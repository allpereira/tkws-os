import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { ChecklistWidget, type ChecklistItem } from '@/components/tkws/checklist-widget'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'ChecklistWidget',
  import: "import { ChecklistWidget } from '@/components/tkws/checklist-widget'",
  contexto:
    'Widget flutuante de primeiros passos · aparece após signup, bottom-right. Mostra progresso visual + trailing pill (pontos, →, tempo). Colapsa após completar todos. State machine: pending → current → done.',
  quandoUsar: [
    'Onboarding pós-signup (flutuante bottom-right)',
    'Setup inicial de workspace · convidar equipe, importar projetos, etc',
    'Sequência de tarefas administrativas (config inicial)',
  ],
  props: [
    { name: 'title', type: 'ReactNode', description: 'Título principal · Fraunces 17px' },
    { name: 'italic', type: 'string', description: 'Texto em italic · em colored brand' },
    { name: 'items', type: 'ChecklistItem[]', description: 'Lista com state pending/current/done' },
    { name: 'progress', type: 'string', description: 'Override · default "X de Y"' },
    { name: 'onSelect', type: '(id) => void', description: 'Click em item · navega para ação' },
  ],
  antiPatterns: [
    'Mais de 8 items · viola atenção',
    'Items vagos ("Configure X") · seja específico ("Convide pelo menos 3 pessoas")',
    'Não esconder após done · vira ruído permanente',
  ],
  exemplo: `const items = [
  { id: '1', title: 'Crie sua conta', state: 'done', trailing: '+1pt' },
  { id: '2', title: 'Convide equipe', state: 'current', trailing: '→' },
  { id: '3', title: 'Importe projetos' },
]

<ChecklistWidget title="Primeiros" italic="passos" items={items} />`,
  relacionados: ['Coachmark', 'WizardSteps', 'Progress'],
}

export function ChecklistWidgetPage() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', title: 'Crie sua conta TKWS OS', meta: 'há 2 dias', trailing: '+1pt', state: 'done' },
    { id: '2', title: 'Convide sua equipe', meta: '38 membros aceitaram', trailing: '+5pt', state: 'done' },
    { id: '3', title: 'Importe seus projetos', meta: '43 projetos importados de XLSX', trailing: '+10pt', state: 'done' },
    { id: '4', title: 'Configure seu primeiro orçamento', meta: 'Tente o compositor de orçamentos', trailing: '→', state: 'current' },
    { id: '5', title: 'Conecte com seus fornecedores', meta: 'Portal dos Parceiros', trailing: '+8pt' },
    { id: '6', title: 'Personalize seu Cockpit', meta: 'Escolha KPIs e painéis', trailing: '+3pt' },
  ])

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.11"
        category="TKWS · ChecklistWidget"
        title="ChecklistWidget"
        italic="primeiros passos"
        description="Widget flutuante de onboarding. State machine: pending → current → done. Progress pill no header."
        tag="floating bottom-right"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="6 passos · 3 done · 1 current · 2 pending" />
      <Showcase>
        <div className="flex justify-center">
          <ChecklistWidget
            title="Primeiros"
            italic="passos"
            items={items}
            onSelect={(id) =>
              setItems((prev) =>
                prev.map((it) =>
                  it.id === id && it.state !== 'done'
                    ? { ...it, state: it.state === 'current' ? 'done' : 'current' }
                    : it
                )
              )
            }
          />
        </div>
      </Showcase>

      <SubHead num="B" title="Todos completos · vira CTA de fim" />
      <Showcase>
        <div className="flex justify-center">
          <ChecklistWidget
            title="Setup"
            italic="completo!"
            progress="6 de 6"
            items={items.map((i) => ({ ...i, state: 'done' as const }))}
          />
        </div>
      </Showcase>
    </div>
  )
}
