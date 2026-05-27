# 05 — Design System

> **STATUS: ⚠️ ESTRUTURA — PRECISA SER PREENCHIDO COM O DESIGN SYSTEM REAL**
>
> Este documento é a fonte de verdade do design system do TKWS OS para IAs e desenvolvedores.
> O HTML do design system unificado está em
> `TKWS_OS_DesignSystem_Unified.html` (na máquina do Allysson, ainda não anexado ao repo).
>
> **Próximo passo:** Allysson deve anexar o HTML aqui na conversa pra Claude extrair tokens
> reais e preencher as seções abaixo. Por enquanto, seções marcadas com `TODO` são placeholders.
>
> Enquanto este documento não estiver completo, **toda IA deve perguntar ao usuário antes de
> tomar decisões visuais** (cores, espaçamento, tipografia).

## Filosofia visual

O TKWS OS atende arquitetos de alto padrão. A interface precisa refletir **rigor editorial,
respiro, materialidade e atenção tipográfica** — o público é treinado para detectar
desalinhamentos, hierarquias mal resolvidas e baixa qualidade gráfica.

### Princípios

1. **Tipografia é estrutura, não decoração.** Hierarquia clara via tamanho, peso e tracking.
2. **Espaço é conteúdo.** Respiro generoso entre seções. Densidade controlada.
3. **Cor com economia.** Paleta enxuta. Cor sinaliza intenção, nunca preenche espaço.
4. **Materialidade.** Sombras suaves, bordas sutis, sem skeumorfismo mas sem flat raso.
5. **Densidade adaptativa.** Tabelas e listas densas em dashboards, espaçoso em formulários.

## Tokens

### Cores

<!-- TODO: extrair do HTML do design system. Por enquanto, placeholders shadcn defaults. -->

```css
/* Light mode */
--background:        0 0% 100%;
--foreground:        240 10% 3.9%;
--card:              0 0% 100%;
--card-foreground:   240 10% 3.9%;
--primary:           240 5.9% 10%;     /* TODO: confirmar com design system */
--primary-foreground: 0 0% 98%;
--secondary:         240 4.8% 95.9%;
--muted:             240 4.8% 95.9%;
--muted-foreground:  240 3.8% 46.1%;
--accent:            240 4.8% 95.9%;
--destructive:       0 84.2% 60.2%;
--border:            240 5.9% 90%;
--input:             240 5.9% 90%;
--ring:              240 5.9% 10%;

/* Dark mode — TODO */
```

**Regra:** sempre usar via classes Tailwind ou `hsl(var(--token))`. **NUNCA** hardcodar hex.

### Tipografia

<!-- TODO: extrair famílias e escalas do HTML. -->

```css
/* Famílias */
--font-display:  /* TODO: provavelmente Inter Display ou GT America */
--font-sans:     /* TODO: provavelmente Inter */
--font-mono:     'JetBrains Mono', 'Fira Code', monospace;

/* Escala (modular) */
--text-xs:    0.75rem;
--text-sm:    0.875rem;
--text-base:  1rem;
--text-lg:    1.125rem;
--text-xl:    1.25rem;
--text-2xl:   1.5rem;
--text-3xl:   1.875rem;
--text-4xl:   2.25rem;
--text-5xl:   3rem;
```

### Espaçamento

Sempre usar escala Tailwind (`p-4`, `gap-6`). Múltiplos de 4px.

| Token | px | Uso |
|---|---|---|
| `space-1` | 4 | Gaps mínimos (ícone+texto) |
| `space-2` | 8 | Gaps de elementos relacionados |
| `space-4` | 16 | Padding padrão de card |
| `space-6` | 24 | Gap entre seções |
| `space-8` | 32 | Espaço respiratório |
| `space-12` | 48 | Separação de blocos grandes |

### Border radius

```css
--radius:    0.5rem;   /* base */
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
```

### Sombras

<!-- TODO: extrair do design system. -->

```css
/* Sutis, nunca dramáticas */
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow:     0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1);
```

## Componentes

> Componentes-base via **shadcn/ui** + Radix primitives. Variantes específicas do TKWS OS
> documentadas abaixo. Use `npx shadcn add <componente>` para adicionar e adapte conforme tokens.

### Button

<!-- TODO: variantes específicas do TKWS. -->

Variantes esperadas:
- `default` — primary, ação principal
- `secondary` — ação secundária
- `outline` — ação alternativa, bordas
- `ghost` — ação sutil, sem fundo
- `destructive` — ações destrutivas (delete, cancel)
- `link` — visual de link

Tamanhos: `sm`, `default`, `lg`, `icon`.

### Input

Padrão: borda sutil, focus ring usando `--ring`. Labels sempre visíveis (nunca placeholder-as-label).

### Card

Container padrão para listagens e dashboards.

### Table

Tabelas devem ser densas mas legíveis. Header com tracking levemente aberto.

### Form

React Hook Form + Zod sempre. Mensagens de erro em vermelho sutil, abaixo do campo.

### Toast / Notification

Usar **Sonner** (`npx shadcn add sonner`). Posição: `top-right` desktop, `bottom` mobile.

### Modal / Dialog

Radix Dialog. Overlay com 60% opacidade. Animações leves.

## Padrões de página

### Chrome de página · breadcrumb + `PageShell` (PADRÃO OBRIGATÓRIO)

**Toda tela do `frontend/` usa o mesmo chrome editorial**, espelhado do pattern
`AppShell` do design system (`design-system/src/pages/patterns/AppShell.tsx`). A
referência viva é **`/crm/atendimento`**. A estrutura, de cima para baixo:

