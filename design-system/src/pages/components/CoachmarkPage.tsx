import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Coachmark } from '@/components/tkws/coachmark'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Coachmark',
  import: "import { Coachmark } from '@/components/tkws/coachmark'",
  contexto:
    'Spotlight + balão · ilumina elemento (target) e mostra explicação. Use para feature NOVA, pontual. Aparece UMA vez por usuário (localStorage flag). Dots indicam sequência multi-step. Diferente de Tooltip (hover passivo) e Dialog (action-blocking).',
  quandoUsar: [
    'Feature nova após deploy · aparece uma vez',
    'Tour multi-step pós-onboarding',
    'Educação contextual sobre atalho ou ação',
  ],
  props: [
    { name: 'step', type: 'string', description: 'Texto mono · "Passo 2 de 4"' },
    { name: 'title', type: 'ReactNode', description: 'Título Fraunces 18px' },
    { name: 'description', type: 'ReactNode', description: 'Explicação · pode ter <kbd>' },
    { name: 'totalSteps', type: 'number', description: 'Total de dots' },
    { name: 'currentStep', type: 'number', description: 'Índice 0-based · dot ativo' },
    { name: 'target', type: 'ReactNode', description: 'Conteúdo do spot iluminado' },
    { name: 'onNext', type: '() => void', description: 'Botão próximo' },
    { name: 'onSkip', type: '() => void', description: 'Pular tour' },
  ],
  antiPatterns: [
    'Coachmark em toda feature · vira spam',
    'Sem onSkip · usuário fica preso',
    'Reaparecer após dismiss · falta localStorage flag',
  ],
  exemplo: `<Coachmark
  step="Passo 2 de 4 · novidade"
  title="Criar projeto direto daqui"
  description={<>Use <kbd>⌘N</kbd> em qualquer tela.</>}
  totalSteps={4}
  currentStep={1}
  target={<><Plus size={14}/> Novo projeto</>}
  onNext={() => setStep(s => s + 1)}
  onSkip={() => localStorage.setItem('tour-dismissed', '1')}
/>`,
  relacionados: ['Tooltip', 'Popover', 'ChecklistWidget'],
}

const steps = [
  {
    title: 'Criar projeto direto daqui',
    description: (
      <>
        Você não precisa mais ir pro menu lateral. Use{' '}
        <kbd
          className="mono rounded-[4px] border px-1 py-0.5 text-[11px]"
          style={{
            background: 'var(--surface-2)',
            borderColor: 'var(--line-1)',
            color: 'var(--text)',
          }}
        >
          ⌘N
        </kbd>{' '}
        em qualquer tela.
      </>
    ),
    target: (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
        <Plus size={14} /> Novo projeto
      </span>
    ),
  },
  {
    title: 'Busca global ⌘K',
    description: (
      <>
        Encontre tudo em segundos · projetos, pessoas, clientes, documentos. Use{' '}
        <kbd
          className="mono rounded-[4px] border px-1 py-0.5 text-[11px]"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)', color: 'var(--text)' }}
        >
          ⌘K
        </kbd>.
      </>
    ),
    target: (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
        <Search size={14} /> Buscar
      </span>
    ),
  },
]

export function CoachmarkPage() {
  const [step, setStep] = useState(0)

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.12"
        category="TKWS · Coachmark"
        title="Coachmark"
        italic="spotlight de feature nova"
        description="Ilumina elemento, mostra balão Fraunces. Dots indicam sequência. Use UMA vez por usuário."
        tag="spotlight + balão"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Tour multi-step · feature nova" />
      <Showcase padding="none">
        <Coachmark
          step={`Passo ${step + 1} de ${steps.length} · novidade`}
          title={steps[step].title}
          description={steps[step].description}
          totalSteps={steps.length}
          currentStep={step}
          target={steps[step].target}
          onSkip={() => setStep(0)}
          onNext={() => setStep((s) => (s + 1) % steps.length)}
          nextLabel={step === steps.length - 1 ? 'Concluir ✓' : 'Próximo →'}
        />
      </Showcase>
    </div>
  )
}
