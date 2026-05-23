import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { LineSeriesChart } from '@/components/tkws/charts'
import type { AIPrompt } from '@/lib/prompts'

const data = [
  { label: 'Jan', Orion: 4.2, Apollo: 2.1, Neptune: 1.8 },
  { label: 'Fev', Orion: 5.1, Apollo: 2.8, Neptune: 2.1 },
  { label: 'Mar', Orion: 6.3, Apollo: 3.2, Neptune: 2.4 },
  { label: 'Abr', Orion: 5.8, Apollo: 4.1, Neptune: 3.0 },
  { label: 'Mai', Orion: 7.4, Apollo: 4.6, Neptune: 3.2 },
  { label: 'Jun', Orion: 8.2, Apollo: 5.1, Neptune: 3.8 },
  { label: 'Jul', Orion: 9.0, Apollo: 5.5, Neptune: 4.2 },
]

const prompt: AIPrompt = {
  componente: 'LineChart',
  import: "import { LineSeriesChart } from '@/components/tkws/charts'",
  contexto:
    'Line chart multi-series · ideal para comparar 2-5 séries ao longo do tempo (receita por squad, margem por mês). Cores das séries via tokens TKWS por padrão (brand, purple, success).',
  quandoUsar: [
    'Comparar performance temporal entre squads/categorias',
    'Tendências de margem, receita, custo',
    'Pontos de muitos dados sem ruído (use BarChart para discretos curtos)',
  ],
  props: [
    { name: 'data', type: 'LinePoint[]', description: 'Pontos com chave label + valores por série' },
    { name: 'series', type: '{ name, color? }[]', description: 'Séries a desenhar' },
    { name: 'height', type: 'number', description: 'Default 240' },
  ],
  antiPatterns: [
    'Mais de 5 séries · vire chart small-multiples',
    'Cores próximas · use tokens distintos',
  ],
  exemplo: `<LineSeriesChart
  data={dataByMonth}
  series={[
    { name: 'Orion', color: 'var(--purple)' },
    { name: 'Apollo', color: 'var(--pink)' },
    { name: 'Neptune', color: 'var(--brand)' }
  ]}
/>`,
  relacionados: ['BarChart', 'KPI hero'],
}

export function LineChartPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="13.4"
        category="Charts · Line Chart"
        title="Line Chart"
        italic="multi-series · temporal"
        description="Compare 2-5 séries no tempo. Cores via tokens TKWS."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Receita por squad" italic="R$ M / mês" />
      <Showcase>
        <LineSeriesChart
          data={data}
          series={[
            { name: 'Orion', color: 'var(--purple)' },
            { name: 'Apollo', color: 'var(--pink)' },
            { name: 'Neptune', color: 'var(--brand)' },
          ]}
        />
      </Showcase>
    </div>
  )
}
