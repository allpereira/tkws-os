# 01 — Desenvolvimento

> Workflow diário do desenvolvedor TKWS OS. Leia inteiro na primeira semana.

## Pré-requisitos

- **Docker Desktop** (Mac/Windows) ou **Docker Engine + Compose plugin** (Linux)
- **Java 21** (para rodar API fora do container) — recomendo SDKMAN
- **Node 22+** (para frontend) — recomendo nvm/fnm
- **Git**
- **Maven 3.9+** (ou usar `./mvnw`)

## Setup inicial

Caminho rápido — um único script sobe tudo (Docker + login app + frontend + API):

```bash
git clone https://github.com/groupws/tkws-os.git
cd tkws-os
bash scripts/dev-start.sh
```

O script faz: `docker compose up -d` da infra (postgres, redis, zitadel,
zitadel-gateway, mailpit), espera o Zitadel ficar healthy, ativa Login V2
apontando para a SPA custom em `:5174`, extrai o PAT do `login-client` para
`docker/zitadel/login-client.pat` (o Vite proxy precisa dele), aplica o seed
declarativo via [`scripts/zitadel-seed.sh`](../scripts/zitadel-seed.sh)
(projeto · app OIDC · 5 roles · sync `VITE_ZITADEL_*` em `.env.local`), e sobe
os três processos Vite/Maven em background com logs em `/tmp/tkws-*.log`.

**Setup manual** (quando o script falhar ou você quiser controlar passo a passo):

```bash
# 1. Infra Docker (Zitadel + Postgres + Redis + Caddy gateway)
docker compose pull zitadel zitadel-login
docker compose up -d postgres redis zitadel zitadel-gateway

# 2. Aguarda Zitadel ficar healthy (1-3 min na primeira vez)
docker compose ps   # zitadel deve estar "healthy"

# 3. Extrai o PAT do login-client (criado pelo bootstrap do Zitadel)
bash scripts/extract-login-pat.sh

# 4. Aplica seed declarativo do Zitadel (idempotente)
#    Cria projeto "TKWS OS" + app "Web" + 5 roles + sincroniza
#    VITE_ZITADEL_CLIENT_ID e VITE_ZITADEL_PROJECT_ID em ambos .env.local.
#    Se for primeira execução pós-reset, ver docs/04-AUTH.md § "Reset Zitadel
#    do zero" para o passo manual de ORG_OWNER + projectRoleAssertion.
bash scripts/zitadel-seed.sh

# 5. Sobe os três processos em terminais separados
cd login && npm install && npm run dev          # :5174 — custom login SPA
cd frontend && npm install && npm run dev       # :5173 — app principal
cd api && mvn spring-boot:run                   # :8080 — Spring Boot API
```

> **Importante:**
> - `ZITADEL_CLIENT_ID` na raiz é só para o build do container `frontend` em Docker Compose.
> - `VITE_ZITADEL_CLIENT_ID` em `frontend/.env.local` E em `login/.env.local` deve ter o mesmo valor (o login app usa pra detectar auth requests do console e redirecionar pro V1 nativo).
> - Sem `docker/zitadel/login-client.pat`, o custom login retorna 401 "auth header missing" em todas as requests. Rode `bash scripts/extract-login-pat.sh` ou recrie o stack com `docker compose down -v && docker compose up -d` (perde dados do Zitadel).

### URLs locais

| Serviço | URL | Credenciais |
|---|---|---|
| Frontend | http://localhost:5173 | (via Zitadel) |
| **Custom Login (SPA)** | http://localhost:5174/login?authRequestId=… | `preferred_username` + senha |
| API | http://localhost:8080 | Bearer JWT |
| Swagger UI | http://localhost:8080/swagger-ui.html | público |
| Zitadel | http://localhost:8088 | admin@tkws.local / Admin@123456 |
| Postgres | localhost:5433 | tkws / tkws |
| Redis | localhost:6380 | sem senha (dev) |

## Inspecionando Postgres, Redis e Zitadel (dev local)

Referência rápida para **consultar dados** durante o desenvolvimento. Credenciais e portas estão na tabela acima.

> **Dois bancos no mesmo Postgres:** `tkws` (dados da API + Flyway) e `zitadel` (usuários, apps OIDC, sessões). Não misture migrations do TKWS no banco `zitadel`.

### PostgreSQL

#### GUI (recomendado para explorar schema e rodar SQL)

Qualquer cliente JDBC/Postgres funciona com:

