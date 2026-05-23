import { CalendarDays, Download, Target, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { TkwsHeader } from '@/components/tkws/header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { KpiHero, KpiMini } from '@/components/tkws/kpi'
import { Donut, LineSeriesChart, VerticalBar } from '@/components/tkws/charts'
import { GoalRing } from '@/components/ui/goal-ring'
import { Timeline, type TimelineItem } from '@/components/tkws/timeline'
import { SalesFunnel } from '@/components/tkws/crm-pipeline'
import { LeadScore } from '@/components/tkws/crm-lead-score'
import { DealCard, type Deal } from '@/components/tkws/crm-deal-card'
import { Progress } from '@/components/ui/progress'
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

const linePipelineVsTarget = [
  { label: 'Jan', Pipeline: 8.2, Meta: 6.0, Fechado: 4.2 },
  { label: 'Fev', Pipeline: 9.1, Meta: 6.5, Fechado: 5.1 },
  { label: 'Mar', Pipeline: 11.4, Meta: 7.0, Fechado: 6.4 },
  { label: 'Abr', Pipeline: 12.8, Meta: 7.5, Fechado: 5.8 },
  { label: 'Mai', Pipeline: 14.2, Meta: 8.0, Fechado: 7.9 },
  { label: 'Jun', Pipeline: 16.0, Meta: 8.5, Fechado: 8.7 },
]

const funnelStages = [
  { id: 'lead', label: 'Lead', count: 84, value: 14_200_000_000, conversion: 62 },
  { id: 'qual', label: 'Qualificado', count: 52, value: 9_800_000_000, conversion: 48 },
  { id: 'prop', label: 'Proposta', count: 25, value: 6_400_000_000, conversion: 56 },
  { id: 'won', label: 'Fechado', count: 10, value: 3_100_000_000, color: 'var(--success)' },
]

const hotDeals: Deal[] = [
  { id: '1', account: 'FAMÍLIA ANDRADE', title: 'Yachthouse 2104', value: 1_250_000_000, probability: 78, expectedClose: '15 jun', owner: { initials: 'LZ', name: 'Lucas Z.' }, temperature: 'hot', tag: { label: 'VIP', tone: 'brand' } },
  { id: '2', account: 'FAMÍLIA NETTO', title: 'Mansão Camboriú', value: 1_450_000_000, probability: 65, expectedClose: '15 jul', owner: { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' }, temperature: 'hot' },
]

const leaderboard = [
  { ini: 'LZ', name: 'Lucas Zucchi', deals: 18, value: 4_200_000_000, win: 52, color: 'var(--brand)' },
  { ini: 'AV', name: 'Ana Vieira', deals: 14, value: 3_100_000_000, win: 48, color: 'var(--purple)' },
  { ini: 'JQ', name: 'João Quintela', deals: 9, value: 1_900_000_000, win: 42, color: 'var(--success)' },
]

const activity: TimelineItem[] = [
  { id: '1', meta: 'agora', title: 'Cliente Andrade aceitou proposta', description: 'Yachthouse · R$ 12,5M · próximo: assinar contrato', tone: 'success' },
  { id: '2', meta: 'há 14 min', title: 'Novo lead via indicação', description: 'Família Lima · Praia Brava 12 · R$ 4,2M estimado', tone: 'brand' },
  { id: '3', meta: 'há 1h', title: 'Cobertura Titanium movido para Negociação', tone: 'warning' },
  { id: '4', meta: 'há 3h', title: '3 leads sem toque há 14 dias', description: 'Sky Resort, Campo Belo, Costa Verde', tone: 'danger' },
]

const sources = [
  { name: 'Indicação', value: 38, color: 'var(--brand)' },
  { name: 'Site/SEO', value: 24, color: 'var(--purple)' },
  { name: 'Instagram', value: 18, color: 'var(--pink)' },
  { name: 'Eventos', value: 12, color: 'var(--success)' },
  { name: 'Outros', value: 8, color: 'var(--text-mute)' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · CRM Dashboard',
  import: '// Composição: KPI hero + Pipeline vs Meta + Funnel + Leaderboard + Hot deals + Activity feed',
  contexto:
    'Dashboard executivo do CRM · visão da semana/mês/trimestre. Grid 12 col com KPI hero, comparativo Pipeline vs Meta vs Fechado, Funnel, leaderboard de vendedores, hot deals e activity feed. Densidade Power · leitura.',
  quandoUsar: [
    'Home do diretor comercial',
    'Reunião de pipeline semanal',
    'Quarterly review · executivo',
  ],
  props: [],
  antiPatterns: [
    'Mais de 15 widgets · vire abas',
    'Sem range picker · usuário não muda período',
    'Hot deals sem ação inline · só "veja a lista"',
  ],
  exemplo: `// Estrutura padrão de Dashboard CRM:
// 1) Header com period picker
// 2) KPI strip (Pipeline / Fechado / Win rate / Ciclo)
// 3) Pipeline vs Meta (LineChart)
// 4) Funnel (executive)
// 5) Sources (Donut) + Leaderboard
// 6) Hot deals · ação prioritária
// 7) Activity feed`,
  relacionados: ['Dashboard', 'CRMPipeline', 'SalesFunnel'],
}

export function CRMDashboardPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="CRM.P2"
        category="Pattern · CRM Dashboard"
        title="CRM Dashboard"
        italic="cockpit comercial"
        description="Dashboard executivo do CRM · pipeline + funnel + leaderboard + hot deals + activity. Densidade Power para diretor."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="CRM Dashboard · Junho 2026" />
      <Showcase padding="comfortable">
        <TkwsHeader
          crumb="Comercial · Dashboard"
          title="Bom dia, time."
          italic="R$ 16,0M em pipeline ativo"
          description="Visão executiva do CRM · período: junho 2026"
          actions={
            <>
              <Button variant="outline" size="sm">
                <CalendarDays size={12} /> Jun 2026
              </Button>
              <Button variant="outline" size="sm">
                <Download size={12} /> PDF executivo
              </Button>
            </>
          }
        />

        {/* KPI Hero · 4 col */}
        <div className="mt-7 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          <KpiHero
            label="Pipeline total"
            value="R$ 16,0M"
            hint="84 deals ativos"
            delta={{ value: '+18% MoM', trend: 'up' }}
            series={seriesMonthly}
          />
          <KpiHero
            label="Fechado · mês"
            value="R$ 8,7M"
            hint="vs meta R$ 8,5M"
            delta={{ value: '+102%', trend: 'up' }}
            series={seriesMonthly.map((s) => ({ ...s, value: s.value * 0.9 }))}
          />
          <KpiHero
            label="Win rate · trimestre"
            value="42%"
            hint="vs 35% ano anterior"
            delta={{ value: '+7pp', trend: 'up' }}
            series={seriesMonthly}
          />
          <KpiHero
            label="Ciclo médio"
            value="62 dias"
            hint="lead → fechado"
            delta={{ value: '-8 dias', trend: 'up' }}
            series={seriesMonthly}
          />
        </div>

        {/* Pipeline vs Meta · 12-col grid */}
        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Line chart · 8 col */}
          <div className="col-span-8 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline vs Meta vs Fechado · R$ M</CardTitle>
                <Badge tone="brand">
                  <Target size={11} /> Acima da meta
                </Badge>
              </CardHeader>
              <CardContent>
                <LineSeriesChart
                  data={linePipelineVsTarget}
                  series={[
                    { name: 'Pipeline', color: 'var(--brand)' },
                    { name: 'Meta', color: 'var(--text-mute)' },
                    { name: 'Fechado', color: 'var(--success)' },
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          {/* Goal ring · 4 col */}
          <div className="col-span-4 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Meta do trimestre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-3">
                  <GoalRing value={102} label="102%" sublabel="da meta" tone="success" size={140} thickness={12} />
                  <div className="mono text-center text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                    R$ 8,7M / R$ 8,5M
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Funnel · 8 col */}
          <div className="col-span-8 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Funil de vendas</CardTitle>
                <Badge tone="brand">{funnelStages.reduce((acc, s) => acc + s.count, 0)} deals</Badge>
              </CardHeader>
              <CardContent className="!p-0">
                <SalesFunnel stages={funnelStages} />
              </CardContent>
            </Card>
          </div>

          {/* Sources Donut · 4 col */}
          <div className="col-span-4 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Origem dos leads</CardTitle>
              </CardHeader>
              <CardContent>
                <Donut data={sources} height={200} />
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard · 6 col */}
          <div className="col-span-6 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Top vendedores · mês</CardTitle>
                <Badge tone="success">
                  <TrendingUp size={11} /> +18% MoM
                </Badge>
              </CardHeader>
              <CardContent>
                <ol className="grid gap-3">
                  {leaderboard.map((p, i) => (
                    <li
                      key={p.ini}
                      className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 rounded-[10px] border p-3"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                    >
                      <span className="mono text-[18px] font-bold" style={{ color: i === 0 ? 'var(--brand)' : 'var(--text-mute)' }}>
                        {i + 1}
                      </span>
                      <Avatar size="md" style={{ background: p.color }}>
                        <AvatarFallback>{p.ini}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                          {p.name}
                        </div>
                        <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                          {p.deals} deals · win rate {p.win}%
                        </div>
                      </div>
                      <div className="num-tabular serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
                        {formatCurrency(p.value / 100)}
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Hot deals · 6 col */}
          <div className="col-span-6 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Hot deals · ação prioritária</CardTitle>
                <LeadScore temperature="hot" size="sm" showLabel={false} />
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {hotDeals.map((d) => (
                    <DealCard key={d.id} deal={d} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity feed · 7 col */}
          <div className="col-span-7 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Atividade · ao vivo</CardTitle>
                <Badge tone="success" pulse>Live</Badge>
              </CardHeader>
              <CardContent>
                <Timeline items={activity} />
              </CardContent>
            </Card>
          </div>

          {/* Bar chart · forecast · 5 col */}
          <div className="col-span-5 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Forecast 90 dias</CardTitle>
              </CardHeader>
              <CardContent>
                <VerticalBar
                  data={[
                    { label: 'Jun', value: 8.7 },
                    { label: 'Jul', value: 11.2 },
                    { label: 'Ago', value: 13.4 },
                  ]}
                  tone="brand"
                  height={180}
                />
                <div className="mono mt-2 text-center text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  Ponderado por probabilidade
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compromissos · 12 col */}
          <div className="col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Compromissos da semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {[
                    { lbl: 'Reunião com cliente Andrade · proposta final', date: 'amanhã · 14h', prio: 'danger' as const, prog: 0 },
                    { lbl: 'Apresentação Yachthouse 2104 · render', date: 'quinta · 10h', prio: 'warning' as const, prog: 30 },
                    { lbl: 'Follow-up Sky Resort · cliente esfriou', date: 'sexta · 16h', prio: 'brand' as const, prog: 60 },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_auto_120px_60px] items-center gap-4 rounded-[10px] border p-3.5 max-[760px]:grid-cols-1"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                    >
                      <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
                        {c.lbl}
                      </span>
                      <Badge tone={c.prio}>{c.date}</Badge>
                      <Progress value={c.prog} tone={c.prio === 'danger' ? 'danger' : 'brand'} />
                      <span className="mono text-right text-[11px] font-bold" style={{ color: 'var(--text)' }}>
                        {c.prog}%
                      </span>
                    </div>
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
