# TKWS OS — Contexto para IAs

> **Este arquivo é a porta de entrada do projeto para qualquer assistente de IA**
> (Claude Code, Cursor, Copilot, etc). Leia-o por inteiro antes de qualquer ação.

## O que é o TKWS OS

Sistema operacional digital da **Group WS**, um produto SaaS B2B para arquitetos e equipes
de arquitetura de alto padrão que operam projetos turnkey. Não é um ERP genérico — é uma
ferramenta de produtividade com **posicionamento estético editorial**, onde tipografia,
respiro visual e materialidade importam tanto quanto funcionalidade.

**Módulos previstos:** CRM, Orçamento, Suprimentos, Catálogo de Produtos, Projetos.
**Escala alvo:** 300+ usuários simultâneos, multi-tenant (cada escritório é um tenant).

## Stack técnica (autoritativa)

### Backend
- **Java 21** + **Spring Boot 3.3+** (virtual threads habilitadas)
- **Maven** como build tool
- **PostgreSQL 16+** com **Flyway** para migrations
- **Redis** para cache e sessões
- **Zitadel** (self-hosted) para autenticação via OIDC
- **Camunda DMN** para regras de negócio configuráveis (quando aplicável)

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **TanStack Router** (não React Router) e **TanStack Query** para data fetching
- **Tailwind CSS** + **shadcn/ui** + **Radix UI** primitives
- **Zustand** para estado client (sparingly — TanStack Query é o estado de servidor)
- **React Hook Form** + **Zod** para formulários e validação
- **Capacitor** para mobile híbrido (web + iOS + Android)

