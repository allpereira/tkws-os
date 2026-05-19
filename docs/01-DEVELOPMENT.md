# 01 — Desenvolvimento

> Workflow diário do desenvolvedor TKWS OS. Leia inteiro na primeira semana.

## Pré-requisitos

- **Docker Desktop** (Mac/Windows) ou **Docker Engine + Compose plugin** (Linux)
- **Java 21** (para rodar API fora do container) — recomendo SDKMAN
- **Node 22+** (para frontend) — recomendo nvm/fnm
- **Git**
- **Maven 3.9+** (ou usar `./mvnw`)

## Setup inicial

```bash
# 1. Clone
git clone https://github.com/groupws/tkws-os.git
cd tkws-os

# 2. Sobe ambiente local completo
docker compose up -d

# 3. Aguarda Zitadel inicializar (1-3 min na primeira vez)
docker compose logs -f zitadel
# Quando ver "starting server", Ctrl+C

# 4. Configura Zitadel (uma vez)
# Acessa http://localhost:8088
# Login: admin@tkws.local / Admin@123456
# Segue docs/04-AUTH.md seção "Setup inicial"
# Copia Client ID que gerou

# 5. Cria .env local com o Client ID
echo "ZITADEL_CLIENT_ID=cole_aqui" > .env

# 6. Restart do frontend pra pegar a env
docker compose up -d --build frontend
```

### URLs locais

| Serviço | URL | Credenciais |
|---|---|---|
| Frontend | http://localhost:5173 | (via Zitadel) |
| API | http://localhost:8080 | Bearer JWT |
| Swagger UI | http://localhost:8080/swagger-ui.html | público |
| Zitadel | http://localhost:8088 | admin@tkws.local / Admin@123456 |
| Postgres | localhost:5432 | tkws / tkws |
| Redis | localhost:6379 | sem senha (dev) |

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

Quando você está iterando rápido em código, rodar API direto na máquina dá hot reload melhor:

```bash
# Sobe só os deps em container
docker compose up -d postgres redis zitadel

# Roda API local com hot reload
cd api
./mvnw spring-boot:run

# Roda frontend local com HMR
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
cd frontend && npm run dev
```

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
