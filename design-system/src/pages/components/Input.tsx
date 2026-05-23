import { Search } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Input, Field, FieldHint } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Input',
  import: "import { Input, Field, FieldHint } from '@/components/ui/input'",
  contexto:
    'Input texto · 4 estados (default, focus cyan, error vermelho, disabled). Sempre associado a um Label via id/htmlFor. Use Field wrapper + FieldHint para mensagens de ajuda ou erro.',
  quandoUsar: [
    'Toda entrada de texto livre, números, busca, e-mail',
    'Use prop icon para inputs com SVG embutido (busca, CNPJ, etc.)',
    'Use error={true} quando react-hook-form indicar erro de validação',
  ],
  props: [
    { name: 'type', type: '"text" | "email" | "tel" | "number" | ...', description: 'HTML type · padrão "text"' },
    { name: 'error', type: 'boolean', description: 'Borda vermelha · controlada por RHF formState.errors' },
    { name: 'icon', type: 'ReactNode', description: 'Ícone à esquerda (search, etc.)' },
  ],
  antiPatterns: [
    'Placeholder como label — placeholder some quando o usuário digita',
    'Validar com onChange custom — use react-hook-form + zodResolver',
    'Hex inline na borda — use prop error',
    'type="number" para moeda — use Intl.NumberFormat',
  ],
  exemplo: `// Com react-hook-form + Zod
const form = useForm({ resolver: zodResolver(schema) })

<Field>
  <Label htmlFor="cnpj" required>CNPJ</Label>
  <Input
    id="cnpj"
    placeholder="00.000.000/0000-00"
    error={!!form.formState.errors.cnpj}
    {...form.register('cnpj')}
  />
  {form.formState.errors.cnpj && (
    <FieldHint error>{form.formState.errors.cnpj.message}</FieldHint>
  )}
</Field>`,
  relacionados: ['Label', 'Field', 'FieldHint', 'Textarea'],
}

export function InputPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.1"
        category="Inputs · Input"
        title="Input"
        italic="entrada de texto"
        description="Sempre com Label. 4 estados visuais (default · focus · error · disabled). Integre com react-hook-form + zodResolver."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Estados" italic="default · focus · error · disabled" />
      <Showcase
        title="4 estados visuais"
        code={`<Input placeholder="ex: Cobertura Vitra · 1801" />
<Input value="Família Andrade" style={{ borderColor: 'var(--brand)' }} />
<Input value="R$ 12,5" error />
<Input value="—" disabled />`}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label htmlFor="i1" required>Nome do projeto</Label>
            <Input id="i1" placeholder="ex: Cobertura Vitra · 1801" />
            <FieldHint>Aparece no Kanban e na listagem</FieldHint>
          </Field>
          <Field>
            <Label htmlFor="i2">Cliente · focus</Label>
            <Input id="i2" defaultValue="Família Andrade" style={{ borderColor: 'var(--brand)' }} />
            <FieldHint>Estado · focus</FieldHint>
          </Field>
          <Field>
            <Label htmlFor="i3" required>Valor do contrato</Label>
            <Input id="i3" defaultValue="R$ 12,5" error />
            <FieldHint error>Valor mínimo R$ 400.000</FieldHint>
          </Field>
          <Field>
            <Label htmlFor="i4">Squad</Label>
            <Input id="i4" defaultValue="—" disabled />
            <FieldHint>Disponível após contrato assinado</FieldHint>
          </Field>
        </div>
      </Showcase>

      <SubHead num="B" title="Com ícone" italic="search · prefix" />
      <Showcase
        title="Input com ícone embutido"
        code={`<Input icon={<Search size={16} />} placeholder="Projeto, cliente, código…" />`}
      >
        <Field>
          <Label htmlFor="search">Buscar</Label>
          <Input id="search" icon={<Search size={16} strokeWidth={1.6} />} placeholder="Projeto, cliente, código…" />
        </Field>
      </Showcase>
    </div>
  )
}
