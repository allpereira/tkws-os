import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const lanes = ['Briefing', 'Orçamento', 'Em obra', 'Entregando']
const wipLimits = [5, 8, 12, 4]
const squads = [
  { id: 'orion', name: 'Squad Orion', tone: 'purple' as BadgeTone, leader: 'Lucas Z.' },
  { id: 'apollo', name: 'Squad Apollo', tone: 'pink' as BadgeTone, leader: 'Ana V.' },
  { id: 'neptune', name: 'Squad Neptune', tone: 'brand' as BadgeTone, leader: 'João Q.' },
]

const data: Record<string, Record<string, { id: string; title: string; client: string; tone: BadgeTone }[]>> = {
  orion: {
    Briefing: [{ id: '1', title: 'Cobertura Vitra · 1801', client: 'F. Costa', tone: 'neutral' }],
    Orçamento: [{ id: '2', title: 'Sky Resort', client: 'F. Oz', tone: 'brand' }],
    'Em obra': [
      { id: '3', title: 'Yachthouse 2104', client: 'F. Andrade', tone: 'danger' },
      { id: '4', title: 'Cobertura Titanium', client: 'WS Group', tone: 'success' },
    ],
    Entregando: [{ id: '5', title: 'Marina Park', client: 'Marina S.A.', tone: 'success' }],
  },
  apollo: {
    Briefing: [
      { id: '6', title: 'Campo Belo SP', client: 'Campo Belo Inv.', tone: 'neutral' },
      { id: '7', title: 'Praia Brava 12', client: 'F. Lima', tone: 'neutral' },
    ],
    Orçamento: [{ id: '8', title: 'Vitra 1801', client: 'F. Costa', tone: 'warning' }],
    'Em obra': [],
    Entregando: [],
  },
  neptune: {
    Briefing: [],
    Orçamento: [],
    'Em obra': [{ id: '9', title: 'Costa Verde 22', client: 'F. Verde', tone: 'success' }],
    Entregando: [],
  },
}

const prompt: AIPrompt = {
  componente: 'Pattern · Kanban Rich (swimlanes + WIP limit)',
  import: '// Composição: Grid swimlanes × lanes + WIP limit por lane + DnD por @dnd-kit',
  contexto:
    'Kanban avançado com swimlanes horizontais (Squad Orion · Apollo · Neptune) e lanes verticais (Briefing · Orçamento · Obra · Entrega). WIP LIMIT é o número MÁXIMO de cards permitidos por lane — destaque visual quando atinge. Use para portfólio operacional do escritório.',
  quandoUsar: [
    'Portfólio do escritório com 3-5 squads',
    'Quando lane × squad importa (alocação visual)',
    'Quando WIP limit precisa ser respeitado (princípio do flow)',
  ],
  props: [],
  antiPatterns: [
    'Kanban swimlanes com 8+ squads · vira ruim · vire DataTable',
    'WIP limit sem destaque visual quando atingido · perde valor',
    'Sem totais por lane',
  ],
  exemplo: `<KanbanRich
  swimlanes={squads}
  lanes={['Briefing','Orçamento','Em obra','Entregando']}
  wipLimits={[5, 8, 12, 4]}
  cards={cards}
  onMove={mutate}
/>`,
  relacionados: ['Kanban', 'RichList'],
}

export function KanbanSwimlanesPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P07.1"
        category="Pattern · Kanban Rich"
        title="Kanban com swimlanes + WIP"
        italic="squad × status"
        description="Kanban avançado com squads como swimlanes horizontais e WIP limit por lane. Destaca visualmente lanes saturadas."
        tag="multi-dimensional"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Portfólio operacional · 3 squads × 4 lanes" />
      <Showcase padding="comfortable">
        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            {/* Header de lanes */}
            <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-2 mb-3">
              <div />
              {lanes.map((lane, i) => (
                <div
                  key={lane}
                  className="rounded-lg border px-3 py-2"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}
                >
                  <div className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                    {lane}
                  </div>
                  <div className="mt-1 text-[11px]" style={{ color: 'var(--text-soft)' }}>
                    WIP limit: <b style={{ color: 'var(--text)' }}>{wipLimits[i]}</b>
                  </div>
                </div>
              ))}
            </div>

            {/* Swimlanes */}
            {squads.map((s) => {
              return (
                <div key={s.id} className="grid grid-cols-[200px_repeat(4,1fr)] gap-2 mb-3">
                  {/* Squad header */}
                  <div
                    className="flex items-center gap-2.5 rounded-lg border p-3"
                    style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
                  >
                    <Avatar size="md" style={{ background: `var(--${s.tone === 'neutral' ? 'text-mute' : s.tone})` }}>
                      <AvatarFallback>{s.name.split(' ')[1].slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <div className="text-[12.5px] font-bold" style={{ color: 'var(--text)' }}>
                        {s.name}
                      </div>
                      <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                        {s.leader}
                      </div>
                    </div>
                  </div>

                  {/* Cells por lane */}
                  {lanes.map((lane, li) => {
                    const cards = data[s.id]?.[lane] ?? []
                    const limit = wipLimits[li]
                    const overWip = cards.length > limit!
                    const atWip = cards.length === limit
                    return (
                      <div
                        key={lane}
                        className={cn(
                          'flex min-h-[120px] flex-col gap-1.5 rounded-lg border p-2',
                          overWip && 'ring-2 ring-[var(--danger)]'
                        )}
                        style={{
                          background: overWip
                            ? 'rgba(235,87,87,0.06)'
                            : atWip
                            ? 'rgba(242,201,76,0.06)'
                            : 'var(--surface-1)',
                          borderColor: overWip ? 'var(--danger)' : atWip ? 'var(--warning)' : 'var(--line-1)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="mono text-[10px] font-bold"
                            style={{ color: overWip ? 'var(--danger)' : atWip ? 'var(--warning)' : 'var(--text-mute)' }}
                          >
                            {cards.length}/{limit}
                          </span>
                          {overWip && <Badge tone="danger">+1 WIP</Badge>}
                        </div>
                        {cards.map((c) => (
                          <Card key={c.id} className="!p-2.5">
                            <div className="text-[12px] font-semibold" style={{ color: 'var(--text)' }}>
                              {c.title}
                            </div>
                            <div className="mono mt-0.5 text-[10px]" style={{ color: 'var(--text-mute)' }}>
                              {c.client}
                            </div>
                            <div className="mt-1.5">
                              <Badge tone={c.tone}>{c.tone === 'danger' ? 'Atraso' : c.tone === 'success' ? 'OK' : c.tone === 'warning' ? 'Risco' : c.tone === 'brand' ? 'Revisão' : 'Novo'}</Badge>
                            </div>
                          </Card>
                        ))}
                        <Button variant="ghost" size="sm" className="!h-7 !text-[10px]">
                          <Plus size={10} /> Adicionar
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </Showcase>
    </div>
  )
}
