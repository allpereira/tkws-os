import { Activity, Calendar as CalIcon, Download, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { TkwsHeader } from '@/components/tkws/header'
import { KpiHero, KpiMini } from '@/components/tkws/kpi'
import { Donut, LineSeriesChart, VerticalBar, Heatmap } from '@/components/tkws/charts'
import { GoalRing } from '@/components/ui/goal-ring'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Timeline, type TimelineItem } from '@/components/tkws/timeline'
import type { AIPrompt } from '@/lib/prompts'

const series = [
  { label: 'jan', value: 32 }, { label: 'fev', value: 42 }, { label: 'mar', value: 38 },
  { label: 'abr', value: 55 }, { label: 'mai', value: 64 }, { label: 'jun', value: 71 }, { label: 'jul', value: 87 },
]

const lineData = [
  { label: 'Jan', Orion: 4.2, Apollo: 2.1, Neptune: 1.8 },
  { label: 'Fev', Orion: 5.1, Apollo: 2.8, Neptune: 2.1 },
  { label: 'Mar', Orion: 6.3, Apollo: 3.2, Neptune: 2.4 },
  { label: 'Abr', Orion: 5.8, Apollo: 4.1, Neptune: 3.0 },
  { label: 'Mai', Orion: 7.4, Apollo: 4.6, Neptune: 3.2 },
  { label: 'Jun', Orion: 8.2, Apollo: 5.1, Neptune: 3.8 },
  { label: 'Jul', Orion: 9.0, Apollo: 5.5, Neptune: 4.2 },
]

const barData = [
  { label: 'Q1', value: 14.2 },
  { label: 'Q2', value: 21.8 },
  { label: 'Q3', value: 18.4 },
  { label: 'Q4', value: 25.1 },
]

const donutData = [
  { name: 'Orion', value: 42, color: 'var(--purple)' },
  { name: 'Apollo', value: 28, color: 'var(--pink)' },
  { name: 'Neptune', value: 18, color: 'var(--brand)' },
  { name: 'Outros', value: 12, color: 'var(--text-mute)' },
]

const heatmapData = Array.from({ length: 7 }).map(() => Array.from({ length: 20 }).map(() => Math.random() * Math.random()))

