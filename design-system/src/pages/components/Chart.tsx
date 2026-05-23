import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { ChartContainer, ChartLegend, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { AIPrompt } from '@/lib/prompts'

const data = [
  { month: 'Jan', orion: 4.2, apollo: 2.1 },
  { month: 'Fev', orion: 5.1, apollo: 2.8 },
  { month: 'Mar', orion: 6.3, apollo: 3.2 },
  { month: 'Abr', orion: 5.8, apollo: 4.1 },
  { month: 'Mai', orion: 7.4, apollo: 4.6 },
  { month: 'Jun', orion: 8.2, apollo: 5.1 },
]

const config: ChartConfig = {
  orion: { label: 'Squad Orion', color: 'var(--purple)' },
  apollo: { label: 'Squad Apollo', color: 'var(--pink)' },
}

const prompt: AIPrompt = {
  componente: 'Chart (wrapper)',
  import: "import { ChartContainer, ChartTooltipContent, ChartLegend, type ChartConfig } from '@/components/ui/chart'\nimport { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'",
  contexto:
    'Wrapper shadcn-style sobre recharts. ChartContainer aplica aspecto e tokens · ChartTooltipContent/ChartLegend respeitam a paleta TKWS automaticamente. Use config tipado para vincular dataKey → { label, color }.',
  quandoUsar: [
    'Charts customizados (não cobertos pelos atalhos KPI/Donut/Bar)',
    'Quando precisar tipar series via config',
    'Quando o usuário deve configurar visibilidade de séries',
  ],
  props: [
    { name: 'config (ChartContainer)', type: 'ChartConfig', description: 'Map dataKey → { label, color }' },
    { name: 'aspect (ChartContainer)', type: 'number', description: 'Default 16/9 · controla altura' },
  ],
  antiPatterns: [
    'Cores hex inline no recharts · use var(--…) via config',
    'Tooltip default do recharts em dark · vire ChartTooltipContent',
  ],
  exemplo: `const config: ChartConfig = {
  revenue: { label: 'Receita', color: 'var(--brand)' }
}

<ChartContainer config={config}>
  <BarChart data={data}>
    <CartesianGrid stroke="var(--line-1)" />
    <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-mute)' }} />
    <YAxis tick={{ fontSize: 10, fill: 'var(--text-mute)' }} />
    <Tooltip content={<ChartTooltipContent />} />
    <Legend content={<ChartLegend />} />
    <Bar dataKey="revenue" fill="var(--brand)" radius={[6,6,0,0]} />
  </BarChart>
</ChartContainer>`,
  relacionados: ['BarChart', 'LineChart', 'KPI'],
}

export function ChartPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="13.6"
        category="Charts · Wrapper"
        title="Chart"
        italic="recharts + tokens TKWS"
        description="Container shadcn-style para recharts. Config tipado mapeia dataKey → { label, color }."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="BarChart customizado" />
      <Showcase>
        <ChartContainer config={config} aspect={16 / 7}>
          <BarChart data={data} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--line-1)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-mute)' }} axisLine={{ stroke: 'var(--line-2)' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-mute)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--surface-3)', opacity: 0.5 }} />
            <Legend content={<ChartLegend />} />
            <Bar dataKey="orion" fill="var(--purple)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="apollo" fill="var(--pink)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </Showcase>
    </div>
  )
}
