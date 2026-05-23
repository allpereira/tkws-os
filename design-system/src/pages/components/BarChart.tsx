import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { VerticalBar } from '@/components/tkws/charts'
import type { AIPrompt } from '@/lib/prompts'

const data = [
  { label: 'Jan', value: 4.2 },
  { label: 'Fev', value: 5.8 },
  { label: 'Mar', value: 6.4 },
  { label: 'Abr', value: 5.1 },
  { label: 'Mai', value: 7.9 },
  { label: 'Jun', value: 8.7 },
  { label: 'Jul', value: 9.1 },
]

const prompt: AIPrompt = {
  componente: 'BarChart',
  import: "import { VerticalBar } from '@/components/tkws/charts'",
  contexto:
    'Bar chart vertical (recharts) · ideal para séries temporais discretas (mês, semana, dia) ou rankings. Use tone semântico para colorir conforme contexto (success se acima do target).',
  quandoUsar: [
    'Receita por mês · contratos por trimestre',
    'Ranking de fornecedores · top N',
    'Conversão por etapa · funil curto',
  ],
  props: [
    { name: 'data', type: '{ label, value }[]', description: 'Pontos' },
    { name: 'tone', type: '"brand" | "success" | "warning" | "danger"', description: 'Cor da barra' },
    { name: 'height', type: 'number', description: 'Default 220' },
  ],
  antiPatterns: [
    'Bar chart com 40+ pontos · vire LineChart',
    'Eixo Y truncado em escala que distorce (sem indicar)',
  ],
  exemplo: `<VerticalBar data={monthlyRevenue} tone="brand" height={240} />`,
  relacionados: ['LineChart', 'Donut'],
}

export function BarChartPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="13.3"
        category="Charts · Bar Chart"
        title="Bar Chart"
        italic="séries temporais · rankings"
        description="Vertical bars para mês/semana/dia. Para muitos pontos, use LineChart."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Receita mensal · R$ M" />
      <Showcase>
        <VerticalBar data={data} tone="brand" />
      </Showcase>
    </div>
  )
}
