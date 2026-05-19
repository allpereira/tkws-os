# 07 — Observabilidade

> Você não consegue operar o que não consegue ver. Este documento define o que medimos,
> onde vemos, e o que dispara alerta.

## Pilares (Three Pillars + 1)

1. **Logs** — eventos textuais
2. **Métricas** — números agregados ao longo do tempo
3. **Traces** — caminho de uma requisição (futuro)
4. **Alertas** — notificação quando algo está fora do normal

## Ferramentas

| Camada | Ferramenta | Quando adotar |
|---|---|---|
| Logs locais | Docker logs | Sempre |
| Logs agregados | Grafana Cloud Loki (free) | Após primeiro mês em prod |
| Métricas locais | Prometheus + Grafana | Após primeiro mês em prod |
| Métricas hosted | Grafana Cloud (free tier) | Alternativa preferida |
| Erros front+back | Sentry (free tier) | Imediato |
| Uptime externo | UptimeRobot ou BetterStack (free) | Antes do MVP público |
| Tracing | OpenTelemetry → Grafana Tempo | Quando dor real aparecer |

## Logs

### Princípios

- **Estruturados** (JSON em produção, texto humano em dev)
- **Contexto rico:** `traceId`, `tenantId`, `userId`, `requestPath`
- **Nível adequado:** ERROR para erros reais, WARN para situações esperadas mas atípicas,
  INFO para eventos de negócio, DEBUG para troubleshooting
- **Idioma:** inglês (facilita busca em ferramentas internacionais)
- **Sem PII:** nunca logar senha, token, CPF/CNPJ completos, dados de cartão

### Convenção de mensagens

```java
// ✅ Bom
log.info("Tenant created: tenantId={}, slug={}, zitadelOrgId={}",
    tenant.id(), tenant.slug(), tenant.zitadelOrgId());

log.warn("Slug already taken, returning 422: slug={}", command.slug());

log.error("Failed to sync user from Zitadel: zitadelId={}, error={}",
    data.zitadelId(), e.getMessage(), e);  // sempre com `, e` no final pra stack trace

// ❌ Ruim
log.info("ok");                                    // não diz nada
log.info("created tenant " + tenant.id());         // concatenação
log.error("erro: " + e.getMessage());              // sem stack trace
log.info("user logged in: senha=" + password);     // VAZAMENTO de dados
```

### Configuração de logback (produção)

Por padrão, Spring Boot loga em texto. Em produção, mudamos para JSON via `logback-spring.xml`:

```xml
<!-- a criar em api/src/main/resources/logback-spring.xml quando subir Loki -->
<configuration>
    <springProfile name="!dev">
        <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
            <encoder class="net.logstash.logback.encoder.LogstashEncoder"/>
        </appender>
        <root level="INFO">
            <appender-ref ref="STDOUT"/>
        </root>
    </springProfile>
</configuration>
```

Adicionar dep:
```xml
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>8.0</version>
</dependency>
```

### Ver logs

#### Dev
```bash
docker compose logs -f api
docker compose logs -f --tail=200 api | grep ERROR
```

#### Staging/Prod
```bash
# Direto no servidor
ssh ubuntu@<host>
docker compose -f docker-compose.prod.yml logs -f --tail=200

# Filtra por padrão
docker compose -f docker-compose.prod.yml logs api | jq 'select(.level=="ERROR")'

# Quando tiver Loki, via Grafana Cloud Web UI
```

### Loki (quando adotar)

`docker-compose.prod.yml` ganha:

```yaml
promtail:
  image: grafana/promtail:latest
  volumes:
    - /var/lib/docker/containers:/var/lib/docker/containers:ro
    - /var/run/docker.sock:/var/run/docker.sock
    - ./docker/promtail/config.yml:/etc/promtail/config.yml
```

Promtail envia logs para Grafana Cloud Loki (URL gratuita via free tier).

## Métricas

### Spring Boot Actuator + Prometheus

Já configurado no `pom.xml` (`micrometer-registry-prometheus`). Endpoint:
- `GET /actuator/prometheus` (público em produção atrás do Caddy)

Métricas relevantes:

| Métrica | Significa | Alerta se |
|---|---|---|
| `http_server_requests_seconds_count` | Total de requests | n/a |
| `http_server_requests_seconds_sum` | Latência total | p95 > 500ms |
| `http_server_requests_seconds_count{status="5xx"}` | Erros 5xx | > 1% |
| `jvm_memory_used_bytes` | Memória JVM | > 80% do max por 10min |
| `hikaricp_connections_active` | Conexões DB ativas | > 80% do pool |
| `hikaricp_connections_pending` | Esperando conexão | > 0 por > 30s |
| `tomcat_threads_busy` | Threads ocupadas | > 80% |

