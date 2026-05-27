# 10 — Checklist de Feature Nova

> Passo a passo completo para implementar uma feature do TKWS OS seguindo TDD,
> Clean Architecture e nossos padrões. **Imprima e tenha do lado**.

Vamos usar `orcamento` como feature exemplo (escolha sua feature real).

## Pré-trabalho

### 0.1 — Entenda o domínio

Antes de codar:
- [ ] Conversa com stakeholder (você mesmo, no caso solo): o que essa feature resolve?
- [ ] Escreve user stories: "Como `<role>`, quero `<ação>` para `<benefício>`"
- [ ] Identifica os agregados envolvidos
- [ ] Mapeia regras de negócio (invariantes)
- [ ] Identifica integrações com outras features (eventos? DTOs?)

### 0.2 — Decide o escopo da entrega

- [ ] Quais use cases entram nesta release? Não tente entregar tudo de uma vez.
- [ ] Endpoints REST necessários
- [ ] Telas/componentes necessários
- [ ] O que fica para próximas iterações

### 0.3 — Branch

```bash
git checkout develop && git pull
git checkout -b feature/orcamento-mvp
```

## Backend — passo a passo

### 1. Migration Flyway

- [ ] Cria `api/src/main/resources/db/migration/V{N}__orcamento.sql`
- [ ] Confirma que **não existe outro arquivo com o mesmo `V{N}`** (`ls …/migration/V*.sql | sort` — ver `docs/01-DEVELOPMENT.md` · Flyway — cuidados)
- [ ] Subiu a API localmente após a migration (Flyway aplicou sem erro)
- [ ] Inclui `tenant_id BIGINT NOT NULL REFERENCES tenants(id)` se for tabela
      multi-tenant (ver [ADR-021](adr/ADR-021-tenant-id-bigint.md) — `tenants.id`
      é BIGINT, não UUID)
- [ ] Inclui `created_at`, `updated_at` TIMESTAMPTZ
- [ ] Cria índices nas colunas filtradas (`tenant_id`, FKs, status, etc)
- [ ] Sem `DROP` em migration nova (use anti-padrão)

```sql
-- V2__orcamento.sql
CREATE TABLE orcamentos (
    id          UUID PRIMARY KEY,
    tenant_id   BIGINT NOT NULL REFERENCES tenants(id),
    name        VARCHAR(255) NOT NULL,
    status      VARCHAR(50) NOT NULL,
    total       NUMERIC(12,2) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_orcamentos_tenant ON orcamentos(tenant_id);
CREATE INDEX idx_orcamentos_status ON orcamentos(status);
```

### 2. Estrutura de pastas

```bash
mkdir -p api/src/main/java/com/groupws/tkws/features/orcamento/{domain/{model,port,event,exception},application/{usecase,dto},infrastructure/persistence,web}
mkdir -p api/src/test/java/com/groupws/tkws/features/orcamento/{domain,application,infrastructure,web}
```

### 3. Domain — TDD começa aqui

#### 3.1 — Aggregate test (RED)

`api/src/test/java/.../features/orcamento/domain/OrcamentoTest.java`

- [ ] Cria `OrcamentoTest` com `@DisplayName`
- [ ] Cobre invariantes: validações de criação, transições de estado
- [ ] Usa `@Nested` para agrupar cenários
- [ ] Usa `@ParameterizedTest` para casos múltiplos
- [ ] Roda: `./mvnw test -Dtest=OrcamentoTest` → falha por classe não existir

#### 3.2 — Aggregate implementation (GREEN)

`api/src/main/java/.../features/orcamento/domain/model/Orcamento.java`

- [ ] Estende `AggregateRoot<OrcamentoId>`
- [ ] Construtor privado, factory `create(...)` e `reconstitute(...)`
- [ ] Métodos públicos para operações de negócio
- [ ] Eventos registrados com `registerEvent(...)`
- [ ] ZERO imports de Spring, JPA, Hibernate

#### 3.3 — Value Objects

- [ ] `OrcamentoId` (UUID tipado)
- [ ] VOs específicos (`Money`, `Status`, etc) se aplicável
- [ ] Cada VO com seus próprios testes

#### 3.4 — Port (Repository interface)

`domain/port/OrcamentoRepository.java`

- [ ] Interface definindo operações necessárias
- [ ] Sem dependência de Spring (`@Repository` vai no adapter)
- [ ] Métodos retornam `Optional`, `List`, ou tipos de domínio (não JPA)

#### 3.5 — Domain Events

`domain/event/OrcamentoCreatedEvent.java` — etc.