| Campo | Valor (dev) |
|---|---|
| Host | `localhost` |
| Porta | `5433` |
| Database | `tkws` ou `zitadel` |
| Usuário | `tkws` |
| Senha | `tkws` |
| SSL | desligado |

Opções populares (gratuitas ou com tier free):

| Ferramenta | Observação |
|---|---|
| [DBeaver](https://dbeaver.io/) | Multi-banco, bom para dia a dia |
| [pgAdmin](https://www.pgadmin.org/) | Oficial Postgres, mais pesado |
| [TablePlus](https://tableplus.com/) | Leve no Mac (versão free limitada) |
| [DataGrip](https://www.jetbrains.com/datagrip/) | Pago, integra bem com IntelliJ |
| Extensão **PostgreSQL** no VS Code / Cursor | SQL direto no editor |

No cliente, conecte em `tkws` para ver `tenants`, `users`, `feature_flags`, `flyway_schema_history`. Conecte em `zitadel` só se precisar inspecionar dados internos do IdP (raro no dia a dia — prefira a console do Zitadel).

#### Console (`psql`)

**Via container** (não precisa instalar `psql` no Mac):

```bash
# Banco da aplicação (sessão interativa)
docker compose exec postgres psql -U tkws -d tkws

# Banco do Zitadel (sessão interativa)
docker compose exec postgres psql -U tkws -d zitadel
```

**SQL avulso no container** (um comando só, sem abrir o `psql`):

```bash
# Rode na raiz do repositório (onde está o docker-compose.yml)
docker compose exec -T postgres psql -U tkws -d tkws -c "SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank;"
```

O `-T` evita erro de TTY quando o terminal não é interativo (CI, scripts, Cursor).

**Do host** (se tiver `psql` instalado, ex.: `brew install libpq`):

```bash
psql -h localhost -p 5433 -U tkws -d tkws
# senha: tkws
```

Consultas úteis no banco `tkws`:

```sql
-- Tabelas do domínio
SELECT id, name, slug, status, created_at FROM tenants ORDER BY created_at DESC LIMIT 20;
SELECT id, email, full_name, zitadel_id, tenant_id FROM users ORDER BY created_at DESC LIMIT 20;
SELECT name, default_enabled, enabled_for_tenants, disabled_for_tenants FROM feature_flags;

-- Migrations aplicadas pelo Flyway
SELECT installed_rank, version, description, success, installed_on
FROM flyway_schema_history
ORDER BY installed_rank;

-- Dentro do psql
\dt          -- lista tabelas
\d tenants   -- descreve colunas da tabela
\q           -- sai
```

#### Flyway e seed de desenvolvimento

O seed local fica em **`api/src/main/resources/db/migration/V7__seed_dev.sql`** (migration **versionada**).
Ele roda **uma única vez** por banco quando `ENVIRONMENT=dev` (placeholder do Flyway em `application.yml`).
Não use mais `R__seed_dev.sql` — migrations repeatable reexecutam quando o checksum muda e podem conflitar com dados já existentes.

| Situação | O que fazer |
|---|---|
| Banco novo | Subir a API; o Flyway aplica V1…V7 automaticamente |
| Ver se V7 já rodou | `SELECT * FROM flyway_schema_history WHERE version = '7';` |
| API falhou após migrar de `R__` para `V7` | Remover entrada antiga do repeatable (só se existir linha com esse script) |

Limpar histórico do repeatable antigo (banco `tkws`, na raiz do repo):

```bash
docker compose exec -T postgres psql -U tkws -d tkws -c "DELETE FROM flyway_schema_history WHERE script = 'R__seed_dev.sql';"
```

Depois reinicie a API para o Flyway aplicar `V7__seed_dev.sql` se ainda não constar no histórico.
Para **alterar** dados de seed depois da primeira carga, use a app ou crie uma migration `V8__…` pontual — editar o V7 em banco já migrado não reexecuta o script.

### Redis

#### GUI

| Ferramenta | Observação |
|---|---|
| [Redis Insight](https://redis.io/insight/) | Oficial Redis, gratuito |
| [Another Redis Desktop Manager](https://github.com/qishibo/AnotherRedisDesktopManager) | Open source |
| [Medis](https://getmedis.com/) | Mac, interface simples |

Conexão dev: host `localhost`, porta `6380`, **sem senha**, database `0`.

#### Console (`redis-cli`)

```bash
# Via container
docker compose exec redis redis-cli

# Do host (brew install redis)
redis-cli -p 6380
```

Comandos úteis:

```bash
PING                    # deve responder PONG
INFO keyspace           # quantidade de chaves por DB
DBSIZE                  # total de chaves no DB atual
KEYS *                  # lista chaves (ok em dev; evite em produção)
GET nome_da_chave       # valor string
TYPE nome_da_chave     # tipo da chave
TTL nome_da_chave       # tempo restante (se houver expiração)
MONITOR                 # stream ao vivo de comandos (debug; Ctrl+C para parar)
```

> Em dev o Redis costuma estar vazio até a API passar a usar cache/sessão distribuída. `DBSIZE` retornando `0` é normal.

### Zitadel

#### GUI (console web)

1. Abra http://localhost:8088
2. Login: `admin@tkws.local` / `Admin@123456`
3. Áreas mais usadas no dia a dia:

| Menu | Para quê |
|---|---|
| **Projects** → TKWS OS → **Applications** | Client ID, redirect URIs, PKCE |
| **Projects** → **Roles** | Roles (`system_admin`, `org_admin`, …) |
| **Users** | Usuários de teste, reset de senha, MFA |
| **Organizations** | Multi-tenant do Zitadel (orgs de clientes) |
| **Instance** → **Settings** | Políticas de login, MFA, sessão |

Setup completo de projeto/app/roles: [`docs/04-AUTH.md`](04-AUTH.md) (seção *Setup inicial*).

#### Console (HTTP e logs)

**Descoberta OIDC** (issuer, JWKS, endpoints):

```bash
curl -s http://localhost:8088/.well-known/openid-configuration | jq .
```

**Logs do container** (erros de login, migração interna, DB):

```bash
docker compose logs -f zitadel
docker compose logs --tail=100 zitadel
```

**Health / processo subiu:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8088/.well-known/openid-configuration
# esperado: 200
```

**Testar JWT na API** (copie o access token do browser após login no frontend):

```bash
curl -s -H "Authorization: Bearer <access_token>" http://localhost:8080/api/v1/users/me | jq .
```

Decodificar claims do JWT (sem validar assinatura — só debug local):

```bash
# payload = segunda parte do JWT (base64url)
echo '<access_token>' | cut -d. -f2 | tr '_-' '/+' | base64 -d 2>/dev/null | jq .
```

> Não edite usuários/apps críticos direto no banco `zitadel`; use a console ou a API do Zitadel. Detalhes de auth no código: [`docs/04-AUTH.md`](04-AUTH.md).

### URLs em staging e produção

| Ambiente | Frontend | API | Zitadel |
|---|---|---|---|
| Staging | `https://staging.tkws.com.br` (Cloudflare Pages) | `https://api.staging.tkws.com.br` (EC2) | `https://auth.staging.tkws.com.br` (EC2) |
| Produção | `https://app.tkws.com.br` (Cloudflare Pages) | `https://api.tkws.com.br` (EC2) | `https://auth.tkws.com.br` (EC2) |

**Preview deploys:** todo PR ganha URL automática tipo `abc123.tkws-os.pages.dev` —
Cloudflare envia o link no comentário do PR.

## Workflow diário

### Branches

- `main` → produção (protegida, só via PR)
- `develop` → staging (protegida, só via PR)
- `feature/<descrição-curta>` → branches de feature
- `fix/<descrição-curta>` → bugfixes
- `chore/<descrição-curta>` → infra, deps, etc

### Ciclo de uma feature

```bash
# 1. Atualiza develop
git checkout develop && git pull

# 2. Cria branch
git checkout -b feature/orcamento-listagem

# 3. Implementa SEGUINDO TDD (veja docs/02-TESTING.md)
#    Red → Green → Refactor, ciclo a ciclo

# 4. Roda testes locais antes de cada commit
cd api && ./mvnw verify        # backend
cd ../frontend && npm run test:run && npm run lint && npm run build

# 5. Commit (Conventional Commits)
git add .
git commit -m "feat(orcamento): adiciona listagem paginada"

# 6. Push e PR
git push -u origin feature/orcamento-listagem
gh pr create --base develop  # ou via UI

# 7. CI roda automaticamente. Se verde, merge.
```

### Conventional Commits

Formato: `<tipo>(<escopo opcional>): <descrição imperativa>`

| Tipo | Quando |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `chore` | Tarefa interna (deps, build, configs) |
| `docs` | Documentação |
| `refactor` | Refatoração sem mudança de comportamento |
| `test` | Adicionar/melhorar testes |
| `perf` | Melhoria de performance |
| `style` | Formatação (sem mudança de código) |
| `ci` | Mudanças no pipeline |

Exemplos bons:
- `feat(crm): adiciona endpoint de leads paginado`
- `fix(auth): corrige refresh token expirando antes da hora`
- `refactor(tenants): extrai validação de slug para VO`
- `chore: bump spring-boot 3.3.5 → 3.3.6`

Exemplos ruins:
- `update files`
- `wip`
- `corrige bug` (qual bug?)

## Padrões de código

### Backend (Java)

#### Constructor injection (sempre)

```java
// ✅ Bom
@Service
public class CreateTenantUseCase {
    private final TenantRepository repo;
    private final ApplicationEventPublisher events;

    public CreateTenantUseCase(TenantRepository repo, ApplicationEventPublisher events) {
        this.repo = repo;
        this.events = events;
    }
}

// ❌ Ruim — @Autowired em campo
@Service
public class CreateTenantUseCase {
    @Autowired private TenantRepository repo;
}
```

#### Records para DTOs

```java
// ✅ Bom
public record CreateTenantCommand(
    @NotBlank String name,
    @NotBlank @Pattern(regexp = "^[a-z0-9-]+$") String slug
) {}

// ❌ Ruim — classe com getters/setters
```

#### Domain puro

```java
// ✅ Bom — domain/model/Tenant.java
public final class Tenant {
    // ZERO imports de Spring/JPA
    // Métodos com lógica de negócio
}

// ❌ Ruim — @Entity no Aggregate Root
@Entity  // proibido em domain/
public final class Tenant { ... }
```

#### Logs estruturados

```java
// ✅ Bom
log.info("Tenant created: id={}, slug={}", tenant.id(), tenant.slug());

// ❌ Ruim
log.info("Tenant created: " + tenant.id() + " " + tenant.slug());
```

### Frontend (TypeScript/React)

#### Tipagem estrita

```ts
// ✅ Bom
function processTenant(tenant: Tenant): TenantView { ... }

// ❌ Ruim
function processTenant(tenant: any): any { ... }
```

#### Schemas Zod como fonte da verdade

```ts
// ✅ Bom
export const tenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/),
});
export type Tenant = z.infer<typeof tenantSchema>;

// Usa o mesmo schema no form, no fetch, e no test
```

#### Componentes funcionais com Props tipadas

```tsx
// ✅ Bom
interface Props {
  tenant: Tenant;
  onEdit?: (id: string) => void;
}

export function TenantCard({ tenant, onEdit }: Props) { ... }
```

#### TanStack Query para estado de servidor

```tsx
// ✅ Bom — usa hook personalizado da feature
function TenantList() {
  const { data, isLoading } = useTenantList();
  // ...
}

// ❌ Ruim — useEffect + useState pra fetch
function TenantList() {
  const [data, setData] = useState();
  useEffect(() => { fetch(...).then(setData); }, []);
}
```

#### Zustand só para estado client genuíno

Bom uso de Zustand: modal aberto/fechado, tema, sidebar collapsed.
**Mau uso:** dados que vêm do servidor (use TanStack Query).

## Rodando fora do container (mais ágil)

Quando você está iterando rápido em código, rodar API direto na máquina dá hot reload melhor.

Postgres e Redis do Compose usam **5433** e **6380** no host (`application.yml` já aponta para essas portas), para não conflitar com outras instâncias locais em 5432/6379.

```bash
# Sobe só os deps em container
docker compose up -d postgres redis zitadel

# Roda API local com hot reload
cd api
./mvnw spring-boot:run

# Roda frontend local com HMR (requer frontend/.env.local — passo 5b acima)
cd ../frontend
npm install
npm run dev
```

## Criando feature nova

Veja `docs/10-FEATURE-CHECKLIST.md` para o checklist completo passo a passo.

**Resumo:**

1. Copia estrutura de `features/tenants/` como template
2. Cria migration Flyway: `api/src/main/resources/db/migration/V{N}__nova_feature.sql`
3. Escreve teste de domain primeiro (RED)
4. Implementa domain até GREEN
5. Sobe pelas camadas: application → infrastructure → web
6. Frontend: schema → API → hook → componente
7. E2E em `frontend/e2e/`
8. Atualiza ADR se decisão arquitetural

## Pequenas dicas que economizam horas

- **`./mvnw test -Dtest=NomeTest`** roda só um teste específico
- **`docker compose logs -f api`** acompanha logs da API
- **`docker compose restart api`** pega rebuild sem reiniciar Postgres/Zitadel
- **`docker compose down -v`** reseta TUDO (incluindo banco) — use em última instância
- **Swagger UI** em `http://localhost:8080/swagger-ui.html` é a forma mais rápida de testar API manualmente
- **`npm run test:ui`** abre Vitest UI no browser, muito melhor que terminal pra debug
- **Use TanStack Router devtools** (já configurado) — atalho de teclado mostra rotas

## Troubleshooting comum

### "Zitadel não conecta no Postgres"
Aguarde mais. Primeira inicialização do Zitadel demora 1-3 min.

### "Flyway: migration checksum mismatch"
Alguém editou uma migration já aplicada (proibido). Reverter a edição ou criar nova migration que ajuste.

### "ArchUnit: domain depende de Spring"
Você importou algo de Spring em `domain/`. Mova para `application/` ou `infrastructure/`.

### "Token expirado" em dev
JWT expira em 12h. Faça logout e login novamente.

### "Porta 8080 em uso"
Outra aplicação está nessa porta. `lsof -i:8080` pra ver qual.

### Hot reload do frontend não funciona em container
Rodar Vite localmente (não em container) para ter HMR real:
```bash
docker compose stop frontend
cp frontend/.env.example frontend/.env.local   # se ainda não existir
# Defina VITE_ZITADEL_CLIENT_ID no .env.local
cd frontend && npm run dev
```

### "Redirecionando para login..." sem sair da página
Causa mais comum: **`VITE_ZITADEL_CLIENT_ID` ausente** em `frontend/.env.local` ao usar `npm run dev`.

1. Crie o app Web no Zitadel com redirect `http://localhost:5173/callback` (ver `docs/04-AUTH.md`).
2. Copie o Client ID para `frontend/.env.local`.
3. Reinicie o Vite.
4. Se aparecer painel de erro, abra o DevTools → Console e confira rede até `localhost:8088`.

Com Docker Compose no frontend, use `.env` na raiz com `ZITADEL_CLIENT_ID` e `docker compose up -d --build frontend`
(não use o placeholder `replace-after-setup`).

## Mobile (Capacitor)

O frontend React é empacotado em apps nativos iOS e Android via Capacitor. **Mesmo código,
três plataformas (Web + iOS + Android).**

### Setup inicial (uma vez)

```bash
cd frontend

# Adiciona Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "TKWS OS" "br.com.tkws.app" --web-dir=dist

# Plataformas
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# Plugins essenciais
npm install @capacitor/preferences          # Storage (Keychain/Keystore)
npm install @capacitor/app                  # Deep links
npm install @capacitor/browser              # OAuth via in-app browser
npm install @capacitor-community/oauth2     # OIDC com Zitadel
```

### Workflow de desenvolvimento

```bash
# Builda web
cd frontend && npm run build

# Sincroniza com plataformas nativas
npx cap sync

# Abre Xcode (precisa de Mac)
npx cap open ios

# Abre Android Studio
npx cap open android

# Live reload em device físico (durante dev)
npx cap run ios --livereload --external
npx cap run android --livereload --external
```

### Variáveis de ambiente do mobile

Crie `frontend/.env.mobile` (não commitado):

```
VITE_API_URL=https://api.tkws.com.br
VITE_ZITADEL_AUTHORITY=https://auth.tkws.com.br
VITE_ZITADEL_CLIENT_ID=<client_id_native_app_no_zitadel>
VITE_REDIRECT_URI=br.com.tkws.app://callback
VITE_ENVIRONMENT=production
VITE_PLATFORM=mobile
```

E builda com:
```bash
npm run build -- --mode mobile
npx cap sync
```

### Storage seguro

No mobile, **nunca** use `localStorage` para tokens. Use `@capacitor/preferences`:

```ts
import { Preferences } from '@capacitor/preferences';

await Preferences.set({ key: 'auth_token', value: token });
const { value } = await Preferences.get({ key: 'auth_token' });
```

Em web (Capacitor detecta plataforma), o plugin cai pra `localStorage` automaticamente.

### Deep links

Configure no Xcode/Android Studio o scheme `br.com.tkws.app`. Veja `docs/04-AUTH.md`
seção Mobile.

### Build de produção

iOS: precisa de Apple Developer ($99/ano) e Mac com Xcode. Build via Xcode → Archive → Upload.
Android: precisa de conta Play Console ($25 uma vez). Build via `./gradlew bundleRelease`.

**Bloqueante de release:** ambos requerem revisão de privacidade. LGPD precisa estar pronta
em `app.tkws.com.br/privacy` antes de submeter.