### Métricas custom (adicionar conforme features)

```java
@Service
public class CreateTenantUseCase {
    private final Counter tenantsCreated;

    public CreateTenantUseCase(MeterRegistry registry) {
        this.tenantsCreated = Counter.builder("tkws.tenants.created")
            .description("Total de tenants criados")
            .register(registry);
    }

    @Transactional
    public TenantView execute(CreateTenantCommand cmd) {
        // ...
        tenantsCreated.increment();
    }
}
```

### Prometheus scrape (quando adotar)

```yaml
# Adicionar serviço no docker-compose.prod.yml
prometheus:
  image: prom/prometheus:latest
  volumes:
    - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    - prometheus-data:/prometheus
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
    - '--storage.tsdb.retention.time=30d'
```

`prometheus.yml`:
```yaml
scrape_configs:
  - job_name: 'tkws-api'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['api:8080']
```

## Sentry (erros)

### Setup

#### Backend

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter-jakarta</artifactId>
    <version>7.18.0</version>
</dependency>
```

`application.yml`:
```yaml
sentry:
  dsn: ${SENTRY_DSN:}
  environment: ${ENVIRONMENT:dev}
  traces-sample-rate: 0.1
  send-default-pii: false
```

#### Frontend

```bash
npm install @sentry/react
```

`main.tsx`:
```tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1,
});
```

### O que vai pro Sentry

- Backend: exceções não tratadas, exceções de domínio são apenas WARN no Sentry (não erros)
- Frontend: erros JavaScript, network errors, Suspense boundaries

### O que NÃO vai pro Sentry

- Logs INFO/DEBUG
- Eventos de negócio (use métricas)
- PII (configuração `send-default-pii: false`)

## Uptime externo

UptimeRobot ou BetterStack (free tier):

- Monitora `https://api.tkws.com.br/actuator/health/liveness` a cada 1 min
- Monitora `https://app.tkws.com.br` (200 OK)
- Alerta via email/Telegram se 2 falhas consecutivas

## Alertas

### Canais

| Severidade | Canal | Quando |
|---|---|---|
| P1 (acordar) | Telegram + SMS | API down > 2min, banco inacessível |
| P2 (mesma janela) | Telegram | Erro 5xx > 1%, latência alta |
| P3 (próximo dia útil) | Email | Disco > 80%, certificado próximo de expirar |

### Lista de alertas iniciais

```yaml
# Pseudocódigo — implementar via Grafana Cloud Alerts ou similar

- name: api_down
  expr: up{job="tkws-api"} == 0
  for: 2m
  severity: P1

- name: high_error_rate
  expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) > 0.01
  for: 5m
  severity: P2

- name: high_latency
  expr: histogram_quantile(0.95, http_server_requests_seconds_bucket) > 0.5
  for: 10m
  severity: P2

- name: db_connection_pool_exhausted
  expr: hikaricp_connections_pending > 0
  for: 30s
  severity: P1

- name: disk_almost_full
  expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.2
  for: 10m
  severity: P3

- name: cert_expiring
  expr: probe_ssl_earliest_cert_expiry - time() < 7*24*3600
  severity: P3
```

## Troubleshooting comum

### API respondendo 500

1. `docker compose logs api --tail=200 | grep ERROR`
2. Olha Sentry pra agrupamento de erros
3. Se erro no banco: `docker compose logs api | grep -i sql`

### Latência alta

1. Acessa Performance Insights do RDS (queries lentas)
2. Verifica `hikaricp_connections_active` no Actuator
3. Verifica logs por N+1 (`org.hibernate.SQL: DEBUG` temporariamente)

### Memória alta

```bash
docker stats --no-stream
docker compose exec api jstat -gc 1
```

Se sustained > 80%, aumentar `JAVA_OPTS` no compose ou subir VM.

### Banco lento

1. RDS Performance Insights → "Top SQL"
2. Verifica se índices existem nas colunas filtradas
3. `EXPLAIN ANALYZE` na query suspeita

## Dashboards (Grafana — quando adotar)

Dashboards iniciais:

1. **Saúde geral** — uptime, latência p50/p95/p99, error rate
2. **Banco** — conexões ativas, queries lentas, locks
3. **Negócio** — tenants ativos, usuários ativos, ações por feature
4. **Infra** — CPU, RAM, disco, network

## Aliás importante

**Logging excessivo é dano técnico.** Não vire `console.log()` debugging em produção:

- Não logue tudo a cada request (`Entering method X`, `Leaving method X`)
- Logs custam dinheiro em Loki (cobra por GB ingerido)
- Logs poluídos atrapalham investigação
- Logs sensíveis viram vazamento LGPD
