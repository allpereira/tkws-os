import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Slider',
  import: "import { Slider } from '@/components/ui/slider'",
  contexto:
    'Slider para valores numéricos contínuos · range (2 thumbs) ou single. Use em filtros de preço, áreas, prazos. Para valores discretos ≤ 5 níveis, prefira ToggleGroup.',
  quandoUsar: [
    'Filtro de faixa numérica (preço, área, prazo)',
    'Configuração contínua (volume, opacidade)',
  ],
  props: [
    { name: 'value / defaultValue', type: 'number[]', description: 'Array · 1 valor = single, 2 = range' },
    { name: 'min / max / step', type: 'number', description: 'Limites' },
    { name: 'onValueChange', type: '(v: number[]) => void', description: 'Callback ao arrastar' },
  ],
  antiPatterns: [
    'Slider para 3-5 níveis fixos → ToggleGroup',
    'Slider sem mostrar valor atual',
    'Step muito pequeno em range grande (UX confusa)',
  ],
  exemplo: `const [range, setRange] = useState([400_000, 12_000_000])

<div>
  <Label>Valor do contrato</Label>
  <Slider
    value={range}
    min={400_000} max={20_000_000} step={50_000}
    onValueChange={setRange}
  />
  <div className="mono">
    {formatCurrency(range[0])} → {formatCurrency(range[1])}
  </div>
</div>`,
  relacionados: ['ToggleGroup', 'Input number'],
}

export function SliderPage() {
  const [range, setRange] = useState([400_000, 12_000_000])

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.8"
        category="Inputs · Slider"
        title="Slider"
        italic="range · single"
        description="Valores contínuos. 2 thumbs para range. Sempre mostre o valor atual ao lado."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Range · faixa de contrato" />
      <Showcase>
        <div className="max-w-md">
          <Label>Valor do contrato</Label>
          <div className="mt-3">
            <Slider value={range} min={400_000} max={20_000_000} step={50_000} onValueChange={setRange} />
          </div>
          <div className="mono mt-3 flex justify-between text-[11px]" style={{ color: 'var(--text-soft)' }}>
            <span>{formatCurrency(range[0])}</span>
            <span>→ {formatCurrency(range[1])}</span>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
