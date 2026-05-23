import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { LeadScore } from '@/components/tkws/crm-lead-score'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'CRM · LeadScore',
  import: "import { LeadScore } from '@/components/tkws/crm-lead-score'",
  contexto:
    'Indicador de temperatura do lead · hot (≥70), warm (40-69), cold (<40). Use score 0-100 OU temperature explícita. Ícone + cor semântica + opcional label. Aparece em Cards de deal, lista de leads e detail panel.',
  quandoUsar: [
    'Cards de deal no Kanban comercial',
    'Lista de leads · coluna "temperatura"',
    'Header do Contact Detail',
  ],
  props: [
    { name: 'score', type: 'number (0-100)', description: 'Mapeia para temperatura automaticamente' },
    { name: 'temperature', type: '"hot" | "warm" | "cold"', description: 'Alternativa direta ao score' },
    { name: 'size', type: '"sm" | "md" | "lg"', description: 'Default md' },
    { name: 'showLabel', type: 'boolean', description: 'Default true · mostra "Quente · 87"' },
  ],
  antiPatterns: [
    'Score acima de 100 ou abaixo de 0 · normalize antes',
    'Temperature inventada (lukewarm, frozen) · use só 3 níveis',
    'Sem ícone · perde reconhecibilidade rápida',
  ],
  exemplo: `<LeadScore score={87} />               // Quente · 87
<LeadScore temperature="warm" />        // Morno (sem número)
<LeadScore score={42} size="sm" showLabel={false} /> // só ícone + 42`,
  relacionados: ['DealCard', 'ContactCard'],
}

export function CrmLeadScorePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="CRM.1"
        category="CRM · Lead Score"
        title="Lead Score"
        italic="hot · warm · cold"
        description="Indicador de temperatura do lead · 3 níveis. Score 0-100 mapeia automaticamente para temperatura."
        tag="3 níveis"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="3 temperaturas" />
      <Showcase>
        <div className="flex flex-wrap items-center gap-3">
          <LeadScore temperature="hot" />
          <LeadScore temperature="warm" />
          <LeadScore temperature="cold" />
        </div>
      </Showcase>

      <SubHead num="B" title="Com score numérico" />
      <Showcase>
        <div className="flex flex-wrap items-center gap-3">
          <LeadScore score={92} />
          <LeadScore score={68} />
          <LeadScore score={42} />
          <LeadScore score={15} />
        </div>
      </Showcase>

      <SubHead num="C" title="Tamanhos · sm · md · lg" />
      <Showcase>
        <div className="flex flex-wrap items-center gap-3">
          <LeadScore score={87} size="sm" />
          <LeadScore score={87} size="md" />
          <LeadScore score={87} size="lg" />
          <LeadScore score={87} size="md" showLabel={false} />
        </div>
      </Showcase>
    </div>
  )
}
