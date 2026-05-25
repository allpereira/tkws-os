# 04 — Autenticação & Autorização

> Sistema baseado em **Zitadel self-hosted** integrado via **OIDC**.

## Fluxo de alto nível

```
┌─────────┐         ┌───────────┐         ┌─────────┐         ┌─────────┐
│ Browser │         │ Custom    │         │ Zitadel │         │   API   │
│  :5173  │         │ Login     │         │  :8088  │         │  :8080  │
│         │         │  :5174    │         │         │         │         │
└────┬────┘         └─────┬─────┘         └────┬────┘         └────┬────┘
     │ 1. Acessa app                            │                   │
     ├──────────────────────────────────────────────────────────────►
     │ 2. OIDC authorize (PKCE)                 │                   │
     ├─────────────────────────────────────────►│                   │
     │ 3. 302 → /login?authRequestId=V2_xxx     │                   │
     │◄─────────────────────────────────────────┤                   │
     │ 4. Carrega custom login                  │                   │
     ├──────────────────────►│                  │                   │
     │ 5. Submete login      │ 6. Session API   │                   │
     │  (loginName/senha)    │  (createSession, │                   │
     ├──────────────────────►│   checkPassword, │                   │
     │                       │   CreateCallback)│                   │
     │                       ├─────────────────►│                   │
     │ 7. Retorna callbackUrl│                  │                   │
     │◄──────────────────────┤                  │                   │
     │ 8. Redireciona pro callbackUrl com code  │                   │
     ├─────────────────────────────────────────►│                   │
     │ 9. 302 → :5173/callback?code=...         │                   │
     │◄─────────────────────────────────────────┤                   │
     │ 10. Troca code por JWT (PKCE)            │                   │
     ├─────────────────────────────────────────►│                   │
     │ 11. JWT                                  │                   │
     │◄─────────────────────────────────────────┤                   │
     │ 12. Bearer JWT em /api/v1/*                                  │
     ├──────────────────────────────────────────────────────────────►
     │      13. Valida via JWK + (fallback) /oidc/v1/userinfo       │
     │◄──────────────────────────────────────────────────────────────
```

A tela de login do Zitadel nativo NÃO é exibida — o `ZITADEL_OIDC_DEFAULTLOGINURLV2` aponta para a nossa SPA custom em `localhost:5174/login`, que orquestra a autenticação via Session API e devolve o controle ao Zitadel apenas no momento do callback.

## Por que Zitadel

- Open source, self-hosted, **zero custo recorrente**
- Multi-tenancy **nativo** (conceito de "organizações")
- Features modernas: senha, MFA (TOTP, SMS), magic link, **passkeys/WebAuthn**, social login
- OIDC/OAuth2 padrão — Spring Security integra com poucas linhas
- Auditoria built-in
- API completa pra automação

## Setup inicial (uma vez por ambiente)

### 1. Acesso ao Zitadel

Após primeiro `docker compose up -d`:

| Ambiente | URL | Credenciais iniciais |
|---|---|---|
| Dev | http://localhost:8088 | admin@tkws.local / Admin@123456 |
| Staging | https://auth.staging.tkws.com.br | de `.env.staging` |
| Prod | https://auth.tkws.com.br | de `.env.prod` |

**IMPORTANTE:** mude a senha no primeiro login.

### 2. Criar projeto TKWS OS

1. Menu → Projects → Create New Project
2. Nome: `TKWS OS`
3. Salvar

### 3. Criar aplicação Web

Dentro do projeto:
1. Applications → New
2. Nome: `TKWS Web`
3. Type: **Web**
4. Authentication Method: **PKCE** (no console: "PKCE" / `NONE` — **não** use Private Key JWT; isso gera `empty client assertion` no callback)
5. **Access Token Type: JWT** (obrigatório — a API Spring valida JWT; tipo Bearer/opaco gera **401** em `/users/me`)
6. Redirect URIs:
   - Dev: `http://localhost:5173/callback`
   - Staging: `https://staging.tkws.com.br/callback`
   - **Staging previews** (Cloudflare Pages preview deploys): `https://*.tkws-os-staging.pages.dev/callback`
   - Prod: `https://app.tkws.com.br/callback`
   - **Prod preview** (Cloudflare alternativo): `https://tkws-os.pages.dev/callback`
7. Post Logout URIs:
   - Dev: `http://localhost:5173`
   - Staging: `https://staging.tkws.com.br` + `https://*.tkws-os-staging.pages.dev`
   - Prod: `https://app.tkws.com.br` + `https://tkws-os.pages.dev`
8. Cria e **copia o Client ID**

> **Nota sobre wildcard:** Zitadel suporta `*` em redirect URIs. Isso é necessário pra preview
> deploys do Cloudflare Pages funcionarem (cada PR ganha URL única tipo `abc123.tkws-os.pages.dev`).
> Em produção, mantenha apenas domínio custom; staging pode aceitar wildcard pra agilizar review.

### 4. Atualizar variáveis de ambiente

Cole Client ID em:
- `frontend/.env.local` (dev local — copia de `frontend/.env.example`)
- **Cloudflare Pages → Project Settings → Environment variables** (staging + production)
  - Variável: `VITE_ZITADEL_CLIENT_ID`
