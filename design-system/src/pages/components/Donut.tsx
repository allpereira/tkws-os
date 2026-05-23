import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Donut } from '@/components/tkws/charts'
import type { AIPrompt } from '@/lib/prompts'

const data = [
  { name: 'Orion', value: 42, color: 'var(--purple)' },
  { name: 'Apollo', value: 28, color: 'var(--pink)' },
  { name: 'Neptune', value: 18, color: 'var(--brand)' },
  { name: 'Outros', value: 12, color: 'var(--text-mute)' },
]

const prompt: AIPrompt = {
  componente: 'Donut',
  import: "import { Donut } from '@/components/tkws/charts'",
  contexto:
    'Donut chart (recharts) · use para portfólio breakdown (squad, status, modalidade) com 3-7 fatias. Acima de 7, vire BarChart horizontal. Sempre passe color por dado para usar tokens TKWS.',
  quandoUsar: [
    'Portfólio breakdown · % do total',
    'Composição de receita por categoria',
    'Distribuição de carga por squad',
  ],
  props: [
    { name: 'data', type: '{ name, value, color? }[]', description: 'Series · 3-7 fatias ideal' },
    { name: 'innerRadius / outerRadius', type: 'number', description: 'Ajusta espessura' },
  ],
  antiPatterns: [
    'Donut com 12+ fatias · use BarChart',
    'Cores hex inline · use var(--…)',
    'Sem legenda · perde leitura',
  ],
  exemplo: `<Donut data={[
  { name: 'Orion', value: 42, color: 'var(--purple)' },
  { name: 'Apollo', value: 28, color: 'var(--pink)' },
  { name: 'Outros', value: 30, color: 'var(--text-mute)' }
]} />`,
  relacionados: ['BarChart', 'KPI'],
}

export function DonutPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="13.2"
        category="Charts · Donut"
        title="Donut"
        italic="portfólio breakdown"
        description="Use para 3-7 fatias. Cores via tokens TKWS. Acima de 7, vire BarChart horizontal."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Portfólio por squad" />
      <Showcase>
        <Donut data={data} />
      </Showcase>
    </div>
  )
}
