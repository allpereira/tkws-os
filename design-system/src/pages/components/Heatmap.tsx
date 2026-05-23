import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Heatmap } from '@/components/tkws/charts'
import type { AIPrompt } from '@/lib/prompts'

// 7 dias × 20 colunas (semanas)
const rows = 7
const cols = 20
const data = Array.from({ length: rows }).map(() =>
  Array.from({ length: cols }).map(() => Math.random() * Math.random())
)

const labelsY = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const labelsX = Array.from({ length: cols }).map((_, i) => `W${i + 1}`)

const prompt: AIPrompt = {
  componente: 'Heatmap',
  import: "import { Heatmap } from '@/components/tkws/charts'",
  contexto:
    'Heatmap calendar-style · grid de células com intensidade de cor (rgba do brand). Use para densidade temporal (atividade do squad por dia/semana) ou matrizes de risco/performance.',
  quandoUsar: [
    'Atividade por dia/semana (contributions style)',
    'Matriz de risco (impacto x probabilidade)',
    'Densidade de ocorrências em grid temporal',
  ],
  props: [
    { name: 'rows / cols', type: 'number', description: 'Dimensão do grid' },
    { name: 'data', type: 'number[rows][cols]', description: 'Valores 0..1' },
    { name: 'labelsX / labelsY', type: 'string[]', description: 'Eixos' },
    { name: 'scale', type: 'string[]', description: '4 cores do gradient · brand-soft → brand' },
  ],
  antiPatterns: [
    'Heatmap sem legenda de intensidade',
    'Escala demais (10+ steps) · perde leitura',
  ],
  exemplo: `<Heatmap
  rows={7} cols={20}
  data={matrix}
  labelsY={['D','S','T','Q','Q','S','S']}
  labelsX={Array.from({length:20}).map((_,i) => 'W'+i)}
/>`,
  relacionados: ['LineChart', 'BarChart'],
}

export function HeatmapPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="13.5"
        category="Charts · Heatmap"
        title="Heatmap"
        italic="densidade temporal"
        description="Grid de células com intensidade. Ideal para atividade por dia/semana."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Atividade do squad · últimas 20 semanas" />
      <Showcase>
        <Heatmap rows={rows} cols={cols} data={data} labelsX={labelsX} labelsY={labelsY} />
      </Showcase>
    </div>
  )
}
