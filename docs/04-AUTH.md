# 04 — Autenticação & Autorização

> Sistema baseado em **Zitadel self-hosted** integrado via **OIDC**.

## Fluxo de alto nível

```
┌─────────┐                   ┌─────────┐                   ┌─────────┐
│ Browser │                   │ Zitadel │                   │   API   │
└────┬────┘                   └────┬────┘                   └────┬────┘
     │ 1. Acessa app               │                             │
     ├─────────────────────────────────────────────────────────► │
     │ 2. Redireciona pra Zitadel  │                             │
     ├────────────────────────────►│                             │
     │ 3. Login + MFA              │                             │
     │◄────────────────────────────┤                             │
     │ 4. Auth code                │                             │
     │ 5. Troca por JWT (PKCE)     │                             │
     │                             │                             │
     │ 6. Bearer JWT em /api/v1/*                                │
     ├──────────────────────────────────────────────────────────►│
     │                             │ 7. Valida via JWK           │
     │                             │◄────────────────────────────┤
     │                             ├────────────────────────────►│
     │ 8. Resposta                                               │
     │◄──────────────────────────────────────────────────────────┤
```

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
4. Authentication Method: **PKCE** (PKCE-only, sem client secret)
5. Redirect URIs:
   - Dev: `http://localhost:5173/callback`
   - Staging: `https://staging.tkws.com.br/callback`
   - **Staging previews** (Cloudflare Pages preview deploys): `https://*.tkws-os-staging.pages.dev/callback`
   - Prod: `https://app.tkws.com.br/callback`
   - **Prod preview** (Cloudflare alternativo): `https://tkws-os.pages.dev/callback`
6. Post Logout URIs:
   - Dev: `http://localhost:5173`
   - Staging: `https://staging.tkws.com.br` + `https://*.tkws-os-staging.pages.dev`
   - Prod: `https://app.tkws.com.br` + `https://tkws-os.pages.dev`
7. Cria e **copia o Client ID**

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

### 5. Configurar roles do projeto

Project → Roles → New:

| Role key | Nome | Descrição |
|---|---|---|
| `system_admin` | System Admin | Operador da Group WS (acesso total) |
| `org_admin` | Org Admin | Administrador do escritório cliente |
| `project_manager` | Project Manager | Gestor de projeto |
| `architect` | Architect | Membro de equipe técnica |
| `viewer` | Viewer | Cliente final, só consulta |

### 6. Habilitar métodos de auth

Settings da instância:
- **Login Policy:** habilita Username/Password
- **MFA:** habilita TOTP e WebAuthn (passkeys)
- **Passwordless:** habilita Magic Link
- **Identity Providers:** adiciona Google e Microsoft se desejar
- **Session Lifetime:** access token 12h, refresh 30 dias

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

`features/auth/api/oidc-config.ts` configura provider:

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

## Sincronização de usuários

Cada usuário Zitadel tem **espelho local** na tabela `users`. Sincronização acontece na primeira
requisição autenticada via `GET /api/v1/users/me`:

```java
@GetMapping("/me")
public ResponseEntity<UserView> me(@AuthenticationPrincipal Jwt jwt) {
    ZitadelUserData data = new ZitadelUserData(
        jwt.getSubject(),
        jwt.getClaimAsString("email"),
        jwt.getClaimAsString("name"),
        jwt.getClaimAsString("picture")
    );
    return ResponseEntity.ok(syncUseCase.execute(data));
}
```

**Vantagem:** você faz JOINs e FKs com `user_id` local, sem chamar Zitadel a cada query.

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

### 401 em todo endpoint protegido

```bash
# Verifica se JWT está sendo enviado:
curl -v -H "Authorization: Bearer <token>" https://api.tkws.com.br/api/v1/users/me

# Verifica logs da API:
docker compose logs api | grep -i jwt
```

## Roles e permissões — quadro de referência

| Endpoint | Roles autorizadas |
|---|---|
| `GET /api/v1/users/me` | Qualquer autenticado |
| `POST /api/v1/tenants` | `system_admin` |
| `GET /api/v1/tenants/{id}` | `system_admin`, `org_admin` |
| `POST /api/v1/orcamentos` (futuro) | `org_admin`, `project_manager`, `architect` |
| `GET /api/v1/orcamentos` (futuro) | `org_admin`, `project_manager`, `architect`, `viewer` |

**Padrão:** sempre usar `@PreAuthorize` em controllers, não `.authorizeHttpRequests()` exceto
para rotas públicas (health, swagger).
