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
1. `tenants.id` é `BIGINT GENERATED BY DEFAULT AS IDENTITY` (ver [ADR-021](adr/ADR-021-tenant-id-bigint.md))
2. Toda tabela de domínio tem `tenant_id BIGINT NOT NULL REFERENCES tenants(id)` (exceto `tenants` em si, e `users` cuja coluna é opcional)
3. O `zitadel_org_id` (snowflake string do IdP) fica como coluna separada em `tenants`, UNIQUE, para mapping `IdP → tenant local`
4. Tenant da request é resolvido por `@CurrentTenant TenantContext` (record `(long tenantId, String zitadelOrgId)`) — JWT-first com fallback `/oidc/v1/userinfo`. Nunca via query/body (ver [ADR-019](adr/ADR-019-tenant-context-from-jwt.md))
5. RLS está previsto mas ainda não ativado nas migrations atuais (será V{N}__enable_rls.sql quando for endurecer o isolamento)

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
| `ADR-011` | Monorepo único (api/ + frontend/ + login/) |
| `ADR-012` | Cloudflare Pages para frontend |
| `ADR-013` | Feature flags via tabela + cache Caffeine |
| `ADR-014` | Auto-cadastro de tenant com aprovação manual |
| `ADR-015` | Custom Login V2 (SPA própria · porta 5174) |
| `ADR-016` | Cadastro de membros via convite por email |
| `ADR-017` | Frontend organizado por módulos de negócio (domain-first) |
| `ADR-018` | Pessoas unificadas (Lead + Cliente em uma tabela) |
| `ADR-019` | Tenant context resolvido do JWT (nunca de query/body) |
| `ADR-020` | Lookup tables sem domain layer |
| `ADR-021` | `tenants.id` como BIGINT, `zitadel_org_id` à parte |
| `ADR-022` | Paginação de listagens via envelope `limit/offset` (`PageResponse<T>`) |
| `ADR-023` | Cadastro direto de Cliente + Contatos da Pessoa |

## Features implementadas (estado atual)

| Feature | Aggregate Root | Path base | Roles autorizadas |
|---|---|---|---|
| `tenants` | `Tenant` (BIGINT id · ADR-021) | `/api/v1/tenants` | `system_admin`, `org_admin` (read) |
| `users` | `User` | `/api/v1/users/me` | qualquer autenticado |
| `invites` | `Invite` | `/api/v1/invites` | `org_admin`, `system_admin` (create); público (by-token/accept) |
| `pessoas` | `Pessoa` (Lead ∪ Cliente · ADR-018) | `/api/v1/pessoas` | `org_admin`, `comercial_atendimento`, `comercial_proposta` |
| `crm/oportunidades` | `Oportunidade` | `/api/v1/crm/oportunidades` | `org_admin`, `comercial_atendimento`, `comercial_proposta` |
| `crm/configuracoes/pipelines` | `Pipeline` | `/api/v1/crm/pipelines` | `org_admin` |
| `crm/configuracoes/etapas` | `Etapa` | `/api/v1/crm/etapas` | `org_admin` |
| `crm/configuracoes/tipospagamento` | (lookup · ADR-020) | `/api/v1/crm/tipos-pagamento` | `org_admin` |
| `organizacao/configuracoes/ofertas` | (lookup) | `/api/v1/organizacao/ofertas` | `org_admin` |
| `organizacao/configuracoes/setores` | (lookup) | `/api/v1/organizacao/setores` | `org_admin` |
| `organizacao/configuracoes/tiposempresa` | (lookup) | `/api/v1/organizacao/tipos-empresa` | `org_admin` |
| `organizacao/configuracoes/tiposprojeto` | (lookup) | `/api/v1/organizacao/tipos-projeto` | `org_admin` |
| `organizacao/configuracoes/unidades` | (lookup) | `/api/v1/organizacao/unidades` | `org_admin` |
| `organizacao/configuracoes/empreendimentos` | (lookup) | `/api/v1/organizacao/empreendimentos` | `org_admin` |
| `organizacao/configuracoes/funcoespessoas` | (lookup) | `/api/v1/organizacao/funcoes-pessoas` | `org_admin` |

**Domain events publicados**:
- `TenantCreatedEvent` — após `Tenant.assignIdIfTransient` (adapter chama pós-INSERT)
- `UserSyncedEvent` — `users.me` ao sincronizar perfil do Zitadel
- `InviteIssuedEvent` — após criar convite
- `PessoaCreatedEvent`, `PessoaConvertedToClienteEvent` — criação e promoção Lead→Cliente
- `OportunidadeMovedToConvertingEtapaEvent` — quando entra em etapa com `converte_lead_em_cliente=true` (consumido pelo módulo `pessoas` para promover automaticamente)

Matriz detalhada de endpoints + roles em [`docs/04-AUTH.md`](04-AUTH.md) § Roles e permissões.
