import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Filter,
  GripVertical,
  Keyboard,
  LayoutGrid,
  List as ListIcon,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { KpiMini } from '@/components/tkws/kpi'
import { LeadScore, type LeadTemperature } from '@/components/tkws/crm-lead-score'
import { cn, formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

interface Opp {
  id: string
  account: string
  title: string
  value: number
  probability: number
  expectedClose: string
  owner: { initials: string; name: string; color: string }
  temperature: LeadTemperature
  tag?: { label: string; tone: 'brand' | 'success' | 'warning' | 'danger' | 'purple' | 'pink' }
  lastTouch: string
  /** Sem toque há X dias · puxa atenção */
  staleDays?: number
}

interface Lane {
  id: string
  label: string
  color: string
  wipLimit?: number
}

const lanes: Lane[] = [
  { id: 'lead', label: 'Lead', color: 'var(--brand)' },
  { id: 'qualified', label: 'Qualificado', color: 'var(--purple)' },
  { id: 'proposal', label: 'Proposta', color: 'var(--pink)', wipLimit: 8 },
  { id: 'negotiation', label: 'Negociação', color: 'var(--warning)' },
  { id: 'won', label: 'Ganho', color: 'var(--success)' },
]

const seed: Record<string, Opp[]> = {
  lead: [
    { id: 'o1', account: 'FAMÍLIA OZ', title: 'Sky Resort · 1200 m² turnkey', value: 18_900_000_00, probability: 25, expectedClose: '14 set', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'cold', lastTouch: 'há 4 dias', staleDays: 4 },
    { id: 'o2', account: 'CAMPO BELO INV.', title: 'Edifício comercial · SP', value: 6_700_000_00, probability: 18, expectedClose: '22 out', owner: { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' }, temperature: 'cold', lastTouch: 'há 7 dias', staleDays: 7 },
    { id: 'o3', account: 'FAMÍLIA LIMA', title: 'Praia Brava 12 · cobertura', value: 4_200_000_00, probability: 35, expectedClose: '30 ago', owner: { initials: 'JQ', name: 'João Q.', color: 'var(--success)' }, temperature: 'warm', tag: { label: 'Indicação', tone: 'success' }, lastTouch: 'ontem' },
  ],
  qualified: [
    { id: 'o4', account: 'FAMÍLIA COSTA', title: 'Vitra 1801 · Reforma + decoração', value: 4_200_000_00, probability: 48, expectedClose: '20 ago', owner: { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' }, temperature: 'warm', tag: { label: 'Referência', tone: 'purple' }, lastTouch: 'hoje' },
    { id: 'o5', account: 'TKWS DEMO', title: 'Catálogo signature', value: 2_800_000_00, probability: 55, expectedClose: '10 ago', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'warm', lastTouch: 'hoje' },
  ],
  proposal: [
    { id: 'o6', account: 'WS GROUP', title: 'Cobertura Titanium · 920 m²', value: 9_500_000_00, probability: 62, expectedClose: '02 jul', owner: { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' }, temperature: 'warm', lastTouch: '2h' },
    { id: 'o7', account: 'FAMÍLIA NETTO', title: 'Mansão Camboriú', value: 14_500_000_00, probability: 65, expectedClose: '15 jul', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'hot', lastTouch: '40min' },
  ],
  negotiation: [
    { id: 'o8', account: 'FAMÍLIA ANDRADE', title: 'Yachthouse 2104 · Decoração full', value: 12_500_000_00, probability: 78, expectedClose: '15 jun', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'hot', tag: { label: 'VIP', tone: 'brand' }, lastTouch: 'agora' },
  ],
  won: [
    { id: 'o9', account: 'MARINA S.A.', title: 'Marina Park · 14 unidades premium', value: 28_000_000_00, probability: 100, expectedClose: '01 jun', owner: { initials: 'JQ', name: 'João Q.', color: 'var(--success)' }, temperature: 'hot', tag: { label: 'Assinado', tone: 'success' }, lastTouch: 'ontem' },
  ],
}

const prompt: AIPrompt = {
  componente: 'Pattern · CRM Oportunidades · Kanban',
  import: '// Composição: KPI strip + toolbar com view switcher + lanes drag-friendly + quick-add inline + hot row de hover actions',
  contexto:
    'Tela operacional do comercial. Foco em mínima digitação · máxima velocidade. Drag handle visível no hover, "Avançar etapa" via dropdown inline (sem precisar arrastar), quick-add inline em cada lane, sugestão Lúmen no card mais quente, KBD hints (J/K/Enter/⌘K). Cards marcam stale (>3d sem toque) com ponto vermelho.',
  quandoUsar: [
    'Visão padrão do comercial · home do squad',
    'Reunião diária de pipeline · stand-up comercial',
    'Quando o usuário precisa mover 5+ deals por dia entre etapas',
  ],
  props: [],
  antiPatterns: [
    'Cards sem affordance de drag · usuário tenta arrastar e não sabe se é possível',
    'Forçar drag-only para mudar etapa · sempre ofereça dropdown rápido também',
    'Lane sem total agregado e contagem · perde leitura executiva',
    'Quick-add escondido em modal · força contexto-switch desnecessário',
    'Sem indicador de stale · deals esquecidos não emergem visualmente',
  ],
  exemplo: `<KanbanLane lane={lane}>
  {opps.map((o) => (
    <OppCard
      opp={o}
      onAdvance={() => moveStage(o.id, nextStage)}
      onWhatsapp={() => openChat(o)}
    />
  ))}
  <QuickAddRow placeholder="+ Nova oportunidade · ⏎" />
</KanbanLane>`,
  relacionados: ['CRMPipeline', 'DealCard', 'StageStepper', 'Kanban'],
}

const allOwners = [
  { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' },
  { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' },
  { initials: 'JQ', name: 'João Q.', color: 'var(--success)' },
]

export function CRMOpportunitiesKanbanPattern() {
  const [data, setData] = useState(seed)
  const [selectedId, setSelectedId] = useState<string | null>('o8')

  const totals = useMemo(() => {
    const all = Object.values(data).flat()
    const total = all.reduce((acc, o) => acc + o.value, 0)
    const weighted = all.reduce((acc, o) => acc + (o.value * o.probability) / 100, 0)
    const hot = all.filter((o) => o.temperature === 'hot').length
    const stale = all.filter((o) => (o.staleDays ?? 0) >= 3).length
    return { total, weighted, hot, stale, count: all.length }
  }, [data])

  const moveStage = (oppId: string, fromLane: string, toLane: string) => {
    setData((prev) => {
      const opp = prev[fromLane].find((o) => o.id === oppId)
      if (!opp) return prev
      const next = { ...prev }
      next[fromLane] = prev[fromLane].filter((o) => o.id !== oppId)
      next[toLane] = [{ ...opp }, ...prev[toLane]]
      return next
    })
    const targetLabel = lanes.find((l) => l.id === toLane)?.label
    toast.success(`Movido para ${targetLabel}`)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="CRM.P4"
        category="Pattern · Oportunidades · Kanban"
        title="Oportunidades"
        italic="kanban operacional"
        description="Tela diária do comercial. Drag-handle visível, dropdown de etapa inline, quick-add em cada lane e marcação automática de deals esquecidos. Mínima digitação · máxima velocidade."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Oportunidades · operação comercial diária" />
      <Showcase padding="none" bg="bg">
        <div className="overflow-hidden rounded-[10px]" style={{ background: 'var(--bg)' }}>
          {/* Header */}
          <div className="border-b p-6 max-[760px]:p-4" style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex-1">
                <div className="mono text-[10.5px] font-semibold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                  Comercial · Oportunidades
                </div>
                <h1 className="serif mt-1.5 text-[30px] font-normal leading-[1.1]" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                  {totals.count} deals
                  <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>
                    {' '}
                    · R$ {(totals.total / 100_00).toFixed(1).replace('.', ',')}M em pipeline
                  </em>
                </h1>
                <div className="mt-1.5 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                  Squad Orion · trimestre Q2 · meta R$ 8,5M
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Keyboard size={12} /> Atalhos
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className="grid gap-1 text-[11px]">
                      <div className="flex items-center justify-between gap-3"><span>Buscar</span> <Kbd>⌘K</Kbd></div>
                      <div className="flex items-center justify-between gap-3"><span>Próximo card</span> <Kbd>J</Kbd></div>
                      <div className="flex items-center justify-between gap-3"><span>Avançar etapa</span> <Kbd>→</Kbd></div>
                      <div className="flex items-center justify-between gap-3"><span>Nova oportunidade</span> <Kbd>N</Kbd></div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                <Button>
                  <Plus size={14} /> Nova oportunidade <Kbd className="ml-1.5">N</Kbd>
                </Button>
              </div>
            </div>
          </div>

          {/* KPI strip · 4 col compactos */}
          <div className="grid grid-cols-4 gap-3 border-b p-6 max-[760px]:grid-cols-2" style={{ borderColor: 'var(--line-1)' }}>
            <KpiMini label="Pipeline" value={`R$ ${(totals.total / 100_00).toFixed(1).replace('.', ',')}M`} hint={`${totals.count} deals ativos`} tone="brand" />
            <KpiMini label="Ponderado" value={`R$ ${(totals.weighted / 100_00).toFixed(1).replace('.', ',')}M`} hint="por probabilidade" tone="success" />
            <KpiMini label="Deals quentes" value={String(totals.hot)} hint="ação urgente" tone="danger" />
            <KpiMini label="Sem toque +3d" value={String(totals.stale)} hint="precisam follow-up" tone="warning" />
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b p-4" style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}>
            <div className="flex flex-1 items-center gap-2">
              <Input icon={<Search size={13} />} placeholder="Buscar deal, cliente, valor… (⌘K)" className="max-w-md flex-1 !text-[13px]" />
              <Tabs value="kanban">
                <TabsList variant="pill">
                  <TabsTrigger value="kanban"><LayoutGrid size={12} /> Kanban</TabsTrigger>
                  <TabsTrigger value="list"><ListIcon size={12} /> Lista</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Owner: todos <ChevronDown size={11} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por owner</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Meus deals</DropdownMenuItem>
                  {allOwners.map((o) => (
                    <DropdownMenuItem key={o.initials}>{o.name}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm">
                <Filter size={12} /> Filtros
              </Button>
              <Badge tone="warning">{totals.stale} esquecidos</Badge>
            </div>
          </div>

          {/* Board */}
          <div className="overflow-x-auto p-5 max-[760px]:p-3">
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: `repeat(${lanes.length}, minmax(260px, 1fr))`, minWidth: lanes.length * 260 }}
            >
              {lanes.map((lane, laneIdx) => {
                const opps = data[lane.id] ?? []
                const total = opps.reduce((acc, o) => acc + o.value, 0)
                const nextLane = lanes[laneIdx + 1]
                const overWip = lane.wipLimit && opps.length > lane.wipLimit

                return (
                  <section key={lane.id} className="flex flex-col gap-2.5">
                    {/* Lane header · sticky-feel · borda colorida no topo */}
                    <header
                      className="rounded-[10px] border p-3"
                      style={{
                        background: 'var(--surface-2)',
                        borderColor: 'var(--line-1)',
                        boxShadow: `inset 0 3px 0 ${lane.color}`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="mono text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: lane.color }}>
                          {lane.label} · {opps.length}
                        </div>
                        {overWip && (
                          <Badge tone="warning">WIP &gt;{lane.wipLimit}</Badge>
                        )}
                      </div>
                      <div className="num-tabular serif mt-1 text-[18px] font-normal leading-none" style={{ color: 'var(--text)' }}>
                        {formatCurrency(total / 100)}
                      </div>
                    </header>

                    {/* Cards */}
                    <div className="flex flex-col gap-2">
                      {opps.map((o) => {
                        const selected = o.id === selectedId
                        const probTone: 'success' | 'warning' | 'danger' | 'brand' =
                          o.probability >= 70 ? 'success' : o.probability >= 40 ? 'warning' : o.probability >= 20 ? 'brand' : 'danger'

                        return (
                          <article
                            key={o.id}
                            onClick={() => setSelectedId(o.id)}
                            className={cn(
                              'group relative cursor-pointer rounded-[12px] border p-3 transition-all',
                              'hover:-translate-y-0.5 hover:shadow-md',
                              selected && 'shadow-md'
                            )}
                            style={{
                              background: 'var(--surface-1)',
                              borderColor: selected ? 'var(--brand)' : 'var(--line-2)',
                            }}
                          >
                            {/* Drag handle · visível só no hover */}
                            <button
                              aria-label="Arrastar"
                              onClick={(e) => e.stopPropagation()}
                              className="absolute top-2 left-1 flex h-6 w-4 cursor-grab items-center justify-center opacity-0 transition-opacity group-hover:opacity-60 active:cursor-grabbing"
                              style={{ color: 'var(--text-mute)' }}
                            >
                              <GripVertical size={13} />
                            </button>

                            {/* Stale dot · canto sup. direito */}
                            {(o.staleDays ?? 0) >= 3 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span
                                    className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full"
                                    style={{ background: 'var(--danger)', boxShadow: '0 0 0 3px var(--bg)' }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent side="left">Sem toque há {o.staleDays} dias</TooltipContent>
                              </Tooltip>
                            )}

                            {/* Header · conta + título */}
                            <header className="pl-3">
                              <div className="mono text-[9.5px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                                {o.account}
                              </div>
                              <h4
                                className="serif mt-0.5 line-clamp-2 text-[14px] font-normal leading-tight"
                                style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
                              >
                                {o.title}
                              </h4>
                            </header>

                            {/* Valor + temperatura */}
                            <div className="mt-3 flex items-end justify-between gap-2 pl-3">
                              <div>
                                <div className="num-tabular serif text-[20px] font-normal leading-none" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                                  {formatCurrency(o.value / 100)}
                                </div>
                                <div className="mono mt-1 text-[10px]" style={{ color: 'var(--text-mute)' }}>
                                  fechar · {o.expectedClose}
                                </div>
                              </div>
                              <LeadScore temperature={o.temperature} size="sm" />
                            </div>

                            {/* Probabilidade */}
                            <div className="mt-3 pl-3">
                              <div className="mb-1 flex items-center justify-between text-[10px]">
                                <span className="mono uppercase tracking-[1.1px]" style={{ color: 'var(--text-mute)' }}>
                                  Probabilidade
                                </span>
                                <span className="mono font-bold" style={{ color: 'var(--text)' }}>
                                  {o.probability}%
                                </span>
                              </div>
                              <Progress value={o.probability} tone={probTone} />
                            </div>

                            {/* Footer · owner + último toque + tag */}
                            <footer className="mt-3 flex items-center justify-between gap-2 border-t pt-2.5 pl-3" style={{ borderColor: 'var(--line-1)' }}>
                              <div className="flex items-center gap-1.5">
                                <Avatar size="sm" style={{ background: o.owner.color, height: 20, width: 20, fontSize: 9 }}>
                                  <AvatarFallback>{o.owner.initials}</AvatarFallback>
                                </Avatar>
                                <span className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                                  · {o.lastTouch}
                                </span>
                              </div>
                              {o.tag && <Badge tone={o.tag.tone}>{o.tag.label}</Badge>}
                            </footer>

                            {/* HOVER ROW · ações rápidas · sem precisar abrir o card */}
                            <div className="mt-2.5 grid grid-cols-3 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={(e) => { e.stopPropagation(); toast.success('WhatsApp aberto') }}
                                className="flex items-center justify-center gap-1 rounded-md py-1.5 text-[10.5px] font-semibold transition-colors hover:brightness-110"
                                style={{ background: 'var(--surface-2)', color: 'var(--success)', border: '1px solid var(--line-2)' }}
                              >
                                <MessageCircle size={11} /> Chat
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); toast.success('Discando…') }}
                                className="flex items-center justify-center gap-1 rounded-md py-1.5 text-[10.5px] font-semibold transition-colors hover:brightness-110"
                                style={{ background: 'var(--surface-2)', color: 'var(--brand)', border: '1px solid var(--line-2)' }}
                              >
                                <Phone size={11} /> Ligar
                              </button>
                              {nextLane ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); moveStage(o.id, lane.id, nextLane.id) }}
                                  className="flex items-center justify-center gap-1 rounded-md py-1.5 text-[10.5px] font-bold transition-colors"
                                  style={{ background: 'var(--brand)', color: 'var(--bg)' }}
                                >
                                  Avançar <ArrowRight size={11} />
                                </button>
                              ) : (
                                <span className="flex items-center justify-center gap-1 rounded-md py-1.5 text-[10.5px] font-bold"
                                  style={{ background: 'rgba(95,217,165,0.18)', color: 'var(--success)' }}>
                                  <TrendingUp size={11} /> Fechado
                                </span>
                              )}
                            </div>
                          </article>
                        )
                      })}

                      {/* Quick-add inline · sem modal · digita e Enter */}
                      <button
                        className="group/qa flex items-center justify-center gap-2 rounded-[10px] border border-dashed py-3 text-[12px] font-medium transition-all hover:bg-white/[0.03]"
                        style={{
                          borderColor: 'var(--line-2)',
                          color: 'var(--text-mute)',
                        }}
                        onClick={() => toast.success('Quick-add aberto inline')}
                      >
                        <Plus size={13} />
                        <span className="group-hover/qa:text-[var(--text-soft)]">Nova oportunidade</span>
                        <Kbd className="opacity-0 group-hover/qa:opacity-100">⏎</Kbd>
                      </button>

                      {opps.length === 0 && (
                        <div
                          className="rounded-[10px] border border-dashed py-8 text-center"
                          style={{ borderColor: 'var(--line-2)' }}
                        >
                          <span className="mono text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                            Arraste cards para cá
                          </span>
                        </div>
                      )}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>

          {/* Footer · sugestão Lúmen flutuante */}
          <div className="border-t p-5" style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}>
            <div
              className="flex items-start justify-between gap-4 rounded-[10px] border p-4"
              style={{
                background: 'linear-gradient(135deg, var(--brand-soft), transparent 70%)',
                borderColor: 'var(--brand)',
              }}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ background: 'var(--brand)', color: 'var(--bg)' }}>
                  <Sparkles size={16} strokeWidth={1.8} />
                </span>
                <div>
                  <div className="mono text-[10px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--brand)' }}>
                    Sugestão Lúmen · próxima ação
                  </div>
                  <div className="serif mt-1 text-[17px] font-normal" style={{ color: 'var(--text)' }}>
                    Faça follow-up nos 4 deals esquecidos esta tarde
                  </div>
                  <p className="mt-1 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                    Sky Resort, Edifício Campo Belo, Praia Brava 12 e Vitra 1801 · sem toque há +3 dias. WhatsApp em batch sugerido.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="ghost" size="sm">Depois</Button>
                <Button size="sm"><MessageCircle size={12} /> Enviar batch</Button>
              </div>
            </div>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
