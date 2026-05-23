import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Badge } from '@/components/ui/badge'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Badge',
  import: "import { Badge } from '@/components/ui/badge'",
  contexto:
    'Badge classifica visualmente: status (success/warning/alert/danger), brand (em revisão), taxonomia (purple = Squad Orion, pink = Squad Apollo). É um chip de leitura — não um botão. Para estados pulsantes (live, novo), use prop pulse.',
  quandoUsar: [
    'Status de projeto, obra, pagamento — tom semântico (success/warning/alert/danger)',
    'Classificação visual de squad ou categoria — purple, pink, brand',
    'Indicador "ao vivo" ou pulso em tempo real (prop pulse)',
  ],
  props: [
    { name: 'tone', type: '"success" | "warning" | "alert" | "danger" | "brand" | "purple" | "pink" | "neutral"', description: 'Define cor e borda · semântico' },
    { name: 'pulse', type: 'boolean', description: 'Dot pulsante · live indicator' },
  ],
  antiPatterns: [
    'Badge clicável — use Toggle ou Button',
    'Inventar cor nova — use os 8 tones do sistema',
    'Badge "brand" para status genérico — só para "em revisão" ou ações TKWS',
  ],
  exemplo: `<Badge tone="success">No prazo</Badge>
<Badge tone="warning">Atenção</Badge>
<Badge tone="danger">Atrasado</Badge>
<Badge tone="purple">Squad Orion</Badge>
<Badge tone="success" pulse>Live</Badge>`,
  relacionados: ['Toggle', 'Status pills (CRM)'],
}

export function BadgePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="06.2"
        category="Foundation · Badge"
        title="Badge"
        italic="status e taxonomia"
        description="7 cores semânticas + neutral. Use para classificar (status, squad), nunca para ações. Apenas leitura."
        tag="8 tones"
      />

      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Cores semânticas" italic="success · warning · alert · danger" />
      <Showcase
        title="Status de projeto"
        description="Cores semânticas mapeadas direto para CSS vars do design system."
        code={`<Badge tone="success">No prazo</Badge>
<Badge tone="warning">Atenção</Badge>
<Badge tone="alert">Risco</Badge>
<Badge tone="danger">Atrasado</Badge>`}
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="success">No prazo</Badge>
          <Badge tone="warning">Atenção</Badge>
          <Badge tone="alert">Risco</Badge>
          <Badge tone="danger">Atrasado</Badge>
        </div>
      </Showcase>

      <SubHead num="B" title="Taxonomia" italic="brand · purple · pink" />
      <Showcase
        title="Classificação por squad ou categoria"
        code={`<Badge tone="brand">Em revisão</Badge>
<Badge tone="purple">Squad Orion</Badge>
<Badge tone="pink">Squad Apollo</Badge>`}
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">Em revisão</Badge>
          <Badge tone="purple">Squad Orion</Badge>
          <Badge tone="pink">Squad Apollo</Badge>
          <Badge tone="neutral">Arquivado</Badge>
        </div>
      </Showcase>

      <SubHead num="C" title="Pulse · live indicators" />
      <Showcase
        title="Dot pulsante para estados em tempo real"
        code={`<Badge tone="success" pulse>Live · 14 conectados</Badge>`}
      >
        <Badge tone="success" pulse>Live · 14 conectados</Badge>
      </Showcase>
    </div>
  )
}
