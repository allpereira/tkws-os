import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { PhoneInput } from '@/components/ui/phone-input'
import { Label } from '@/components/ui/label'
import { Field, FieldHint } from '@/components/ui/input'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'PhoneInput',
  import: "import { PhoneInput } from '@/components/ui/phone-input'",
  contexto:
    'Input com máscara BR (xx) xxxxx-xxxx. Internamente guarda só dígitos · exibe formatado. Para uso internacional, considere libphonenumber-js + adaptação.',
  quandoUsar: [
    'Cadastro de cliente · pessoa física e jurídica',
    'Cadastro de fornecedor',
    'Onboarding de squad',
  ],
  props: [
    { name: 'value', type: 'string', description: 'Dígitos puros (sem máscara)' },
    { name: 'onChange', type: '(v: string) => void', description: 'Recebe dígitos puros' },
    { name: 'error', type: 'boolean', description: 'Estado de validação' },
  ],
  antiPatterns: [
    'Input simples com placeholder de telefone · usuário copia formato errado',
    'Armazenar formatado · perde portabilidade',
  ],
  exemplo: `const [phone, setPhone] = useState('')

<Field>
  <Label htmlFor="ph">Telefone</Label>
  <PhoneInput id="ph" value={phone} onChange={setPhone} />
  <FieldHint>Apenas Brasil · use libphonenumber-js para internacional</FieldHint>
</Field>`,
  relacionados: ['Input'],
}

export function PhoneInputPage() {
  const [phone, setPhone] = useState('')
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.15"
        category="Inputs · PhoneInput"
        title="Phone Input"
        italic="máscara BR"
        description="(xx) xxxxx-xxxx · armazena dígitos puros. Para internacional, libphonenumber-js."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Padrão · BR" />
      <Showcase>
        <Field className="max-w-xs">
          <Label htmlFor="ph" required>Telefone</Label>
          <PhoneInput id="ph" value={phone} onChange={setPhone} />
          <FieldHint>
            Dígitos: <code className="mono">{phone || '—'}</code>
          </FieldHint>
        </Field>
      </Showcase>
    </div>
  )
}