- `.env.staging` / `.env.prod` no servidor EC2 (para API validar tokens emitidos por esse cliente)

Após mudar variáveis no Cloudflare, **trigger novo deploy** (Deployments → Retry).

### 4.1. Habilitar `org_id` no JWT (multi-tenancy)

A API resolve o tenant a partir do claim `urn:zitadel:iam:user:resourceowner:id`
no JWT (ver [ADR-019](adr/ADR-019-tenant-context-from-jwt.md)). Esse claim
exige **duas configurações combinadas** — uma no Zitadel (app) e outra no
cliente OIDC (frontend):

#### A) No Zitadel — habilitar emissão dos claims

1. Console Zitadel (`http://localhost:8088`) → **Projects** → TKWS OS → **Applications** → **TKWS Web**
2. Aba **Token Settings**
3. Marque **"User Info inside Access Token"** ✓ (libera o `org_id` no JWT)
4. Marque também **"User Roles inside ID Token"** + **"User Roles inside Access Token"** ✓
   (necessário para o `@PreAuthorize` enxergar as roles)
5. **Save**

#### B) No frontend — pedir o scope correto

O Zitadel só inclui o claim se o cliente OIDC **pedir** explicitamente via scope.
Configure em `frontend/src/modules/plataforma/auth/api/oidc-config.ts`:

```ts
scope: [
  'openid',
  'profile',
  'email',
  'offline_access',
  'urn:zitadel:iam:user:resourceowner',  // ← obrigatório para o org_id
].join(' ')
```

Sem esse scope, mesmo com a opção habilitada no app, o JWT virá apenas com
`[sub, aud, iss, exp, iat, client_id, jti]`.

#### Depois das duas mudanças

**Logout + login** dos usuários afetados — tokens antigos continuam sem o claim;
só os emitidos depois da mudança recebem.

Como confirmar:

```bash
# Pegue um JWT depois de logar e cole em https://jwt.io
# No payload, procure: "urn:zitadel:iam:user:resourceowner:id": "<snowflake da org>"
# (snowflake numérico ~18 dígitos — formato do Zitadel; mapeado para BIGINT
#  local em tenants.zitadel_org_id; ver ADR-021)
```

**Sem essa configuração**, a API ainda funciona via fallback automático que chama
`/oidc/v1/userinfo` com o token do usuário (uma round-trip extra por request ·
resultado é cacheado em memória). Habilitar o claim no JWT evita a round-trip e
é o caminho recomendado para produção.

**Se você está vendo este erro:**

```json
{
  "status": 422,
  "title": "tenant.context_missing",
  "detail": "JWT não traz claim '...resourceowner:id' e /userinfo também não devolveu..."
}
```

Checklist:
- "User Info inside Access Token" está habilitada no app?
- Você fez logout+login depois de habilitar?
- O usuário pertence a uma organização (Zitadel) que existe na tabela `tenants` da API?
  (`tenants.zitadel_org_id` precisa bater com o id da org do Zitadel)

### 5. Configurar roles do projeto

Project → Roles → New:

| Role key | Display Name | Descrição |
|---|---|---|
| `system_admin` | Administrador da plataforma TKWS | Operador da Group WS · acesso total a todos os tenants |
| `org_admin` | Administrador do escritório | Configurações do tenant + comercial completo |
| `comercial_atendimento` | Atendimento Comercial | Time de atendimento · Pessoas + Oportunidades |
| `comercial_proposta` | Proposta Comercial | Time de proposta · Pessoas + Oportunidades |
| `default` | Usuário básico | Role base de qualquer convidado · entra mas não tem permissão em rotas com `@PreAuthorize`. Frontend usa pra gate de menu/funcionalidade |

**Group** (campo opcional do Zitadel ao criar role): use `tkws` em todas as 5 — agrupa visualmente no Console.

O `zitadel-seed.sh` cria essas 5 roles automaticamente quando rodado com PAT de `ORG_OWNER` (ver § "Reset Zitadel do zero").

### 6. Habilitar métodos de auth

Settings da instância:
- **Login Policy:** habilita Username/Password
- **MFA:** habilita TOTP e WebAuthn (passkeys)
- **Passwordless:** habilita Magic Link
- **Identity Providers:** adiciona Google e Microsoft se desejar
- **Session Lifetime:** access token 12h, refresh 30 dias

### 7. Configurar Login V2 customizado (SPA `login/`)

O TKWS OS substitui a tela de login nativa do Zitadel por uma SPA própria em
`login/` rodando em `localhost:5174` (em prod, atrás do mesmo domínio do app
ou em subdomínio). Por que: ter total controle sobre a estética editorial,
mensagens em pt-BR e branding da Group WS.

A SPA fala com a Session API do Zitadel via Vite proxy `/zitadel-api/*` que
injeta o Bearer de um **machine user** com role `IAM_LOGIN_CLIENT`. Detalhes
em [ADR-015](adr/0015-custom-login-v2.md).

**Passos** (uma vez por ambiente):

