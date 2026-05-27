# 16 — Performance & Tuning de Produção

> Guia de afinação de performance de todos os containers/runtime do TKWS OS,
> pensado para produção (alvo: 300+ usuários simultâneos, multi-tenant).
> Consulte antes de mexer em pool de conexões, GC, JPA ou limites de container.

Este documento descreve **o que foi configurado, por quê, e como medir**. As
mudanças priorizam ganhos seguros e mensuráveis — sem otimização prematura.

---

## 1. Visão geral da topologia em produção

```
Cloudflare (CDN/WAF) ──► Caddy (TLS, 80/443) ──► API (Spring Boot, 8080)
                                              └──► Zitadel (OIDC, 8088)
                          Redis (cache)            │
                                                   ▼
                                          PostgreSQL (RDS, sa-east-1)
```

- **API**: Spring Boot 3.3 + Java 21, **virtual threads habilitadas**.
- **PostgreSQL**: RDS gerenciado (não está no compose) — tuning via *parameter group*.
- **Redis**: cache (Caffeine é o cache L1 in-process; Redis é L2/compartilhado).
- **Caddy**: TLS automático + reverse proxy.

---

## 2. JVM (container-aware)

Configurado no `docker/api/Dockerfile` (`JAVA_OPTS`), sobrescrito em
`docker-compose.prod.yml`:

| Flag | Valor | Por quê |
|---|---|---|
| `-XX:MaxRAMPercentage` | 75 (dev) / **70 (prod)** | Heap = % da memória do *container* (não da máquina). 70% deixa folga para metaspace, threads, off-heap e o próprio SO. |
| `-XX:InitialRAMPercentage` | 50 | Aloca metade do heap de cara → evita *resize churn* do G1 sob carga inicial. |
| `-XX:+UseG1GC` | — | GC de baixa pausa, ideal para web (latência previsível > throughput puro). |
| `-XX:+UseStringDeduplication` | — | Workload web cria muitas `String` repetidas (JSON, DTOs); o G1 deduplica e economiza heap. |
| `-XX:+ExitOnOutOfMemoryError` | — | Em OOM, mata a JVM → Docker reinicia o container. Melhor que uma instância "zumbi" degradada. |

**Virtual threads** (`spring.threads.virtual.enabled=true`): cada request roda numa
virtual thread; não há mais um pool fixo de threads do Tomcat como gargalo. O
**gargalo de concorrência passa a ser o pool de conexões do banco** (ver §3) — por
isso ele é dimensionado com cuidado.

> **Não** definimos `-Xmx` fixo de propósito: `MaxRAMPercentage` se adapta ao
> limite de memória do container (`deploy.resources.limits.memory`).

---

## 3. PostgreSQL — pool de conexões (HikariCP)

Em `application.yml` → `spring.datasource.hikari`:

| Propriedade | Valor | Por quê |
|---|---|---|
| `maximum-pool-size` | `DB_POOL_SIZE` (prod **30**) | Com virtual threads, milhares de requests podem competir por conexão. O pool é o teto real de concorrência no banco. **Regra prática:** `((núcleos_db × 2) + spindles)`; para RDS pequena/média, 20–30 é saudável. Pools grandes **pioram** throughput (contention no PG). |
| `minimum-idle` | prod **10** | Conexões quentes prontas para picos sem pagar handshake. |
| `connection-timeout` | 10s | Falha rápido se o pool esgota, em vez de pendurar a request. |
| `max-lifetime` | 29min | Recicla a conexão **antes** do timeout do PG/RDS (~30min) → nunca usa conexão morta. |
| `keepalive-time` | 5min | Mantém conexões idle vivas atravessando NAT/Load Balancer da RDS. |
| `auto-commit` | **false** | Combinado com `provider_disables_autocommit` (§4), elimina 1 round-trip por transação. |

### Dimensionando para 300+ usuários
300 usuários **simultâneos** ≠ 300 queries simultâneas. A maioria fica idle (lendo
tela). Com virtual threads + pool de 30 e queries rápidas (<10ms), o throughput
teórico é `30 / 0.010 = 3000 req/s` no caminho de banco. Se a RDS aguentar mais,
suba `DB_POOL_SIZE`; **meça** `hikaricp_connections_pending` (Prometheus) antes.

### Parameter group recomendado (RDS)
A RDS não está no compose; ajuste via *parameter group*:

| Parâmetro | Sugestão (instância 4–8 GB) | Observação |
|---|---|---|
| `max_connections` | ≥ `DB_POOL_SIZE × nº_instâncias_API + Zitadel + folga` | Ex.: 2 APIs × 30 + Zitadel(~20) + 20 = ~100. |
| `shared_buffers` | 25% da RAM | Cache de páginas do PG. |
| `effective_cache_size` | 50–75% da RAM | Dica pro planner. |
| `work_mem` | 16–32 MB | Por operação de sort/hash; cuidado × conexões. |
| `maintenance_work_mem` | 256 MB | VACUUM/CREATE INDEX mais rápidos. |
| `random_page_cost` | 1.1 | Storage SSD (gp3) — leitura aleatória barata. |
| `pg_stat_statements` | habilitado | Identifica queries lentas em prod. |

---

## 4. JPA / Hibernate

Em `application.yml` → `spring.jpa`:

