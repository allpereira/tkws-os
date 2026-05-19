# 00 — Arquitetura

> Visão geral autoritativa da arquitetura do TKWS OS. Toda decisão importante vira ADR
> (Architecture Decision Record) em `adr/`.

## Princípios arquiteturais

1. **Monolito modular antes de microserviços.** Velocidade de entrega solo, sem perder
   capacidade de extrair módulos quando a dor justificar.
2. **Stateless em todas as camadas.** Sessão em Redis, uploads em S3, zero estado local.
3. **Banco gerenciado externo desde o dia 1** (RDS). Postgres nunca em container de produção.
4. **Infraestrutura simples agora, evolução clara.** Compose hoje, K8s só quando dor real.
5. **Observabilidade desde o começo.** Logs estruturados, métricas, alertas antes do MVP.
6. **Custos previsíveis.** Free tier AWS por 12 meses, escala incremental.
7. **Reversibilidade.** Toda escolha tecnológica tem saída clara, sem lock-in profundo.

## Visão de alto nível

```
┌──────────────────────────────────────────────────────────┐
│ Usuários (Web + iOS + Android via Capacitor)             │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS
                         ▼
                  ┌─────────────┐
                  │ Cloudflare  │  CDN + WAF + DDoS
                  └──────┬──────┘
                         │
                         ▼
              ┌──────────────────┐
              │ Caddy (TLS auto) │  Let's Encrypt
              └─────────┬────────┘
                        │
       ┌────────────────┼────────────────────┐
       ▼                ▼                    ▼
┌────────────┐  ┌──────────────┐    ┌────────────────┐
│  Frontend  │  │  API Spring  │    │    Zitadel     │
│  React 19  │  │  Boot Java21 │    │  (auth OIDC)   │
└────────────┘  └──────┬───────┘    └────────────────┘
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
   ┌────────┐    ┌──────────┐    ┌────────────┐
   │ RDS PG │    │  Redis   │    │  S3 (OCI)  │
   │ (AWS)  │    │  cache   │    │  uploads   │
   └────────┘    └──────────┘    └────────────┘
                       ▲
                       │ jobs pesados
                ┌──────┴──────┐
                │   Workers   │
                │ (containers)│
                └─────────────┘
```

## Clean Architecture aplicada

### As 4 camadas

```
┌─────────────────────────────────────────────────────┐
│ WEB (Controllers REST)                              │
│ ↓ chama use cases                                   │
├─────────────────────────────────────────────────────┤
│ APPLICATION (Use Cases, Commands, Views)            │
│ ↓ usa ports do domain                               │
├─────────────────────────────────────────────────────┤
│ DOMAIN (Aggregates, VOs, Events, Ports)             │
│ ▲ implementado por infrastructure                   │
├─────────────────────────────────────────────────────┤
│ INFRASTRUCTURE (JPA, Redis, S3, integrações)        │
└─────────────────────────────────────────────────────┘
```

### Por que essa ordem importa

- **Domain no centro:** muda menos. Independente de Spring, JPA, banco. Testável em ms.
- **Infrastructure na periferia:** muda mais (troca de banco, troca de cache).
- **Dependências apontam para dentro:** infrastructure depende de domain, nunca o contrário.

### Resultado prático

- Trocar Postgres por Mongo? Implementa novo `TenantRepository` em `infrastructure/`.
  Domain não muda.
- Trocar REST por GraphQL? Cria novo controller em `web/`. Application e domain não mudam.
- Testar domain? `new Tenant(...)` direto, sem container, sem mock framework.

## DDD tático aplicado

### Building blocks que usamos

| Padrão | Onde | Exemplo |
|---|---|---|
| **Aggregate Root** | `domain/model/` | `Tenant`, `User` |
| **Value Object** | `domain/model/` | `TenantId`, `Email`, `Money` (futuro) |
| **Domain Event** | `domain/event/` | `TenantCreatedEvent` |
| **Domain Exception** | `domain/exception/` | `InvalidTenantSlugException` |
| **Port (Repository)** | `domain/port/` | `TenantRepository` (interface) |
| **Adapter** | `infrastructure/` | `TenantJpaRepositoryAdapter` |
| **Use Case** | `application/usecase/` | `CreateTenantUseCase` |
| **DTO Command** | `application/dto/` | `CreateTenantCommand` |
| **DTO View** | `application/dto/` | `TenantView` |

