import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select'
import { Field } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Select',
  import: "import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'",
  contexto:
    'Select dropdown nativo customizado · até ~10 opções. Para mais (busca), use Combobox. Suporta grupos com SelectGroup + SelectLabel.',
  quandoUsar: [
    'Lista de opções fixa (status, UF, tipo de projeto)',
    '≤ 10 opções · acima disso, use Combobox com busca',
    'Quando há ordem natural (estados, prioridades)',
  ],
  props: [
    { name: 'value / onValueChange', type: 'controlled', description: 'Controle externo (RHF Controller)' },
    { name: 'defaultValue', type: 'string', description: 'Valor inicial' },
    { name: 'disabled', type: 'boolean', description: 'Bloqueia abertura' },
  ],
  antiPatterns: [
    'Select com 30+ opções — vire Combobox',
    'Select sem placeholder no Value',
    'Usar value para guardar objeto — só strings/numbers',
  ],
  exemplo: `<Field>
  <Label htmlFor="status">Status</Label>
  <Select onValueChange={(v) => form.setValue('status', v)}>
    <SelectTrigger id="status">
      <SelectValue placeholder="Escolher status…" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="draft">Rascunho</SelectItem>
      <SelectItem value="active">Ativo</SelectItem>
      <SelectItem value="done">Concluído</SelectItem>
    </SelectContent>
  </Select>
</Field>`,
  relacionados: ['Combobox', 'RadioGroup'],
}

export function SelectPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.3"
        category="Inputs · Select"
        title="Select"
        italic="dropdown nativo"
        description="Até ~10 opções fixas. Acessibilidade total via Radix. Para listas grandes ou busca, use Combobox."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Básico" />
      <Showcase>
        <Field className="max-w-xs">
          <Label htmlFor="uf">UF</Label>
          <Select>
            <SelectTrigger id="uf">
              <SelectValue placeholder="Escolher…" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sul</SelectLabel>
                <SelectItem value="sc">Santa Catarina</SelectItem>
                <SelectItem value="pr">Paraná</SelectItem>
                <SelectItem value="rs">Rio Grande do Sul</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Sudeste</SelectLabel>
                <SelectItem value="sp">São Paulo</SelectItem>
                <SelectItem value="rj">Rio de Janeiro</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </Showcase>
    </div>
  )
}
