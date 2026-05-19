# 02 — Testes

> Filosofia, ferramentas e workflow TDD do TKWS OS. **Toda feature é construída com TDD.**

## Filosofia: Testing Trophy de Kent Dodds

```
                   ╱╲
                  ╱E2E╲                Fluxos críticos (poucos, lentos)
                 ╱──────╲
                ╱ Integ. ╲              ← FOCO PRINCIPAL
               ╱──────────╲             Pegam mais bugs/linha
              ╱   Unit     ╲            Lógica complexa de domínio
             ╱──────────────╲
            ╱    Static      ╲          TypeScript, ESLint, ArchUnit
           ╱──────────────────╲
```

**Por que não pirâmide tradicional:**
- Dev solo + IA gerando código = integration tests pegam mais bugs por linha de teste
- Unit puro só vale a pena para invariantes claras de domínio (regras de negócio)
- E2E garante que tudo conecta no mundo real

## Backend (Java/Spring)

### Estrutura de testes

```
api/src/test/java/com/groupws/tkws/
├── shared/
│   ├── AbstractIntegrationTest.java    # Base Testcontainers (reutilizável)
│   ├── MockJwtConfig.java               # JWT mockado para E2E
│   ├── ArchitectureTest.java            # ArchUnit (Clean Arch + features)
│   └── EmailTest.java                   # VO compartilhado
└── features/{feature}/
    ├── domain/{Agregado}Test.java        # Unit puro (sem Spring)
    ├── application/{UseCase}Test.java    # Mock dos ports
    ├── infrastructure/{Repo}IT.java      # Postgres real
    └── web/{Controller}IT.java           # E2E HTTP→DB
```

### Convenções

- `*Test.java` → unit tests (rodam em `mvn test`, surefire plugin)
- `*IT.java` → integration tests (rodam em `mvn verify`, failsafe plugin)
- Sem `@Autowired` em campos — use constructor injection
- Domain tests: ZERO dependência de Spring
- Application tests: Mockito puro, sem `@SpringBootTest`
- Infrastructure IT: estende `AbstractIntegrationTest`
- Web IT: estende `AbstractIntegrationTest`, importa `MockJwtConfig`, usa REST Assured

### Comandos

```bash
# Unit tests rápidos
./mvnw test

# Tudo (unit + IT + ArchUnit)
./mvnw verify

# Teste específico
./mvnw test -Dtest=TenantTest
./mvnw test -Dtest=TenantTest#deveRejeitarSlugsInvalidos

# Pular testes (NÃO faça isso normalmente)
./mvnw package -DskipTests

# Cobertura
./mvnw verify
open target/site/jacoco/index.html
```

### ArchUnit: arquitetura como código

`ArchitectureTest.java` falha o build se:

- Domain importar Spring/JPA/Hibernate
- Domain depender de infrastructure ou web
- Application acessar JPA diretamente
- Features dependerem umas das outras
- Use Cases não terminarem com `UseCase`
- JPA Entities fora de `infrastructure.persistence`
- Controllers não terminarem com `Controller`

**Você não precisa lembrar dessas regras. O teste lembra.**

### Padrão de um teste de domain

```java
@DisplayName("Tenant — Aggregate Root")
class TenantTest {

    @Nested
    @DisplayName("ao criar")
    class WhenCreating {

        @Test
        @DisplayName("deve criar tenant válido com defaults corretos")
        void deveCriarTenantValido() {
            Tenant tenant = Tenant.create("zitadel-org", "Studio X", "studio-x");

            assertThat(tenant.id()).isNotNull();
            assertThat(tenant.active()).isTrue();
        }

        @ParameterizedTest
        @ValueSource(strings = { "SlugMaiusculo", "slug com espaço", "-comeca-hifen" })
        void deveRejeitarSlugsInvalidos(String slug) {
            assertThatThrownBy(() -> Tenant.create("org", "Nome", slug))
                .isInstanceOf(InvalidTenantSlugException.class);
        }
    }
}
```

