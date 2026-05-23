import { CheckCircle2, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AIPrompt } from '@/lib/prompts'

interface Recipe {
  num: string
  title: string
  italic?: string
  intro: string
  steps: { title: string; description: string; code?: string }[]
}

const recipes: Recipe[] = [
  {
    num: '01',
    title: 'Nova tela de listagem',
    italic: '(ex: Projetos)',
    intro: 'Construa uma tela index do zero seguindo o padrão TKWS · view switcher + filter sidebar + DataTable.',
    steps: [
      { title: 'Schema Zod primeiro', description: 'Defina o tipo do dado · projeto, cliente, fornecedor.', code: "export const projectSchema = z.object({\n  id: z.string().uuid(),\n  code: z.string().regex(/^\\d{4}$/),\n  name: z.string().min(3).max(80)\n})" },
      { title: 'Hook TanStack Query', description: 'Crie useProjects() com filtros via search params.', code: "export function useProjects(filters) {\n  return useQuery({\n    queryKey: ['projects', filters],\n    queryFn: () => api.get('/projects', { searchParams: filters })\n  })\n}" },
      { title: 'Route TanStack', description: 'Rota file-based em /routes/_authed/projetos.tsx.', code: 'export const Route = createFileRoute(\'/_authed/projetos\')({\n  component: ProjectsPage,\n  validateSearch: searchSchema\n})' },
      { title: 'Layout · TkwsHeader', description: 'Crumb · título editorial · actions Exportar + Novo.' },
      { title: 'KPI strip', description: '4 KpiMini com totais (no prazo · atrasados · em revisão · margem).' },
      { title: 'View switcher · Tabs', description: 'Pill tabs Kanban/List/Table · controla search param view.' },
      { title: 'Filter sidebar + Active chips', description: 'Squad · Status · Valor · UF · todos persistidos na URL.' },
      { title: 'Empty + Loading + Error', description: 'Trate isPending (Skeleton), isError (EmptyState danger), data?.length === 0 (EmptyState brand).' },
      { title: 'Testes Playwright', description: 'Cobertura: lista carrega, filtros aplicam, view muda, paginação avança.' },
    ],
  },
  {
    num: '02',
    title: 'Nova tela de detalhe',
    italic: '(ex: Projeto com tabs)',
    intro: 'Detail screen com DetailHero + 5-7 tabs underline. Cada tab é um sub-componente.',
    steps: [
      { title: 'Rota com $id', description: 'routes/_authed/projetos.$id.tsx · validateSearch p/ tab ativa.' },
      { title: 'DetailHero', description: 'Cover (render) + título Fraunces + status Badge + 4 KPIs meta + actions.' },
      { title: 'Tabs underline', description: '7 tabs: Visão Geral · Briefing · Orçamento · Financeiro · Obra · Documentos · Equipe.' },
      { title: 'Visão Geral · grid 12-col', description: 'KPIs hero + Progresso por etapa + Squad card + Atividade timeline.' },
      { title: 'Tabs lazy-loaded', description: 'TabsContent só carrega quando ativo · usa React.lazy() se pesado.' },
      { title: 'Sheet de edição', description: 'Botão Editar abre Sheet · não muda de rota.' },
    ],
  },
  {
    num: '03',
    title: 'Wizard de criação',
    italic: '(ex: Novo projeto · 4 etapas)',
    intro: 'Multi-step com validação por step + autosave + review final.',
    steps: [
      { title: 'Estado global · context', description: 'Crie NewProjectContext com state acumulado entre steps.' },
      { title: 'WizardSteps stepper', description: 'Mostra 5 etapas · click em anteriores volta · futuros bloqueados.' },
      { title: 'Validação por step', description: 'Zod schema separado por step · só avança se safeParse passar.' },
      { title: 'Autosave a cada 3s', description: 'TanStack mutation com debounce · indicador "salvo há Xs" no rodapé.' },
      { title: 'Step Review · read-only', description: 'Mostra TUDO preenchido com Editar por seção. Alert avisa implicações.' },
      { title: 'Submit final', description: 'POST /projetos · onSuccess invalida queries + toast.success + navigate para detail.' },
    ],
  },
  {
    num: '04',
    title: 'Edit drawer rápido',
    italic: '(ex: Editar item da lista)',
    intro: 'Sheet lateral com form que salva sem sair do contexto.',
    steps: [
      { title: 'State controlado', description: 'const [editing, setEditing] = useState<Item | null>(null)' },
      { title: 'Sheet com side="right"', description: 'Aberto quando editing !== null.' },
      { title: 'react-hook-form + zodResolver', description: 'Form vinculado ao schema · defaultValues do item.' },
      { title: 'Optimistic update', description: 'mutation onMutate atualiza cache antes da resposta.' },
      { title: 'Fecha + toast no success', description: 'setEditing(null) + toast.success("Salvo")' },
    ],
  },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Recipe Screens',
  import: '// Cookbook · receitas passo-a-passo para construir telas TKWS comuns',
  contexto:
    'Cookbook do TKWS OS · receitas passo-a-passo para construir telas comuns. Cada receita lista os passos em ordem, com snippets de código. Use como referência ao começar uma nova feature.',
  quandoUsar: [
    'Construir tela nova · siga uma receita',
    'Onboarding de dev novo · leia as 4 receitas principais',
    'Treinamento · workshop interno',
  ],
  props: [],
  antiPatterns: [
    'Construir tela sem seguir receita · inventa padrão novo',
    'Pular validação por step em Wizard',
  ],
  exemplo: `// Antes de começar, abra a receita certa
// Recipe 01: nova listagem
// Recipe 02: novo detalhe
// Recipe 03: wizard
// Recipe 04: edit drawer`,
  relacionados: ['BestPractices', 'ProjectList', 'ProjectDetail'],
}

