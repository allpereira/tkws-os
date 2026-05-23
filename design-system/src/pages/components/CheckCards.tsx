import { useState } from 'react'
import { Boxes, Bell, ClipboardCheck, Sparkles, FileSpreadsheet, MessageSquare } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { CheckCards } from '@/components/ui/check-cards'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'CheckCards',
  import: "import { CheckCards } from '@/components/ui/check-cards'",
  contexto:
    'Multi-seleção visual com cards · cada opção com ícone, título e descrição. Diferente de RadioCards (1 de N): permite múltiplos selecionados. Use para módulos a habilitar, features de onboarding, categorias de notificação.',
  quandoUsar: [
    'Escolher módulos do plano (Projetos, Catálogo, Catálogo Externo)',
    'Habilitar categorias de notificação',
    'Tags / categorias contextuais com descrição',
  ],
  props: [
    { name: 'options', type: 'CheckCardOption<T>[]', description: '{ value, title, description?, icon?, disabled? }' },
    { name: 'value', type: 'T[]', description: 'Valores selecionados' },
    { name: 'onChange', type: '(values: T[]) => void', description: 'Callback' },
    { name: 'max', type: 'number', description: 'Limita seleção · ex: max=3' },
    { name: 'cols', type: '2 | 3 | 4', description: 'Grid · default 3' },
  ],
  antiPatterns: [
    'CheckCards para escolhas mutuamente exclusivas · use RadioCard',
    'CheckCards sem descrição/ícone · vire ToggleGroup',
  ],
  exemplo: `<CheckCards
  value={enabled}
  onChange={setEnabled}
  max={3}
  options={[
    { value: 'core', title: 'Projetos', description: 'Gestão CRUD', icon: <Boxes/> },
    { value: 'cat', title: 'Catálogo', description: 'Curadoria editorial' }
  ]}
/>`,
  relacionados: ['RadioCard', 'Checkbox'],
}

const opts = [
  { value: 'projects', title: 'Projetos', description: 'CRUD · Kanban · Timeline', icon: <Boxes size={16} /> },
  { value: 'briefings', title: 'Briefings', description: 'Editor Tiptap · co-autoria', icon: <FileSpreadsheet size={16} /> },
  { value: 'catalog', title: 'Catálogo', description: 'Curadoria editorial', icon: <Sparkles size={16} /> },
  { value: 'comms', title: 'Comunicação', description: 'Chat · comentários inline', icon: <MessageSquare size={16} /> },
  { value: 'notif', title: 'Notificações', description: 'Push · email · SMS', icon: <Bell size={16} /> },
  { value: 'checklist', title: 'Punch list', description: 'Vistorias e correções', icon: <ClipboardCheck size={16} /> },
]

export function CheckCardsPage() {
  const [enabled, setEnabled] = useState<string[]>(['projects', 'catalog'])
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.16"
        category="Inputs · CheckCards"
        title="Check Cards"
        italic="multi-seleção visual"
        description="Cards multi-select com ícone + descrição. Use para módulos, features, categorias contextuais."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Módulos a habilitar · seleção múltipla" />
      <Showcase>
        <CheckCards options={opts} value={enabled} onChange={setEnabled} cols={3} />
      </Showcase>

      <SubHead num="B" title="Com limite · max=3" />
      <Showcase>
        <CheckCards options={opts} value={enabled} onChange={setEnabled} cols={3} max={3} />
        <div
          className="mono mt-3 text-[10.5px] font-bold uppercase tracking-[1.4px]"
          style={{ color: enabled.length === 3 ? 'var(--warning)' : 'var(--text-mute)' }}
        >
          {enabled.length}/3 selecionados
        </div>
      </Showcase>
    </div>
  )
}