### Padrões que NÃO usamos (deliberadamente)

- **CQRS pesado** com event sourcing — overkill no estágio atual
- **Domain Service** quando UseCase já basta
- **Saga** complexa — eventos publicados via Spring `ApplicationEventPublisher` por enquanto
- **Anemic models** — proibido. Lógica vai no domain.

## Multi-tenancy

**Estratégia:** discriminator (`tenant_id`) em cada tabela + Row Level Security do Postgres.

**Vantagens:**
- Um único banco, menor custo operacional
- Isolamento garantido pelo banco
- Backup/restore unificado
- Permite analytics cross-tenant quando necessário

**Quando promover para banco dedicado:**
- Cliente corporativo exigir isolamento contratual
- Cliente exceder X% do tamanho do banco compartilhado
- Necessidade de compliance específica (raro)

**Implementação:**
1. Toda tabela de domínio tem `tenant_id UUID NOT NULL` (exceto `tenants` e `users`)
2. RLS policy aplicada automaticamente baseada em variável de sessão `app.current_tenant`
3. `TenantContextFilter` (interceptor) lê tenant do JWT e seta na sessão DB
4. Migration sempre cria RLS policy junto com tabela

## Comunicação entre features

**Regra de ouro:** features não se importam diretamente. ArchUnit valida isso.

**Caminhos permitidos:**

1. **Domain Events** (preferencial) — feature A publica evento, feature B escuta
   ```java
   // Feature A
   eventPublisher.publishEvent(new TenantCreatedEvent(...));

   // Feature B
   @EventListener
   public void on(TenantCreatedEvent event) { ... }
   ```

2. **Use Case público com DTO** (quando precisa de resposta síncrona)
   ```java
   // Em features/A/application/usecase/, expor método público
   // Feature B injeta o UseCase de A e chama com Command/recebe View
   ```

3. **Read-only repository compartilhado** (anti-padrão evitado, mas às vezes pragmático)
   — só com ADR justificando.

## Padrões de erro

### Backend

- **Exceções de domínio** estendem `DomainException` (HTTP 422)
- **Validação de input** falha com `MethodArgumentNotValidException` (HTTP 400)
- **Recurso não encontrado** lança `XNotFoundException extends DomainException` (HTTP 422)
- **Erros inesperados** logados com stacktrace, retornam 500 com problema genérico

Resposta sempre em formato **Problem Details (RFC 7807)**:

```json
{
  "type": "https://errors.tkws.com.br/tenant_slug_already_taken",
  "title": "TENANT_SLUG_ALREADY_TAKEN",
  "status": 422,
  "detail": "Já existe um tenant com o slug 'studio-x'",
  "instance": "/api/v1/tenants"
}
```

### Frontend

- **Erros de rede** capturados no axios interceptor → toast genérico
- **Erros de domínio (422)** parseados e mostrados no contexto do form/ação
- **Erros 401** redirecionam para login automaticamente
- **Erros 403** mostram tela de "sem permissão"

## Performance — diretrizes

- **Paginação obrigatória** em todas as listagens (default 20 itens)
- **N+1 proibido** — sempre `@EntityGraph` ou JOIN FETCH explícito
- **Cache** no Redis para dados quentes (catálogo, configurações de tenant)
- **Jobs pesados** sempre assíncronos via fila (Spring `@Async` + tabela `jobs`)
- **Compressão HTTP** (gzip) habilitada no Caddy e Spring
- **Connection pool** HikariCP dimensionado: `maximum-pool-size = 20` (ajusta conforme load)

## Decisões registradas

Veja `docs/adr/` para o histórico completo de decisões.

| ADR | Decisão |
|---|---|
| `ADR-001` | Clean Architecture + DDD tático + Feature-based |
| `ADR-002` | Backend em Java/Spring Boot vs Node |
| `ADR-003` | Frontend em React vs Vue |
| `ADR-004` | Auth via Zitadel self-hosted |
| `ADR-005` | Cloud em AWS (não OCI/GCP) |
| `ADR-006` | Docker Compose puro (sem Coolify/K8s) |
| `ADR-007` | Multi-tenancy via discriminator + RLS |
| `ADR-008` | Testing Trophy (Kent Dodds) em vez de pirâmide clássica |
| `ADR-009` | ArchUnit para validar fronteiras arquiteturais |
| `ADR-010` | TanStack Router (não React Router) |