### Infra
- **AWS** (EC2 ARM Graviton + RDS PostgreSQL + S3) em região `sa-east-1` — **backend (API + Zitadel + Redis)**
- **Cloudflare Pages** — **frontend** (edge global, PoPs no Brasil, free pra uso comercial)
- **Cloudflare** como DNS + CDN/WAF
- **Docker Compose** (puro, sem orquestrador) — backend
- **Caddy** como proxy reverso da API/Zitadel (SSL automático via Let's Encrypt)
- **GitHub Actions** para CI/CD do backend, **GHCR** para registry
- **Cloudflare Pages ↔ GitHub** integração nativa para CI/CD do frontend

### Testes
- **Backend:** JUnit 5 + AssertJ + Mockito + Testcontainers + ArchUnit + REST Assured
- **Frontend:** Vitest + Testing Library + MSW + Playwright

## Arquitetura: Clean Architecture + DDD tático + Feature-based

### Backend — estrutura de cada feature

```
features/{feature}/
├── domain/                    # PURO, zero Spring/JPA
│   ├── model/                 # Aggregate Roots e Value Objects
│   ├── port/                  # Interfaces (Repository, etc) que o domain define
│   ├── event/                 # Domain Events
│   └── exception/             # Exceções específicas do domínio
├── application/
│   ├── usecase/               # Orquestração (CreateXUseCase, FindXUseCase)
│   └── dto/                   # Commands (entrada) e Views (saída)
├── infrastructure/
│   ├── persistence/           # JpaEntity, JpaRepository, JpaRepositoryAdapter
│   └── messaging/             # Listeners, publishers
└── web/                       # Controllers REST (anteriormente "interface")
```

**Regras invioláveis (validadas por ArchUnit no build):**
1. `domain/` não pode importar `org.springframework.*`, `jakarta.persistence.*` ou `org.hibernate.*`
2. `domain/` não pode importar `infrastructure/` nem `web/`
3. `application/` não pode usar JPA diretamente — só os ports do domínio
4. Features **não se acessam diretamente** — comunicam via eventos de domínio ou DTOs
5. Use cases terminam com `UseCase`, controllers com `Controller`, JPA entities ficam em `infrastructure/persistence/`

### Frontend — estrutura de cada feature

```
features/{feature}/
├── api/                       # Função pura que chama o backend
├── components/                # Componentes específicos da feature
├── hooks/                     # useX (TanStack Query)
├── types/                     # Schemas Zod (fonte da verdade)
└── __tests__/                 # Testes co-localizados
```

Código **compartilhado** vai em `src/shared/`. Código de **rotas e providers** vai em `src/app/`.

## TDD — workflow obrigatório para feature nova

Adotamos o **Testing Trophy de Kent Dodds** (mais integração, menos unit puro).

Para CADA feature nova, a ordem é:

1. **Domain test** (RED) → Implementa Aggregate/VO (GREEN) → Refatora
2. **Application test** com port mockado (RED) → Implementa UseCase (GREEN)
3. **Infrastructure IT** com Testcontainers (RED) → Implementa Adapter JPA (GREEN)
4. **Web IT** com REST Assured + JWT mockado (RED) → Implementa Controller (GREEN)
5. **Frontend:** schema Zod test → schema → hook test → hook → component test → component
6. **E2E** (Playwright) cobrindo o fluxo crítico
7. ArchUnit roda automaticamente e valida fronteiras

**Convenções de nome:**
- `*Test.java` → unit/application tests, rodam em `mvn test`
- `*IT.java` → integration tests, rodam em `mvn verify`
- Frontend: `*.test.ts(x)` em `__tests__/` dentro da feature

## Antes de qualquer ação, leia também

| Documento | Quando consultar |
|---|---|
| `docs/00-ARCHITECTURE.md` | Antes de criar feature nova ou mexer em estrutura |
| `docs/01-DEVELOPMENT.md` | Workflow diário, setup, padrões de código |
| `docs/02-TESTING.md` | Como escrever cada tipo de teste |
| `docs/03-DEPLOY.md` | Pra qualquer dúvida sobre infra/deploy |
| `docs/04-AUTH.md` | Mexer em autenticação/autorização |
| `docs/05-DESIGN-SYSTEM.md` | **Antes de criar QUALQUER componente visual** |
| `docs/06-BACKUP-RECOVERY.md` | Estratégia de backup, DR, runbook de restore |
| `docs/07-OBSERVABILITY.md` | Logs, métricas, troubleshooting |
| `docs/08-SECURITY.md` | LGPD, secrets, vulnerabilidades |
| `docs/09-RUNBOOKS.md` | Quando algo quebrar em produção |
| `docs/10-FEATURE-CHECKLIST.md` | Checklist completo para criar feature |
| `docs/11-SECRETS-VAULT.md` | Política de gestão de segredos críticos |
| `docs/12-FEATURE-FLAGS.md` | Como usar feature flags |
| `docs/13-ONBOARDING.md` | Fluxo de onboarding de tenants (com aprovação manual) |
| `.ai/CODING-RULES.md` | Regras de código que a IA deve seguir |
| `.ai/FEATURE-TEMPLATE.md` | Template de prompt para gerar feature nova |
| `.ai/REVIEW-CHECKLIST.md` | Auto-review antes de propor PR |
| `docs/adr/` | Decisões arquiteturais (por quê fizemos X em vez de Y) |

## Princípios não-negociáveis

1. **TDD primeiro, código depois.** Sempre. Sem exceção.
2. **Toda decisão arquitetural vira ADR** em `docs/adr/`.
3. **Toda feature segue o template** em `.ai/FEATURE-TEMPLATE.md`.
4. **Toda mudança visual consulta o design system** em `docs/05-DESIGN-SYSTEM.md`.
5. **Nunca commitar segredo** (`.env*` está no `.gitignore`).
6. **Nunca pular o ArchUnit** — se ele falhou, a violação é real, não tente contornar.
7. **Nunca usar `any` em TypeScript** — use `unknown` e refine.
8. **Sempre validar entrada do usuário com Zod** no frontend e Bean Validation no backend.
9. **Sempre usar `@Transactional`** em use cases (readOnly quando aplicável).
10. **Sempre paginar listagens** — nunca retornar `List<X>` cru de endpoint.

## Idioma e tom

- **Código:** inglês (variáveis, classes, funções, comentários técnicos)
- **Documentação de negócio:** português do Brasil (este projeto atende mercado brasileiro)
- **Mensagens de erro pro usuário final:** português do Brasil
- **Logs:** inglês (pra facilitar busca em ferramentas internacionais)
- **Commits:** inglês, Conventional Commits (`feat:`, `fix:`, `chore:`, etc)

## Comportamentos esperados da IA

### O que a IA SEMPRE deve fazer
- Ler este arquivo e os linkados antes de propor mudanças significativas
- Escrever testes ANTES da implementação (TDD)
- Respeitar a estrutura de pastas (Clean Architecture + features)
- Seguir as regras de ArchUnit já existentes
- Validar entrada com Zod (frontend) ou Bean Validation (backend)
- Adicionar migration Flyway sequencial (`V{N}__descricao.sql`) ao mexer em schema
- Documentar decisão arquitetural em ADR quando aplicável
- Usar `pnpm` ou `npm` consistente com o que já existe (`npm` por padrão)
- Logar erros, não engolir (`catch (e) { log.error(...); throw; }`)
- Confirmar com o desenvolvedor antes de **deletar** arquivos ou tabelas

### O que a IA NUNCA deve fazer
- Pular testes ("vou implementar primeiro, teste depois")
- Importar Spring/JPA em `domain/`
- Acessar outra feature diretamente (use eventos ou DTOs)
- Usar `@Autowired` em campos (sempre constructor injection)
- Criar JPA Entity igual ao Aggregate Root (são classes diferentes em camadas diferentes)
- Hardcodar credenciais, URLs ou segredos
- Commitar arquivos `.env*` ou chaves privadas
- Usar `any` em TypeScript
- Criar componente visual sem consultar `docs/05-DESIGN-SYSTEM.md`
- Quebrar regras de ArchUnit "temporariamente"
- Inventar bibliotecas — verifique se já existe no `pom.xml` ou `package.json`

## Quando estiver em dúvida

Use esta ordem de fallback:

1. Procure padrão similar já implementado no código (ex.: para nova feature, copie `features/tenants/` como template)
2. Consulte o documento relevante listado acima
3. Consulte ADRs em `docs/adr/`
4. Pergunte ao desenvolvedor (Allysson) antes de tomar decisão estrutural

## Glossário do domínio

| Termo | Significado |
|---|---|
| **Tenant** | Um escritório de arquitetura cliente do TKWS OS |
| **System Admin** | Operador da Group WS (acesso total a todos os tenants) |
| **Org Admin** | Administrador de um tenant (escritório) |
| **Project Manager** | Gestor de projeto dentro de um tenant |
| **Architect** | Membro de equipe técnica dentro de um tenant |
| **Viewer** | Cliente final que apenas consulta status do seu projeto |
| **Turnkey** | Projeto "chave na mão" — escritório entrega obra completa |
| **Aggregate Root** | Entidade de entrada de um agregado DDD |
| **Port** | Interface que o domínio define para infraestrutura implementar |
| **Adapter** | Implementação concreta de um port (ex.: `TenantJpaRepositoryAdapter`) |