### Padrão de um Integration Test

```java
class TenantRepositoryIT extends AbstractIntegrationTest {

    @Autowired TenantRepository repo;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach
    void cleanDatabase() {
        jdbc.execute("TRUNCATE tenants RESTART IDENTITY CASCADE");
    }

    @Test
    @DisplayName("save deve persistir e retornar tenant")
    void saveDevePersistir() {
        Tenant tenant = repo.save(Tenant.create("org-1", "X", "x"));
        assertThat(repo.findById(tenant.id())).isPresent();
    }
}
```

### Padrão de um Web IT (E2E API)

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(MockJwtConfig.class)
class TenantControllerIT extends AbstractIntegrationTest {

    @LocalServerPort int port;

    @Test
    void deveCriarTenantComSystemAdmin() {
        RestAssured.port = port;
        given()
            .auth().oauth2(MockJwtConfig.tokenForSystemAdmin())
            .contentType(JSON)
            .body(Map.of("zitadelOrgId", "x", "name", "Y", "slug", "y"))
        .when()
            .post("/api/v1/tenants")
        .then()
            .statusCode(201)
            .body("slug", equalTo("y"));
    }
}
```

## Frontend (React)

### Ferramentas

| O quê | Como |
|---|---|
| Schemas Zod | Vitest puro |
| Hooks TanStack Query | Vitest + renderHook + MSW |
| Componentes | Vitest + Testing Library + userEvent + MSW |
| Fluxos completos | Playwright E2E |

### Estrutura

```
frontend/src/
├── test/
│   ├── setup.ts                      # MSW + cleanup global
│   ├── msw-server.ts                 # Server setup
│   ├── msw-handlers.ts               # Mocks padrão da API
│   └── test-utils.tsx                # renderWithProviders helper
└── features/{feature}/__tests__/
    ├── {feature}-schema.test.ts        # Validação Zod
    ├── use-{feature}.test.tsx          # Hooks (via MSW)
    └── {component}.test.tsx            # Componentes
