import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { SalesFunnel, type FunnelStage } from '@/components/tkws/crm-pipeline'
import type { AIPrompt } from '@/lib/prompts'

const stages: FunnelStage[] = [
  { id: 'lead', label: 'Lead', count: 84, value: 14_200_000_000, conversion: 62 },
  { id: 'qual', label: 'Qualificado', count: 52, value: 9_800_000_000, conversion: 48 },
  { id: 'prop', label: 'Proposta', count: 25, value: 6_400_000_000, conversion: 56 },
  { id: 'neg', label: 'Negociação', count: 14, value: 4_200_000_000, conversion: 71 },
  { id: 'won', label: 'Fechado', count: 10, value: 3_100_000_000, color: 'var(--success)' },
]

const prompt: AIPrompt = {
  componente: 'CRM · SalesFunnel',
  import: "import { SalesFunnel, type FunnelStage } from '@/components/tkws/crm-pipeline'",
  contexto:
    'Funil de vendas visual em SVG · cada estágio é um trapézio com largura proporcional ao count. Mostra count + valor + conversão entre estágios. Diferente do Kanban (operacional): o Funnel é EXECUTIVO/DASHBOARD.',
  quandoUsar: [
    'Dashboard CRM · visão executiva',
    'Forecast widget no Dashboard',
    'Apresentação ao C-level',
  ],
  props: [
    { name: 'stages', type: 'FunnelStage[]', description: '{ id, label, count, value (cents), conversion?, color? }' },
    { name: 'height', type: 'number', description: 'Altura · default 280px' },
  ],
  antiPatterns: [
    'Funnel para operação diária · use Kanban',
    '8+ estágios · vire chart de barras',
    'Sem taxas de conversão · perde a insight principal',
  ],
  exemplo: `<SalesFunnel
  stages={[
    { id: 'lead', label: 'Lead', count: 84, value: 14_200_000_000, conversion: 62 },
    { id: 'qual', label: 'Qualificado', count: 52, value: 9_800_000_000, conversion: 48 },
    { id: 'won', label: 'Fechado', count: 10, value: 3_100_000_000, color: 'var(--success)' }
  ]}
/>`,
  relacionados: ['Kanban', 'StageStepper', 'Donut'],
}

export function CrmFunnelPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="CRM.5"
        category="CRM · SalesFunnel"
        title="Sales Funnel"
        italic="funil executivo"
        description="Funil de vendas em SVG · trapézios proporcionais. Conversão entre estágios destacada. Dashboard, não operacional."
        tag="visão executiva"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Funil completo · 5 estágios" />
      <Showcase>
        <SalesFunnel stages={stages} />
      </Showcase>

      <SubHead num="B" title="Compacto · 3 estágios" />
      <Showcase>
        <SalesFunnel
          height={200}
          stages={[
            { id: 'lead', label: 'Lead', count: 84, value: 14_200_000_000, conversion: 48 },
            { id: 'neg', label: 'Negociando', count: 40, value: 8_900_000_000, conversion: 65 },
            { id: 'won', label: 'Ganho', count: 26, value: 5_800_000_000, color: 'var(--success)' },
          ]}
        />
      </Showcase>
    </div>
  )
}
