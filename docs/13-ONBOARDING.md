# 13 — Onboarding de Tenants

> Como novos escritórios de arquitetura entram no TKWS OS. Ver `ADR-014`.

## Modelo: auto-cadastro com aprovação manual

### Por quê esse modelo

- **Auto-cadastro puro:** abre porta pra spam, bots e tenants problemáticos
- **Onboarding 100% manual:** atrapalha crescimento (todo lead vira ticket de suporte)
- **Modelo escolhido:** lead se cadastra sozinho, mas Allysson aprova antes do acesso

Benefícios:
- Lead investiu tempo no cadastro = quente
- Allysson tem oportunidade de ligar antes de aprovar (descoberta de necessidade real)
- Filtra trolls e concorrentes
- Permite cobrança upfront antes da liberação se desejar

## Fluxo

```
Lead visita app.tkws.com.br
       ↓
Clica "Solicitar acesso"
       ↓
Preenche form (escritório + responsável)
       ↓
POST /api/v1/onboarding/request
       ↓
Cria tenant em status PENDING
       ↓
Notifica Allysson (email + Telegram)
       ↓
Allysson revisa, opcional liga pro lead
       ↓
Aprova ou rejeita via UI/endpoint admin
       ↓
SE APROVADO:
  - tenant.status = ACTIVE
  - Cria org no Zitadel via API
  - Cria usuário admin no Zitadel
  - Envia email de boas-vindas com magic link
SE REJEITADO:
  - tenant.status = REJECTED
  - Envia email educado de não-aprovação
```

## Estados de tenant

| Status | Significado | Pode logar? | Aparece em queries normais? |
|---|---|---|---|
| `PENDING` | Solicitou cadastro, aguarda aprovação | Não | Não |
| `ACTIVE` | Aprovado, operando normalmente | Sim | Sim |
| `REJECTED` | Solicitação rejeitada | Não | Não |
| `SUSPENDED` | Conta suspensa (inadimplência, abuso, etc) | Não | Não |

## Endpoint público

`POST /api/v1/onboarding/request` (sem auth)

Body:
```json
{
  "companyName": "Studio X Arquitetura",
  "companySlug": "studio-x",
  "requesterFullName": "Maria Souza",
  "requesterEmail": "maria@studiox.com.br",
  "requesterPhone": "+5511999999999",
  "requesterCompanyRole": "Sócia-fundadora",
  "expectedTeamSize": 8,
  "howFoundUs": "Indicação"
}
```

Validações:
- Email único na tabela `tenants` (não permite re-cadastrar)
- Slug único e válido (kebab-case, 3-50 chars)
- Phone opcional mas validado (E.164 ou BR comum)
- Rate limit: 5 requests/IP/hora pra evitar spam

Response 202 Accepted:
```json
{
  "requestId": "uuid",
  "status": "PENDING",
  "message": "Solicitação recebida. Entraremos em contato em até 2 dias úteis."
}
```

## Endpoint admin (aprovação)

`POST /api/v1/admin/tenants/{tenantId}/approve` (auth: `system_admin`)

Body:
```json
{
  "adminEmail": "maria@studiox.com.br",
  "adminFullName": "Maria Souza",
  "initialPlan": "trial"
}
```

`POST /api/v1/admin/tenants/{tenantId}/reject` (auth: `system_admin`)

Body:
```json
{
  "reason": "Não atendemos esse segmento atualmente."
}
```

Aprovação executa:
1. Atualiza `tenants.status = 'ACTIVE'`, `approved_at`, `approved_by_user_id`
2. Cria organização no Zitadel via API
3. Cria usuário admin no Zitadel com role `org_admin`
4. Envia email de boas-vindas com magic link

## Notificação ao Allysson (System Admin)

Quando nova solicitação chega:

1. **Telegram** (futuro: webhook + bot pessoal) — alerta imediato
2. **Email** (futuro via SES) — registro formal
3. **Dashboard interno** (futuro: tela `/admin/onboarding-queue`)

Por enquanto (MVP):
- Email simples enviado para `admin@tkws.com.br` via SMTP do Zitadel
- Allysson confere via SQL ou Swagger UI

## SLA esperado

- Resposta inicial: **48h úteis**
- Decisão de aprovação: **5 dias úteis**

Esse SLA aparece na resposta do endpoint público e em emails.

## Implementação pendente

Esta documentação descreve o **target state**. Está implementado:
- ✅ Coluna `status` em tenants
- ✅ Coluna `requested_at`, `approved_at`, `rejected_at`, `rejection_reason`
- ✅ Colunas de dados do solicitante
- ❌ Endpoint público `POST /api/v1/onboarding/request`
- ❌ Endpoint admin de aprovação
- ❌ Integração com Zitadel API para criar org/user
- ❌ Envio de email de boas-vindas
- ❌ Notificação Telegram/email para Allysson
- ❌ Tela `/admin/onboarding-queue`

Essas features são parte da feature `onboarding-v1` (a criar). Ver `.ai/FEATURE-TEMPLATE.md`.

## Anti-padrões

❌ Permitir login com tenant em PENDING — todas as queries de listagem devem filtrar
   `WHERE status = 'ACTIVE'`
❌ Deletar tenant rejeitado — mantém pra auditoria, filtra em queries
❌ Aprovar sem confirmar email do solicitante — risco de vazamento de dados
❌ Aprovar sem validar slug (pode ser ofensivo, infringir marca, etc)
