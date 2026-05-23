import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Kanban, type KanbanLane, type KanbanCard } from '@/components/tkws/kanban'
import type { AIPrompt } from '@/lib/prompts'

const lanes: KanbanLane[] = [
  { id: 'briefing', title: 'Briefing', tone: 'neutral' },
  { id: 'budget', title: 'Orçamento', tone: 'brand' },
  { id: 'obra', title: 'Em obra', tone: 'warning' },
  { id: 'delivered', title: 'Entregue', tone: 'success' },
]

const cards: KanbanCard[] = [
  { id: 'c1', title: 'Yachthouse 2104', meta: '#2410 · F. Andrade', badge: { label: 'Atrasado', tone: 'danger' }, laneId: 'obra' },
  { id: 'c2', title: 'Cobertura Titanium', meta: '#2411 · WS Group', badge: { label: 'No prazo', tone: 'success' }, laneId: 'obra' },
  { id: 'c3', title: 'Vitra 1801', meta: '#2412 · F. Costa', badge: { label: 'Em revisão', tone: 'brand' }, laneId: 'budget' },
  { id: 'c4', title: 'Sky Resort', meta: '#2413 · F. Oz', laneId: 'budget' },
  { id: 'c5', title: 'Campo Belo SP', meta: '#2414 · Campo Belo Inv.', laneId: 'briefing' },
  { id: 'c6', title: 'Marina Park', meta: '#2401 · Marina S.A.', badge: { label: 'Entregue', tone: 'success' }, laneId: 'delivered' },
  { id: 'c7', title: 'Praia Brava 12', meta: '#2402 · F. Lima', laneId: 'briefing' },
]

const prompt: AIPrompt = {
  componente: 'Kanban',
  import: "import { Kanban } from '@/components/tkws/kanban'",
  contexto:
    'Quadro Kanban com drag-and-drop via @dnd-kit/core (acessível). Para projetos: lanes = status, cards = projetos. Sempre suba o estado para um hook (TanStack Query mutation) ao mover. Use Kanban Rich (futuro) quando precisar de swimlanes (squad x status).',
  quandoUsar: [
    'Workflow visual de status (CRM, projetos, atividades)',
    'Quando o usuário deveria poder reordenar fácil',
    'Vista "Kanban" do view switcher',
  ],
  props: [
    { name: 'lanes', type: 'KanbanLane[]', description: 'Colunas · cada uma com title e tone' },
    { name: 'cards', type: 'KanbanCard[]', description: 'Cards distribuídos pelo laneId' },
    { name: 'onChange', type: '(cards) => void', description: 'Callback ao mover · dispara mutation' },
  ],
  antiPatterns: [
    'Kanban sem persistência da posição',
    'Cards de tamanho variável extremo · quebra o ritmo visual',
    'Kanban em mobile portrait · scroll horizontal vira ruim · vire List',
  ],
  exemplo: `const { mutate } = useMutation({ mutationFn: updateStatuses })

<Kanban
  lanes={[
    { id: 'briefing', title: 'Briefing' },
    { id: 'obra', title: 'Em obra', tone: 'warning' },
    { id: 'done', title: 'Entregue', tone: 'success' }
  ]}
  cards={projects}
  onChange={(next) => mutate(next)}
/>`,
  relacionados: ['RichList', 'DataTable', 'BulkActionBar'],
}

export function KanbanPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="11.5"
        category="Data Display · Kanban"
        title="Kanban"
        italic="drag-and-drop acessível"
        description="@dnd-kit/core. Cards arrastáveis entre lanes. Acessível via teclado (Tab + Space + setas)."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="4 lanes · arraste os cards" />
      <Showcase padding="comfortable">
        <Kanban lanes={lanes} cards={cards} />
      </Showcase>
    </div>
  )
}
