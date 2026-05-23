import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { NumberInput } from '@/components/ui/number-input'
import { Label } from '@/components/ui/label'
import { Field } from '@/components/ui/input'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'NumberInput',
  import: "import { NumberInput } from '@/components/ui/number-input'",
  contexto:
    'Input numérico com steppers +/− nas laterais. Suporta currency (formata como R$ via Intl) e suffix (m², %, etc.). NUNCA use type="number" puro para moeda · usa Intl.NumberFormat por trás.',
  quandoUsar: [
    'Valores monetários (currency=true)',
    'Quantidades, áreas, percentuais (com suffix)',
    'Configurações com limites min/max claros',
  ],
  props: [
    { name: 'value / onChange', type: 'number | undefined', description: 'Controlled · undefined quando vazio' },
    { name: 'currency', type: 'boolean', description: 'Formata como R$ via Intl' },
    { name: 'suffix', type: 'string', description: 'Ex: "m²", "%", "u"' },
    { name: 'min / max / step', type: 'number', description: 'Limites do stepper' },
  ],
  antiPatterns: [
    'type="number" para moeda · perde locale BR (vírgula vs ponto)',
    'Hardcode de "R$" · sempre via Intl',
  ],
  exemplo: `const [value, setValue] = useState<number | undefined>(12_500_000)

<NumberInput
  value={value}
  onChange={setValue}
  currency
  min={400_000}
  step={50_000}
/>`,
  relacionados: ['Input', 'Slider'],
}

export function NumberInputPage() {
  const [contract, setContract] = useState<number | undefined>(12_500_000)
  const [area, setArea] = useState<number | undefined>(280)
  const [margin, setMargin] = useState<number | undefined>(32)
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.14"
        category="Inputs · NumberInput"
        title="Number Input"
        italic="stepper +/−"
        description="Input numérico com steppers laterais. Formata como BRL ou com suffix (m², %)."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Moeda · BRL via Intl" />
      <Showcase>
        <div className="grid max-w-md gap-3">
          <Field>
            <Label>Valor do contrato</Label>
            <NumberInput value={contract} onChange={setContract} currency min={400_000} step={50_000} />
          </Field>
          <Field>
            <Label>Área</Label>
            <NumberInput value={area} onChange={setArea} suffix="m²" min={0} max={5000} step={5} />
          </Field>
          <Field>
            <Label>Margem alvo</Label>
            <NumberInput value={margin} onChange={setMargin} suffix="%" min={0} max={100} step={1} />
          </Field>
        </div>
      </Showcase>
    </div>
  )
}