1. **Barra de breadcrumb** — hierárquica, clicável, `mono` uppercase. Fica numa
   barra própria full-bleed (`border-b px-6 py-2.5`, fundo `--surface-1`). É a
   **única forma de breadcrumb** — não use mais a tag `crumb` mono solta acima do
   título.
2. **Page header** — título Fraunces serif (`serif text-[30px]`) + `description` +
   ações à direita (`border-b px-6 pt-6 pb-5`).
3. **Toolbar sticky** (opcional) — busca / filtros / view switcher (`sticky top-0`).
4. **Conteúdo** — sobre `--bg`.

Tudo é **full-bleed**: o shell cancela o padding do `<main>` com margens negativas
(`-mx-4 -my-6 md:-mx-8 md:-my-8`) e usa `px-6` interno, garantindo margem,
alinhamento e organização idênticos em todas as telas.

**Como usar — nunca monte esse chrome à mão:**

- Caso geral: **`PageShell`** (`@/components/tkws/page-shell`). Passe
  `breadcrumbs` (hierárquico explícito) **ou** `crumb` (string legada com `·`/`›`,
  derivada automaticamente para breadcrumb + `title`). Slots: `actions`,
  `toolbar` (sticky), `children` (conteúdo).
- Listagens CRUD de Configurações: **`CrudPage`** — já compõe `PageShell`.
- Listagens de Pessoas (Leads/Clientes): **`PessoaListing`** — já compõe `PageShell`.
- Pipelines Kanban (Atendimento/Propostas): **`PipelineKanbanShell`** — mesma
  estrutura, com KPI strip + view switcher fixos.

> Telas novas **devem** entrar por um desses componentes. Se nenhum servir,
> componha sobre `PageShell` — não recrie a barra de breadcrumb nem o header.
> O componente antigo `PageHeader` (crumb mono, sem barra) foi **removido** em
> favor de `PageShell`.

### Dashboard

- Sidebar lateral fixa (~240px)
- Header com breadcrumb e ações
- Conteúdo com grid de cards
- Densidade alta

### Formulário

- Largura máxima `max-w-2xl`
- Espaçamento entre campos `space-y-6`
- Botão primário à direita, secundário à esquerda
- **Responsividade (obrigatório):** linhas com múltiplos campos usam grid que
  **empilha no mobile** — `grid grid-cols-1 gap-3 sm:grid-cols-2` (e não
  `grid-cols-2` cru). Para um campo estreito ao lado de um largo, use
  `sm:grid-cols-[minmax(160px,200px)_1fr]` em vez de coluna de pixel fixa
  (`[140px_1fr]`), que **espreme** controles como Select num espaço apertado.
  Tudo dentro do `Dialog` (que é `w-full max-w-lg`) precisa caber sem corte —
  confira no breakpoint mobile.
- **Formulário longo / com sub-cadastros:** use abas (`Tabs`) para separar blocos
  (ex.: cadastro de Cliente → abas **Dados** e **Contatos**, ver ADR-023). Uma aba
  que depende de um id (sub-itens 1:N) fica desabilitada até o registro ser salvo.

### Listagem / Tabela

- Filtros no topo
- Paginação no rodapé
- Ações em hover ou via menu kebab

## Como usar este design system

### Para o desenvolvedor

1. Para adicionar componente shadcn: `cd frontend && npx shadcn add <nome>`
2. Após adicionar, verifique se tokens usados batem com este doc
3. Se precisar de variante nova, adicione aqui antes de criar
4. Componentes específicos do TKWS OS vão em `frontend/src/shared/components/`

### Para a IA

**Antes de gerar qualquer componente visual:**

1. Consulte este documento
2. Use exclusivamente os tokens documentados (não invente cores/tamanhos)
3. Se algo não estiver documentado, **pergunte ao usuário** antes de criar
4. Use shadcn/ui como base sempre que possível
5. Componentes complexos devem ser composições de primitives Radix + Tailwind

### Para a IA — checklist visual

Antes de propor mudança visual:
- [ ] Usei tokens (CSS variables) e não hex/rgb cru?
- [ ] Usei classes Tailwind padrão (escala 4px) e não pixels arbitrários?
- [ ] Componente respeita variantes documentadas?
- [ ] Tipografia respeita escala documentada?
- [ ] Espaçamento usa tokens?
- [ ] **Responsivo?** Grids de formulário empilham no mobile (`grid-cols-1 sm:grid-cols-N`); nada é cortado/espremido dentro do `Dialog` no breakpoint estreito?
- [ ] Funciona em dark mode? (TODO: tema dark a definir)
- [ ] É acessível? (labels, contrast, foco visível)

## Acessibilidade

- Contraste mínimo **AA** (WCAG 2.1)
- Todos os componentes interativos devem ter estado de foco visível
- Inputs sempre com `<label>` associado
- Botões sempre com texto descritivo (não só ícone, exceto com `aria-label`)
- Modais com `aria-modal` e foco gerenciado por Radix

## Como atualizar este documento

Quando o design system HTML for finalizado/atualizado:

1. Abre o HTML em `TKWS_OS_DesignSystem_Unified.html`
2. Extrai todos os tokens (CSS variables, escalas, tipos)
3. Substitui as seções marcadas com `TODO` neste doc
4. Atualiza `frontend/src/index.css` com os tokens reais
5. Atualiza `frontend/tailwind.config.ts` se houver tokens custom
6. Commita com `docs(design): atualiza design system pra v{X}`
7. Comunica em ADR se for mudança quebrante
