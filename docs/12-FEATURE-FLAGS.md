# 12 — Feature Flags

> Sistema simples de feature flags para ligar/desligar funcionalidades por tenant ou
> globalmente, sem deploy. Ver `ADR-013`.

## Quando usar feature flag

**SIM:**
- Liberar funcionalidade pra beta tester (1 tenant antes dos outros)
- Desligar feature problemática em produção sem rollback de deploy
- Migration gradual entre versões antigas e novas de uma feature
- Dark launch (código em produção, sem ativar pra ninguém)
- Customização por contrato (cliente enterprise pediu feature exclusiva)

**NÃO:**
- Permissão de usuário (use roles)
- Configuração de tenant (slug, nome, etc — use colunas próprias)
- A/B testing (usa ferramenta dedicada)
- Limite de uso (use quota explícita)

## Como funciona

Tabela `feature_flags` no banco. Cada flag tem:

| Campo | Tipo | Significado |
|---|---|---|
| `name` | string | Identificador único (kebab-case) |
| `default_enabled` | bool | Ligada por padrão pra todos? |
| `enabled_for_tenants` | UUID[] | Allowlist (usada quando `default_enabled=false`) |
| `disabled_for_tenants` | UUID[] | Blocklist (usada quando `default_enabled=true`) |

Lógica:
```
default OFF: tenant tem flag ON apenas se tá em enabled_for_tenants
default ON:  tenant tem flag ON exceto se tá em disabled_for_tenants
```

## Uso no código (backend)

```java
@Service
public class CreateOrcamentoUseCase {

    private final FeatureFlagService featureFlags;
    // ...

    @Transactional
    public OrcamentoView execute(CreateOrcamentoCommand cmd, UUID tenantId) {
        if (!featureFlags.isEnabled("orcamento-v1", tenantId)) {
            throw new FeatureNotAvailableException("orcamento-v1");
        }
        // ... lógica normal
    }
}
```

## Uso no código (frontend)

Endpoint pra expor flags ao frontend (a ser criado quando necessário):

```http
GET /api/v1/users/me/feature-flags
→ { "crm-leads-v1": true, "mobile-app": false, ... }
```

No React:
```tsx
const { data: flags } = useFeatureFlags();

if (flags?.['crm-leads-v1']) {
    return <CRMModule />;
}
```

## Gerenciamento

### Criar flag nova

1. Adiciona linha em migration nova (`V{N}__add_flag_<name>.sql`):
   ```sql
   INSERT INTO feature_flags (name, description, default_enabled) VALUES
       ('nova-flag', 'Descrição clara do que liga', false);
   ```
2. Usa no código com `featureFlags.isEnabled("nova-flag", tenantId)`
3. Adiciona ao test que cobre a feature gated

### Ativar pra tenant específico

Via SQL direto (dev/staging) ou endpoint admin (prod, futuro):

```sql
UPDATE feature_flags
SET enabled_for_tenants = array_append(enabled_for_tenants, '<tenant-uuid>')
WHERE name = 'crm-leads-v1';
```

Cache invalida em até 60s. Pra forçar:
```bash
# Via endpoint admin (futuro)
curl -X POST https://api.tkws.com.br/api/v1/admin/feature-flags/crm-leads-v1/invalidate \
  -H "Authorization: Bearer $TOKEN"
```

### Promover de "ativada pra alguns" pra "ativada pra todos"

```sql
UPDATE feature_flags
SET default_enabled = true,
    enabled_for_tenants = '{}'
WHERE name = 'crm-leads-v1';
```

### Remover flag (após feature estabilizada pra todos)

**Em PR único:**
1. Remove `featureFlags.isEnabled(...)` do código (else branch também)
2. Adiciona migration `V{N}__remove_flag_<name>.sql`:
   ```sql
   DELETE FROM feature_flags WHERE name = '<nome>';
   ```
3. Remove referências em testes

## Cache

Cache em memória via Caffeine (`spring-cache`). TTL 60s.

**Por que não Redis:** flag é cross-tenant, raramente muda, e ler do banco a cada request
seria desperdício. Caffeine em memória é mais rápido que Redis pra esse caso. Cada instância
da API tem seu próprio cache (até 60s de drift entre instâncias).

**Quando migrar pra Redis:** quando tiver 3+ instâncias da API e propagação <60s for crítica.

## Naming convention

Use kebab-case com sufixo de versão quando aplicável:
- ✅ `crm-leads-v1`
- ✅ `mobile-app`
- ✅ `dark-mode`
- ❌ `crmLeads` (camelCase)
- ❌ `crm_leads` (snake_case)
- ❌ `featureNewBudget` (não use prefixo "feature")

## Anti-padrões

❌ Usar flag como "vou implementar depois" e nunca limpar — vire dívida técnica
❌ Mais de 20 flags ativas — sinal de que muitas features estão em "limbo"
❌ Flag pra permissão (use role)
❌ Flag pra dado de tenant (use coluna)
❌ Hardcode `featureFlags.isEnabled("nome", tenantId)` em 30 lugares — extrai pra método
   `isOrcamentoEnabled(tenantId)` quando começar a repetir
