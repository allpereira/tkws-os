import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { KpiHero, KpiMini } from '@/components/tkws/kpi'
import type { AIPrompt } from '@/lib/prompts'

const series = [
  { label: 'jan', value: 32 },
  { label: 'fev', value: 42 },
  { label: 'mar', value: 38 },
  { label: 'abr', value: 55 },
  { label: 'mai', value: 64 },
  { label: 'jun', value: 71 },
  { label: 'jul', value: 87 },
]

const prompt: AIPrompt = {
  componente: 'KpiHero · KpiMini',
  import: "import { KpiHero, KpiMini } from '@/components/tkws/kpi'",
  contexto:
    'KpiHero = card grande com sparkline (Dashboard). KpiMini = tile compacto para grids 4-6 KPIs. Sempre formate moeda com Intl.NumberFormat. Tone semântico no delta (success/danger).',
  quandoUsar: [
    'Dashboard · 3-4 KpiHero principais + grid de KpiMini',
    'Detail screen · KPIs do registro',
    'KPIs em cards de cliente / projeto',
  ],
  props: [
    { name: 'label / value', type: 'string', description: 'Texto principal' },
    { name: 'delta', type: '{ value, trend: "up"|"down"|"neutral" }', description: 'Comparativo' },
    { name: 'series', type: 'KpiSeriesPoint[]', description: 'Sparkline (só KpiHero)' },
    { name: 'hint', type: 'string', description: 'Sublabel' },
  ],
  antiPatterns: [
    'KPI sem unidade (sem R$ ou %)',
    'Delta sem cor semântica',
    'Sparkline sem contexto (qual período?)',
  ],
  exemplo: `<KpiHero
  label="Portfólio em obra"
  value={formatCurrency(8_740_000)}
  hint="42 projetos ativos"
  delta={{ value: '+12,4% MoM', trend: 'up' }}
  series={lastSevenMonths}
/>

<KpiMini label="Margem alvo" value="32%" hint="vs 30% planejado" tone="success" />`,
  relacionados: ['GoalRing', 'Donut', 'LineChart'],
}

export function KpiPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="13.1"
        category="Charts · KPI"
        title="KPI Hero · Mini"
        italic="dashboard"
        description="Hero grande com sparkline. Mini para grids. Sempre tone semântico no delta."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="KPI Hero · com sparkline" />
      <Showcase>
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          <KpiHero
            label="Portfólio em obra"
            value="R$ 8,74M"
            hint="42 projetos ativos · 7 squads"
            delta={{ value: '+12,4% MoM', trend: 'up' }}
            series={series}
          />
          <KpiHero
            label="Margem consolidada"
            value="31,2%"
            hint="vs 30% planejado"
            delta={{ value: '+1,2pp', trend: 'up' }}
            series={series.map((s) => ({ ...s, value: s.value * 0.8 }))}
          />
        </div>
      </Showcase>

      <SubHead num="B" title="KPI Mini · grid compacto" />
      <Showcase>
        <div className="grid grid-cols-4 gap-3 max-[760px]:grid-cols-2">
          <KpiMini label="No prazo" value="38" hint="de 43 projetos" tone="success" />
          <KpiMini label="Atrasados" value="5" hint="8 dias média" tone="danger" />
          <KpiMini label="Em revisão" value="12" hint="aguardando cliente" tone="warning" />
          <KpiMini label="Squads ativos" value="7" hint="38 pessoas" tone="brand" />
        </div>
      </Showcase>
    </div>
  )
}
