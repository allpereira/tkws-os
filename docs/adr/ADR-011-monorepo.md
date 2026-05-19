# ADR-011: Monorepo único (backend + frontend + infra + docs)

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

TKWS OS contém backend Java, frontend React, infraestrutura como código (compose + Caddy +
scripts) e documentação extensa. Decidir: tudo em um repo ou repos separados?

Dev solo trabalhando com IA (Claude Code, Cursor, Copilot) — produtividade depende de IA
ter contexto completo do sistema.

## Decisão

**Monorepo único** com a seguinte estrutura na raiz:

```
tkws-os/
├── api/                  # Backend Java/Spring
├── frontend/             # Frontend React/Vite
├── docker/               # Dockerfiles, Caddyfile
├── scripts/              # Provisionamento, deploy, backup
├── docs/                 # Documentação humana + ADRs
├── .ai/                  # Prompts e regras pra IAs
├── .cursor/rules/        # Regras Cursor IDE
├── .github/              # CI/CD workflows + copilot-instructions
├── docker-compose.yml    # Dev local
├── docker-compose.staging.yml
├── docker-compose.prod.yml
├── CLAUDE.md             # Entrada principal pra IAs
└── README.md
```

## Alternativas consideradas

1. **Polyrepo** (`tkws-backend` + `tkws-frontend` + `tkws-infra` + `tkws-docs`)
   - Pros: separação clara de responsabilidades, deploys independentes naturais
   - Contras: mudança de contrato API quebra em runtime (não no CI compartilhado), IA
     fica com contexto parcial, overhead de coordenação de PRs entre repos

2. **Monorepo com workspaces** (npm/pnpm workspaces, Nx, Turborepo)
   - Pros: ferramentas modernas pra build incremental
   - Contras: complexidade adicional injustificada — backend Java não se integra
     bem com workspaces JS, e benefício de Nx só aparece com 5+ packages JS

3. **Monorepo simples (escolhido)** — diretórios separados, sem ferramenta especial
   - Pros: zero complexidade, IA tem contexto total, mudança atômica em vias completas,
     CI com path filters dá feedback rápido sem ferramenta extra, deploy continua
     independente por artefato (imagem API ≠ build frontend)
   - Contras: nenhum significativo no estágio atual

## Consequências

### Positivas
- **Mudança atômica em vias completas:** alterar `CreateTenantCommand` no backend +
  schema Zod no frontend num único PR
- **IA com contexto completo:** Cursor/Claude veem o sistema inteiro
- **Setup local trivial:** `docker compose up -d` sobe tudo
- **Documentação compartilhada** sem duplicação
- **Histórico unificado:** evolução do produto em um único `git log`
- **CI com path filters:** só roda o que mudou, mantendo velocidade
- **Deploy continua independente por artefato:** imagem API redeploya sem mexer no frontend,
  e vice-versa (frontend é Cloudflare Pages)

### Negativas / Trade-offs
- Repo cresce ao longo do tempo (irrelevante até 100k+ arquivos)
- Permissões granulares por área são impossíveis (irrelevante em dev solo)
- Quem só quer backend tem que clonar tudo (irrelevante: tudo é pequeno)

### Riscos
- Quando time crescer (5+ devs), pode haver conflitos de merge frequentes — mitigar:
  bom modular packaging por feature já reduz isso drasticamente
- Build/CI lento se rodar tudo a cada push — mitigado por path filters no workflow

## Quando reavaliar (gatilhos para separar)

- Time backend e time frontend separados (5+ pessoas cada)
- Mobile nativo (Swift/Kotlin) entrar como tech distinta
- Cliente exigir SDK público open source de uma parte
- Compliance exigir isolamento físico de código (raro)
- Componente virar produto independente (spin-off)

Nenhum desses se aplica nos próximos 12-18 meses.

## Notas adicionais

Esta decisão é compatível com ADR-012 (Cloudflare Pages para frontend). Monorepo não exige
deploy unificado — Cloudflare faz path-aware build (só rebuilda quando `frontend/` muda) e
GitHub Actions usa path filter (só builda API quando `api/` muda).

Repos separados seriam **piores** mesmo no cenário Cloudflare, porque a sincronização de
contratos (API → frontend) ainda atravessa front e back num mesmo PR.
