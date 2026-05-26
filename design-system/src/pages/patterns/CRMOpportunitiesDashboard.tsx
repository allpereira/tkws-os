import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  MessageCircle,
  Phone,
  Plus,
  Snowflake,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { TkwsHeader } from '@/components/tkws/header'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KpiHero, KpiMini } from '@/components/tkws/kpi'
import { LineSeriesChart, VerticalBar } from '@/components/tkws/charts'
import { GoalRing } from '@/components/ui/goal-ring'
import { Progress } from '@/components/ui/progress'
import { SalesFunnel } from '@/components/tkws/crm-pipeline'
import { LeadScore } from '@/components/tkws/crm-lead-score'
import { formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const seriesMonthly = [
  { label: 'Jan', value: 4.2 },
  { label: 'Fev', value: 5.1 },
  { label: 'Mar', value: 6.4 },
  { label: 'Abr', value: 5.8 },
  { label: 'Mai', value: 7.9 },
  { label: 'Jun', value: 8.7 },
]

const pipelineVsTarget = [
  { label: 'Jan', Pipeline: 8.2, Meta: 6.0, Fechado: 4.2 },
  { label: 'Fev', Pipeline: 9.1, Meta: 6.5, Fechado: 5.1 },
  { label: 'Mar', Pipeline: 11.4, Meta: 7.0, Fechado: 6.4 },
  { label: 'Abr', Pipeline: 12.8, Meta: 7.5, Fechado: 5.8 },
  { label: 'Mai', Pipeline: 14.2, Meta: 8.0, Fechado: 7.9 },
  { label: 'Jun', Pipeline: 16.0, Meta: 8.5, Fechado: 8.7 },
]

const funnelStages = [
  { id: 'lead', label: 'Lead', count: 18, value: 36_900_000_00, conversion: 62 },
  { id: 'qual', label: 'Qualificado', count: 12, value: 24_500_000_00, conversion: 48 },
  { id: 'prop', label: 'Proposta', count: 7, value: 18_400_000_00, conversion: 56 },
  { id: 'neg', label: 'Negociação', count: 4, value: 12_500_000_00, conversion: 75 },
  { id: 'won', label: 'Ganho · trimestre', count: 6, value: 28_000_000_00, color: 'var(--success)' },
]

const focusToday = [
  { id: 'a1', label: 'Mandar cotação granito alternativo', account: 'Família Andrade', time: 'até quarta · prometido', tone: 'warning' as const, action: 'WhatsApp', value: 12_500_000_00 },
  { id: 'a2', label: 'Apresentar orçamento final', account: 'Família Netto', time: 'amanhã · 14h', tone: 'danger' as const, action: 'Reunião', value: 14_500_000_00 },
  { id: 'a3', label: 'Follow-up Sky Resort', account: 'Família Oz', time: 'sem toque há 4 dias', tone: 'warning' as const, action: 'Ligar', value: 18_900_000_00 },
  { id: 'a4', label: 'Confirmar assinatura contrato', account: 'Marina S.A.', time: 'sexta', tone: 'success' as const, action: 'Email', value: 28_000_000_00 },
]

const hotDeals = [
  { id: 'h1', account: 'Família Andrade', title: 'Yachthouse 2104', value: 12_500_000_00, prob: 78, close: '15 jun', stage: 'Negociação' },
  { id: 'h2', account: 'Família Netto', title: 'Mansão Camboriú', value: 14_500_000_00, prob: 65, close: '15 jul', stage: 'Proposta' },
  { id: 'h3', account: 'WS Group', title: 'Cobertura Titanium', value: 9_500_000_00, prob: 62, close: '02 jul', stage: 'Proposta' },
]

const staleDeals = [
  { id: 's1', account: 'Família Oz', title: 'Sky Resort · 1200 m²', days: 4, value: 18_900_000_00 },
  { id: 's2', account: 'Campo Belo Inv.', title: 'Edifício comercial · SP', days: 7, value: 6_700_000_00 },
  { id: 's3', account: 'Família Costa Verde', title: 'Praia das Pedras', days: 14, value: 3_400_000_00 },
  { id: 's4', account: 'Investe SP', title: 'Mansão Alphaville', days: 22, value: 8_200_000_00 },
]

const prompt: AIPrompt = {
  componente: 'Pattern · CRM Oportunidades · Dashboard',
  import: '// Composição: Hero greeting + KPI strip + 12-col grid · meta + funnel + foco do dia + hot deals + stale + forecast',
  contexto:
    'Dashboard operacional · home do comercial. Diferente do CRM Dashboard executivo · este é "o que eu faço hoje". KPIs orientados a ação (Hoje, Aguardando você, Esquecidos), "Foco do dia" no topo com 3-4 ações concretas, hot deals e stale lado a lado. Dias e prazos sempre absolutos. Lúmen sugere agenda da manhã.',
  quandoUsar: [
    'Home/landing do role Comercial Atendimento e Proposta',
    'Início do dia · "o que eu preciso fazer?"',
    'Reunião de squad semanal · 5 min de status',
  ],
  props: [],
  antiPatterns: [
    'Dashboard cheio de gráficos executivos sem ação · transforma em museu',
    'Hot deals sem ação inline · força ir pra outra tela',
    'Sem "Foco do dia" no topo · perde direcionamento',
    'Métricas % sem contexto absoluto (R$, número de deals)',
    'Mais de 8 widgets · vire abas ou esconda atrás de drilldown',
  ],
  exemplo: `<DashboardHero greeting="Bom dia, Lucas" sub="3 ações pra hoje" />
<KpiStrip metrics={['Aguardando você', 'Quentes', 'Esquecidos', 'Fecha em 7d']} />
<FocusToday actions={focusItems} />
<HotDeals onAdvance={advance} />
<StaleDeals onFollowup={followup} />
<Funnel stages={stages} />`,
  relacionados: ['CRMDashboard', 'CRMPipeline', 'CRMOpportunitiesKanban'],
}

const toneBg: Record<string, string> = {
  warning: 'rgba(242,201,76,0.10)',
  danger: 'rgba(235,87,87,0.10)',
  success: 'rgba(95,217,165,0.10)',
  brand: 'var(--brand-soft)',
}
const toneBorder: Record<string, string> = {
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  success: 'var(--success)',
  brand: 'var(--brand)',
}

export function CRMOpportunitiesDashboardPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="CRM.P7"
        category="Pattern · Oportunidades · Dashboard"
        title="Dashboard de oportunidades"
        italic="o que eu faço hoje"
        description="Home operacional do comercial. KPIs orientados a ação, 'Foco do dia' no topo com ações concretas, hot deals e deals esquecidos lado a lado. Mínima leitura · máxima ação."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Dashboard · home do comercial · 25 mai 2026" />
      <Showcase padding="comfortable">
        <TkwsHeader
          crumb="Comercial · Oportunidades · Dashboard"
          title="Bom dia, Lucas."
          italic="você tem 3 ações pra hoje"
          description="Squad Orion · trimestre Q2 · 102% da meta · mais R$ 4,5M pra bater o stretch"
          actions={
            <>
              <Tabs defaultValue="day">
                <TabsList variant="pill">
                  <TabsTrigger value="day">Hoje</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                  <TabsTrigger value="qtr">Trimestre</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm">
                <CalendarDays size={12} /> Jun 2026
              </Button>
              <Button>
                <Plus size={14} /> Nova oportunidade
              </Button>
            </>
          }
        />

        {/* KPI strip · orientado a AÇÃO, não a leitura */}
        <div className="mt-7 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          <KpiHero
            label="Aguardando você"
            value="3"
            hint="próximas ações hoje"
            delta={{ value: 'fazer agora', trend: 'up' }}
          />
          <KpiHero
            label="Deals quentes"
            value="3"
            hint="R$ 36,5M em pipeline ativo"
            delta={{ value: '+1 vs ontem', trend: 'up' }}
          />
          <KpiHero
            label="Esquecidos"
            value="4"
            hint="+3 dias sem toque · risco"
            delta={{ value: '+2 vs ontem', trend: 'down' }}
          />
          <KpiHero
            label="Fecha em 7 dias"
            value="R$ 27M"
            hint="2 deals em negociação"
            delta={{ value: '78% prob.', trend: 'up' }}
            series={seriesMonthly}
          />
        </div>

        {/* FOCO DO DIA · primeira coisa que o comercial vê */}
        <div className="mt-6">
          <Card accent="brand">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: 'var(--brand)', color: 'var(--bg)' }}>
                  <Sparkles size={14} strokeWidth={1.8} />
                </span>
                <CardTitle>Foco do dia · sugerido pela Lúmen</CardTitle>
              </div>
              <Badge tone="brand">{focusToday.length} ações</Badge>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {focusToday.map((a) => (
                  <li
                    key={a.id}
                    className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 rounded-[10px] border p-3.5 max-[760px]:grid-cols-1"
                    style={{ background: toneBg[a.tone], borderColor: toneBorder[a.tone] }}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-md"
                      style={{ background: toneBorder[a.tone], color: 'var(--bg)' }}>
                      {a.tone === 'warning' && <AlertTriangle size={15} />}
                      {a.tone === 'danger' && <Flame size={15} />}
                      {a.tone === 'success' && <Trophy size={15} />}
                    </span>
                    <div>
                      <div className="serif text-[16px] font-normal leading-tight" style={{ color: 'var(--text)' }}>
                        {a.label}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px]" style={{ color: 'var(--text-soft)' }}>
                        <span className="mono text-[10.5px] font-semibold uppercase tracking-[1.1px]" style={{ color: 'var(--text-mute)' }}>
                          {a.account}
                        </span>
                        <span>·</span>
                        <span className="num-tabular font-semibold" style={{ color: 'var(--text)' }}>{formatCurrency(a.value / 100)}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 mono text-[10.5px]" style={{ color: toneBorder[a.tone] }}>
                          <Clock size={10} /> {a.time}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success(`${a.action} iniciado`)}>
                      {a.action === 'WhatsApp' && <><MessageCircle size={12} /> WhatsApp</>}
                      {a.action === 'Ligar' && <><Phone size={12} /> Ligar</>}
                      {a.action === 'Email' && <><MessageCircle size={12} /> Email</>}
                      {a.action === 'Reunião' && <><Calendar size={12} /> Reunião</>}
                    </Button>
                    <Button size="sm" onClick={() => toast.success('Marcado como feito')}>
                      <CheckCircle2 size={12} /> Feito
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 12-col grid · meta + funnel + atalhos */}
        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Meta do trimestre · 4 col */}
          <div className="col-span-4 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Meta do trimestre</CardTitle>
                <Badge tone="success">Acima!</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-3">
                  <GoalRing value={102} label="102%" sublabel="da meta" tone="success" size={150} thickness={13} />
                  <div className="num-tabular serif text-[20px] font-normal" style={{ color: 'var(--text)' }}>
                    {formatCurrency(8_700_000_00 / 100)} / {formatCurrency(8_500_000_00 / 100)}
                  </div>
                  <div className="mono text-center text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                    Stretch · {formatCurrency(13_200_000_00 / 100)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline vs Meta · 8 col */}
          <div className="col-span-8 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline · Meta · Fechado · R$ M</CardTitle>
                <Badge tone="brand">6 meses</Badge>
              </CardHeader>
              <CardContent>
                <LineSeriesChart
                  data={pipelineVsTarget}
                  series={[
                    { name: 'Pipeline', color: 'var(--brand)' },
                    { name: 'Meta', color: 'var(--text-mute)' },
                    { name: 'Fechado', color: 'var(--success)' },
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          {/* Funnel · 8 col */}
          <div className="col-span-8 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Funil · {funnelStages.reduce((a, s) => a + s.count, 0)} deals</CardTitle>
                <Badge tone="success">Conversão · 35%</Badge>
              </CardHeader>
              <CardContent className="!p-0">
                <SalesFunnel stages={funnelStages} />
              </CardContent>
            </Card>
          </div>

          {/* Forecast 90 dias · 4 col */}
          <div className="col-span-4 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Forecast 90d · R$ M</CardTitle>
              </CardHeader>
              <CardContent>
                <VerticalBar
                  data={[
                    { label: 'Jun', value: 8.7 },
                    { label: 'Jul', value: 11.2 },
                    { label: 'Ago', value: 13.4 },
                  ]}
                  tone="brand"
                  height={200}
                />
                <div className="mono mt-2 text-center text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  Ponderado por probabilidade
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hot deals · 6 col */}
          <div className="col-span-6 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LeadScore temperature="hot" size="sm" showLabel={false} />
                  <CardTitle>Deals quentes · ação prioritária</CardTitle>
                </div>
                <Button variant="ghost" size="sm">Ver todos <ArrowRight size={11} /></Button>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2">
                  {hotDeals.map((d) => (
                    <li
                      key={d.id}
                      className="group grid grid-cols-[1fr_auto] items-center gap-3 rounded-[10px] border p-3 transition-colors hover:bg-white/[0.025]"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                    >
                      <div className="min-w-0">
                        <div className="mono text-[9.5px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                          {d.account}
                        </div>
                        <div className="serif mt-0.5 truncate text-[14.5px] font-normal leading-tight" style={{ color: 'var(--text)' }}>
                          {d.title}
                        </div>
                        <div className="mt-1.5 flex items-center gap-3">
                          <span className="num-tabular text-[12.5px] font-semibold" style={{ color: 'var(--text)' }}>
                            {formatCurrency(d.value / 100)}
                          </span>
                          <span className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                            {d.stage} · {d.prob}% · {d.close}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Button size="sm" variant="outline" className="opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => toast.success('WhatsApp aberto')}>
                          <MessageCircle size={11} />
                        </Button>
                        <Button size="sm" onClick={() => toast.success('Avançado de etapa')}>
                          <ArrowRight size={12} /> Avançar
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Stale deals · 6 col */}
          <div className="col-span-6 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Snowflake size={13} style={{ color: 'var(--warning)' }} />
                  <CardTitle>Esquecidos · precisam follow-up</CardTitle>
                </div>
                <Button variant="ghost" size="sm">Enviar batch <MessageCircle size={11} /></Button>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2">
                  {staleDeals.map((d) => (
                    <li
                      key={d.id}
                      className="group grid grid-cols-[1fr_auto] items-center gap-3 rounded-[10px] border p-3 transition-colors hover:bg-white/[0.025]"
                      style={{
                        background: d.days >= 14 ? 'rgba(235,87,87,0.06)' : 'var(--surface-2)',
                        borderColor: d.days >= 14 ? 'var(--danger)' : 'var(--line-1)',
                      }}
                    >
                      <div className="min-w-0">
                        <div className="mono text-[9.5px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                          {d.account}
                        </div>
                        <div className="serif mt-0.5 truncate text-[14.5px] font-normal leading-tight" style={{ color: 'var(--text)' }}>
                          {d.title}
                        </div>
                        <div className="mt-1.5 flex items-center gap-3">
                          <span className="num-tabular text-[12.5px] font-semibold" style={{ color: 'var(--text)' }}>
                            {formatCurrency(d.value / 100)}
                          </span>
                          <span className="mono inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-[1.1px]"
                            style={{ color: d.days >= 14 ? 'var(--danger)' : 'var(--warning)' }}>
                            <Clock size={9} /> {d.days} dias sem toque
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => toast.success('WhatsApp aberto')}>
                          <MessageCircle size={11} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toast.success('Discando…')}>
                          <Phone size={11} />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Atalhos rápidos · 12 col */}
          <div className="col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Atalhos rápidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3 max-[760px]:grid-cols-2 max-[600px]:grid-cols-1">
                  {[
                    { ic: <Plus size={18} />, lbl: 'Nova oportunidade', sub: 'N', tone: 'brand' },
                    { ic: <Calendar size={18} />, lbl: 'Agendar reunião', sub: 'A', tone: 'purple' },
                    { ic: <MessageCircle size={18} />, lbl: 'Disparar follow-up', sub: '4 deals', tone: 'success' },
                    { ic: <CheckCircle2 size={18} />, lbl: 'Revisar deals fechados', sub: '6 esta semana', tone: 'warning' },
                  ].map((s, i) => (
                    <button
                      key={i}
                      onClick={() => toast.success(`${s.lbl}`)}
                      className="group flex cursor-pointer items-center gap-3 rounded-[12px] border p-4 text-left transition-all hover:-translate-y-0.5"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `var(--${s.tone})` }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)' }}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-[10px]"
                        style={{ background: `var(--${s.tone})`, color: 'var(--bg)' }}>
                        {s.ic}
                      </span>
                      <div className="min-w-0">
                        <div className="serif text-[15px] font-normal" style={{ color: 'var(--text)' }}>{s.lbl}</div>
                        <div className="mono mt-0.5 text-[10px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                          {s.sub}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
