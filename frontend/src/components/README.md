# `frontend/src/components/`

Esta pasta espelha o **design system** do TKWS OS.

> **Antes de criar componente novo aqui, leia [`docs/14-DESIGN-SYSTEM-SYNC.md`](../../../docs/14-DESIGN-SYSTEM-SYNC.md).**
>
> Tem chance grande do componente já existir em `design-system/src/components/` — nesse
> caso o caminho é **copiar do DS** seguindo o runbook, não recriar do zero.

## Organização

```
components/
├── ui/      # primitivos visuais (botão, badge, input, etc.) — espelho do DS
└── tkws/    # composições e templates do produto
            #   25 componentes vindos do DS (kanban, kpi, gantt, etc.)
            # + 6 templates próprios do produto (app-shell, crud-page, etc.)
```

## Regras rápidas

1. **Antes de criar componente em `ui/`:** verifique se ele existe em `design-system/src/components/ui/`. Se sim, siga o runbook em `docs/14`.
2. **Templates do produto** (App Shell, PageShell, CrudPage, DataTable, ConfirmDialog, SimpleNomeForm) ficam em `tkws/` e **não vêm do DS**. Esses são da camada de produto.
3. **Tokens visuais** (cores, espaçamento, tipografia) vêm de CSS variables declaradas em `src/index.css`, espelhando `design-system/src/styles/globals.css`.
4. **Nunca importe direto do `design-system/`** — o frontend não depende do DS como package. A sincronia é por cópia consciente.

## Por onde começar

| Tarefa | Documento |
|---|---|
| Adicionar componente novo do DS | [`docs/14-DESIGN-SYSTEM-SYNC.md`](../../../docs/14-DESIGN-SYSTEM-SYNC.md) |
| Mudar visual de um componente existente | [`docs/05-DESIGN-SYSTEM.md`](../../../docs/05-DESIGN-SYSTEM.md) (princípios e tokens) |
| Criar feature CRUD que usa esses componentes | [`docs/10-FEATURE-CHECKLIST.md`](../../../docs/10-FEATURE-CHECKLIST.md) |
