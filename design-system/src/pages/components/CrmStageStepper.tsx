import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { StageStepper } from '@/components/tkws/crm-stage-stepper'
import type { AIPrompt } from '@/lib/prompts'

const stages = [
  { id: 'lead', label: 'Lead' },
  { id: 'qualified', label: 'Qualificado' },
  { id: 'proposal', label: 'Proposta' },
  { id: 'negotiation', label: 'Negociação' },
  { id: 'won', label: 'Fechado · ganho' },
]

const prompt: AIPrompt = {
  componente: 'CRM · StageStepper',
  import: "import { StageStepper } from '@/components/tkws/crm-stage-stepper'",
  contexto:
    'Indicador horizontal de estágio do funil de vendas. Read + Update · click avança estágio. Diferente do WizardSteps (criação multi-step): este READ + UPDATE do estágio de um deal já criado.',
  quandoUsar: [
    'Topo do Deal/Lead detail',
    'Modal de "Mover deal" (com onChange)',
    'Header de Contact Detail mostrando estágio atual',
  ],
  props: [
    { name: 'stages', type: 'Stage[]', description: '{ id, label, tone? }' },
    { name: 'current', type: 'number', description: 'Índice atual' },
    { name: 'onChange', type: '(i) => void', description: 'Click muda estágio · dispara mutation' },
    { name: 'allowBack', type: 'boolean', description: 'Permite voltar · default true' },
  ],
  antiPatterns: [
    'Stepper sem onChange · vire read-only com componente diferente',
    '8+ estágios · simplifique o funil',
    'Misturar tons sem motivo · use tone só em estágios especiais (won/lost)',
  ],
  exemplo: `const [stage, setStage] = useState(2)

<StageStepper
  stages={[
    { id: 'lead', label: 'Lead' },
    { id: 'qual', label: 'Qualificado' },
    { id: 'won', label: 'Ganho', tone: 'success' }
  ]}
  current={stage}
  onChange={(i) => { setStage(i); mutate({ stage: i }) }}
/>`,
  relacionados: ['WizardSteps', 'Pipeline funnel'],
}

export function CrmStageStepperPage() {
  const [current, setCurrent] = useState(2)
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="CRM.3"
        category="CRM · StageStepper"
        title="Stage Stepper"
        italic="estágio do funil"
        description="Read + Update do estágio do deal. Click avança · diferente de WizardSteps (criação)."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Estágios do funil · click para mover" />
      <Showcase>
        <StageStepper stages={stages} current={current} onChange={setCurrent} />
        <div className="mono mt-4 text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
          Estágio atual: {stages[current]?.label}
        </div>
      </Showcase>

      <SubHead num="B" title="Estágios com tom · won/lost" />
      <Showcase>
        <StageStepper
          stages={[
            { id: 'lead', label: 'Lead' },
            { id: 'qual', label: 'Qualificado' },
            { id: 'prop', label: 'Proposta' },
            { id: 'neg', label: 'Negociação' },
            { id: 'won', label: 'Fechado · ganho', tone: 'success' },
          ]}
          current={4}
        />
      </Showcase>

      <SubHead num="C" title="Lost · perdido" />
      <Showcase>
        <StageStepper
          stages={[
            { id: 'lead', label: 'Lead' },
            { id: 'qual', label: 'Qualificado' },
            { id: 'prop', label: 'Proposta' },
            { id: 'lost', label: 'Perdido', tone: 'danger' },
          ]}
          current={3}
        />
      </Showcase>
    </div>
  )
}
