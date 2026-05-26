import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  LayoutGrid,
  List as ListIcon,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Star,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
  stage: { id: string; label: string; tone: 'brand' | 'purple' | 'pink' | 'warning' | 'success' | 'danger' | 'neutral' }
  value: number
  probability: number
  expectedClose: string
  owner: { initials: string; name: string; color: string }
  temperature: LeadTemperature
  lastTouch: string
  staleDays?: number
  starred?: boolean
}

const opps: Opp[] = [
  { id: 'o1', account: 'Família Andrade', title: 'Yachthouse 2104 · Decoração full', stage: { id: 'neg', label: 'Negociação', tone: 'warning' }, value: 12_500_000_00, probability: 78, expectedClose: '15 jun', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'hot', lastTouch: 'agora', starred: true },
  { id: 'o2', account: 'Família Netto', title: 'Mansão Camboriú · turnkey', stage: { id: 'prop', label: 'Proposta', tone: 'pink' }, value: 14_500_000_00, probability: 65, expectedClose: '15 jul', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'hot', lastTouch: '40 min' },
  { id: 'o3', account: 'WS Group', title: 'Cobertura Titanium · 920 m²', stage: { id: 'prop', label: 'Proposta', tone: 'pink' }, value: 9_500_000_00, probability: 62, expectedClose: '02 jul', owner: { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' }, temperature: 'warm', lastTouch: '2h' },
  { id: 'o4', account: 'Família Costa', title: 'Vitra 1801 · Reforma + decoração', stage: { id: 'qual', label: 'Qualificado', tone: 'purple' }, value: 4_200_000_00, probability: 48, expectedClose: '20 ago', owner: { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' }, temperature: 'warm', lastTouch: 'hoje' },
  { id: 'o5', account: 'TKWS Demo', title: 'Catálogo signature', stage: { id: 'qual', label: 'Qualificado', tone: 'purple' }, value: 2_800_000_00, probability: 55, expectedClose: '10 ago', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'warm', lastTouch: 'hoje' },
  { id: 'o6', account: 'Família Lima', title: 'Praia Brava 12 · cobertura', stage: { id: 'lead', label: 'Lead', tone: 'brand' }, value: 4_200_000_00, probability: 35, expectedClose: '30 ago', owner: { initials: 'JQ', name: 'João Q.', color: 'var(--success)' }, temperature: 'warm', lastTouch: 'ontem' },
  { id: 'o7', account: 'Família Oz', title: 'Sky Resort · 1200 m² turnkey', stage: { id: 'lead', label: 'Lead', tone: 'brand' }, value: 18_900_000_00, probability: 25, expectedClose: '14 set', owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' }, temperature: 'cold', lastTouch: 'há 4 dias', staleDays: 4 },
  { id: 'o8', account: 'Campo Belo Inv.', title: 'Edifício comercial · SP', stage: { id: 'lead', label: 'Lead', tone: 'brand' }, value: 6_700_000_00, probability: 18, expectedClose: '22 out', owner: { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' }, temperature: 'cold', lastTouch: 'há 7 dias', staleDays: 7 },
  { id: 'o9', account: 'Marina S.A.', title: 'Marina Park · 14 unidades premium', stage: { id: 'won', label: 'Ganho', tone: 'success' }, value: 28_000_000_00, probability: 100, expectedClose: '01 jun', owner: { initials: 'JQ', name: 'João Q.', color: 'var(--success)' }, temperature: 'hot', lastTouch: 'ontem' },
]

const allStages = [
  { id: 'lead', label: 'Lead', tone: 'brand' as const },
  { id: 'qual', label: 'Qualificado', tone: 'purple' as const },
  { id: 'prop', label: 'Proposta', tone: 'pink' as const },
  { id: 'neg', label: 'Negociação', tone: 'warning' as const },
  { id: 'won', label: 'Ganho', tone: 'success' as const },
  { id: 'lost', label: 'Perdido', tone: 'danger' as const },
]

const prompt: AIPrompt = {
  componente: 'Pattern · CRM Oportunidades · Lista',
  import: '// Composição: KPI strip + toolbar com saved views + tabela densa com inline-edit em Stage/Owner/Probabilidade + bulk action bar sticky',
  contexto:
    'View tabular do pipeline · ideal para comerciais que precisam editar várias oportunidades de uma vez. Stage e owner editáveis diretamente na célula (clique abre dropdown). Star/favoritar inline. Bulk action bar aparece quando 1+ linha é selecionada. Saved views como chips no topo. Tudo orientado a "menos cliques pra realizar a ação".',
  quandoUsar: [
    'Quando o comercial precisa fazer mass-update (mudar owner de 10 deals)',
    'Quando o volume é alto (50+ oportunidades) e o Kanban fica pesado',
    'Revisão semanal de pipeline · scan rápido por valor/probabilidade',
    'Squad/Gestor que precisa ver tudo em uma tela',
  ],
  props: [],
  antiPatterns: [
    'Stage como texto · usuário precisa abrir o deal para mudar',
    'Sem inline-edit · força open-edit-save em cada célula',
    'Bulk bar fixa no topo · usuário esquece que tem seleção ativa',
    'Sem indicador visual de staleness · deals esquecidos somem na lista',
    'Densidade Power sem opção de relaxar (Standard) · cansa em 5min',
  ],
  exemplo: `<table>
  {opps.map(o => (
    <tr>
      <td><Checkbox /></td>
      <td><Avatar /> {o.account}</td>
      <td>{o.title}</td>
      <td><StageDropdown value={o.stage} onChange={moveStage} /></td>
      <td>{formatCurrency(o.value)}</td>
      <td><Progress value={o.probability} /> <InlineEdit /></td>
      <td><HoverActions />: WhatsApp · Avançar · Mais</td>
    </tr>
  ))}
</table>`,
  relacionados: ['CRMPipeline', 'DataTable', 'BulkActionBar', 'InlineEdit'],
}

const savedViews = [
  { id: 'mine', label: 'Meus deals', count: 18, active: true },
  { id: 'hot', label: 'Quentes', count: 3 },
  { id: 'stale', label: 'Esquecidos +3d', count: 4 },
  { id: 'closing', label: 'Fecha em 30d', count: 7 },
  { id: 'high', label: '+R$ 5M', count: 5 },
]

export function CRMOpportunitiesListPattern() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [activeView, setActiveView] = useState('mine')

  const toggleAll = () => {
    if (selected.size === opps.length) setSelected(new Set())
    else setSelected(new Set(opps.map((o) => o.id)))
  }

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totals = useMemo(() => {
    const total = opps.reduce((acc, o) => acc + o.value, 0)
    const weighted = opps.reduce((acc, o) => acc + (o.value * o.probability) / 100, 0)
    const hot = opps.filter((o) => o.temperature === 'hot').length
    const stale = opps.filter((o) => (o.staleDays ?? 0) >= 3).length
    return { total, weighted, hot, stale }
  }, [])

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="CRM.P5"
        category="Pattern · Oportunidades · Lista"
        title="Lista de oportunidades"
        italic="tabela com inline-edit"
        description="View tabular densa para gerenciar muitas oportunidades. Stage e owner editáveis na célula, bulk actions sticky, saved views como chips. Foco em escala e velocidade."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Lista · pipeline em formato tabular" />
      <Showcase padding="none" bg="bg">
        <div className="overflow-hidden rounded-[10px]" style={{ background: 'var(--bg)' }}>
          {/* Header */}
          <div className="border-b p-6 max-[760px]:p-4" style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex-1">
                <div className="mono text-[10.5px] font-semibold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                  Comercial · Oportunidades · Lista
                </div>
                <h1 className="serif mt-1.5 text-[30px] font-normal leading-[1.1]" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                  {opps.length} oportunidades
                  <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>
                    {' '}
                    · R$ {(totals.total / 100_00).toFixed(1).replace('.', ',')}M total
                  </em>
                </h1>
                <div className="mt-1.5 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                  Visão tabular · clique nas células para editar inline
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download size={12} /> Exportar
                </Button>
                <Button>
                  <Plus size={14} /> Nova oportunidade <Kbd className="ml-1.5">N</Kbd>
                </Button>
              </div>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-3 border-b p-6 max-[760px]:grid-cols-2" style={{ borderColor: 'var(--line-1)' }}>
            <KpiMini label="Total" value={`R$ ${(totals.total / 100_00).toFixed(1).replace('.', ',')}M`} hint={`${opps.length} deals`} tone="brand" />
            <KpiMini label="Ponderado" value={`R$ ${(totals.weighted / 100_00).toFixed(1).replace('.', ',')}M`} hint="por probabilidade" tone="success" />
            <KpiMini label="Quentes" value={String(totals.hot)} hint="ação urgente" tone="danger" />
            <KpiMini label="Esquecidos" value={String(totals.stale)} hint="+3 dias sem toque" tone="warning" />
          </div>

          {/* Toolbar · saved views como chips */}
          <div className="border-b p-4" style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2">
                <Input icon={<Search size={13} />} placeholder="Buscar oportunidade… (⌘K)" className="max-w-md flex-1 !text-[13px]" />
                <Tabs value="list">
                  <TabsList variant="pill">
                    <TabsTrigger value="kanban"><LayoutGrid size={12} /> Kanban</TabsTrigger>
                    <TabsTrigger value="list"><ListIcon size={12} /> Lista</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Button variant="outline" size="sm">
                <Filter size={12} /> Filtros avançados
              </Button>
            </div>

            {/* Saved views · chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                Visões salvas
              </span>
              {savedViews.map((v) => {
                const active = v.id === activeView
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveView(v.id)}
                    className={cn(
                      'mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors',
                      active ? 'cursor-default' : 'cursor-pointer hover:brightness-110'
                    )}
                    style={{
                      background: active ? 'var(--brand-soft)' : 'var(--surface-2)',
                      borderColor: active ? 'var(--brand)' : 'var(--line-2)',
                      color: active ? 'var(--brand)' : 'var(--text-soft)',
                    }}
                  >
                    {v.label}
                    <span
                      className="rounded-full px-1.5 text-[9.5px]"
                      style={{ background: active ? 'var(--brand)' : 'var(--surface-3)', color: active ? 'var(--bg)' : 'var(--text-mute)' }}
                    >
                      {v.count}
                    </span>
                  </button>
                )
              })}
              <button className="mono inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-white/[0.03]"
                style={{ borderColor: 'var(--line-2)', color: 'var(--text-mute)' }}>
                <Plus size={11} /> Salvar visão
              </button>
            </div>
          </div>

          {/* Bulk action bar · aparece quando há seleção */}
          {selected.size > 0 && (
            <div
              className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b px-6 py-3"
              style={{ background: 'var(--brand)', color: 'var(--bg)' }}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} />
                <span className="text-[13px] font-bold">
                  {selected.size} oportunidade{selected.size > 1 ? 's' : ''} selecionada{selected.size > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="mono inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[1.2px]"
                      style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--bg)' }}>
                      Mover para etapa <ChevronDown size={12} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {allStages.map((s) => (
                      <DropdownMenuItem key={s.id} onSelect={() => { toast.success(`${selected.size} movidos para ${s.label}`); setSelected(new Set()) }}>
                        <ArrowRight size={11} /> {s.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="mono inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[1.2px]"
                      style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--bg)' }}>
                      Atribuir <ChevronDown size={12} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mover owner</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {[
                      { ini: 'LZ', name: 'Lucas Z.' },
                      { ini: 'AV', name: 'Ana V.' },
                      { ini: 'JQ', name: 'João Q.' },
                    ].map((u) => (
                      <DropdownMenuItem key={u.ini}>{u.name}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <button onClick={() => setSelected(new Set())} className="mono text-[11px] font-bold uppercase tracking-[1.2px] underline-offset-2 hover:underline"
                  style={{ color: 'var(--bg)' }}>
                  Limpar
                </button>
              </div>
            </div>
          )}

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]" style={{ color: 'var(--text)' }}>
              <thead>
                <tr className="border-b" style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}>
                  <th className="w-[40px] px-4 py-2.5 text-left">
                    <Checkbox
                      checked={selected.size === opps.length}
                      onCheckedChange={toggleAll}
                      aria-label="Selecionar todos"
                    />
                  </th>
                  <th className="w-[28px] px-1 py-2.5"></th>
                  <th className="mono px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                    Oportunidade
                  </th>
                  <th className="mono px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                    Etapa
                  </th>
                  <th className="mono px-3 py-2.5 text-right text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                    Valor
                  </th>
                  <th className="mono w-[160px] px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                    Probab.
                  </th>
                  <th className="mono px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                    Fecha em
                  </th>
                  <th className="mono px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                    Owner
                  </th>
                  <th className="mono px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                    Último toque
                  </th>
                  <th className="w-[140px] px-3 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {opps.map((o) => {
                  const isSelected = selected.has(o.id)
                  const probTone: 'success' | 'warning' | 'brand' | 'danger' =
                    o.probability >= 70 ? 'success' : o.probability >= 40 ? 'warning' : o.probability >= 20 ? 'brand' : 'danger'

                  return (
                    <tr
                      key={o.id}
                      className={cn(
                        'group border-b transition-colors',
                        isSelected ? 'bg-[var(--brand-soft)]' : 'hover:bg-white/[0.025]'
                      )}
                      style={{ borderColor: 'var(--line-1)' }}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleOne(o.id)} />
                      </td>

                      {/* Star */}
                      <td className="px-1 py-3">
                        <button
                          aria-label={o.starred ? 'Desfavoritar' : 'Favoritar'}
                          className="cursor-pointer transition-colors"
                          style={{ color: o.starred ? 'var(--warning)' : 'var(--text-mute)' }}
                        >
                          <Star size={14} fill={o.starred ? 'currentColor' : 'none'} />
                        </button>
                      </td>

                      {/* Conta + título */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {o.temperature !== 'cold' && <LeadScore temperature={o.temperature} size="sm" showLabel={false} />}
                          <div className="min-w-0">
                            <div className="mono text-[9.5px] font-semibold uppercase tracking-[1.1px]" style={{ color: 'var(--text-mute)' }}>
                              {o.account}
                            </div>
                            <div className="serif mt-0.5 truncate text-[14px] font-normal leading-tight" style={{ color: 'var(--text)' }}>
                              {o.title}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Etapa · inline-edit dropdown */}
                      <td className="px-3 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="group/stg inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 transition-colors hover:brightness-110"
                              style={{
                                background:
                                  o.stage.tone === 'success' ? 'rgba(95,217,165,0.14)' :
                                  o.stage.tone === 'warning' ? 'rgba(242,201,76,0.14)' :
                                  o.stage.tone === 'pink' ? 'rgba(241,120,182,0.14)' :
                                  o.stage.tone === 'purple' ? 'rgba(187,107,217,0.14)' :
                                  o.stage.tone === 'danger' ? 'rgba(235,87,87,0.14)' :
                                  'var(--brand-soft)',
                                borderColor: `var(--${o.stage.tone === 'purple' ? 'purple' : o.stage.tone === 'pink' ? 'pink' : o.stage.tone === 'success' ? 'success' : o.stage.tone === 'warning' ? 'warning' : o.stage.tone === 'danger' ? 'danger' : 'brand'})`,
                              }}>
                              <span className="mono text-[10.5px] font-bold uppercase tracking-[1.1px]"
                                style={{ color: `var(--${o.stage.tone === 'purple' ? 'purple' : o.stage.tone === 'pink' ? 'pink' : o.stage.tone === 'success' ? 'success' : o.stage.tone === 'warning' ? 'warning' : o.stage.tone === 'danger' ? 'danger' : 'brand'})` }}>
                                {o.stage.label}
                              </span>
                              <ChevronDown size={10} className="opacity-0 transition-opacity group-hover/stg:opacity-100" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Mudar etapa</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {allStages.map((s) => (
                              <DropdownMenuItem key={s.id} onSelect={() => toast.success(`Movido para ${s.label}`)}>
                                {s.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>

                      {/* Valor */}
                      <td className="num-tabular serif px-3 py-3 text-right text-[16px] font-normal" style={{ color: 'var(--text)' }}>
                        {formatCurrency(o.value / 100)}
                      </td>

                      {/* Probabilidade */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={o.probability} tone={probTone} className="flex-1" />
                          <span className="mono w-9 text-right text-[11.5px] font-bold" style={{ color: 'var(--text)' }}>
                            {o.probability}%
                          </span>
                        </div>
                      </td>

                      {/* Fecha em */}
                      <td className="px-3 py-3">
                        <span className="mono text-[11.5px]" style={{ color: 'var(--text-soft)' }}>
                          {o.expectedClose}
                        </span>
                      </td>

                      {/* Owner · inline-edit */}
                      <td className="px-3 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-colors hover:bg-white/[0.04]">
                              <Avatar size="sm" style={{ background: o.owner.color, height: 22, width: 22, fontSize: 9 }}>
                                <AvatarFallback>{o.owner.initials}</AvatarFallback>
                              </Avatar>
                              <span className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>
                                {o.owner.name}
                              </span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Atribuir owner</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[
                              { ini: 'LZ', name: 'Lucas Zucchi' },
                              { ini: 'AV', name: 'Ana Vieira' },
                              { ini: 'JQ', name: 'João Quintela' },
                            ].map((u) => (
                              <DropdownMenuItem key={u.ini}>{u.name}</DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>

                      {/* Último toque */}
                      <td className="px-3 py-3">
                        <span className={cn('mono text-[11.5px]', (o.staleDays ?? 0) >= 3 ? 'font-bold' : '')}
                          style={{ color: (o.staleDays ?? 0) >= 3 ? 'var(--danger)' : 'var(--text-soft)' }}>
                          {o.lastTouch}
                        </span>
                      </td>

                      {/* Hover actions */}
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => toast.success('WhatsApp aberto')}
                                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/[0.06]"
                                style={{ color: 'var(--success)' }}>
                                <MessageCircle size={14} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>WhatsApp</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => toast.success('Discando…')}
                                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/[0.06]"
                                style={{ color: 'var(--brand)' }}>
                                <Phone size={14} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Ligar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => toast.success('Etapa avançada')}
                                className="flex h-7 cursor-pointer items-center gap-1 rounded-md px-2 text-[10.5px] font-bold transition-colors"
                                style={{ background: 'var(--brand)', color: 'var(--bg)' }}>
                                <TrendingUp size={11} /> Avançar
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Mover para próxima etapa</TooltipContent>
                          </Tooltip>
                          <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/[0.06]"
                            style={{ color: 'var(--text-mute)' }}>
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              {/* Footer · totalizador */}
              <tfoot>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <td colSpan={4} className="mono px-4 py-3 text-[10.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                    Total
                  </td>
                  <td className="num-tabular serif px-3 py-3 text-right text-[18px] font-normal" style={{ color: 'var(--text)' }}>
                    {formatCurrency(totals.total / 100)}
                  </td>
                  <td colSpan={5} className="mono px-3 py-3 text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                    Ponderado · {formatCurrency(totals.weighted / 100)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="flex items-center justify-between gap-3 border-t p-4" style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}>
            <div className="mono text-[10.5px] font-semibold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
              Mostrando 1–{opps.length} de {opps.length} oportunidades
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Anterior</Button>
              <Button variant="outline" size="sm" disabled>Próximo</Button>
            </div>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
