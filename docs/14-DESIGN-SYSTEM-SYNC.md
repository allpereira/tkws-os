# 14 — Sincronia Design System → Frontend

> **Quem deve ler:** qualquer IA ou dev que vá copiar/atualizar componentes do
> `design-system/` para o `frontend/`. Antes de criar componente novo do zero, **sempre**
> verifique se já existe no design-system — ele é a fonte da verdade visual.

## Princípio

```
design-system/  ──(fonte da verdade)──>  frontend/
```

- **`design-system/src/components/ui/`** → **`frontend/src/components/ui/`**
- **`design-system/src/components/tkws/`** → **`frontend/src/components/tkws/`**
- **`design-system/src/lib/utils.ts`** → utilitários equivalentes em **`frontend/src/lib/utils.ts`**

O `frontend/` **espelha** o DS. Mudou no DS → sincroniza no frontend.

## Quando sincronizar

| Gatilho | Ação |
|---|---|
| Componente novo no `design-system/src/components/ui/*` | Copiar para frontend |
| Componente novo em `design-system/src/components/tkws/*` | Copiar para frontend |
| Componente alterado no DS (props, comportamento, tokens) | Atualizar versão no frontend |
| Novo utilitário em `design-system/src/lib/utils.ts` | Adicionar em `frontend/src/lib/utils.ts` |
| Novo token CSS no `design-system/src/styles/globals.css` | Mirror em `frontend/src/index.css` |

## Componentes que NÃO devem ser sobrescritos

Existem dois grupos de arquivos que o frontend mantém localmente e que **não vêm do DS**:

### 1. Templates próprios do produto (`frontend/src/components/tkws/`)

Esses arquivos pertencem ao **produto TKWS OS** (não ao DS) e devem ser preservados em qualquer sincronia:

- `app-shell.tsx` — App Shell com sidebar/topbar/statusbar do produto
- `confirm-dialog.tsx` — confirmação destrutiva (excluir/etc.)
- `crud-page.tsx` — template de página CRUD reutilizável
- `data-table.tsx` — wrapper de `Table` com loading/empty/onRowClick
- `page-header.tsx` — header editorial Fraunces das telas
- `simple-name-form.tsx` — form genérico nome+descricao+ativo+ordem

Se o DS um dia trouxer componente com nome igual a um desses, **renomeie o que veio do DS** para evitar colisão (ex.: `header.tsx` do DS continua sendo `header.tsx`, e o nosso template é `page-header.tsx`).

### 2. Primitivos adaptados (`frontend/src/components/ui/`)

Esses já foram adaptados para a estética/tokens do produto e tipicamente **não devem ser sobrescritos** sem revisão manual — mas devem ser **atualizados quando o DS introduzir tokens novos**:

- `avatar.tsx` (adicionou helper `initialsOf`)
- `badge.tsx` (API expandida com `tone` + `variant` aliases para `success`/`warning`/`destructive`)
- `breadcrumb.tsx` (usa `Link` do TanStack Router em vez de `<a>`)
- `button.tsx` (size `md` como alias de `default`)
- `card.tsx` (suporte a `accent` lateral)
- `dialog.tsx` (frontend: wrapper controlado `Dialog({ open, onOpenChange })` · DS: `Dialog` = Radix Root — ambos Radix, não HTML5)
- `empty-state.tsx`
- `input.tsx` (também exporta `Textarea`, `Label`, `Field`, `FieldHint`)
- `select.tsx` (Radix · `SelectContent` em z-[100] para uso dentro de Dialog)
- `spinner.tsx`
- `table.tsx`

Para esses: **revise o diff antes de sobrescrever**. A regra é: o DS é a fonte de verdade visual (estilo/tokens), mas as **APIs públicas** desses primitivos não podem regredir.

## Runbook · sincronia incremental

### Cenário A — Componente novo no DS

Exemplo: alguém adicionou `design-system/src/components/ui/banner-stripe.tsx`.

```bash
# 1. Verifique se realmente é novo
diff <(ls design-system/src/components/ui/ | sort) \
     <(ls frontend/src/components/ui/ | sort)

# 2. Copie (cp -n preserva qualquer existente)
cp -n design-system/src/components/ui/banner-stripe.tsx \
      frontend/src/components/ui/

# 3. Inspecione imports — se importar de @/lib/utils alguma função
#    nova, copie a função para frontend/src/lib/utils.ts

# 4. Inspecione package.json — se importar dependência nova
#    (@radix-ui/*, cmdk, vaul, etc.), instale-a:
#    cd frontend && npm install <dep>@<versão-igual-à-do-DS> --save

# 5. Valide
cd frontend && npx tsc --noEmit && npx vite build
```

### Cenário B — Componente existente foi alterado no DS