- [ ] Records implementando `DomainEvent`
- [ ] Campos imutáveis
- [ ] Timestamp `Instant occurredOn`

#### 3.6 — Domain Exceptions

`domain/exception/*.java`

- [ ] Estendem `DomainException`
- [ ] Código único (ex: `ORCAMENTO_NOT_FOUND`)
- [ ] Mensagem em português (vai pro usuário final)

### 4. Application — Use Cases

#### 4.1 — Use case test (RED)

`api/src/test/java/.../features/orcamento/application/CreateOrcamentoUseCaseTest.java`

- [ ] `@ExtendWith(MockitoExtension.class)`
- [ ] Mock dos ports do domínio
- [ ] Mock de `ApplicationEventPublisher`
- [ ] Cenário feliz + cenários de erro

#### 4.2 — Use case implementation (GREEN)

`application/usecase/CreateOrcamentoUseCase.java`

- [ ] `@Service`
- [ ] Constructor injection
- [ ] `@Transactional` (com `readOnly = true` em queries)
- [ ] Publica eventos APÓS persistência bem-sucedida

#### 4.3 — DTOs

`application/dto/CreateOrcamentoCommand.java` — record com Bean Validation
`application/dto/OrcamentoView.java` — record com factory `from(Orcamento)`

### 5. Infrastructure — Persistência

#### 5.1 — Repository IT (RED)

`api/src/test/java/.../features/orcamento/infrastructure/OrcamentoRepositoryIT.java`

- [ ] Estende `AbstractIntegrationTest`
- [ ] `@BeforeEach` com TRUNCATE
- [ ] Testa save, findById, queries específicas
- [ ] Roda: `./mvnw verify -Dit.test=OrcamentoRepositoryIT` → falha por adapter não existir

#### 5.2 — JpaEntity

`infrastructure/persistence/OrcamentoJpaEntity.java`

- [ ] Package-private (sem `public`)
- [ ] `@Entity`, `@Table` com nome real da tabela
- [ ] Fields package-private (não use Lombok aqui pra não vazar)
- [ ] Construtor protegido vazio + construtor com args

#### 5.3 — JpaRepository

`infrastructure/persistence/OrcamentoJpaRepository.java`

- [ ] Package-private
- [ ] Extende `JpaRepository<OrcamentoJpaEntity, UUID>`
- [ ] Métodos custom usam derived queries do Spring Data

#### 5.4 — Adapter

`infrastructure/persistence/OrcamentoJpaRepositoryAdapter.java`

- [ ] Package-private
- [ ] `@Repository`
- [ ] Implementa `OrcamentoRepository` (port do domain)
- [ ] Converte Domain ↔ JpaEntity (métodos `toEntity` e `toDomain` privados)

### 6. Web — Controller

#### 6.1 — Controller IT (RED)

`api/src/test/java/.../features/orcamento/web/OrcamentoControllerIT.java`

- [ ] `@SpringBootTest(webEnvironment = RANDOM_PORT)`
- [ ] `@Import(MockJwtConfig.class)`
- [ ] Estende `AbstractIntegrationTest`
- [ ] REST Assured pra fazer requests
- [ ] Cobre: feliz, 401, 403, 400 validação, 422 regra de domínio

#### 6.2 — Controller (GREEN)

`web/OrcamentoController.java`

- [ ] Package-private
- [ ] `@RestController` + `@RequestMapping("/api/v1/orcamentos")`
- [ ] `@PreAuthorize` em cada método
- [ ] `@Valid` em `@RequestBody`
- [ ] Retorna `ResponseEntity` (não `void`)
- [ ] POST retorna 201 com Location header
- [ ] Lista usa `Pageable`

### 7. ArchUnit

Roda automaticamente. Se falhou, conserte:

```bash
./mvnw test -Dtest=ArchitectureTest
```

## Frontend — passo a passo

### 8. Estrutura de pastas

Organização **domain-first** ([ADR-017](adr/ADR-017-frontend-modules-domain-first.md)): a feature
mora dentro do seu módulo de negócio, com arquivos **flat** (`schema.ts` + `api.ts`):

```bash
mkdir -p frontend/src/modules/orcamentos/orcamento/{components,__tests__}
```

> Só subdivida em `api/`, `hooks/`, `types/` quando colidir nome ou houver >5 arquivos do mesmo
> tipo. Configurações de admin vão em `modules/<domínio>/configuracoes/<feature>/`.

### 9. Schema Zod

#### 9.1 — Schema test (RED)

`frontend/src/modules/orcamentos/orcamento/__tests__/orcamento-schema.test.ts`

