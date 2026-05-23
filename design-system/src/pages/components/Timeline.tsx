import { Check, FileText, MessageSquare, Wrench } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Timeline, type TimelineItem } from '@/components/tkws/timeline'
import type { AIPrompt } from '@/lib/prompts'

const items: TimelineItem[] = [
  {
    id: '1',
    meta: '20 MAI · 09:42',
    title: 'Orçamento aprovado pelo cliente',
    description: 'Família Andrade assinou via portal · R$ 12,5M · 8 parcelas.',
    icon: <Check size={12} strokeWidth={2.5} />,
    tone: 'success',
  },
  {
    id: '2',
    meta: '18 MAI · 16:20',
    title: 'Briefing finalizado',
    description: 'Programa, referências e moodboard enviados pelo squad Orion.',
    icon: <FileText size={12} strokeWidth={2} />,
    tone: 'brand',
  },
  {
    id: '3',
    meta: '15 MAI · 14:08',
    title: 'Cliente comentou no moodboard',
    description: '"Adorei a referência da bancada em granito São Gabriel. Manter para a cozinha."',
    icon: <MessageSquare size={12} strokeWidth={2} />,
    tone: 'neutral',
  },
  {
    id: '4',
    meta: '12 MAI · 11:14',
    title: 'Visita técnica realizada',
    description: 'Apartamento medido · 280 m² confirmados. Foto 360° subida ao portal.',
    icon: <Wrench size={12} strokeWidth={2} />,
    tone: 'warning',
  },
]

const prompt: AIPrompt = {
  componente: 'Timeline',
  import: "import { Timeline } from '@/components/tkws/timeline'",
  contexto:
    'Activity feed vertical com pontos conectados. Use em detalhe de projeto/cliente para mostrar histórico. Cada item tem meta (mono uppercase) + title + description + tone semântico.',
  quandoUsar: [
    'Histórico de atividade em Detail screen',
    'Auditoria de mudanças',
    'Cronograma de obra (com tone para status)',
  ],
  props: [
    { name: 'items', type: 'TimelineItem[]', description: '{ id, meta, title, description?, icon?, tone? }' },
  ],
  antiPatterns: [
    'Timeline com 50+ itens · vire Table ou virtualize',
    'Sem meta (timestamp) · perde valor temporal',
  ],
  exemplo: `<Timeline items={[
  { id: '1', meta: '14 MAR · 09:42', title: 'Orçamento aprovado', tone: 'success' },
  { id: '2', meta: '12 MAR · 16:30', title: 'Briefing enviado', tone: 'brand' }
]} />`,
  relacionados: ['Activity feed', 'Card'],
}

export function TimelinePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.12"
        category="Data Display · Timeline"
        title="Timeline"
        italic="activity feed"
        description="Histórico vertical com pontos conectados. Use tone semântico para diferenciar tipos de evento."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Histórico de projeto" />
      <Showcase>
        <Timeline items={items} />
      </Showcase>
    </div>
  )
}
