import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { TagInput } from '@/components/ui/tag-input'
import { Field, FieldHint } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'TagInput',
  import: "import { TagInput } from '@/components/ui/tag-input'",
  contexto:
    'Input para múltiplas tags · chips dentro do campo. Use Enter, Tab ou vírgula para adicionar. Backspace em input vazio remove a última. Bom para classificação rápida, keywords, hashtags, áreas de interesse. Valida com onBeforeAdd antes de aceitar.',
  quandoUsar: [
    'Tags de projeto (ultra-luxo, signature, render-aprovado…)',
    'Áreas de atuação · skills · interesses',
    'Categorias livres em CRM',
    'Keywords de SEO no produto',
  ],
  props: [
    { name: 'value', type: 'string[]', description: 'Array de tags atuais' },
    { name: 'onChange', type: '(next: string[]) => void', description: 'Recebe novo array a cada add/remove' },
    { name: 'max', type: 'number', description: 'Máximo de tags · default ilimitado' },
    { name: 'onBeforeAdd', type: '(tag) => boolean | string', description: 'Validar/normalizar antes de aceitar' },
    { name: 'commaSeparator', type: 'boolean', description: 'Default true · vírgula também adiciona' },
  ],
  antiPatterns: [
    'Usar como Combobox · use Combobox quando há lista fechada',
    'Sem onBeforeAdd · acaba aceitando lixo ("kk", "asdf")',
    'Sem limit · usuário pode colar 200 tags',
  ],
  exemplo: `const [tags, setTags] = useState<string[]>(['ultra luxo', 'signature'])

<TagInput
  value={tags}
  onChange={setTags}
  max={8}
  onBeforeAdd={(t) => t.toLowerCase().trim()}
/>`,
  relacionados: ['Combobox', 'Badge', 'Input'],
}

export function TagInputPage() {
  const [tags, setTags] = useState<string[]>(['ultra luxo', 'signature', 'cliente top', 'render aprovado'])
  const [skills, setSkills] = useState<string[]>(['design', 'gestão'])

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.18"
        category="Inputs · TagInput"
        title="TagInput"
        italic="chips dentro do campo"
        description="Múltiplas tags em um único input. Enter/Tab/vírgula adiciona, Backspace remove a última."
        tag="multi-tag"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Tags do projeto" italic="enter para salvar" />
      <Showcase>
        <Field className="max-w-[540px]">
          <Label>Tags do projeto</Label>
          <TagInput value={tags} onChange={setTags} />
          <FieldHint>Use tags para agrupar projetos por característica. Aparecem nos filtros.</FieldHint>
        </Field>
      </Showcase>

      <SubHead num="B" title="Limit · máximo 5 tags" />
      <Showcase>
        <Field className="max-w-[540px]">
          <Label>Skills (máx. 5)</Label>
          <TagInput
            value={skills}
            onChange={setSkills}
            max={5}
            placeholder="ex: design, gestão, marcenaria…"
            onBeforeAdd={(t) => t.toLowerCase().trim()}
          />
          <FieldHint>{skills.length}/5 · normalizadas em lowercase</FieldHint>
        </Field>
      </Showcase>

      <SubHead num="C" title="Vazio · placeholder visível" />
      <Showcase>
        <Field className="max-w-[540px]">
          <Label>Keywords</Label>
          <TagInput value={[]} onChange={() => {}} placeholder="Adicionar keyword…" />
        </Field>
      </Showcase>
    </div>
  )
}
