import { useState } from 'react'
import { Download, Filter, Plus, Search } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { TkwsHeader } from '@/components/tkws/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { KpiMini } from '@/components/tkws/kpi'
import { DealCard, DealLaneTotal, type Deal } from '@/components/tkws/crm-deal-card'
import { SalesFunnel } from '@/components/tkws/crm-pipeline'
import type { AIPrompt } from '@/lib/prompts'

const lanes = [
  { id: 'lead', label: 'Lead', color: 'var(--brand)' },
  { id: 'qualified', label: 'Qualificado', color: 'var(--purple)' },
  { id: 'proposal', label: 'Proposta', color: 'var(--pink)' },
  { id: 'negotiation', label: 'Negociação', color: 'var(--warning)' },
  { id: 'won', label: 'Ganho', color: 'var(--success)' },
]

const allDeals: (Deal & { laneId: string })[] = [
  // Lead
  { id: '1', laneId: 'lead', account: 'FAMÍLIA OZ', title: 'Sky Resort · projeto + decoração 1200m²', value: 1_890_000_000, probability: 25, expectedClose: '14 set', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'cold' },
  { id: '2', laneId: 'lead', account: 'CAMPO BELO INV.', title: 'Edifício comercial SP', value: 670_000_000, probability: 18, expectedClose: '22 out', owner: { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' }, temperature: 'cold' },
  { id: '3', laneId: 'lead', account: 'FAMÍLIA LIMA', title: 'Praia Brava 12 · cobertura', value: 4_200_000_00, probability: 35, expectedClose: '30 ago', owner: { initials: 'JQ', name: 'João Q.', color: 'var(--success)' }, temperature: 'warm', tag: { label: 'Indicação', tone: 'success' } },

  // Qualified
  { id: '4', laneId: 'qualified', account: 'FAMÍLIA COSTA', title: 'Vitra 1801 · Reforma + decoração', value: 420_000_000, probability: 48, expectedClose: '20 ago', owner: { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' }, temperature: 'warm', tag: { label: 'Referência', tone: 'purple' } },
  { id: '5', laneId: 'qualified', account: 'TKWS DEMO', title: 'Catálogo signature', value: 280_000_000, probability: 55, expectedClose: '10 ago', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'warm' },

  // Proposal
  { id: '6', laneId: 'proposal', account: 'WS GROUP', title: 'Cobertura Titanium · 920 m² Premium', value: 950_000_000, probability: 62, expectedClose: '02 jul', owner: { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' }, temperature: 'warm' },
  { id: '7', laneId: 'proposal', account: 'FAMÍLIA NETTO', title: 'Mansão Camboriú', value: 1_450_000_000, probability: 65, expectedClose: '15 jul', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'hot' },

  // Negotiation
  { id: '8', laneId: 'negotiation', account: 'FAMÍLIA ANDRADE', title: 'Yachthouse 2104 · Decoração full', value: 1_250_000_000, probability: 78, expectedClose: '15 jun', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'hot', tag: { label: 'VIP', tone: 'brand' } },

  // Won
  { id: '9', laneId: 'won', account: 'MARINA S.A.', title: 'Marina Park · 14 unidades premium', value: 2_800_000_000, probability: 100, expectedClose: '01 jun', owner: { initials: 'JQ', name: 'João Q.', color: 'var(--success)' }, tag: { label: 'Assinado', tone: 'success' } },
]

const prompt: AIPrompt = {
  componente: 'Pattern · CRM Pipeline',
  import: '// Composição: KPI strip + view switcher Kanban/Funnel + lanes com DealCards + LaneTotal headers',
  contexto:
    'Tela completa do pipeline comercial. View switcher Kanban (operacional) ou Funnel (executivo). Lanes têm header com total + tendência. Cards arrastáveis via @dnd-kit (mock visual aqui). Toda state na URL.',
  quandoUsar: [
    'Visão "Pipeline" do CRM',
    'Reunião comercial semanal · veja Kanban',
    'Reunião executiva · veja Funnel',
  ],
  props: [],
  antiPatterns: [
    'Pipeline sem KPIs no topo · perde leitura rápida',
    'Lane sem total · não mostra contribuição',
    'Mais de 6 lanes · simplifique o funil',
  ],
  exemplo: `// view = 'kanban' | 'funnel'
<Tabs value={view}>
  <TabsList>
    <TabsTrigger value="kanban">Kanban</TabsTrigger>
    <TabsTrigger value="funnel">Funil</TabsTrigger>
  </TabsList>
</Tabs>

// Kanban: lanes × DealCards · DnD via @dnd-kit
// Funnel: SalesFunnel · single view executiva`,
  relacionados: ['DealCard', 'SalesFunnel', 'Kanban'],
}

export function CRMPipelinePattern() {
  const [view, setView] = useState<'kanban' | 'funnel'>('kanban')

  // Funnel stages from deals
  const funnelStages = lanes.map((l, i) => {
    const dealsInLane = allDeals.filter((d) => d.laneId === l.id)
    const total = dealsInLane.reduce((acc, d) => acc + d.value, 0)
    const next = lanes[i + 1]
    const dealsInNext = next ? allDeals.filter((d) => d.laneId === next.id) : []
    const conversion = next && dealsInLane.length > 0 ? Math.round((dealsInNext.length / dealsInLane.length) * 100) : undefined
    return { id: l.id, label: l.label, count: dealsInLane.length, value: total, conversion, color: l.color }
  })

  const totalValue = allDeals.reduce((acc, d) => acc + d.value, 0)
  const weightedValue = allDeals.reduce((acc, d) => acc + (d.value * d.probability) / 100, 0)

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="CRM.P1"
        category="Pattern · CRM Pipeline"
        title="Pipeline comercial"
        italic="Kanban + Funil"
        description="Pipeline com view switcher Kanban/Funnel · lane totals · cards com temperature e probabilidade."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Pipeline completo · veja Kanban ou Funil" />
      <Showcase padding="none" bg="bg">
        <div className="overflow-hidden rounded-[10px]" style={{ background: 'var(--bg)' }}>
          {/* Header */}
          <div className="p-6 max-[760px]:p-4" style={{ background: 'var(--surface-1)' }}>
            <TkwsHeader
              crumb="Comercial · Pipeline"
              title="9 deals ativos"
              italic={`R$ ${(totalValue / 100_000_000).toFixed(1)}M em pipeline`}
              description="Pipeline comercial do trimestre · ponderado por probabilidade"
              actions={
                <>
                  <Button variant="outline" size="sm">
                    <Download size={12} /> Exportar
                  </Button>
                  <Button>
                    <Plus size={14} /> Novo deal
                  </Button>
                </>
              }
            />
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-3 border-b p-6 max-[760px]:grid-cols-2" style={{ borderColor: 'var(--line-1)' }}>
            <KpiMini label="Pipeline total" value={`R$ ${(totalValue / 100_000_000).toFixed(1)}M`} hint={`${allDeals.length} deals`} tone="brand" />
            <KpiMini label="Ponderado" value={`R$ ${(weightedValue / 100_000_000).toFixed(1)}M`} hint="por probabilidade" tone="success" />
            <KpiMini label="Win rate (90d)" value="42%" hint="vs 35% ano anterior" tone="success" />
            <KpiMini label="Ciclo médio" value="62 dias" hint="lead → fechado" tone="warning" />
          </div>

          {/* Toolbar */}
          <div
            className="flex items-center justify-between gap-3 border-b p-4 max-[760px]:flex-col max-[760px]:items-stretch"
            style={{ borderColor: 'var(--line-1)' }}
          >
            <div className="flex flex-1 items-center gap-3">
              <Input icon={<Search size={13} />} placeholder="Buscar deal, conta…" className="max-w-xs !text-[13px]" />
              <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                <TabsList variant="pill">
                  <TabsTrigger value="kanban">Kanban</TabsTrigger>
                  <TabsTrigger value="funnel">Funil</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter size={12} /> Filtros
              </Button>
              <Badge tone="brand">Squad: todos</Badge>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 max-[760px]:p-4">
            {view === 'kanban' ? (
              <div className="overflow-x-auto">
                <div
                  className="grid gap-3"
                  style={{ gridTemplateColumns: `repeat(${lanes.length}, minmax(240px, 1fr))`, minWidth: lanes.length * 240 }}
                >
                  {lanes.map((lane) => {
                    const dealsInLane = allDeals.filter((d) => d.laneId === lane.id)
                    const total = dealsInLane.reduce((acc, d) => acc + d.value, 0)
                    return (
                      <div key={lane.id} className="flex flex-col gap-3">
                        {/* Lane header com total */}
                        <DealLaneTotal label={lane.label} count={dealsInLane.length} total={total} />
                        {/* Cards */}
                        <div className="flex flex-col gap-2">
                          {dealsInLane.map((d) => (
                            <DealCard key={d.id} deal={d} />
                          ))}
                          {dealsInLane.length === 0 && (
                            <div
                              className="rounded-[10px] border border-dashed py-6 text-center"
                              style={{ borderColor: 'var(--line-2)' }}
                            >
                              <span className="mono text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                                vazio · arraste para cá
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <SalesFunnel stages={funnelStages} />
            )}
          </div>
        </div>
      </Showcase>
    </div>
  )
}
