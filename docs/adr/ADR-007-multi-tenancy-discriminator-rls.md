# ADR-007: Multi-tenancy via discriminator + Row Level Security

**Status:** Accepted (tipo do discriminator atualizado em [ADR-021](ADR-021-tenant-id-bigint.md))
**Data:** 2025-05
**Decisores:** Allysson

> **Atualização 2026-05-24**: o tipo do discriminator mudou de `UUID` para `BIGINT`
> em [ADR-021](ADR-021-tenant-id-bigint.md). Os exemplos abaixo ainda mostram
> `UUID` para preservar o registro histórico — em código novo use
> `tenant_id BIGINT NOT NULL REFERENCES tenants(id)`. Quando o RLS for ativado
> (ainda pendente), a session var será `BIGINT` também.

## Contexto

TKWS OS é SaaS B2B. Cada escritório cliente é um tenant. Precisamos garantir:
- Isolamento estrito (cliente A não vê dado de cliente B)
- Custo operacional baixo (não viável banco por tenant em escala)
- Backups e migrations unificados
- Possibilidade de analytics cross-tenant pela Group WS

## Decisão

**Discriminator pattern** (`tenant_id UUID NOT NULL` em cada tabela de domínio) reforçado por
**Row Level Security (RLS) do Postgres**, com variável de sessão `app.current_tenant`
configurada via interceptor a cada request.

## Alternativas consideradas

1. **Database por tenant** — isolamento máximo, mas inviável operacionalmente (migrations
   em 100 bancos, custo de RDS multiplicado, dificulta features cross-tenant).
2. **Schema por tenant (mesmo banco)** — meio termo, mas Flyway precisa rodar em N schemas,
   conexão pool fica complicada, e mesmo benefício de isolamento é menor.
3. **Discriminator sem RLS** — depende só de filtros na aplicação. **Risco enorme:** um WHERE
   esquecido vira vazamento de dados cross-tenant.
4. **Escolhida:** Discriminator + RLS — RLS no banco é defesa em profundidade: mesmo que dev
   esqueça filtro, banco recusa retornar dados de outro tenant.

## Como funciona

```sql
-- Toda tabela de domínio:
CREATE TABLE leads (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    -- ...
);

-- RLS habilitado:
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads FORCE ROW LEVEL SECURITY;

-- Policy:
CREATE POLICY tenant_isolation ON leads
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
```

Java interceptor seta a variável de sessão antes de cada request:
```java
@Component
public class TenantContextInterceptor implements HandlerInterceptor {
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        UUID tenantId = extractTenantFromJwt(req);
        jdbc.execute("SET LOCAL app.current_tenant = '" + tenantId + "'");
        return true;
    }
}
```

## Consequências

### Positivas
- Defesa em profundidade — vazamento cross-tenant praticamente impossível
- Operação simples (1 banco, 1 backup, 1 migration)
- Permite features cross-tenant via `BYPASSRLS` em usuário admin (analytics da Group WS)
- Custo operacional baixo

### Negativas
- Performance: cada query tem condição extra (mitigado por índice em `tenant_id`)
- Migrations precisam lembrar de aplicar RLS em novas tabelas (mitigar: template em FEATURE-CHECKLIST)
- Sem isolamento físico (cliente paranoico exigindo "meu banco só meu" precisa de outra arquitetura)

### Riscos
- Esquecer RLS em tabela nova = vazamento — mitigar: lint que verifica + ArchUnit test
- `current_setting` ineficiente em queries muito pesadas — monitorar e otimizar caso a caso

## Quando reavaliar

- Cliente corporativo exigir isolamento físico em contrato
- Cliente exceder 30% do tamanho do banco
- Compliance específica exigir banco dedicado
