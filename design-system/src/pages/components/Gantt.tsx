import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Gantt, type GanttTask } from '@/components/tkws/gantt'
import type { AIPrompt } from '@/lib/prompts'

const periods = ['Mar W1', 'Mar W2', 'Mar W3', 'Mar W4', 'Abr W1', 'Abr W2', 'Abr W3', 'Abr W4']

const tasks: GanttTask[] = [
  { id: '1', name: 'Demolição', assignee: 'Equipe Vasconcelos', startCol: 0, span: 2, progress: 100, tone: 'success' },
  { id: '2', name: 'Hidráulica', assignee: 'Squad Orion', startCol: 1, span: 3, progress: 80, tone: 'success' },
  { id: '3', name: 'Marcenaria sob medida', assignee: 'Forn. Sereno', startCol: 2, span: 4, progress: 45, tone: 'warning' },
  { id: '4', name: 'Pisos e acabamentos', assignee: 'Equipe Lima', startCol: 4, span: 3, progress: 10, tone: 'brand' },
  { id: '5', name: 'Iluminação cênica', assignee: 'Lúmen', startCol: 5, span: 2, progress: 0, tone: 'purple' },
  { id: '6', name: 'Mobiliário e decor', assignee: 'Squad Orion', startCol: 6, span: 2, progress: 0, tone: 'pink' },
  { id: '7', name: 'Granito São Gabriel (atrasado)', assignee: 'Forn. Marmoraria', startCol: 3, span: 1, progress: 30, tone: 'danger' },
]

const prompt: AIPrompt = {
  componente: 'Gantt',
  import: "import { Gantt, type GanttTask } from '@/components/tkws/gantt'",
  contexto:
    'Cronograma de obra · linha do tempo por tarefa com progresso e tone semântico (danger = atrasado). Use periods como semanas/quinzenas · não dias individuais para projetos longos.',
  quandoUsar: [
    'Cronograma de obra · resumo executivo',
    'Planejamento por entregáveis (Briefing → Orçamento → Contrato)',
    'Detalhe de projeto · aba "Obra"',
  ],
  props: [
    { name: 'periods', type: 'string[]', description: 'Colunas de tempo (semanas, quinzenas, meses)' },
    { name: 'tasks', type: 'GanttTask[]', description: '{ id, name, startCol, span, progress?, tone?, assignee? }' },
    { name: 'labelWidth', type: 'number', description: 'Largura da coluna de label · default 200px' },
  ],
  antiPatterns: [
    'Gantt com 100+ tarefas · vire DataTable agrupado',
    'Dias individuais em obra de 6 meses · use semanas',
    'Sem cor semântica em atrasos · perde leitura rápida',
  ],
  exemplo: `<Gantt
  periods={['Mar W1','Mar W2','Mar W3','Mar W4']}
  tasks={[
    { id: '1', name: 'Marcenaria', startCol: 1, span: 2, progress: 65, tone: 'warning', assignee: 'Forn. Sereno' }
  ]}
/>`,
  relacionados: ['Timeline', 'Kanban'],
}

export function GanttPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="18.3"
        category="Charts · Gantt"
        title="Gantt"
        italic="cronograma de obra"
        description="Linha do tempo por tarefa. Use periods em semanas/quinzenas, tone semântico para destacar atrasos."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Yachthouse 2104 · obra · 8 semanas" />
      <Showcase padding="none">
        <Gantt periods={periods} tasks={tasks} />
      </Showcase>
    </div>
  )
}