1. **Habilita Login V2** apontando para a SPA. No `docker-compose.yml` já está:
   ```yaml
   ZITADEL_DEFAULTINSTANCE_FEATURES_LOGINV2_REQUIRED: "true"
   ZITADEL_DEFAULTINSTANCE_FEATURES_LOGINV2_BASEURI: http://localhost:5174/
   ZITADEL_OIDC_DEFAULTLOGINURLV2: http://localhost:5174/login?authRequestId=
   ```
   Em instâncias já existentes (sem bootstrap): rode `bash scripts/zitadel-dev-enable-login-v2-custom.sh`.

2. **Cria machine user `login-client` + PAT + role `IAM_LOGIN_CLIENT`.**
   - Bootstrap automático: `ZITADEL_FIRSTINSTANCE_LOGINCLIENTPATPATH=/zitadel/bootstrap/login-client.pat` no compose gera tudo no primeiro `docker compose up`. Depois rode `bash scripts/extract-login-pat.sh` para extrair o PAT para `docker/zitadel/login-client.pat` (gitignored).
   - Manual (instância já criada): Console → Users → Service Accounts → "+ New" → username `login-client`, name `TKWS Login Client`, type Bearer → criar → "Personal Access Tokens" → "+ New" → Add (sem expiração) → copia o token e salva em `docker/zitadel/login-client.pat`. Depois Default Settings → "+" no topo direito → seleciona o user → marca `Iam Login Client` → Add. Para containers/serviços externos: `bash scripts/zitadel-install-login-pat.sh docker/zitadel/login-client.pat`.

3. **Cria o usuário humano** (Console → Users → New) com email válido. O `preferred_username` será o **loginName** usado no formulário da SPA (a Session API não aceita email como loginName por padrão).

4. **Configura `login/.env.local`** copiando de `login/.env.example`:
   ```bash
   VITE_ZITADEL_AUTHORITY=http://localhost:8088
   VITE_ZITADEL_API_BASE=/zitadel-api
   VITE_ZITADEL_UPSTREAM=http://localhost:8088
   VITE_ZITADEL_CLIENT_ID=<mesmo client id do frontend>
   ```

## Como funciona no código

### Backend — Spring Security

