import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { WizardSteps } from '@/components/tkws/wizard-steps'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const steps = [
  { label: 'Identificação', description: 'Cliente · contrato' },
  { label: 'Briefing', description: 'Programa · referências' },
  { label: 'Orçamento', description: 'Curva · fornecedores' },
  { label: 'Contrato', description: 'Assinatura · pagamento' },
  { label: 'Onboarding', description: 'Squad · cronograma' },
]

const prompt: AIPrompt = {
  componente: 'WizardSteps',
  import: "import { WizardSteps } from '@/components/tkws/wizard-steps'",
  contexto:
    'Stepper visível no topo do Wizard pattern. Cada step mostra número + label + descrição curta. Steps anteriores são clicáveis para voltar; futuros são desabilitados. Conectores entre steps indicam progresso.',
  quandoUsar: [
    'Padrão Wizard (criação multi-etapa com decisões dependentes)',
    'Onboarding (Cadastro Cliente → Primeiro Projeto → Convite Squad)',
  ],
  props: [
    { name: 'steps', type: 'WizardStep[]', description: '{ label, description? }' },
    { name: 'current', type: 'number', description: 'Índice do step atual' },
    { name: 'onStepClick', type: '(i) => void', description: 'Permite clicar em steps anteriores' },
  ],
  antiPatterns: [
    'Wizard com 8+ steps · vire sectioned form com TOC',
    'Sem indicação do step atual no header da seção',
    'Permitir pular steps obrigatórios (perda de validação)',
  ],
  exemplo: `const [step, setStep] = useState(0)

<WizardSteps steps={steps} current={step} onStepClick={setStep} />
{/* render do step atual */}
<Button onClick={() => setStep(s => s + 1)}>Avançar</Button>`,
  relacionados: ['Tabs', 'Form sectioned com TOC'],
}

export function WizardPage() {
  const [current, setCurrent] = useState(2)
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="12.3"
        category="Layout · Wizard Steps"
        title="Wizard Steps"
        italic="stepper visível"
        description="Para criações multi-etapa com dependências. Mobile scroll horizontal."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="5 etapas de onboarding" />
      <Showcase>
        <WizardSteps steps={steps} current={current} onStepClick={setCurrent} />
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={() => setCurrent(Math.max(0, current - 1))}>
            <ChevronLeft size={14} /> Voltar
          </Button>
          <span
            className="mono inline-flex items-center text-[11px] font-bold uppercase tracking-[1.4px]"
            style={{ color: 'var(--text-mute)' }}
          >
            Etapa {current + 1} de {steps.length}
          </span>
          <Button onClick={() => setCurrent(Math.min(steps.length - 1, current + 1))}>
            Avançar <ChevronRight size={14} />
          </Button>
        </div>
      </Showcase>
    </div>
  )
}
