# ADR-015: Custom Login V2 (SPA própria substituindo a UI nativa do Zitadel)

**Status:** Accepted
**Data:** 2026-05-21
**Decisores:** Allysson

## Contexto

O Zitadel 4.x exige o **Login V2** (feature flag `login_v2.required=true`) para
fluxos OIDC. Por padrão, a UI vem do container oficial `ghcr.io/zitadel/zitadel-login`
(Next.js, montado pelo Caddy em `/ui/v2/login/*`). Duas dificuldades:

1. **Estética e tom.** O TKWS OS tem posicionamento editorial (tipografia
   Fraunces/Inter, paleta navy/cyan, microcopy em pt-BR). A UI nativa do Zitadel,
   ainda que customizável via "Branding", não chega no nível de controle que
   queremos — e mudanças passam por configuração do servidor, não por código.
2. **Fluxos não-padrão futuros.** Onboarding com aprovação manual ([ADR-014](ADR-014-onboarding-approval.md)),
   convites com link, branding por tenant — todos exigem telas que a UI nativa
   não cobre nativamente.

O Zitadel expõe a **Session API v2** justamente para esse caso: criar UIs próprias
que orquestrem o login chamando `POST /v2/sessions`, `PATCH /v2/sessions/{id}` e
`POST /zitadel.oidc.v2.OIDCService/CreateCallback`. Mas todos esses endpoints
exigem **Bearer auth** com PAT de um machine user com role `IAM_LOGIN_CLIENT`.

Como a SPA é puro JS no browser, ela **não pode** segurar o PAT. Surge a
necessidade de um intermediário.

## Decisão

Construir uma **SPA dedicada** em `login/` (Vite + React 19 + TanStack Router),
servida em `localhost:5174` em dev e em subdomínio próprio em prod. O Zitadel é
configurado para redirecionar todos os auth requests para essa SPA via
`ZITADEL_OIDC_DEFAULTLOGINURLV2=http://localhost:5174/login?authRequestId=`.

Para resolver o problema do PAT:

- **Em dev**, o Vite proxy `/zitadel-api/*` lê `docker/zitadel/login-client.pat`
  (gitignored) e injeta `Authorization: Bearer <PAT>` em cada request antes de
  encaminhar para o Zitadel.
- **Em prod**, a mesma topologia será replicada por Cloudflare Worker (ou Caddy
  no mesmo gateway que serve o Zitadel) — o PAT mora no edge, nunca toca o
  bundle do browser.

Endpoints que a SPA usa:

| Operação | Path |
|---|---|
| Criar sessão | `POST /v2/sessions` |
| Verificar senha | `PATCH /v2/sessions/{id}` (header `x-zitadel-session-token`) |
| Verificar TOTP | `PATCH /v2/sessions/{id}` |
| Buscar auth request | `GET /v2/oidc/auth_requests/{id}` |
| **Finalizar callback** | `POST /zitadel.oidc.v2.OIDCService/CreateCallback` |

A última linha usa o caminho **Connect-RPC** porque o gRPC-transcoding REST
`POST /v2/oidc/auth_requests/{id}/callback` retorna 404 no Zitadel 4.x v4.15.0
(bug conhecido — talvez corrigido em versões futuras; quando atualizar, testar
o REST de novo e remover essa exceção).

## Alternativas consideradas

1. **Usar a UI nativa do Zitadel (`zitadel-login` container)** — Zero código de
   auth para manter. Mas estética limitada a "branding" (logo, cores, copy
   curto) e zero controle sobre fluxos não-padrão. **Rejeitada** porque o
   posicionamento do produto pede mais.

2. **Forkar o `zitadel-login` Next.js oficial** — Mantém Bearer auth no
   servidor Node (resolve o PAT trivialmente). Mas adiciona Next.js ao stack
   (que é só Vite/React no resto do projeto), e atualizar fork conforme Zitadel
   evolui é trabalho recorrente. **Rejeitada**.

3. **SPA + backend dedicado pra login (BFF)** — Pequeno serviço Node/Spring
   que proxia a Session API e injeta o PAT. Resolve prod e dev igualmente.
   **Considerada para prod**: o Vite proxy só funciona em dev. Em produção
   provavelmente vamos usar Cloudflare Worker (mais barato e simples que um
   serviço dedicado) — mas a opção fica aberta caso a complexidade exija.

4. **SPA + Vite proxy em dev + edge function em prod (ESCOLHIDA)** —
   Topologia idêntica conceitualmente (gateway injetando Bearer); só muda o
   runtime. Em dev é instantâneo (`npm run dev` lê o PAT do disco); em prod
   é Worker/Caddy. **Por que venceu**: zero código extra em dev, e a transição
   pra prod é só configurar o Worker (decisão protelável).

## Consequências

### Positivas

- **Controle total da experiência de login** — tipografia, animações, microcopy,
  fluxos custom (convite, onboarding com aprovação).
- **Pt-BR de primeira classe** — sem depender da i18n do Zitadel.
- **Permite IndexGate**: a SPA detecta auth requests do console Zitadel (clientId
  ≠ frontend) e redireciona silenciosamente para a Login V1 nativa, evitando que
  o admin caia no nosso form.
- **Fallback `/oidc/v1/userinfo` no UserController** — desacopla a API do
  formato do JWT que o Zitadel emite (que muda entre versões e configs).

### Negativas / Trade-offs

- **Complexidade operacional do PAT.** Precisa criar machine user, gerar PAT,
  atribuir role `IAM_LOGIN_CLIENT`, salvar no disco (dev) ou no Worker (prod).
  Mitigado por scripts (`extract-login-pat.sh`, `zitadel-install-login-pat.sh`)
  e bootstrap automático no `docker-compose.yml`.
- **Não há proteção contra brute force além do rate limit do Zitadel.** A UI
  nativa tem captcha/lockout configurável; a custom precisa reimplementar se
  quisermos algo mais sofisticado que o default do Zitadel.
- **Manter a SPA atualizada com mudanças da Session API.** Já consumimos a
  ressaca de uma: o Connect-RPC do `CreateCallback`. Quando o Zitadel arrumar
  o REST, podemos voltar — vamos ter que monitorar.

### Riscos

- **Acoplamento ao formato Connect-RPC do Zitadel.** Se a Zitadel renomear o
  service (de `zitadel.oidc.v2` para `zitadel.oidc.v3`, por exemplo), quebramos.
  Mitigação: testes E2E que cobrem o fluxo inteiro (a fazer).
- **PAT vazado.** Se o Vite proxy em prod for substituído por algo que exponha
  o PAT (ex.: configurando direto no env do browser), todo o sistema fica
  comprometido. Documentação enfatiza: PAT mora no servidor/edge, NUNCA no
  bundle.

## Notas adicionais

- Setup completo em [docs/04-AUTH.md, seção "Configurar Login V2 customizado"](../04-AUTH.md).
- Scripts relacionados:
  - `scripts/extract-login-pat.sh` — extrai PAT do volume Docker
  - `scripts/zitadel-install-login-pat.sh` — instala PAT manualmente no volume
  - `scripts/zitadel-dev-enable-login-v2-custom.sh` — ativa Login V2 apontando para a SPA
  - `scripts/zitadel-dev-disable-login-v2.sh` — volta para Login V1 (emergência)
- Issue do Zitadel sobre o `CreateCallback` REST 404: ainda não reportada upstream.
  Verificar quando atualizar para versões > v4.15.0.