const activity: TimelineItem[] = [
  { id: '1', meta: 'AGORA · 09:42', title: 'Yachthouse 2104 · cliente aprovou orçamento revisto', tone: 'success' },
  { id: '2', meta: 'há 12 min', title: 'Cobertura Titanium passou para "Decoração"', tone: 'brand' },
  { id: '3', meta: 'há 1h', title: 'Squad Apollo · 3 cotações respondidas', tone: 'neutral' },
  { id: '4', meta: 'hoje · 08:14', title: 'Atraso reportado em Vitra 1801', tone: 'danger' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Dashboard',
  import: '// Composição: Header + KPI strip + grid de cards com Charts',
  contexto:
    'Dashboard executivo · LEITURA · não CRUD. Hero KPIs no topo · grid com charts e north-star metric · activity feed lateral. Use grid 12-col com spans variando entre cards.',
  quandoUsar: [
    'Home executiva do escritório',
    'Visão consolidada do portfólio',
    'Cockpit do líder de squad',
  ],
  props: [],
  antiPatterns: [
    'Dashboard como CRUD (criar/editar)',
    'Mais de 15 charts numa única tela · vire abas',
    'Sem range picker · usuário não consegue mudar período',
  ],
  exemplo: `// Grid 12-col padrão TKWS:
<div className="grid grid-cols-12 gap-4">
  <div className="col-span-8"><MainChart /></div>
  <div className="col-span-4"><GoalRing /></div>
  <div className="col-span-3"><KpiMini /></div>
  ...
</div>`,
  relacionados: ['KPI', 'LineChart', 'Donut', 'Timeline'],
}

export function DashboardPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P28"
        category="Pattern · Dashboard"
        title="Dashboard Cockpit"
        italic="cockpit executivo"
        description="Home consolidada · KPIs hero + charts + activity feed. Apenas leitura, sem CRUD."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Dashboard executivo · maio 2026" />
      <Showcase padding="comfortable">
        <TkwsHeader
          crumb="Operação · Dashboard"
          title="Bom dia, time."
          italic="R$ 87,4M em portfólio · 43 projetos"
          description="Visão consolidada do escritório · mensal · período: maio/2026"
          actions={
            <>
              <Button variant="outline" size="sm">
                <CalIcon size={12} /> Maio 2026
              </Button>
              <Button variant="outline" size="sm">
                <Download size={12} /> PDF executivo
              </Button>
            </>
          }
        />

        {/* North star + KPIs */}
        <div className="mt-7 grid grid-cols-12 gap-4">
          <div
            className="col-span-12 flex items-center justify-between rounded-2xl border p-7 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4"
            style={{
              background: 'linear-gradient(135deg, var(--brand-soft) 0%, transparent 60%), var(--surface-1)',
              borderColor: 'var(--brand)',
            }}
          >
            <div>
              <div className="mono text-[10px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--brand)' }}>
                North star · maio
              </div>
              <div className="serif mt-2 text-[clamp(48px,7vw,80px)] font-light leading-none tracking-tight" style={{ color: 'var(--text)' }}>
                R$ 12,8M
              </div>
              <div className="mt-2 inline-flex items-center gap-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                <Badge tone="success"><TrendingUp size={11} /> +18% vs mês anterior</Badge>
                Receita recorrente projetada do trimestre
              </div>
            </div>
            <div className="h-24 w-72 max-[760px]:w-full">
              <LineSeriesChart
                data={lineData}
                series={[{ name: 'Orion', color: 'var(--brand)' }]}
                height={96}
              />
            </div>
          </div>

          {/* KPI Hero · 3 col */}
          {[
            { lbl: 'Portfólio em obra', val: 'R$ 8,74M', hint: '42 projetos ativos', delta: '+12,4% MoM' as string, trend: 'up' as const },
            { lbl: 'Margem consolidada', val: '31,2%', hint: 'vs 30% planejado', delta: '+1,2pp', trend: 'up' as const },
            { lbl: 'NPS clientes', val: '9,1', hint: '17 reviews', delta: '-0,2', trend: 'down' as const },
          ].map((k) => (
            <div key={k.lbl} className="col-span-4 max-[760px]:col-span-12">
              <KpiHero label={k.lbl} value={k.val} hint={k.hint} delta={{ value: k.delta, trend: k.trend }} series={series} />
            </div>
          ))}

          {/* KPI Mini · 4 col */}
          <div className="col-span-12 grid grid-cols-4 gap-3 max-[760px]:grid-cols-2">
            <KpiMini label="No prazo" value="38" hint="de 43" tone="success" />
            <KpiMini label="Atrasados" value="5" hint="8d média" tone="danger" />
            <KpiMini label="Em revisão" value="12" hint="cliente" tone="warning" />
            <KpiMini label="Squads ativos" value="7" hint="38 pessoas" tone="brand" />
          </div>

          {/* Line chart big · 8 col */}
          <div className="col-span-8 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Receita por squad · últimos 7 meses</CardTitle>
                <Badge tone="brand"><Activity size={11} /> R$ M / mês</Badge>
              </CardHeader>
              <CardContent>
                <LineSeriesChart
                  data={lineData}
                  series={[
                    { name: 'Orion', color: 'var(--purple)' },
                    { name: 'Apollo', color: 'var(--pink)' },
                    { name: 'Neptune', color: 'var(--brand)' },
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          {/* Donut · 4 col */}
          <div className="col-span-4 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Portfólio por squad</CardTitle>
              </CardHeader>
              <CardContent>
                <Donut data={donutData} height={220} />
              </CardContent>
            </Card>
          </div>

          {/* Goal rings · 4 col */}
          <div className="col-span-4 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Saúde · 3 dimensões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-around">
                  <GoalRing value={82} sublabel="No prazo" tone="success" size={92} thickness={8} />
                  <GoalRing value={31} sublabel="Margem" tone="warning" size={92} thickness={8} />
                  <GoalRing value={91} sublabel="NPS" tone="brand" size={92} thickness={8} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bar · 4 col */}
          <div className="col-span-4 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Receita por trimestre</CardTitle>
              </CardHeader>
              <CardContent>
                <VerticalBar data={barData} tone="brand" height={200} />
              </CardContent>
            </Card>
          </div>

          {/* Activity · 4 col */}
          <div className="col-span-4 max-[900px]:col-span-12">
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

          {/* Heatmap · 12 col */}
          <div className="col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Atividade do escritório · últimas 20 semanas</CardTitle>
              </CardHeader>
              <CardContent>
                <Heatmap rows={7} cols={20} data={heatmapData} labelsY={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']} />
              </CardContent>
            </Card>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
