import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldHint } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Textarea',
  import: "import { Textarea } from '@/components/ui/textarea'",
  contexto:
    'Textarea para textos longos · observações, briefings, descrição livre. Resize vertical permitido. Para texto rico (negrito, listas), use Tiptap.',
  quandoUsar: [
    'Texto livre > 2 linhas (observações, briefing curto)',
    'Comentários em projetos / obras',
  ],
  props: [
    { name: 'error', type: 'boolean', description: 'Borda vermelha' },
    { name: 'rows', type: 'number', description: 'Altura inicial · padrão min-h-20' },
  ],
  antiPatterns: [
    'Textarea para 1 linha — use Input',
    'Texto rico em Textarea — use Tiptap',
    'Resize horizontal — desabilitado por padrão (mantém layout)',
  ],
  exemplo: `<Field>
  <Label htmlFor="obs">Observações</Label>
  <Textarea id="obs" placeholder="Detalhes adicionais para a equipe…" rows={4} />
  <FieldHint>Visível para o squad designado</FieldHint>
</Field>`,
  relacionados: ['Input', 'Tiptap (rich text)'],
}

export function TextareaPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.2"
        category="Inputs · Textarea"
        title="Textarea"
        italic="texto longo"
        description="Para observações, briefings, descrições livres. Resize vertical. Use Tiptap para conteúdo rico."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Padrão" />
      <Showcase
        code={`<Field>
  <Label htmlFor="obs">Observações</Label>
  <Textarea id="obs" placeholder="Detalhes adicionais para a equipe…" />
  <FieldHint>Visível para o squad designado</FieldHint>
</Field>`}
      >
        <Field>
          <Label htmlFor="obs">Observações</Label>
          <Textarea id="obs" placeholder="Detalhes adicionais para a equipe…" rows={4} />
          <FieldHint>Visível para o squad designado</FieldHint>
        </Field>
      </Showcase>
    </div>
  )
}
