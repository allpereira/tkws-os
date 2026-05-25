# TKWS OS

> Sistema operacional digital da **Group WS**. SaaS B2B para escritórios de arquitetura
> premium que operam projetos turnkey.

## Para humanos

| Você é... | Comece por |
|---|---|
| Dev novo no projeto | [`docs/01-DEVELOPMENT.md`](docs/01-DEVELOPMENT.md) |
| Querendo entender arquitetura | [`docs/00-ARCHITECTURE.md`](docs/00-ARCHITECTURE.md) |
| Criando feature nova | [`docs/10-FEATURE-CHECKLIST.md`](docs/10-FEATURE-CHECKLIST.md) |
| Mexendo em testes | [`docs/02-TESTING.md`](docs/02-TESTING.md) |
| Operando produção | [`docs/03-DEPLOY.md`](docs/03-DEPLOY.md) + [`docs/09-RUNBOOKS.md`](docs/09-RUNBOOKS.md) |
| Quer entender uma decisão | [`docs/adr/`](docs/adr/) |

## Para IAs (Claude, Cursor, Copilot, etc)

**Entrada principal:** [`CLAUDE.md`](CLAUDE.md) — descreve topologia, stack, regras
não-negociáveis, glossário do domínio e referências cruzadas para a doc operacional.

## Stack

- **Backend:** Java 21 + Spring Boot 3.3+ + PostgreSQL 16 + Redis + Zitadel
- **Frontend:** React 19 + TypeScript + Vite + TanStack Router/Query + shadcn/ui + Tailwind
- **Custom login:** SPA dedicada (`login/`) consumindo a Session API do Zitadel — ver [ADR-015](docs/adr/ADR-015-custom-login-v2.md)
- **Infra backend:** AWS sa-east-1 + Docker Compose + Caddy + GitHub Actions
- **Infra frontend:** Cloudflare Pages (free pra uso comercial, preview deploys)
- **DNS/CDN:** Cloudflare

## Quick start (desenvolvimento)

```bash
git clone https://github.com/groupws/tkws-os.git
cd tkws-os
bash scripts/dev-start.sh
# Acessa http://localhost:5173 — redireciona para o custom login em :5174
```

O script sobe os containers de infra (Postgres, Redis, Zitadel, gateway Caddy
+ Mailpit), extrai o PAT do `login-client` necessário pro custom login,
aplica o seed declarativo do Zitadel ([`scripts/zitadel-seed.sh`](scripts/zitadel-seed.sh))
e inicia os três processos via `npm run dev` / `mvn spring-boot:run`
(login app :5174, frontend :5173, API :8080) com logs em `/tmp/tkws-*.log`.
Setup manual ou troubleshooting: [`docs/01-DEVELOPMENT.md`](docs/01-DEVELOPMENT.md).

## Comandos úteis

```bash
# Backend
cd api && ./mvnw verify              # roda testes + ArchUnit
cd api && ./mvnw spring-boot:run     # roda local

# Frontend
cd frontend && npm install
cd frontend && npm run dev           # dev server com HMR
cd frontend && npm run test:run      # testes unit/integration
cd frontend && npm run e2e           # Playwright

# Infra
docker compose up -d                 # sobe tudo
docker compose logs -f api           # logs da API
docker compose down -v               # reseta tudo (CUIDADO)
```

## Documentação completa

```
docs/
├── 00-ARCHITECTURE.md       # Arquitetura, Clean Arch, DDD, multi-tenancy
├── 01-DEVELOPMENT.md        # Setup, workflow diário, padrões, Capacitor
├── 02-TESTING.md            # Testing Trophy, TDD, padrões + troubleshooting
├── 03-DEPLOY.md             # AWS + Cloudflare Pages, CI/CD, custos
├── 04-AUTH.md               # Zitadel, OIDC, roles, reset Zitadel
├── 05-DESIGN-SYSTEM.md      # Tokens, componentes, padrões visuais
├── 06-BACKUP-RECOVERY.md    # Backup strategy, DR, runbooks de restore
├── 07-OBSERVABILITY.md      # Logs, métricas, Sentry, alertas
├── 08-SECURITY.md           # LGPD, secrets, vulnerabilidades
├── 09-RUNBOOKS.md           # Playbooks operacionais para incidentes
├── 10-FEATURE-CHECKLIST.md  # Passo a passo para criar feature
├── 11-SECRETS-VAULT.md      # Cofre de segredos críticos (Zitadel masterkey, etc)
├── 12-FEATURE-FLAGS.md      # Sistema de feature flags
├── 13-ONBOARDING.md         # Fluxo de onboarding de tenants
├── 14-DESIGN-SYSTEM-SYNC.md # Espelhamento DS → frontend
└── adr/                     # Architecture Decision Records (20 ADRs · 001-016, 018-021)
    ├── README.md
    └── ADR-001..ADR-021.md
```

## Princípios

1. TDD primeiro
2. Toda decisão arquitetural vira ADR
3. ArchUnit valida fronteiras (não é manual)
4. Conventional Commits
5. Nunca commitar segredo
6. Mensagens ao usuário em português; código/logs/commits em inglês
7. Consulte design system antes de mudança visual

## Licença

Proprietário — Group WS — © 2025
