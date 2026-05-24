# `src/modules/` · estrutura

Organização **domain-first**: cada feature mora dentro do seu módulo de negócio.

Decisão completa em [ADR-017](../../../tkws-os-architeture/adr/ADR-017-modules-domain-first.md).
Regras de execução em [AGENT.md](../../../tkws-os-architeture/AGENT.md).

## Mapa atual

```
modules/
├── plataforma/                   # infra técnica
│   ├── auth/
│   ├── tenants/
│   └── users/
├── crm/
│   ├── leads/                    # operação · uso diário
│   ├── clientes/
│   ├── atendimento/
│   ├── propostas/
│   └── configuracoes/            # tudo que o admin configura no CRM
│       ├── pipelines/
│       ├── etapas/
│       ├── tipos-propostas/
│       └── tipos-pagamentos/
└── organizacao/                 # tenant = organização (escritório TKWS)
    └── configuracoes/            # configurações do tenant
        ├── ofertas/              # catálogo do que a organização oferece (ex-produtos)
        ├── tipos-empresa/        # taxonomia de empresas externas (cliente/fornecedor/parceiro…)
        ├── unidades/             # filiais/escritórios da organização
        ├── setores/
        ├── tipos-projetos/
        ├── funcoes-pessoas/
        └── empreendimentos/
```

## Onde criar código novo

| Tipo | Caminho |
|---|---|
| Lógica de módulo de negócio | `modules/<dominio>/<feature>/` |
| Configuração gerenciada pelo admin | `modules/<dominio>/configuracoes/<feature>/` |
| Infra técnica (auth, tenants, users) | `modules/plataforma/<feature>/` |
| Reuso entre 2+ módulos | `src/shared/` |
| Utilitário puro (sem domínio, sem rede) | `src/lib/` |

## Estrutura interna de cada feature

```
<feature>/
├── schema.ts        # Zod schemas · fonte da verdade dos tipos
├── api.ts           # hooks TanStack Query
├── store.ts         # Zustand (opcional)
├── components/
│   ├── <feature>-page.tsx
│   └── <feature>-form.tsx
└── __tests__/
```

Subdividir em `api/`, `hooks/`, `types/` só quando colidir nome ou >5 arquivos do mesmo tipo (ver `plataforma/auth/` como exemplo de feature subdividida).

## Sub-pasta `configuracoes/` — quando criar

Só vira pasta quando o módulo tem **≥4 features** de configuração. Antes disso, mantém plano (`modules/<dominio>/<feature>/`).

## Módulos planejados

Não criar pasta vazia antes de ter código — pastas vazias envelhecem mal. Quando começar a feature, cria o módulo:

- `modules/projetos/` — projetos arquitetônicos
- `modules/orcamentos/` — compositor de orçamento
- `modules/catalogo/` — catálogo digital de produtos
- `modules/obra/` — gestão de obra
- `modules/financeiro/` — financeiro
