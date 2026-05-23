import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Rating } from '@/components/ui/rating'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Rating',
  import: "import { Rating } from '@/components/ui/rating'",
  contexto:
    'Avaliação por estrelas · 1-5. Modo readOnly mostra avaliação existente (NPS, review de fornecedor). Modo interativo permite o usuário avaliar.',
  quandoUsar: [
    'NPS de fornecedor · readOnly em listings',
    'Pesquisa de satisfação ao final de obra',
    'Review do plugin SketchUp pelos arquitetos',
  ],
  props: [
    { name: 'value', type: 'number', description: 'Valor atual · 0..max' },
    { name: 'max', type: 'number', description: 'Default 5' },
    { name: 'readOnly', type: 'boolean', description: 'Desabilita interação' },
    { name: 'onChange', type: '(v) => void', description: 'Callback quando interativo' },
    { name: 'size', type: 'number', description: 'px · default 18' },
  ],
  antiPatterns: [
    'Rating com 10 estrelas · use Slider',
    'Rating sem readOnly em contextos só de exibição',
  ],
  exemplo: `<Rating value={4.5} readOnly />

const [v, setV] = useState(0)
<Rating value={v} onChange={setV} label="Avalie o atendimento" />`,
  relacionados: ['Slider'],
}

export function RatingPage() {
  const [value, setValue] = useState(0)
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.12"
        category="Inputs · Rating"
        title="Rating"
        italic="estrelas 1-5"
        description="Avaliação por estrelas. Modo readOnly em listings, interativo em pesquisas."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Read-only · valores variados" />
      <Showcase>
        <div className="flex flex-col gap-3">
          <Rating value={5} readOnly />
          <Rating value={4} readOnly />
          <Rating value={3.5} readOnly />
          <Rating value={2} readOnly />
        </div>
      </Showcase>

      <SubHead num="B" title="Interativo · clique para avaliar" />
      <Showcase>
        <div className="flex flex-col items-start gap-2">
          <span className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
            Como foi o atendimento do squad?
          </span>
          <Rating value={value} onChange={setValue} size={24} />
        </div>
      </Showcase>
    </div>
  )
}
