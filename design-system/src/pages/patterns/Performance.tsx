import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { GoalRing } from '@/components/ui/goal-ring'
import { KpiHero, KpiMini } from '@/components/tkws/kpi'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Heatmap } from '@/components/tkws/charts'
import { TrendingDown, TrendingUp } from 'lucide-react'
import type { AIPrompt } from '@/lib/prompts'

const krs = [
  { name: 'Margem média do portfólio', target: '≥ 30%', actual: '31,2%', pct: 104, tone: 'success' as const },
  { name: 'NPS clientes (mensal)', target: '≥ 9,0', actual: '9,1', pct: 101, tone: 'success' as const },
  { name: 'Atraso médio em obra', target: '≤ 3 dias', actual: '8 dias', pct: 38, tone: 'danger' as const },
  { name: 'Tempo médio de orçamento', target: '≤ 5 dias', actual: '4,2 dias', pct: 119, tone: 'success' as const },
  { name: 'Taxa de conversão de orçamentos', target: '≥ 65%', actual: '58%', pct: 89, tone: 'warning' as const },
]

const squads = [
  { name: 'Orion', leader: 'Lucas Z.', projects: 18, revenue: 'R$ 42,1M', score: 92, tone: 'success' as const },
  { name: 'Apollo', leader: 'Ana V.', projects: 14, revenue: 'R$ 28,3M', score: 84, tone: 'success' as const },
  { name: 'Neptune', leader: 'João Q.', projects: 11, revenue: 'R$ 17,0M', score: 72, tone: 'warning' as const },
]

const heatmap = Array.from({ length: 7 }).map(() => Array.from({ length: 20 }).map(() => Math.random() * Math.random()))

const prompt: AIPrompt = {
  componente: 'Pattern · Performance & Medição',
  import: '// Composição: OKRs/KRs + leaderboard de squads + heatmap de atividade',
  contexto:
    'Tela de Performance · OKRs/KRs com target vs actual, leaderboard de squads, heatmap de atividade. Use cor semântica (verde acima target, vermelho abaixo). Para muitos squads, ordene por score.',
  quandoUsar: [
    'Quarterly review · CEO / líderes',
    'Daily report · ops manager',
    'Dashboard de KR/OKR',
  ],
  props: [],
  antiPatterns: [
    'KRs sem target visível · perde contexto',
    'Leaderboard sem comparativo do mês anterior',
  ],
  exemplo: `<KRRow name="Margem média" target="≥30%" actual="31,2%" pct={104} tone="success" />`,
  relacionados: ['KPI', 'GoalRing', 'Progress'],
}

export function PerformancePattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P30"
        category="Pattern · Performance"
        title="Performance & Medição"
        italic="OKRs · leaderboard · atividade"
        description="Tela de medição com KRs (target vs actual), leaderboard e heatmap de atividade."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Performance Q2/2026" />
      <Showcase padding="comfortable">
        {/* Hero KPIs */}
        <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          <KpiHero label="Receita Q2 (projeção)" value="R$ 21,8M" delta={{ value: '+18,4% YoY', trend: 'up' }} hint="Meta: R$ 20M" series={[
            { label: 'Abr', value: 6.4 }, { label: 'Mai', value: 7.8 }, { label: 'Jun', value: 7.6 },
          ]} />
          <KpiHero label="Margem consolidada" value="31,2%" delta={{ value: '+1,2pp', trend: 'up' }} hint="Meta: ≥ 30%" series={[
            { label: 'Abr', value: 28 }, { label: 'Mai', value: 30 }, { label: 'Jun', value: 31.2 },
          ]} />
          <KpiHero label="NPS médio" value="9,1" delta={{ value: '-0,2', trend: 'down' }} hint="Meta: ≥ 9,0" series={[
            { label: 'Abr', value: 8.9 }, { label: 'Mai', value: 9.3 }, { label: 'Jun', value: 9.1 },
          ]} />
        </div>

        {/* KRs · target vs actual */}
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>Key Results · Q2</CardTitle>
            <Badge tone="brand">5 KRs ativos</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {krs.map((kr) => (
                <div
                  key={kr.name}
                  className="grid grid-cols-[1fr_auto_120px_60px] items-center gap-4 rounded-lg border p-3.5 max-[760px]:grid-cols-1"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                >
                  <div>
                    <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                      {kr.name}
                    </div>
                    <div className="mono mt-0.5 text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                      Target: {kr.target}
                    </div>
                  </div>
                  <div className="serif text-[22px] font-light leading-none" style={{ color: 'var(--text)' }}>
                    {kr.actual}
                  </div>
                  <Progress value={Math.min(100, kr.pct)} tone={kr.tone} />
                  <Badge tone={kr.tone}>
                    {kr.pct >= 100 ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {kr.pct}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard squads */}
        <div className="mt-5 grid grid-cols-12 gap-4">
          <div className="col-span-7 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Squads · leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="grid gap-3">
                  {squads.map((s, i) => (
                    <li
                      key={s.name}
                      className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-3 rounded-lg border p-3"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                    >
                      <span className="mono text-[18px] font-bold" style={{ color: i === 0 ? 'var(--brand)' : 'var(--text-mute)' }}>
                        {i + 1}
                      </span>
                      <Avatar size="md" style={{ background: s.name === 'Orion' ? 'var(--purple)' : s.name === 'Apollo' ? 'var(--pink)' : 'var(--brand)' }}>
                        <AvatarFallback>{s.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
                          Squad {s.name}
                        </div>
                        <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                          {s.leader} · {s.projects} projetos · {s.revenue}
                        </div>
                      </div>
                      <div className="serif text-[24px] font-light leading-none" style={{ color: 'var(--text)' }}>
                        {s.score}
                      </div>
                      <Badge tone={s.tone}>score</Badge>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-5 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Saúde do trimestre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-around">
                  <GoalRing value={82} sublabel="No prazo" tone="success" size={100} thickness={9} />
                  <GoalRing value={59} sublabel="Margem" tone="warning" size={100} thickness={9} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <KpiMini label="Pessoas" value="38" hint="6 squads ativos" tone="brand" />
                  <KpiMini label="Turnover Q2" value="3%" hint="vs 5% Q1" tone="success" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Atividade do escritório · últimas 20 semanas</CardTitle>
              </CardHeader>
              <CardContent>
                <Heatmap rows={7} cols={20} data={heatmap} labelsY={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']} />
              </CardContent>
            </Card>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