```bash
# 1. Veja o diff entre as duas versões
diff -u frontend/src/components/ui/<arquivo>.tsx \
        design-system/src/components/ui/<arquivo>.tsx

# 2. Se o arquivo está na lista "primitivos adaptados" acima:
#    → revisão manual obrigatória, NÃO sobrescreva direto.
#    → adapte só as mudanças visuais (tokens, classes Tailwind, cores)
#      preservando a API pública adaptada.

# 3. Se o arquivo NÃO está nessa lista:
#    → sobrescreva direto
cp design-system/src/components/ui/<arquivo>.tsx \
   frontend/src/components/ui/

# 4. Valide
cd frontend && npx tsc --noEmit && npx vite build
```

### Cenário C — Sincronia em massa (vários arquivos)

```bash
# 1. Detectar diferenças nominais (arquivos só no DS)
diff <(ls design-system/src/components/ui/   | sort) \
     <(ls frontend/src/components/ui/        | sort)
diff <(ls design-system/src/components/tkws/ | sort) \
     <(ls frontend/src/components/tkws/      | sort)

# 2. Copiar tudo o que não existe (preserva os customizados)
cp -n design-system/src/components/ui/*.tsx   frontend/src/components/ui/
cp -n design-system/src/components/tkws/*.tsx frontend/src/components/tkws/

# 3. Diff de dependências
node -e "
const ds = require('./design-system/package.json').dependencies;
const fe = require('./frontend/package.json').dependencies;
console.log(JSON.stringify(Object.keys(ds).filter(k => !fe[k]), null, 2));
"

# 4. Instalar todas as deps faltantes em batch (mesma versão do DS)
cd frontend && npm install <lista-de-deps> --save

# 5. Validar
npx tsc --noEmit
npx vite build
```

## Resolvendo conflitos comuns

### `formatCurrency`/`formatNumber`/`formatPercent` não encontrados

O DS define essas funções em `design-system/src/lib/utils.ts`. Copie para `frontend/src/lib/utils.ts` se algum componente importar.

### `react-resizable-panels` exports não encontrados

A lib mudou na v4: `PanelGroup` → `Group`, `PanelResizeHandle` → `Separator`. Verifique a versão e ajuste imports nomeados.

### `prop "error" does not exist on InputProps`

O Input do frontend usa `state` em vez de `error: boolean`. Em componentes do DS que passem `error`, troque por `state={error ? 'error' : 'default'}`.

### `Dialog` controlado no frontend vs. Root no DS

O DS exporta `Dialog` como `DialogPrimitive.Root` (aceita `open`/`onOpenChange` e `DialogTrigger`). O frontend usa um wrapper tipado `Dialog({ open, onOpenChange, children })` com a mesma API Radix por baixo. Ao sincronizar `dialog.tsx`, preserve o wrapper do frontend se existir — não volte para `<dialog showModal>` HTML5.

`DialogContent` em ambos aceita `className` e `style` (Radix). Select/Popover: manter `z-[100]` no content portaled.

### Tailwind v4 vs v3

DS usa Tailwind v4 (`@theme inline`). Frontend usa v3 (`tailwind.config.ts`). Tokens estão alinhados via CSS variables, mas:

- Classes utilitárias como `bg-surface-1`, `text-soft` funcionam em ambos (frontend declara como utility classes em `index.css`)
- Sintaxe `@theme` do v4 não roda no v3 — não copiar nada do `design-system/src/styles/globals.css` cegamente

### Imports unused (`React`)

Componentes copiados podem ter `import * as React from 'react'` sem uso (com JSX automático do React 19). TS reclama (`TS6133`). Remova quando aparecer.

## Checklist antes de fechar PR de sincronia

- [ ] `npx tsc --noEmit` limpo
- [ ] `npx vite build` limpo
- [ ] Componentes da lista "templates próprios" e "primitivos adaptados" preservados
- [ ] Novas deps adicionadas ao `package.json` na mesma versão do DS
- [ ] Se introduziu token/utility class novo, atualizou `frontend/src/index.css`
- [ ] Testou um consumidor real do componente em `npm run dev`

## Por que o frontend não importa do DS direto

Considerou-se publicar o DS como package (`tkws-os-design-system`) e o frontend instalar como dependência. Decidiu-se por **copiar arquivos** porque:

1. **Independência de release** — frontend pode evoluir sem versionar o DS
2. **Customização local** — os primitivos adaptados precisam de pequenas mudanças (tokens, API, comportamento mobile) que ficariam atrás de PR no DS
3. **Tailwind v3 vs v4** — DS adotou v4 cedo, frontend mantém v3 estável
4. **Tooling simples** — sem monorepo (pnpm workspaces, turborepo), sem publish flow

A regra "DS é a fonte da verdade" + esta documentação substituem o que um package faria.

## Tabela rápida · estado atual

| Pasta | DS | Frontend | Δ |
|---|---|---|---|
| `components/ui/` | 60 arquivos | 60 espelhados + 1 customizado (`input.tsx` re-exporta extras) | sincronizado |
| `components/tkws/` | 25 arquivos | 25 espelhados + 6 templates próprios | sincronizado |
| `lib/utils.ts` | `cn` + `formatCurrency` + `formatNumber` + `formatPercent` | igual + comentários | sincronizado |

Atualizar essa tabela sempre que rodar sincronia.