`SecurityConfig.java` configura:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(c -> c.disable())
        .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/actuator/health/**").permitAll()
            .anyRequest().authenticated()
        )
        .oauth2ResourceServer(o -> o
            .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
        );
    return http.build();
}
```

`ZitadelRolesConverter.java` extrai roles do claim `urn:zitadel:iam:org:project:roles` e converte
em `GrantedAuthority` com prefixo `ROLE_` para usar em `@PreAuthorize`:

```java
@PostMapping
@PreAuthorize("hasRole('SYSTEM_ADMIN')")
public ResponseEntity<TenantView> create(@Valid @RequestBody CreateTenantCommand cmd) { ... }
```

### Frontend — react-oidc-context

`features/auth/api/oidc-config.ts` configura o provider e exporta `isOidcConfigured()` (valida
`VITE_ZITADEL_CLIENT_ID` em dev). Rotas: `/` (home protegida) e `/callback` (retorno OIDC).
Variáveis em `frontend/.env.local` — copiar de `frontend/.env.example`. Hook recomendado:
`useRequireAuth()`.

Configuração base:

```ts
export const oidcConfig: AuthProviderProps = {
  authority: ZITADEL_AUTHORITY,
  client_id: ZITADEL_CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile email offline_access',
  automaticSilentRenew: true,
};
```

Em componentes:

```tsx
import { useAuth } from 'react-oidc-context';

function MyComponent() {
  const auth = useAuth();

  if (auth.isLoading) return <Spinner />;
  if (!auth.isAuthenticated) {
    return <button onClick={() => auth.signinRedirect()}>Login</button>;
  }

  return <div>Olá, {auth.user?.profile.name}</div>;
}
```

`shared/api/client.ts` (axios) injeta token automaticamente em todo request.

### Custom Login V2 — SPA `login/`

A SPA em `login/` (porta 5174) implementa o fluxo de login customizado usando a
**Session API v2** do Zitadel. As chamadas para `/v2/sessions`, `/v2/sessions/{id}`
e `/zitadel.oidc.v2.OIDCService/CreateCallback` exigem Bearer auth com PAT do
machine user `login-client` (role `IAM_LOGIN_CLIENT`) — segredo que **não pode**
ficar no bundle do browser.

A solução em dev é o **proxy do Vite** (`login/vite.config.ts`): mapeia
`/zitadel-api/*` para o Zitadel, lê o PAT de `docker/zitadel/login-client.pat`
e injeta `Authorization: Bearer <PAT>` em cada request encaminhada. O cliente
JS chama `apiFetch('/v2/sessions', ...)` como se fosse same-origin. Detalhes
em [ADR-015](adr/0015-custom-login-v2.md).

```
Browser ──► /zitadel-api/v2/sessions  ──Vite proxy──► http://localhost:8088/v2/sessions
                                       (injeta Bearer)
```

**Em prod:** a mesma topologia precisa ser replicada por Caddy/Cloudflare Worker
que injete o Bearer antes de chamar o Zitadel — a SPA nunca toca no PAT.

**Pegadinha do Zitadel 4.x v4.15.0:** o endpoint REST
`POST /v2/oidc/auth_requests/{id}/callback` retorna **404 "Not Found"**, mas o
Connect-RPC equivalente `POST /zitadel.oidc.v2.OIDCService/CreateCallback`
funciona. Já está corrigido em `login/src/shared/lib/zitadel-client.ts:createOidcCallback`.

**LoginName ≠ email.** A Session API resolve usuários por `preferred_username`,
não por email. Quando o usuário digita o email no formulário, o Zitadel retorna
404 `User could not be found (QUERY-Dfbg2)`. Use o `preferred_username` do
usuário (visível em Console → Users → Display).

## Sincronização de usuários

Cada usuário Zitadel tem **espelho local** na tabela `users`. Sincronização acontece na primeira
requisição autenticada via `GET /api/v1/users/me`:

```java
@GetMapping("/me")
public ResponseEntity<UserView> me(
        @AuthenticationPrincipal Jwt jwt,
        @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {

    ZitadelUserData data = ZitadelJwtClaimsMapper.toUserData(jwt);

    // Fallback: o access token do Zitadel frequentemente NÃO carrega email/name —
    // só sub/iss/aud. Quando faltar, chamamos /oidc/v1/userinfo com o próprio
    // access token do usuário (sem PAT) e enriquecemos o ZitadelUserData.
    if (data.email() == null) {
        Map<String, Object> userInfo = userInfoClient.fetchUserInfo(extractBearer(authHeader));
        data = enrichWithUserInfo(data, userInfo);
    }

    if (data.email() == null) {
        throw new IllegalArgumentException("Não foi possível determinar o email do usuário...");
    }

    return ResponseEntity.ok(syncUseCase.execute(data));
}
```

O `ZitadelUserInfoClient` (Spring `@Component`) usa `RestClient` apontando para
`spring.security.oauth2.resourceserver.jwt.issuer-uri` e chama `GET /oidc/v1/userinfo`
com `Authorization: Bearer <access_token_do_usuário>`. Não é necessário PAT — o
endpoint aceita o próprio access token do usuário que está fazendo a request.

Por que o JWT do Zitadel não traz `email`: por design, claims OIDC (`email`,
`name`, `picture`, etc.) ficam no UserInfo endpoint a não ser que sejam
explicitamente embarcados no token via "User Info Inside ID Token" no app web
ou via Action customizada. O fallback nos isenta dessa config — funciona com
qualquer setup padrão do Zitadel.

**Vantagem do mirror local:** JOINs e FKs com `user_id` local, sem chamar Zitadel
a cada query.

## Convite de membros para tenants existentes

Admins adicionam membros ao tenant via convite com magic link enviado por email.
A spec completa está em [ADR-016](adr/ADR-016-invite-by-email.md); resumo:

- `POST /api/v1/invites` (autenticado, `org_admin` ou `system_admin`) cria o
  invite, cria um user shell no Zitadel via Admin API, gera token (32 bytes,
  Base64URL), persiste o **hash SHA-256** do token e dispara email + log
  estruturado pro operador.
- O convidado clica no link e cai em `localhost:5174/accept-invite?token=...`
  (SPA `login/`). A tela espelha `09.6 · Aceitar convite` do design system V1.
- `POST /api/v1/invites/accept` (público — o token autentica) define a senha
  no Zitadel, atribui o role do projeto no `zitadel_org_id` do tenant, marca
  o invite como ACCEPTED e redireciona para `/login?loginNameHint=<email>`.

Estados do invite: `PENDING → ACCEPTED | EXPIRED | REVOKED` (terminais). TTL
default 7 dias (`tkws.invites.ttl` em `application.yml`).

**Email em dev local:** o `docker-compose.yml` sobe **Mailpit** —
inbox web em <http://localhost:8025>, SMTP em `:1025`. Spring Mail já aponta
pra lá via `application.yml`. Em prod, configurar `SMTP_HOST/PORT/USER/PASS` no
ambiente.

**Pré-requisito:** `tkws.zitadel.project-id` precisa estar configurado para a
atribuição de role funcionar — pegue em Console → Projects → TKWS OS → Detail.
Sem ele, o invite é aceito mas o role não é atribuído (warn no log).

## Multi-tenancy

Cada escritório cliente é uma **organização** no Zitadel:

1. Cria org via API Zitadel (automatizado via use case `OnboardTenantUseCase` — futuro)
2. Espelha como `tenant` na tabela local
3. Convida usuários para a org via UI Zitadel
4. JWT vem com `org_id` em claims customizados (configurável no Zitadel)
5. Backend filtra dados por `tenant_id` extraído do JWT

## SSO corporativo (futuro)

Quando cliente corporativo pedir login via Microsoft 365 ou Google Workspace:

1. Settings da org no Zitadel → Identity Providers → Add
2. Configura SAML ou OIDC com dados do IdP do cliente
3. Pronto. Sem custo extra, sem upgrade de plano.

## Mobile (Capacitor)

O app mobile híbrido (iOS/Android via Capacitor) precisa de auth com **deep links** em vez
de redirect HTTP. Diferenças importantes:

### Aplicação separada no Zitadel (recomendado)

Crie uma **segunda aplicação Zitadel** especificamente para mobile:

1. No mesmo projeto `TKWS OS`, Applications → New
2. Nome: `TKWS Mobile`
3. Type: **Native**
4. Authentication Method: **PKCE** (PKCE-only)
5. Redirect URIs:
   - `br.com.tkws.app://callback` (deep link customizado)
6. Post Logout URIs:
   - `br.com.tkws.app://logout`
7. Copia o Client ID — vai como `VITE_ZITADEL_MOBILE_CLIENT_ID` no build do Capacitor

> **Por que app separado:** apps Web e Native têm requisitos OIDC diferentes. Misturar
> num só dá problema em validação. Separar é grátis (Zitadel não cobra por app).

### CORS

A API precisa aceitar origens do Capacitor (já configurado em `docker-compose.prod.yml`
e `docker-compose.staging.yml`):

```
capacitor://localhost  # iOS WKWebView
https://localhost      # Android WebView com schema https
```

### Plugin Capacitor

Usar [`@capacitor-community/oauth2`](https://github.com/moberwasserlechner/capacitor-oauth2)
ou [`@openid/appauth`](https://github.com/openid/AppAuth-JS) com Capacitor Browser.
Veja `docs/01-DEVELOPMENT.md` seção "Capacitor" para setup.

### Deep linking config

iOS (`ios/App/App/Info.plist`):
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array><string>br.com.tkws.app</string></array>
  </dict>
</array>
```

Android (`android/app/src/main/AndroidManifest.xml`):
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="br.com.tkws.app" />
</intent-filter>
```

### Token storage

No mobile, JWT vai no **Secure Storage** nativo (Keychain iOS / Keystore Android), nunca
em `localStorage`. Plugin: `@capacitor/preferences` com encryption habilitada, ou
`capacitor-secure-storage-plugin`.

## Backups

Toda a configuração do Zitadel (instâncias, orgs, usuários, sessões) fica no banco PostgreSQL
(database `zitadel`). Backups do RDS já incluem.

**CRÍTICO:** a `ZITADEL_MASTERKEY` (32 caracteres) é necessária pra descriptografar dados após restore.
**Guarde em local seguro** (1Password, AWS Secrets Manager, cofre físico).

## Troubleshooting

### "Invalid issuer" no Spring

`ZITADEL_ISSUER` no `.env` não bate com o que o Zitadel se identifica.

```bash
# Confere o issuer real:
curl https://auth.tkws.com.br/.well-known/openid-configuration | jq .issuer
```

### Token expirado

Tokens duram 12h por default. Refresh automático funciona se `automaticSilentRenew: true`
estiver no config OIDC do frontend.

### CORS errors

1. `tkws.cors.allowed-origins` no `application.yml` da API permite a origem
2. Redirect URI cadastrado corretamente no Zitadel
3. Em produção, tudo via HTTPS

### Loop infinito de redirect

Provável: redirect URI não cadastrado, ou Client ID errado, ou cookies bloqueados.

```bash
# Limpa cookies/localstorage do browser e tenta de novo
```

### Console redireciona para `/ui/v2/login/login` (não abre a UI)

A instância está com **Login V2 obrigatório**, mas o serviço `zitadel-login` ainda não tem PAT — o console também exige login e cai no mesmo endpoint quebrado (502 ou Not Found).

**Desbloqueio rápido em dev** (volta ao Login V1 embutido no `zitadel`):

```bash
./scripts/zitadel-dev-disable-login-v2.sh
```

Depois acesse http://localhost:8088/ui/console, crie o app Web e o PAT do login-client. Para reativar Login V2, siga a seção abaixo e `scripts/zitadel-install-login-pat.sh`.

### `{"code":5,"message":"Not Found"}` em `/ui/v2/login/login`

O Zitadel **4.x** usa **Login V2** (`/ui/v2/login/...`). O container `zitadel` sozinho **não** serve essa UI —
é preciso o serviço `zitadel-login` + `zitadel-gateway` (Caddy na porta 8088), já definidos em `docker-compose.yml`.

**Instalação nova** (bootstrap gera o PAT automaticamente):

```bash
docker compose pull zitadel zitadel-login
docker compose up -d zitadel zitadel-login zitadel-gateway
```

**Instância já existente** (sem apagar o banco): crie o PAT manualmente e instale no volume:

1. Console: http://localhost:8088/ui/console (`admin@tkws.local` / `Admin@123456`)
2. Users → machine user `login-client` → PAT → salve em `docker/zitadel/login-client.pat`
3. Instance → Members → role **Instance Login Client** (`IAM_LOGIN_CLIENT`)
4. `./scripts/zitadel-install-login-pat.sh`
5. `docker compose up -d zitadel-login zitadel-gateway`

**Último recurso** (apaga dados do Zitadel): `docker compose down -v` e `docker compose up -d`.

### "Redirecionando para login..." preso em `http://localhost:5173/`

| Cenário | O que verificar |
|---|---|
| `npm run dev` (Vite) | Arquivo `frontend/.env.local` com `VITE_ZITADEL_CLIENT_ID` real; reiniciar Vite após editar |
| `docker compose` frontend | `.env` na raiz com `ZITADEL_CLIENT_ID` (não `replace-after-setup`); rebuild: `docker compose up -d --build frontend` |
| Zitadel | `curl -s http://localhost:8088/.well-known/openid-configuration` retorna JSON |
| App Web no Zitadel | Redirect URI `http://localhost:5173/callback` cadastrado; método **PKCE** |

O frontend exibe **"Autenticação não configurada"** quando o Client ID está vazio ou é placeholder.
Após login, o Zitadel retorna para `/callback`; o `AuthProvider` processa o código e redireciona para `/`.

### 401 em todo endpoint protegido

```bash
# Verifica se JWT está sendo enviado:
curl -v -H "Authorization: Bearer <token>" https://api.tkws.com.br/api/v1/users/me

# Verifica logs da API:
docker compose logs api | grep -i jwt
```

### `empty client assertion` no callback (`/callback`)

O app Web foi criado com **Private Key JWT** em vez de **PKCE**. O frontend (`oidc-client-ts`) usa PKCE público e não envia `client_assertion`.

1. Console → app **TKWS Web** → **Authentication Method: PKCE** (não Private Key JWT)
2. Limpe localStorage e faça login de novo

Em dev:

```bash
./scripts/zitadel-dev-pkce-auth-method.sh <client_id>
```

### 400 em `GET /api/v1/users/me` (`Não foi possível determinar o email do usuário`)

A API tem fallback automático para `/oidc/v1/userinfo` quando o JWT não traz
`email` (ver `ZitadelUserInfoClient`). Se mesmo assim falhar:

1. **Confira que o user tem email cadastrado no Zitadel.** Console → Users →
   abrir o user → campo "E-mail" preenchido e marcado como verified.
2. **Logout/login** depois de qualquer mudança no perfil (token cacheado pode
   ainda apontar pro user sem email).
3. **A API está com bytecode antigo?** Sintoma: a mensagem do erro é `"JWT sem
   email. Confirme o scope 'email'..."` (texto antigo, só existe em testes).
   Mata o processo Java (`lsof -ti:8080 | xargs kill -9`) e roda
   `mvn clean spring-boot:run`.
4. **Confirme manualmente** que o /userinfo está respondendo:
   ```js
   // No console do browser, com sessão ativa
   const u = JSON.parse(localStorage[Object.keys(localStorage).find(k => k.startsWith('oidc.user'))]);
   fetch('http://localhost:8088/oidc/v1/userinfo', {
     headers: { Authorization: 'Bearer ' + u.access_token }
   }).then(r => r.json()).then(console.log);
   ```
   Deve trazer `email`, `name`, `preferred_username`. Se não, é o user no
   Zitadel que está incompleto.

### 401 em `GET /api/v1/users/me` após login no frontend

Causa mais comum: app Web no Zitadel com **Access Token Type = Bearer** (opaco). A API usa `JwtDecoder` e só aceita **JWT**.

1. Console Zitadel → app **TKWS Web** → **Token Settings** → **Access Token Type: JWT**
2. Faça **logout e login** de novo no app (token antigo continua opaco)
3. No DevTools → Application → Local Storage, o `access_token` deve começar com `eyJ`

Em dev, script alternativo (projeção; prefira alterar no console):

```bash
./scripts/zitadel-dev-jwt-access-token.sh 373713356953026566
```

### Login custom retorna "E-mail ou senha incorretos" mesmo com credenciais corretas

O custom login mapeia status HTTP genéricos para essa mensagem. Para diagnosticar:

```js
// Console do browser em http://localhost:5174/login?authRequestId=...
fetch('/zitadel-api/v2/sessions', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({checks: {user: {loginName: 'seu_username'}}})
}).then(r => r.json().then(b => console.log(r.status, b)));
```

| Status / mensagem | Causa | Fix |
|---|---|---|
| `401 auth header missing` | PAT do login-client não está sendo lido pelo proxy | `bash scripts/extract-login-pat.sh` e reiniciar `cd login && npm run dev` |
| `404 User could not be found (QUERY-Dfbg2)` | loginName errado (provavelmente digitou email) | Usar o `preferred_username` real (Console → Users) |
| `200` mas o submit continua dando erro | Falha no `CreateCallback`. Ver próximo item. | — |

### `404 Not Found` em `CreateCallback` no Zitadel 4.x

Bug conhecido: o gRPC-transcoding REST `POST /v2/oidc/auth_requests/{id}/callback`
retorna 404 no Zitadel 4.x v4.15.0, mesmo com PAT válido e role correto. O
método Connect-RPC `POST /zitadel.oidc.v2.OIDCService/CreateCallback` funciona.
A SPA `login/` já usa o Connect-RPC — se o erro voltar depois de uma atualização
do Zitadel, conferir `login/src/shared/lib/zitadel-client.ts:createOidcCallback`.

### Console do Zitadel também cai no custom login e quebra

Quando `LOGINV2_REQUIRED=true`, TODOS os auth requests vão pra `/login?authRequestId=...`
da SPA, inclusive os do próprio console. Mitigação implementada:
`login/src/app/router.tsx:IndexGate` busca o auth request via
`GET /v2/oidc/auth_requests/{id}`, compara o `clientId` com
`VITE_ZITADEL_CLIENT_ID`, e redireciona silenciosamente para a tela V1 nativa
do Zitadel se for um cliente diferente (console, etc).

Pré-requisito: `VITE_ZITADEL_CLIENT_ID` configurado em `login/.env.local` com o
mesmo valor do frontend.

## Roles e permissões — quadro de referência

Paths base reais e roles autorizadas (espelho do `@PreAuthorize` nos
controllers · snapshot atual). Quando criar endpoint novo, atualize aqui.

| Endpoint | Roles autorizadas |
|---|---|
| `GET /api/v1/users/me` | qualquer autenticado · sem `@PreAuthorize` (inclui `default`) |
| `POST /api/v1/tenants` | `system_admin` |
| `GET /api/v1/tenants/{id}`, `GET /api/v1/tenants/by-slug/{slug}` | `system_admin`, `org_admin` |
| `POST /api/v1/invites` | `org_admin`, `system_admin` |
| `GET /api/v1/invites/by-token`, `POST /api/v1/invites/accept` | público (sem auth) |
| `GET /api/v1/pessoas` (`?status=LEAD\|CLIENTE`) | `org_admin`, `comercial_atendimento`, `comercial_proposta` |
| `GET /api/v1/pessoas/{id}`, `GET /api/v1/pessoas/buscar` (dedup) | `org_admin`, `comercial_atendimento`, `comercial_proposta` |
| `POST /api/v1/pessoas`, `PATCH /api/v1/pessoas/{id}` | `org_admin`, `comercial_atendimento`, `comercial_proposta` |
| `POST /api/v1/pessoas/{id}/converter` (Lead → Cliente manual) | `org_admin`, `comercial_atendimento`, `comercial_proposta` |
| `GET/POST/PATCH/DELETE /api/v1/crm/oportunidades` + `/{id}/mover` | `org_admin`, `comercial_atendimento`, `comercial_proposta` |
| `GET/POST/PATCH/DELETE /api/v1/crm/pipelines` | `org_admin` |
| `GET/POST/PATCH/DELETE /api/v1/crm/etapas` | `org_admin` |
| `GET/POST/PATCH/DELETE /api/v1/crm/tipos-pagamento` (lookup · ADR-020) | `org_admin` |
| `GET/POST/PATCH/DELETE /api/v1/organizacao/ofertas` (lookup) | `org_admin` |
| `GET/POST/PATCH/DELETE /api/v1/organizacao/setores` (lookup) | `org_admin` |
| `GET/POST/PATCH/DELETE /api/v1/organizacao/tipos-empresa` (lookup) | `org_admin` |
| `GET/POST/PATCH/DELETE /api/v1/organizacao/tipos-projeto` (lookup) | `org_admin` |
| `GET/POST/PATCH/DELETE /api/v1/organizacao/unidades` (lookup) | `org_admin` |
| `GET/POST/PATCH/DELETE /api/v1/organizacao/empreendimentos` (lookup) | `org_admin` |
| `GET/POST/PATCH/DELETE /api/v1/organizacao/funcoes-pessoas` (lookup) | `org_admin` |

**Padrão:** sempre usar `@PreAuthorize` em controllers, não `.authorizeHttpRequests()` exceto
para rotas públicas (health, swagger).

**Sobre a role `default`**: ela é atribuída a qualquer convidado e funciona como
gate de UI · o usuário entra no sistema (pode chamar `/users/me`), mas todo
endpoint com `@PreAuthorize` retorna 403. O frontend lê as authorities do JWT e
liga/desliga menus conforme as outras roles que o usuário tem.

## Reset Zitadel do zero (dev local)

Quando você quer recomeçar limpo (instância Zitadel inteira derrubada e recriada),
o bootstrap automático do compose recria:

- **org default** `tkws.localhost`
- humano **`admin@tkws.local`** com senha `Admin@123456` (vars
  `ZITADEL_FIRSTINSTANCE_ORG_HUMAN_*` no `docker-compose.yml`)
- machine **`login-client`** + PAT salvo em `/zitadel/bootstrap/login-client.pat`
  (var `ZITADEL_FIRSTINSTANCE_LOGINCLIENTPATPATH`)
- **Login V2 ativado** apontando para `http://localhost:5174` (var
  `ZITADEL_DEFAULTINSTANCE_FEATURES_LOGINV2_REQUIRED=true`)

O que o bootstrap **não** cria automaticamente:

- Nome da org (renomeada para `GROUP WS`) e domínio primário (`group-ws.localhost`)
- Projeto `TKWS OS`
- App OIDC `Web` (com redirect, post-logout, JWT, role assertion)
- 5 roles do projeto: `system_admin`, `org_admin`, `comercial_atendimento`, `comercial_proposta`, `default`
- `projectRoleAssertion=true` no projeto (necessário para o claim de roles vir no JWT · ver § "Diagnóstico · JWT sem claim de roles")
- Usuários humanos da equipe (além do admin) + UserGrants (atribuir roles a humanos)

Esse "estado de aplicação" é construído pelo script
[`scripts/zitadel-seed.sh`](../scripts/zitadel-seed.sh) (idempotente).

### Procedimento completo

```bash
# 1. Destrói tudo (containers + volumes; perde dados Zitadel + Postgres TKWS)
docker compose down -v

# 2. Sobe de novo (bootstrap automático faz seu trabalho)
docker compose up -d

# 3. Aguarda Zitadel saudável (~30s) e extrai o PAT bootstrap para o host
bash scripts/extract-login-pat.sh

# 4. Aplica o seed declarativo
bash scripts/zitadel-seed.sh
```

O `zitadel-seed.sh`:

- detecta `Projeto TKWS OS` (cria se não existir)
- detecta `App Web` (cria se não existir, com config OIDC PKCE + JWT)
- cria as 5 roles do projeto (`system_admin`, `org_admin`, etc.)
- sincroniza `VITE_ZITADEL_CLIENT_ID` nos `frontend/.env.local` e
  `login/.env.local`

### Limitação · ORG_OWNER

O PAT do `login-client` tem permissão mínima (só Session API + OIDC). Para
**criar projeto/app/role** o seed precisa rodar com um machine user que tenha
role `ORG_OWNER`. Caminhos:

**A. Promover o login-client a ORG_OWNER (dev local, simples)**

1. Abra http://localhost:8088 e logue como `admin@tkws.local` / `Admin@123456`
2. Vá em **Users** → `login-client` → **Authorizations** → **+ New**
3. Selecione a org TKWS e o role `ORG_OWNER`
4. Re-rode `bash scripts/zitadel-seed.sh` — agora ele consegue criar tudo

**B. Criar machine user dedicado `seed-bot` (recomendado para staging/prod)**

1. Abra http://localhost:8088 logado como admin
2. **Users** → **+ New** → tipo **Service User**, name `seed-bot`
3. Adicione **Authorization** com role `ORG_OWNER`
4. **Personal Access Tokens** → **+ New** → expiration distante (ou never)
5. Copie o PAT e salve em `docker/zitadel/seed-bot.pat`
6. Edite `scripts/zitadel-seed.sh`: troque `PAT_FILE` para
   `docker/zitadel/seed-bot.pat`
7. Re-rode o seed

Quando o usuário convidado aceitar o invite (ver ADR-016), ele também precisará
ser autorizado no projeto via o fluxo de UserGrant que o backend já faz por código.

### Quando o `zitadel-seed.sh` falha com 403

O script é tolerante a 403: ele imprime aviso e continua. Os endpoints com
permissão limitada são `POST /projects`, `POST /apps`, `POST /roles` e
`PUT /projects/{id}`. Em todos os outros casos (sync `.env.local`, leitura
de estado) ele funciona com o PAT do login-client.

### Diagnóstico · JWT sem claim de roles (403 em todo endpoint)

Sintoma: depois de logar via OIDC, todo `GET /api/v1/...` com `@PreAuthorize`
retorna 403. O usuário **tem grants** assinalados no projeto, mas o claim
`urn:zitadel:iam:org:project:roles` não aparece no JWT.

Para o claim ser emitido, **três** condições precisam estar satisfeitas
simultaneamente:

1. **No FRONTEND** · scope OIDC `urn:zitadel:iam:org:project:id:{ProjectId}:aud`
   no `oidc-config.ts`. Adiciona o `project_id` ao `aud` do token. Sem isso o
   audience fica só com o client_id e o Zitadel não emite o role claim. Vem
   automaticamente quando `VITE_ZITADEL_PROJECT_ID` está no `.env.local`.

2. **No APP `Web`** · `accessTokenRoleAssertion: true` (e `idTokenRoleAssertion: true`
   se o frontend usar id_token). Já configurado pelo seed na criação inicial.

3. **No PROJETO `TKWS OS`** · `projectRoleAssertion: true`. **Esse é o que mais
   passa despercebido** — projetos criados manualmente no Console nascem com
   essa flag em `false`. Console → Projects → TKWS OS → toggle
   **"Assert Roles on Authentication"** → Save.

O `zitadel-seed.sh` detecta projetos com `projectRoleAssertion=false` e tenta
ligar via `PUT /projects/{id}`, mas isso requer `ORG_OWNER` no PAT (gap
documentado na seção anterior).

**Diagnose rápido**: pegue o access token (`localStorage.clear()` + login,
copie do localStorage `oidc.user:...`), cole em https://jwt.io e cheque:

```json
{
  "aud": ["client_id", "project_id"],   // ✓ scope project audience funcionou
  "urn:zitadel:iam:user:resourceowner:id": "...",  // ✓ org id
  "urn:zitadel:iam:org:project:roles": { ... }   // ✓ projectRoleAssertion ON
}
```

Se `aud` não tem o project_id → fix (1).
Se tem project_id em `aud` mas falta `urn:zitadel:iam:org:project:roles` → fix (3).
