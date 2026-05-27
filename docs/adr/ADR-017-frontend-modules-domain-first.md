# ADR-017 — Frontend organizado por módulos de negócio (domain-first)

**Status:** Aceito
**Data:** 2026-05-27
**Decisores:** Allysson Pereira

## Contexto

O backend usa Clean Architecture com features técnicas em camadas (`features/<feature>/{domain,application,infrastructure,web}`). O frontend (React 19 + TanStack) **não** tem camadas equivalentes — não há domain/infra/web no client. Ainda assim, a documentação inicial (CLAUDE.md, `10-FEATURE-CHECKLIST.md`, `02-TESTING.md`) descrevia o frontend como `src/features/<feature>/{api,components,hooks,types,__tests__}`, copiando a nomenclatura do backend.

Na prática isso gerou dois problemas:

1. **Pasta `features/` plana não escala** — com CRM, Organização, Plataforma e os módulos futuros (Orçamento, Projetos, Catálogo…), uma lista plana de features mistura domínios sem hierarquia. Onde mora `etapas`? E `setores`? E `pipelines`?
2. **Subdividir `api/ hooks/ types/` para cada feature criou pastas de 1 arquivo** — `tenants/api/tenants-api.ts`, `tenants/hooks/use-tenants.ts`, `tenants/types/tenant.ts`: três pastas, três arquivos, um único hook. Mais navegação, zero benefício.

## Decisão

**O frontend se organiza por módulo de negócio (domain-first), com arquivos flat dentro de cada feature.**

```
src/modules/
├── plataforma/        # infra técnica (auth, tenants, users)
├── crm/               # operação comercial
│   ├── leads/ · clientes/ · atendimento/ · propostas/
│   └── configuracoes/ # ≥4 features de config viram subpasta
│       ├── pipelines/ · etapas/ · tipos-pagamentos/
└── organizacao/       # o tenant (escritório) e suas configurações
    └── configuracoes/
        ├── ofertas/ · setores/ · unidades/ · …
```

Estrutura interna de cada feature — **flat**:

```
<feature>/
├── schema.ts        # Zod · fonte da verdade dos tipos
├── api.ts           # funções de acesso + hooks TanStack Query
├── store.ts         # Zustand (opcional)
├── components/
└── __tests__/
```

**Regra de subdivisão:** só crie `api/`, `hooks/`, `types/` quando colidir nome **ou** houver >5 arquivos do mesmo tipo. Antes disso, mantenha `schema.ts` + `api.ts`.

**Onde mora o quê:**

| Tipo | Caminho |
|---|---|
| Lógica de módulo de negócio | `modules/<domínio>/<feature>/` |
| Config gerenciada pelo admin | `modules/<domínio>/configuracoes/<feature>/` |
| Reuso entre 2+ módulos | `src/shared/` |
| Utilitário puro (sem domínio/rede) | `src/lib/` |
| Rotas e providers | `src/app/` |

## Alternativas consideradas

1. **`src/features/` plana, espelhando o backend** — simples no início, mas mistura domínios e não escala. Rejeitada.
2. **Sempre subdividir `api/ hooks/ types/`** — consistente com o backend, mas gera pastas de 1 arquivo. Rejeitada; vira só ruído de navegação.
3. **Domain-first + flat com subdivisão sob demanda (escolhida)** — hierarquia por negócio, menos arquivos, e a porta aberta para subdividir quando a feature crescer de verdade.

## Consequências

### Positivas

- Navegação por domínio: tudo de uma feature num só lugar, poucos arquivos.
- Alinha com a forma como o produto é pensado (módulos: CRM, Orçamento, Projetos…).
- `createCrudApi`/`createCrudHooks` (`@/lib`) tornam `api.ts` de lookup quase trivial.

### Negativas / Trade-offs

- Diverge da nomenclatura em camadas do backend — exige nota explícita (esta ADR) para não confundir.
- "Quando subdividir" é um julgamento (>5 arquivos / colisão), não uma regra rígida.

## Notas adicionais

- Mapa vivo e regras de execução: [`frontend/src/modules/README.md`](../../frontend/src/modules/README.md).
- Esta ADR preenche o gap de numeração que existia entre ADR-016 e ADR-018.
- Lookup tables no backend: [ADR-020](ADR-020-lookup-tables-sem-domain-layer.md). Pessoas unificadas: [ADR-018](ADR-018-pessoas-unificadas.md).
