# TKWS OS · Design System (React)

Living style guide do **TKWS OS** em React 19 + Vite + Tailwind v4 + shadcn/ui + Radix Primitives. Fiel ao `TKWS OS - Design System V1.html` original, agora 100% funcional, interativo e animado.

---

## Stack

```
React 19 · TypeScript strict · Vite 6 · Tailwind v4
@tanstack/router · @tanstack/query · @tanstack/table · @tanstack/virtual
react-hook-form · zod · @hookform/resolvers
@radix-ui/* (15+ primitives) · shadcn/ui · cmdk · sonner
motion (ex-framer-motion) · @dnd-kit/core · recharts
react-day-picker · date-fns (pt-BR) · input-otp · vaul
lucide-react · class-variance-authority · tailwind-merge
zustand (UI state · persist)
```

Stack obrigatória definida em `../design-system/architeture/AGENT.md`.

---

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
```

Build de produção:

```bash
npm run build
npm run preview
```

Type-check:

```bash
npm run typecheck
```

---

## O que está aqui

### 1 · 8 páginas de Foundation

- **Welcome** — landing editorial com cards de feature
- **Manifesto** — princípios em forma de citações
- **Princípios** — os 6 pilares editoriais
- **Versus** — ERP genérico vs TKWS OS
- **Typography** — Fraunces + Inter + Mono · 6 funções tipográficas
- **Color** — surfaces · brand · ink · semantic · taxonomy (24 tokens copiáveis)
- **Spacing** — gutters · padding · 6 níveis de radius
- **Best Practices** — telas-mãe · padrões de form · Definition of Done

### 2 · ~45 páginas de componentes

Cada componente tem 4 lentes:

1. **Showcase visual** — interativo, com botão "Ver código" e "Copiar"
2. **PromptCard para IA** — contexto + quando usar + props + anti-patterns + exemplo
3. **Variantes** — todos os estados (default, hover, error, disabled) e tamanhos
4. **Anti-patterns** — o que evitar, com justificativa

Categorias:

- **Foundation** (5): Button · Badge · Avatar · Label · Separator
- **Inputs** (10): Input · Textarea · Select · Combobox · RadioGroup · Checkbox · Switch · Slider · InputOTP · Datepicker
- **Navigation** (5): Tabs · Toggle · Breadcrumb · Pagination · Menubar
- **Overlays** (9): Dialog · AlertDialog · Sheet · Dropdown · ContextMenu · Popover · Tooltip · HoverCard · Command Palette
- **Feedback** (6): Alert · Toast (sonner) · Skeleton · Progress · EmptyState · GoalRing
- **Data Display** (8): Card · Table · DataTable · RichList · Kanban (dnd) · Accordion · Collapsible · Carousel
- **Layout TKWS** (5): Header/Subheader · DetailHero · WizardSteps · FilterSidebar · BulkActionBar
- **Charts** (5): KPI Hero/Mini · Donut · BarChart · LineChart · Heatmap

### 3 · Índice de prompts para IA

Em `/ai-prompts`:

- **System prompt geral** copiável para colar no agente UMA vez
- Lista de prompts específicos por componente
- Cada prompt vira markdown com `promptToMarkdown()`

### 4 · Tema dark/light

Toggle persistente via Zustand. Toda CSS variable tem versão `[data-theme="dark"]` e `[data-theme="light"]`. Switch instantâneo no canto da sidebar.

---

## Estrutura

```
src/
├── main.tsx                  · entry · TanStack Router + Query + Tooltip Provider
├── router.tsx                · code-based routes (TanStack Router)
├── styles/globals.css        · tokens TKWS · @theme inline (Tailwind v4)
│
├── components/
│   ├── docs/                 · Layout · Sidebar · PromptCard · Showcase · CodeBlock · PageHeader
│   ├── ui/                   · shadcn primitives customizados (Button, Dialog, etc.)
│   └── tkws/                 · compostos TKWS (RichList, Kanban, DetailHero, KPI, Charts, etc.)
│
├── data/nav.ts               · árvore de navegação
├── lib/
│   ├── utils.ts              · cn() · formatCurrency · formatNumber · formatPercent
│   └── prompts.ts            · AIPrompt type + promptToMarkdown()
├── store/theme.ts            · zustand persist (dark/light)
│
└── pages/
    ├── Welcome.tsx · Manifesto.tsx · Principles.tsx · Versus.tsx · Typography.tsx · Color.tsx · Spacing.tsx · BestPractices.tsx · AiPromptsIndex.tsx
    └── components/           · 1 arquivo por componente
```

---

## Como ler como dev

1. **Abra a página do componente** que você precisa usar
2. **Copie o snippet** do Showcase (botão "Copiar" no canto)
3. **Cole o PromptCard** no agente de IA (Cursor, Claude Code, Copilot) ANTES de pedir o uso
4. **Leia os anti-patterns** — eles são linhas vermelhas

## Como usar com IA

1. Abra `/ai-prompts`
2. Copie o **System prompt geral** e cole no system prompt do agente
3. Para cada componente que precisar, copie o **PromptCard específico** e adicione à conversa
4. Peça a implementação · o agente já tem contexto + anti-patterns + exemplo

---

## Filosofia · "Para arquitetos. Não para back-office."

- Tipografia editorial (Fraunces serif + Inter + JetBrains Mono)
- Paleta disciplinada (navy + cyan + 6 semânticas)
- Whitespace radical (140px entre seções editoriais)
- Motion como linguagem (curvas long-and-low, durações editoriais)
- Conteúdo visual em primeiro plano

Detalhes em [/principles](src/pages/Principles.tsx) e [/versus](src/pages/Versus.tsx).

---

## Versão

**v1.0** · React 19 · Tailwind v4 · ~45 componentes · 8 páginas conceituais · 45 prompts IA
