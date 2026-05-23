import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { GoalRing } from '@/components/ui/goal-ring'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'GoalRing',
  import: "import { GoalRing } from '@/components/ui/goal-ring'",
  contexto:
    'Progresso circular para KPIs vs target. Mostra valor centralizado em Fraunces light. Use tone semântico (success ≥ target, warning entre, danger < 70% do target). Para barra horizontal em listas, use Progress.',
  quandoUsar: [
    'KPI hero · obra concluída, margem atingida, satisfação',
    'Health rings em dashboards',
    'Resumo visual de metas',
  ],
  props: [
    { name: 'value', type: 'number (0-100)', description: 'Percentual' },
    { name: 'label / sublabel', type: 'string', description: 'Customiza texto central' },
    { name: 'size / thickness', type: 'number', description: 'Tamanho e espessura · default 120/10' },
    { name: 'tone', type: '"brand" | "success" | "warning" | "danger"', description: 'Cor' },
  ],
  antiPatterns: [
    'GoalRing com label muito longo · use Progress horizontal',
    'GoalRing sem comparação clara com target',
  ],
  exemplo: `<GoalRing value={82} sublabel="do orçamento" tone="success" />`,
  relacionados: ['Progress', 'KPI'],
}

export function GoalRingPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="10.6"
        category="Feedback · Goal Ring"
        title="Goal Ring"
        italic="progresso circular"
        description="Anel SVG com valor central. Use para KPIs vs target em dashboards. Tone semântico."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Tons" />
      <Showcase>
        <div className="flex flex-wrap gap-8">
          <GoalRing value={92} sublabel="no prazo" tone="success" />
          <GoalRing value={64} sublabel="margem" tone="warning" />
          <GoalRing value={28} sublabel="obra" tone="danger" />
          <GoalRing value={82} sublabel="orçamento" tone="brand" />
        </div>
      </Showcase>

      <SubHead num="B" title="Customizado · label central" />
      <Showcase>
        <GoalRing value={73} label="R$ 8,7M" sublabel="de 12,0M" tone="brand" size={160} thickness={12} />
      </Showcase>
    </div>
  )
}
