# ADR-016: Cadastro de membros via convite por email com magic link

**Status:** Accepted
**Data:** 2026-05-21
**Decisores:** Allysson

## Contexto

Tenants já cadastrados (escritórios ativos) precisam adicionar membros (arquitetos,
PMs, viewers). Quatro padrões considerados:

1. **Convite por email do admin** — admin gera invite, sistema cria user shell no
   Zitadel + envia magic link, convidado clica e define senha.
2. **Código de convite compartilhado fora de banda** (WhatsApp/email manual) que o
   user digita num form público de signup.
3. **Self-service + aprovação do admin do tenant** — user se cadastra livremente
   informando slug do tenant, fica em PENDING.
4. **Self-service sem tenant inicial** — descartado: não há "área pessoal" antes
   de pertencer a um tenant no produto atual.

Notas:
- O onboarding de **tenants** (escritórios novos) já tem ADR-014 e doc 13 — é
  fluxo diferente, com aprovação manual da Group WS.
- Spec visual da tela do convidado já existe no Design System V1, seção 09.6
  ("Aceitar convite · primeiro login após receber link").
- Senhas seguem a policy do Zitadel (default: ≥12 chars + 3 classes). A SPA
  mostra um indicador heurístico mas só o servidor decide.

## Decisão

**Convite por email do admin (opção 1).** O sistema mantém uma tabela `invites`
com o **hash SHA-256** do token (token claro só vai no link enviado por email,
nunca persistido). O admin chama `POST /api/v1/invites` (autenticado, role
`org_admin` ou `system_admin`); o backend cria um user shell no Zitadel via
Admin API (sem senha, email pré-verificado), persiste o invite e dispara:

1. **Email** para o convidado (Spring Mail → SMTP, Mailpit em dev) com o magic link
   `https://app.tkws.com.br/accept-invite?token=<raw>`.
2. **Notificação ao operador** (log estruturado tagueado por `[INVITE-ADMIN-NOTIFY]`
   pra grep / encaminhamento futuro via webhook Telegram/Slack).

O convidado clica no link, a SPA `login/` (porta 5174) busca metadata via
`GET /api/v1/invites/by-token`, exibe o form "Aceitar convite" (email read-only,
nome, senha com strength indicator, termos), e submete em
`POST /api/v1/invites/accept`. O backend define a senha no Zitadel, atribui o
role do projeto na org do tenant, marca o invite como `ACCEPTED` e devolve a SPA
para `/login?loginNameHint=<email>` pro fluxo OIDC normal.

Estados do invite: `PENDING → ACCEPTED | EXPIRED | REVOKED` (terminais).
TTL default 7 dias, configurável via `tkws.invites.ttl`.

## Alternativas consideradas

1. **Opção 2 — código fora de banda.** Mais simples (sem SMTP), mas: (a) admin
   precisa copiar/colar manualmente, (b) atrito alto pro convidado, (c) não há
   prova de propriedade do email (qualquer um com o código entra). Descartada.
2. **Opção 3 — self-service + aprovação.** Funciona bem em produtos com grande
   volume de signup, mas: (a) acrescenta moderação contínua ao admin do tenant,
   (b) precisa de UX para listar PENDING + aprovar, (c) abre porta pra spam de
   signups. Descartada por agora; pode ser reativada quando volume justificar.
3. **Não fazer nada agora — usuário admin cria via console do Zitadel.**
   Operacional, mas não dá pra repassar pra parceiros e quebra fidelidade do DS.

## Consequências

### Positivas

- **Prova de propriedade do email** built-in (só quem recebe abre o link).
- **Token de uso único** com hash no DB — vazamento do banco não permite aceitar
  invites.
- **Senha definida pelo próprio convidado** — admin nunca conhece a senha do
  membro.
- **UX editorial** consistente com o resto da SPA (mesmo `AuthStage`).
- **TTL curto** (7 dias default) limita a janela de abuso se o email vazar.

### Negativas / Trade-offs

- **Depende de SMTP estável.** Sem entrega de email, o convite vira papelão.
  Mitigado por Mailpit em dev (não depende de provedor externo) e log do tag
  `[INVITE-ADMIN-NOTIFY]` que permite ao operador reenviar manualmente.
- **Cria user no Zitadel **antes** do aceite.** Se o convidado nunca clicar, o
  Zitadel acumula users shell. Mitigar com job de cleanup futuro (deletar user
  shell quando invite for revogado ou marcar como EXPIRED).
- **Não cobre cadastro de tenant novo** (ADR-014 + doc 13).

### Riscos

- **Phishing**: link `app.tkws.com.br/accept-invite?token=...` pode ser
  spoofado. Mitigação: domínio canônico no email, branding consistente, alertar
  o usuário a desconfiar de remetentes que não sejam `no-reply@tkws.com.br`.
- **Token vazar via referer/log**: o token mora na query string, o que é OK pra
  fluxos client-side mas requer cuidado para nunca aparecer em request logs.
  Mitigação: TTL curto + uso único.

## Notas adicionais

- Implementação em `api/.../features/invites/` (V4 migration) e
  `login/src/features/accept-invite/`.
- **Tela admin entregue** em `frontend/src/modules/plataforma/usuarios/`
  (`/settings/usuarios`, gated por `org_admin`/`system_admin` via `useRoles`):
  lista paginada, criar convite, reenviar e cancelar. Endpoints correspondentes:
  - `GET    /api/v1/invites`             — listagem paginada (`PageResponse`, filtro por status)
  - `POST   /api/v1/invites/{id}/revoke` — cancela um convite PENDING
  - `POST   /api/v1/invites/{id}/resend` — rotaciona o token (invalida o link antigo) e reenvia
- **Multi-tenancy**: `tenantId` saiu do `CreateInviteCommand` — agora é resolvido
  via `@CurrentTenant` no controller (ADR-019). Revoke/resend são tenant-scoped
  (`findByIdAndTenant`) → 404 para convite de outro tenant.
- **Email**: corpo HTML (MimeMessage, multipart com fallback texto) com tom
  editorial, rótulo de papel legível e CTA "Confirmar acesso e definir senha".
- Notificação do operador via Telegram/Slack: implementar quando o tag de log
  começar a barulhar muito.
- Spec visual: design-system V1 seção 09.6, demo "Aceitar convite".
