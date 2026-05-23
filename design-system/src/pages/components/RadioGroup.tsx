import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { RadioGroup, RadioGroupItem, RadioCard } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'RadioGroup',
  import: "import { RadioGroup, RadioGroupItem, RadioCard } from '@/components/ui/radio-group'",
  contexto:
    'Seleção única entre 2-5 opções visíveis. Para muitas opções, prefira Select. Use RadioCard quando cada opção tem descrição (escolha de plano, tipo de projeto). Use RadioGroupItem inline quando opções são curtas.',
  quandoUsar: [
    '2-5 opções mutuamente exclusivas, todas visíveis',
    'Escolha de tipo, plano, modalidade — RadioCard',
    'Filtros radio simples — RadioGroupItem inline',
  ],
  props: [
    { name: 'value / defaultValue', type: 'string', description: 'Valor selecionado' },
    { name: 'onValueChange', type: '(v: string) => void', description: 'Callback' },
  ],
  antiPatterns: [
    '6+ opções de radio — use Select',
    'Permitir múltipla seleção — use Checkbox',
    'RadioGroup sem fieldset/label de contexto',
  ],
  exemplo: `<RadioGroup defaultValue="decor-full">
  <RadioCard value="decor-full" title="Decoração completa" description="Inclui mobiliário" />
  <RadioCard value="reform" title="Reforma + decoração" description="Alterações estruturais" />
  <RadioCard value="project" title="Apenas projeto" description="Sem execução" />
</RadioGroup>`,
  relacionados: ['Checkbox', 'Select', 'ToggleGroup'],
}

export function RadioGroupPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.5"
        category="Inputs · RadioGroup"
        title="Radio Group"
        italic="seleção única visível"
        description="Para escolhas mutuamente exclusivas onde TODAS as opções precisam estar visíveis. Use RadioCard quando há descrição por opção."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="RadioCard · cards selecionáveis" />
      <Showcase
        title="Tipo de projeto"
        code={`<RadioGroup defaultValue="decor-full">
  <RadioCard value="decor-full" title="Decoração completa" description="Inclui mobiliário" />
  <RadioCard value="reform" title="Reforma + decoração" description="Alterações estruturais" />
  <RadioCard value="project" title="Apenas projeto" description="Sem execução" />
</RadioGroup>`}
      >
        <RadioGroup defaultValue="decor-full" className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          <RadioCard value="decor-full" title="Decoração completa" description="Decoração full · inclui mobiliário" />
          <RadioCard value="reform" title="Reforma + decoração" description="Alterações estruturais" />
          <RadioCard value="project" title="Apenas projeto" description="Sem execução" />
        </RadioGroup>
      </Showcase>

      <SubHead num="B" title="Inline · opções curtas" />
      <Showcase>
        <RadioGroup defaultValue="sc" className="flex gap-5">
          {['sc', 'sp', 'pr', 'rj'].map((uf) => (
            <div key={uf} className="flex items-center gap-2">
              <RadioGroupItem value={uf} id={`r-${uf}`} />
              <Label htmlFor={`r-${uf}`}>{uf.toUpperCase()}</Label>
            </div>
          ))}
        </RadioGroup>
      </Showcase>
    </div>
  )
}
