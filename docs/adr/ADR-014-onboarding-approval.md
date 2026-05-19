# ADR-014: Auto-cadastro com aprovação manual de tenants

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

Como novos escritórios de arquitetura entram no TKWS OS? Trade-off entre velocidade de
crescimento (self-service) e qualidade de tenants (curadoria).

Opções:
- **Self-service puro:** abre porta pra spam, bots, concorrentes, tenants problemáticos
- **Onboarding 100% manual:** atrapalha crescimento, todo lead vira ticket
- **Híbrido (escolhido):** auto-cadastro + aprovação manual antes do acesso

## Decisão

**Auto-cadastro com aprovação manual.** Lead se cadastra via formulário público, tenant
fica em status `PENDING` até Allysson aprovar via endpoint admin (ou UI futura).

## Implementação

### Estados de tenant

```
PENDING → ACTIVE   (aprovado)
PENDING → REJECTED (negado, mantém pra auditoria)
ACTIVE  → SUSPENDED (inadimplência, abuso)
```

Coluna `status` em `tenants` com check constraint.

### Endpoints

- `POST /api/v1/onboarding/request` (público, rate-limited)
- `POST /api/v1/admin/tenants/{id}/approve` (system_admin)
- `POST /api/v1/admin/tenants/{id}/reject` (system_admin)

### Workflow de aprovação

Aprovação dispara:
1. Update tenant status
2. Cria org no Zitadel via API
3. Cria usuário admin com role `org_admin`
4. Envia email de boas-vindas com magic link

## Alternativas consideradas

1. **Self-service puro** — descartado: spam e tenants ruins
2. **Onboarding 100% manual** — descartado: não escala
3. **Cadastro pago upfront** — adiciona fricção excessiva pré-validação
4. **Convite-only (sem formulário público)** — limita marketing/SEO
5. **Híbrido com aprovação automática por critérios** — futuro: quando volume justificar

## Consequências

### Positivas
- Filtragem manual = qualidade alta de tenants iniciais
- Allysson conhece cada cliente nos primeiros meses (insights de produto)
- Sem risco de spam/abuso desde dia 1
- Permite cobrança upfront se desejar (aprova só após pagar)

### Negativas
- Bottleneck no Allysson conforme crescer
- SLA de aprovação (48h-5d úteis) pode frustrar leads quentes
- Tenants rejeitados podem reclamar publicamente (risco reputacional)

### Riscos
- Allysson em viagem/doença = pipeline parado — mitigar: SLA flexível comunicado, alerta
  de "+5 solicitações pendentes" pra urgência
- Critério de aprovação inconsistente — mitigar: documentar critério em `docs/13-ONBOARDING.md`
  conforme padrões emergirem

## Quando reavaliar

- Volume de solicitações > 20/semana (vira gargalo)
- Critério de aprovação estabilizado o suficiente pra automatizar
- Surgir necessidade de free trial self-service como funil de vendas
