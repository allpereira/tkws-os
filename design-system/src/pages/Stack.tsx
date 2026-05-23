import { Box, Code, Database, Layers, Paintbrush, Smartphone, TestTube, Wrench } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { SubHead } from '@/components/docs/Showcase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Pkg {
  name: string
  version?: string
  why: string
  tag?: 'core' | 'mandatory' | 'recommended'
}

interface Group {
  id: string
  icon: React.ReactNode
  label: string
  description: string
  packages: Pkg[]
}

const groups: Group[] = [
  {
    id: 'core',
    icon: <Code size={16} />,
    label: 'Core',
    description: 'Linguagem, build, framework. Não trocar sem ADR.',
    packages: [
      { name: 'react', version: '19.x', why: 'Concurrent features (Suspense, transitions). Latest stable.', tag: 'mandatory' },
      { name: 'typescript', version: '5.x', why: 'strict: true · noUncheckedIndexedAccess · schemas Zod compartilhados.', tag: 'mandatory' },
      { name: 'vite', version: '6.x', why: 'HMR instantâneo · build otimizado · ecossistema TanStack.', tag: 'mandatory' },
    ],
  },
  {
    id: 'routing',
    icon: <Layers size={16} />,
    label: 'Routing & Data',
    description: 'Tudo TanStack. Saved views serializáveis via URL.',
    packages: [
      { name: '@tanstack/router', why: 'Type-safe routes · file-based · search params tipados.', tag: 'mandatory' },
      { name: '@tanstack/query', why: 'Cache · refetch · optimistic updates. Casa com mutations CRUD.', tag: 'mandatory' },
      { name: '@tanstack/table', why: 'Sort · filter · group · pagination · column resize.', tag: 'mandatory' },
      { name: '@tanstack/virtual', why: '400+ projetos sem travar · renderiza só o visível.', tag: 'mandatory' },
      { name: 'ky', why: 'Wrapper de fetch com interceptors (auth, retry). Leve.', tag: 'recommended' },
    ],
  },
  {
    id: 'state',
    icon: <Database size={16} />,
    label: 'State & Forms',
    description: 'Zustand para UI, RHF + Zod para forms.',
    packages: [
      { name: 'zustand', why: 'UI state (sidebar, theme, command palette open). Persist middleware.', tag: 'mandatory' },
      { name: 'react-hook-form', why: 'Performance · mínimo re-render. zodResolver integra com schema.', tag: 'mandatory' },
      { name: 'zod', why: 'Schema único entre form, API e state. Tipo inferido.', tag: 'mandatory' },
    ],
  },
  {
    id: 'ui',
    icon: <Paintbrush size={16} />,
    label: 'UI',
    description: 'shadcn + Radix + Tailwind v4. Acessibilidade resolvida.',
    packages: [
      { name: 'shadcn/ui', why: 'Code-owned · cada componente customizado para TKWS.', tag: 'mandatory' },
      { name: '@radix-ui/*', why: 'Acessibilidade (focus trap, ARIA, keyboard). Don\'t bypass.', tag: 'mandatory' },
      { name: 'tailwindcss', version: '4.x', why: 'Tokens do design system viram utilities.', tag: 'mandatory' },
      { name: 'lucide-react', why: 'Ícones SVG consistentes. NUNCA emoji.', tag: 'mandatory' },
      { name: 'motion', why: 'ex-framer-motion · page transitions · stagger · layout animations.', tag: 'mandatory' },
      { name: 'class-variance-authority', why: 'Type-safe variants em componentes shadcn.', tag: 'recommended' },
      { name: 'tailwind-merge + clsx', why: 'cn() helper · combina classes sem conflito.', tag: 'recommended' },
    ],
  },
  {
    id: 'crud',
    icon: <Box size={16} />,
    label: 'CRUD patterns',
    description: 'Drag-and-drop, command palette, toasts, dropzone.',
    packages: [
      { name: '@dnd-kit/core + sortable', why: 'Kanban acessível · multi-container.', tag: 'mandatory' },
      { name: 'cmdk', why: 'Command palette ⌘K com fuzzy search.', tag: 'mandatory' },
      { name: 'sonner', why: 'Toast stack moderno. shadcn já usa.', tag: 'mandatory' },
      { name: 'react-dropzone', why: 'Drag-and-drop file upload.', tag: 'mandatory' },
      { name: 'vaul', why: 'Drawer mobile-first com drag-to-dismiss.', tag: 'recommended' },
      { name: 'input-otp', why: 'OTP de 6 dígitos · 2FA.', tag: 'recommended' },
      { name: 'react-resizable-panels', why: 'Split panels arrastáveis.', tag: 'recommended' },
    ],
  },
  {
    id: 'charts',
    icon: <Code size={16} />,
    label: 'Charts & Viz',
    description: 'recharts default. Sparklines via @nivo se pesado.',
    packages: [
      { name: 'recharts', why: 'Bar/line/donut/area do Dashboard. API simples. Default.', tag: 'mandatory' },
      { name: '@nivo/sparkline', why: 'Se recharts ficar pesado para sparklines inline.', tag: 'recommended' },
    ],
  },
  {
    id: 'docs',
    icon: <Wrench size={16} />,
    label: 'Documentos & Editor',
    description: 'Tiptap para briefings, react-pdf para orçamentos.',
    packages: [
      { name: '@react-pdf/renderer', why: 'Orçamentos em PDF mantendo o design editorial.', tag: 'recommended' },
      { name: 'xlsx (sheetjs)', why: 'Export do Datatable · importação de planilhas antigas.', tag: 'recommended' },
      { name: '@tiptap/react', why: 'Editor rich text para briefings, atas, observações.', tag: 'recommended' },
    ],
  },
  {
    id: 'dates',
    icon: <Code size={16} />,
    label: 'Dates & Format',
    description: 'date-fns para datas, Intl nativo para números.',
    packages: [
      { name: 'date-fns', why: 'Tree-shakable. formatDistanceToNow para "há 3 dias".', tag: 'mandatory' },
      { name: 'date-fns-tz', why: 'Timezone (Brasil tem 4 fusos).', tag: 'recommended' },
      { name: 'Intl nativo', why: 'Moeda e número. Intl.NumberFormat(\'pt-BR\'). SEM LIB.', tag: 'mandatory' },
      { name: 'react-day-picker', why: 'Calendar standalone. Combina com Popover.', tag: 'mandatory' },
    ],
  },
  {
    id: 'mobile',
    icon: <Smartphone size={16} />,
    label: 'Mobile',
    description: 'Capacitor 6 para iOS/Android com base web.',
    packages: [
      { name: '@capacitor/core', version: '6.x', why: 'iOS/Android com a mesma base web.', tag: 'mandatory' },
      { name: '@capacitor/camera', why: 'Foto de obra.', tag: 'recommended' },
      { name: '@capacitor/filesystem', why: 'Salvar PDF localmente.', tag: 'recommended' },
      { name: '@capacitor/haptics', why: 'Feedback tátil em mobile.', tag: 'recommended' },
      { name: '@capacitor/push-notifications', why: 'Notificações de obra/cliente.', tag: 'recommended' },
    ],
  },
  {
    id: 'test',
    icon: <TestTube size={16} />,
    label: 'Tests & Quality',
    description: 'Vitest + Playwright + MSW + Sentry.',
    packages: [
      { name: 'vitest + @testing-library/react', why: 'Unit + component. Compatível com Vite.', tag: 'mandatory' },
      { name: 'playwright', why: 'E2E. Cobertura iOS via WebKit também.', tag: 'mandatory' },
      { name: 'msw', why: 'Mock API no service worker. Dev sem backend, tests sem fixtures.', tag: 'mandatory' },
      { name: 'biome', why: 'Lint + format. Rápido, zero-config.', tag: 'recommended' },
      { name: '@sentry/react', why: 'Crashes em prod · session replay · performance.', tag: 'recommended' },
      { name: 'posthog-js', why: 'Funnel de uso · feature flags · retention.', tag: 'recommended' },
      { name: '@storybook/react-vite', why: 'Catálogo navegável · onboarding de devs.', tag: 'recommended' },
    ],
  },
]