```

### Por que MSW

MSW intercepta requests no **nível de rede** (não mocka `axios` ou `fetch`). Isso:

- Testa o comportamento real (incluindo serialização, interceptors, etc)
- Resiliente a troca de cliente HTTP
- Handlers ficam como documentação executável do contrato da API

### Padrão de teste de schema Zod

```ts
describe('createTenantSchema', () => {
  it('deve aceitar input válido', () => {
    const result = createTenantSchema.safeParse({
      zitadelOrgId: 'x', name: 'X', slug: 'x'
    });
    expect(result.success).toBe(true);
  });

  it.each([
    ['SlugMaiusculo'], ['slug com espaço']
  ])('deve rejeitar slug %s', (slug) => {
    const result = createTenantSchema.safeParse({ slug, name: 'X', zitadelOrgId: 'x' });
    expect(result.success).toBe(false);
  });
});
```

### Padrão de teste de hook

```tsx
function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('useCreateTenant', () => {
  it('deve criar tenant', async () => {
    const { result } = renderHook(() => useCreateTenant(), { wrapper });
    result.current.mutate({ name: 'X', slug: 'x', zitadelOrgId: 'x' });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
```

### Padrão de teste de componente

```tsx
describe('CreateTenantForm', () => {
  it('deve criar com sucesso', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    renderWithProviders(<CreateTenantForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/nome/i), 'Studio X');
    await user.type(screen.getByLabelText(/identificador/i), 'studio-x');
    await user.type(screen.getByLabelText(/zitadel org id/i), 'org-1');
    await user.click(screen.getByRole('button', { name: /criar/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});
```

### Convenções

- **Sempre `getByRole` antes de `getByText`** (acessibilidade)
- **`userEvent` (não `fireEvent`)** para interações realistas
- Cada teste com **QueryClient próprio** (evita cache vazando)
- Use **MSW** para mocks de rede, **`vi.mock`** só para módulos não-HTTP

### Comandos

```bash
npm test                # watch mode
npm run test:run        # run once
npm run test:ui         # Vitest UI no browser
npm run test:coverage   # com cobertura
npm run e2e             # Playwright headless
npm run e2e:ui          # Playwright UI
```

## E2E (Playwright)

### Quando usar E2E

- Fluxos críticos do negócio (login → criar orçamento → enviar)
- Smoke tests pré-deploy
- Não use pra testar regras de validação (isso é unit/integration)

### Estrutura

```
frontend/e2e/
├── auth.setup.ts        # Login programático (gera storageState)
├── smoke.spec.ts        # App carrega, redireciona pra auth
└── {feature}.spec.ts    # Fluxos completos por feature
```

### Auth nos E2E

Pra evitar login UI em todo teste, salvamos `storageState` autenticado:

```ts
// e2e/auth.setup.ts (rodado uma vez antes da suite)
test('autenticar admin', async ({ page }) => {
  await page.goto('/');
  await page.fill('[name=username]', process.env.E2E_USER!);
  await page.fill('[name=password]', process.env.E2E_PASSWORD!);
  await page.click('button[type=submit]');
  await page.context().storageState({ path: 'e2e/.auth/admin.json' });
});

// Outros testes usam o state já autenticado
test.use({ storageState: 'e2e/.auth/admin.json' });
```

## Workflow TDD padrão

Para CADA feature nova, ciclo de Red → Green → Refactor:

### 1. Domain (mais importante)

```bash
# RED: escreva o teste primeiro
api/src/test/java/.../features/orcamento/domain/OrcamentoTest.java

# Roda — vai falhar (classe nem existe)
./mvnw test -Dtest=OrcamentoTest

# GREEN: cria classe minimal pra passar
api/src/main/java/.../features/orcamento/domain/model/Orcamento.java

# Refactor: limpa, melhora nomes, extrai constantes
```

### 2. Application (use case)

```bash
# RED
api/src/test/java/.../features/orcamento/application/CreateOrcamentoUseCaseTest.java

# GREEN
api/src/main/java/.../features/orcamento/application/usecase/CreateOrcamentoUseCase.java
api/src/main/java/.../features/orcamento/application/dto/CreateOrcamentoCommand.java
```

### 3. Infrastructure (com Testcontainers)

```bash
# RED
api/src/test/java/.../features/orcamento/infrastructure/OrcamentoRepositoryIT.java

# GREEN: cria JpaEntity, JpaRepository, Adapter
# Cria também a migration Flyway V{N}__orcamento.sql
```

### 4. Web (E2E HTTP)

```bash
# RED
api/src/test/java/.../features/orcamento/web/OrcamentoControllerIT.java

# GREEN
api/src/main/java/.../features/orcamento/web/OrcamentoController.java
```

### 5. Frontend (mesma lógica)

```bash
# Schema Zod test → schema → hook test → hook → component test → component
```

### 6. E2E

```bash
frontend/e2e/orcamento.spec.ts
```

### 7. ArchUnit

Roda automático. Se você quebrou alguma regra, o teste reclama. Conserte antes de commitar.

## Coverage

- **Backend:** mínimo 70% (JaCoCo). Foco em domain (deve ser ~100%) e application.
- **Frontend:** mínimo 70% (Vitest v8). Foco em features, não em UI puramente visual.

**Cobertura não é meta, é sinal.** Cobertura baixa em domain = você não testou regras críticas.
Cobertura baixa em UI estática = aceitável.

## CI

`.github/workflows/ci.yml` roda em todo push/PR:

1. Lint (ESLint + Checkstyle implícito do Maven)
2. `mvn verify` (unit + integration + ArchUnit + JaCoCo)
3. `npm run test:coverage` + `npm run build`
4. Playwright apenas em PRs pra `main`

**Build vermelho bloqueia merge.**