export function RecipeScreensPattern() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="P34"
        category="Pattern · Recipe Screens"
        title="Cookbook · receitas de tela"
        italic="passo-a-passo"
        description="4 receitas para construir telas comuns do TKWS. Siga a ordem · não invente padrão novo."
        tag={`${recipes.length} receitas`}
      />
      <PromptCard prompt={prompt} />

      {recipes.map((r) => (
        <section key={r.num} className="mt-6">
          <SubHead num={r.num} title={r.title} italic={r.italic} tag={`${r.steps.length} passos`} />
          <Card>
            <CardHeader>
              <CardTitle>Receita {r.num}</CardTitle>
              <Badge tone="brand">{r.steps.length} steps</Badge>
            </CardHeader>
            <CardContent>
              <p className="mb-5 text-[13.5px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                {r.intro}
              </p>

              <ol className="grid gap-3">
                {r.steps.map((s, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[36px_1fr] items-start gap-3 rounded-lg border p-4"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                  >
                    <span
                      className="mono inline-flex h-7 w-7 items-center justify-center rounded-full font-bold"
                      style={{ background: 'var(--brand)', color: 'var(--bg)' }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h5 className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>
                        {s.title}
                      </h5>
                      <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                        {s.description}
                      </p>
                      {s.code && (
                        <pre
                          className="mono mt-3 overflow-x-auto rounded-md p-3 text-[11px] leading-relaxed"
                          style={{ background: 'var(--bg)', color: 'var(--text-soft)' }}
                        >
                          <code>{s.code}</code>
                        </pre>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-4 flex items-center gap-2 rounded-md border p-3" style={{ background: 'rgba(95,217,165,0.06)', borderColor: 'var(--success)' }}>
                <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                <span className="text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                  Receita aprovada para uso em produção · revisada pelo time de design system
                </span>
                <ChevronRight size={12} style={{ color: 'var(--text-mute)' }} className="ml-auto" />
              </div>
            </CardContent>
          </Card>
        </section>
      ))}
    </div>
  )
}