const antiLibs = [
  { name: 'moment', why: 'Use date-fns' },
  { name: 'lodash', why: 'ES tem nativo: Object.groupBy, Object.fromEntries' },
  { name: 'axios', why: 'ky / ofetch são menores' },
  { name: 'redux', why: 'Zustand é suficiente' },
  { name: 'formik', why: 'React Hook Form é melhor' },
  { name: 'material-ui / chakra', why: 'Conflitam com shadcn' },
  { name: 'framer-motion (nome antigo)', why: 'Use motion (mesma lib)' },
  { name: 'react-icons', why: 'Use lucide-react (consistência visual)' },
]

const tagColor: Record<NonNullable<Pkg['tag']>, 'brand' | 'success' | 'warning'> = {
  core: 'brand',
  mandatory: 'success',
  recommended: 'warning',
}

export function StackPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="P39"
        category="Documentação · Stack"
        title="Stack completa"
        italic="com justificativa"
        description="Antes de adicionar qualquer dep nova, justifique aqui. mandatory = obrigatório · recommended = opcional. Veja anti-libs no rodapé."
        tag={`${groups.reduce((acc, g) => acc + g.packages.length, 0)} packages`}
      />

      <div className="grid gap-5">
        {groups.map((g) => (
          <Card key={g.id}>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
                >
                  {g.icon}
                </span>
                <div>
                  <CardTitle>{g.label}</CardTitle>
                  <div className="mt-0.5 text-[12px]" style={{ color: 'var(--text-soft)' }}>
                    {g.description}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {g.packages.map((p) => (
                  <div
                    key={p.name}
                    className="grid grid-cols-[1fr_auto] items-start gap-3 rounded-md border p-3"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                  >
                    <div>
                      <div className="flex items-baseline gap-2">
                        <code className="mono text-[13px] font-bold" style={{ color: 'var(--brand)' }}>
                          {p.name}
                        </code>
                        {p.version && (
                          <span className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                            {p.version}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                        {p.why}
                      </div>
                    </div>
                    {p.tag && <Badge tone={tagColor[p.tag]}>{p.tag}</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SubHead num="X" title="Anti-libs" italic="NÃO adicionar" />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 max-[760px]:grid-cols-1">
            {antiLibs.map((a) => (
              <div
                key={a.name}
                className="grid grid-cols-[auto_1fr] items-start gap-3 rounded-md border p-3"
                style={{ background: 'rgba(235,87,87,0.06)', borderColor: 'var(--danger)' }}
              >
                <span className="mono text-[12px] font-bold" style={{ color: 'var(--danger)' }}>
                  ✗ {a.name}
                </span>
                <span className="text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                  → {a.why}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
