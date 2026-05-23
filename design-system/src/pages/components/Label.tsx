import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Label } from '@/components/ui/label'
import { Input, Field, FieldHint } from '@/components/ui/input'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Label',
  import: "import { Label } from '@/components/ui/label'",
  contexto:
    'Label uppercase JetBrains Mono. Sempre associado a um Input via htmlFor + id. Asterisco automático quando required. Placeholder nunca substitui label — fica abaixo como hint.',
  quandoUsar: [
    'Sempre acima de todo Input/Textarea/Select',
    'Em seções de form para nomear o campo',
    'Use required quando o campo é obrigatório (exibe asterisco)',
  ],
  props: [
    { name: 'htmlFor', type: 'string', description: 'ID do input · obrigatório para acessibilidade' },
    { name: 'required', type: 'boolean', description: 'Exibe asterisco · cyan' },
  ],
  antiPatterns: [
    'Placeholder como label — placeholder some quando o usuário digita',
    'Label sem htmlFor — quebra acessibilidade',
    'Misturar Mono + Sans no mesmo label',
  ],
  exemplo: `<Field>
  <Label htmlFor="name" required>Nome do projeto</Label>
  <Input id="name" placeholder="ex: Cobertura Vitra · 1801" />
  <FieldHint>Aparece no Kanban e na listagem</FieldHint>
</Field>`,
  relacionados: ['Input', 'Textarea', 'Select'],
}

export function LabelPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="06.16"
        category="Foundation · Label"
        title="Label"
        italic="uppercase mono"
        description="JetBrains Mono uppercase com tracking. Sempre htmlFor. Placeholder não é label."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Padrão · Label + Input + Hint" />
      <Showcase
        title="Estrutura completa do campo"
        code={`<Field>
  <Label htmlFor="name" required>Nome do projeto</Label>
  <Input id="name" placeholder="ex: Cobertura Vitra · 1801" />
  <FieldHint>Aparece no Kanban e na listagem</FieldHint>
</Field>`}
      >
        <Field>
          <Label htmlFor="name" required>Nome do projeto</Label>
          <Input id="name" placeholder="ex: Cobertura Vitra · 1801" />
          <FieldHint>Aparece no Kanban e na listagem</FieldHint>
        </Field>
      </Showcase>
    </div>
  )
}