- [ ] `describe` por schema
- [ ] Cobre casos felizes e inválidos
- [ ] Usa `it.each` pra casos parametrizados

#### 9.2 — Schema (GREEN)

`frontend/src/modules/orcamentos/orcamento/schema.ts`

- [ ] Schemas Zod como fonte da verdade
- [ ] Tipos derivados via `z.infer<typeof schema>`

### 10. API + hooks

`frontend/src/modules/orcamentos/orcamento/api.ts` — funções de acesso **e** hooks TanStack Query
no mesmo arquivo (CRUDs simples podem usar `createCrudApi`/`createCrudHooks` de `@/lib`).

- [ ] Funções puras chamando o axios `api` (`@/lib/api`)
- [ ] Retornam tipos Zod-validated
- [ ] Exporta `keys` factory; mutations fazem `invalidateQueries` no sucesso
- [ ] Sem lógica de UI

### 11. MSW handlers

Adicionar handlers em `frontend/src/test/msw-handlers.ts` para os endpoints da nova feature.

### 12. Teste de hooks (TanStack Query)

`__tests__/orcamento-api.test.tsx`

- [ ] `renderHook` com QueryClient
- [ ] Cobre sucesso, erro (via `server.use(...)`), loading
- [ ] Hooks expostos: `useOrcamentos`, `useOrcamentoById`, `useCreateOrcamento`

### 13. Componentes

#### 13.1 — Componente test (RED)

`__tests__/create-orcamento-form.test.tsx`

- [ ] Render com `renderWithProviders`
- [ ] `userEvent` pra interação
- [ ] Cobre validação, sucesso, erro de API
- [ ] Sempre `getByRole` antes de `getByText`

#### 13.2 — Componente (GREEN)

`components/create-orcamento-form.tsx`

- [ ] React Hook Form + `zodResolver`
- [ ] Labels associados via `htmlFor`/`id`
- [ ] `aria-invalid`, `aria-describedby`, `role="alert"`
- [ ] Estados: idle, submitting, success, error
- [ ] Consulta `docs/05-DESIGN-SYSTEM.md` para padrões visuais

### 14. Rota

Adiciona rota em `frontend/src/app/route-tree.tsx`:

```tsx
const orcamentosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orcamentos',
  component: OrcamentosPage,
});
```

## E2E

### 15. Playwright spec

`frontend/e2e/orcamento.spec.ts`

- [ ] Skipa por padrão se requer auth (`test.skip(!process.env.E2E_AUTHENTICATED, ...)`)
- [ ] Cobre fluxo crítico end-to-end
- [ ] Usa `getByRole` igual nos unit tests

## Validação final

### 16. Roda tudo localmente

```bash
# Backend
cd api && ./mvnw verify

# Frontend
cd ../frontend && npm run lint && npm run test:run && npm run build

# Se tem ambiente local subindo:
docker compose up -d
# Testa manualmente no browser pelo Swagger
```

### 17. Commit & PR

- [ ] Commit com Conventional Commits (`feat(orcamento): ...`)
- [ ] Push da branch
- [ ] Abre PR pra `develop`
- [ ] Descrição do PR cobre: o quê, por quê, como testar
- [ ] CI verde
- [ ] Auto-review usando `.ai/REVIEW-CHECKLIST.md`

### 18. Após merge

- [ ] Confirma deploy automático em staging
- [ ] Smoke test em staging
- [ ] Se OK, abre PR de `develop` pra `main`
- [ ] Após merge em main: confirma deploy em produção
- [ ] Smoke test em produção

## Quando essa checklist NÃO se aplica

- Mudanças triviais de texto/CSS
- Bugfix de um arquivo só
- Refatoração que não muda comportamento

Mas mesmo nesses casos:
- Testes ainda obrigatórios
- ArchUnit não pode ser quebrado
- CI tem que ficar verde

## Anti-padrões a evitar

❌ "Vou implementar primeiro, teste depois" — TDD invertido
❌ Pular ArchUnit "temporariamente"
❌ Copiar lógica entre features em vez de extrair pra shared
❌ JPA Entity igual ao Aggregate Root
❌ Service na camada errada (use case ≠ service do Spring "qualquer coisa")
❌ Controllers chamando repositories direto (sempre via use case)
❌ Frontend chamando API sem hook (use sempre TanStack Query)
❌ Estado de servidor em Zustand (use TanStack Query)
❌ `any` em TypeScript
❌ Hardcoded strings que deveriam ser i18n (mesmo que i18n ainda não exista)