| Propriedade | Valor | Por quê |
|---|---|---|
| `hibernate.ddl-auto` | **`validate`** em prod (`JPA_DDL_AUTO`) | Flyway é o dono do schema. `validate` confere entidade × schema no startup e **nunca altera** o banco (evita drift/DDL acidental). Dev pode usar `update`. |
| `open-in-view` | **false** | Fecha a sessão JPA ao sair do service → sem lazy-loading "escondido" no render do JSON (fonte clássica de N+1 e conexões presas). |
| `jdbc.batch_size` | 50 | Agrupa INSERT/UPDATE em lotes → menos round-trips. |
| `order_inserts` / `order_updates` | true | Reordena por tabela para o batching ser efetivo. |
| `batch_versioned_data` | true | Permite batch mesmo em entidades com `@Version`. |
| `default_batch_fetch_size` | 25 | **Mitiga N+1**: ao carregar coleções/associações lazy (ex.: contatos de uma pessoa), busca em lotes de 25 em vez de 1 query por registro. |
| `jdbc.time_zone` | UTC | Timestamps consistentes entre instâncias/regiões. |
| `query.in_clause_parameter_padding` | true | Reaproveita plano de query para `IN (...)` de tamanhos próximos. |
| `connection.provider_disables_autocommit` | true | Diz ao Hibernate que o Hikari já desligou autocommit → economiza round-trip. |

> **Paginação** (ADR-022): toda listagem devolve `PageResponse<T>`. Listas de
> configuração pequenas usam "página única" (sem `count`), evitando query de
> contagem desperdiçada. Índices de listagem em `V9__pessoas_listing_indexes.sql`.

---

## 5. Redis

`docker-compose.prod.yml`: `redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru`.
`application.yml`: `timeout: 2s`, `connect-timeout: 2s` — cache **nunca** deve
pendurar uma request; em falha, a app degrada para o cache L1 (Caffeine) ou o banco.

**Recomendações:**
- Mantenha o **cache L1 Caffeine** (`feature-flags`, 60s) como primeira linha — Redis é o nível compartilhado entre instâncias.
- `allkeys-lru` é correto para uso **puramente cache**. Se Redis passar a guardar **sessões**, troque para `volatile-lru` + TTL nas chaves de cache, para não despejar sessões.
- Para cache puro, considere `--save "" --appendonly no` (desliga persistência, menos I/O). **Não** faça isso se houver dado que precise sobreviver a restart.

---

## 6. Caddy / borda

- **Compressão**: habilite `encode zstd gzip` no `Caddyfile.prod` para respostas JSON/HTML.
- **Timeouts**: defina `timeouts` de leitura/escrita compatíveis com uploads.
- Cloudflare à frente já faz CDN/cache de estáticos; o frontend é servido pelo Cloudflare Pages (ADR-012), então o Caddy roteia majoritariamente **API + Zitadel**.

---

## 7. Limites de container (`docker-compose.prod.yml`)

| Serviço | CPU | Memória | Healthcheck |
|---|---|---|---|
| **api** | 0.5–1.5 | 1–2 GB | `/actuator/health/readiness` |
| redis | — | 256 MB (maxmemory) | `redis-cli ping` |
| caddy | — | — | — |
| zitadel | — (recomendado limitar) | — (recomendado ~1 GB) | recomendado |

> **Budget numa t4g.medium (2 vCPU / 4 GB):** API (2 GB) + Zitadel (~1 GB) + Redis
> (256 MB) + Caddy é apertado. Para produção real, prefira **t4g.large (8 GB)** ou
> separe Zitadel em outra instância. A reserva de CPU evita *starvation* da API.

---

## 8. Observabilidade — como validar o tuning

Métricas expostas em `/actuator/prometheus` (ver `docs/07-OBSERVABILITY.md`):

| O que medir | Métrica | Alerta se |
|---|---|---|
| Espera por conexão | `hikaricp_connections_pending` | > 0 sustentado → pool pequeno |
| Conexões ativas | `hikaricp_connections_active` | perto do `max` sempre → escalar pool/DB |
| Pausas de GC | `jvm_gc_pause_seconds_max` | p99 > 200ms → revisar heap |
| Heap | `jvm_memory_used_bytes{area="heap"}` | perto do limite → subir memória/limite |
| Latência HTTP | `http_server_requests_seconds` | p95 subindo → investigar query/cache |
| Queries lentas | `pg_stat_statements` (RDS) | top por tempo total |

**Roteiro de carga:** rode um teste (k6/Gatling) simulando 300 usuários, observe
`hikaricp_connections_pending` e `http_server_requests_seconds{quantile=0.95}`.
Ajuste `DB_POOL_SIZE` **com base na métrica**, não no chute.

---

## 9. Checklist de deploy de performance

- [ ] `JPA_DDL_AUTO=validate` em staging/prod.
- [ ] `DB_POOL_SIZE` ≤ capacidade da RDS; `max_connections` da RDS comporta todas as instâncias.
- [ ] Limites de memória do container coerentes com `MaxRAMPercentage`.
- [ ] `pg_stat_statements` habilitado na RDS.
- [ ] Compressão habilitada no Caddy.
- [ ] Dashboards de Hikari/JVM/HTTP no Grafana (ver `docs/07-OBSERVABILITY.md`).
- [ ] Teste de carga executado e métricas dentro do alvo.
