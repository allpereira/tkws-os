import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'InputOTP',
  import: "import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'",
  contexto:
    'Input OTP de 6 dígitos com separador no meio (3-3). Usado em 2FA, confirmação de email, código de cliente. Aceita paste de código completo · navegação por teclado nativa.',
  quandoUsar: [
    '2FA · autenticação de dois fatores',
    'Confirmação de email/SMS',
    'Códigos curtos numéricos (4-8 dígitos)',
  ],
  props: [
    { name: 'maxLength', type: 'number', description: '6 padrão' },
    { name: 'onComplete', type: '(v: string) => void', description: 'Callback ao preencher todos' },
    { name: 'value / onChange', type: 'controlled', description: 'Controle externo' },
  ],
  antiPatterns: [
    'OTP para senha — use Input type="password"',
    'Sem onComplete · auto-submit é o padrão UX',
    'Nada de separator em códigos < 6 dígitos',
  ],
  exemplo: `<InputOTP maxLength={6} onComplete={(v) => verify(v)}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
  relacionados: ['Input', 'Toast (sonner)'],
}

export function InputOtpPage() {
  const [value, setValue] = useState('')
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.9"
        category="Inputs · OTP"
        title="Input OTP"
        italic="6 dígitos · 2FA"
        description="Confirmação por código. Aceita paste, navega por teclado, auto-submit via onComplete."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="2FA · 6 dígitos com separador" />
      <Showcase>
        <div className="flex flex-col items-center gap-3">
          <Label>Digite o código enviado por SMS</Label>
          <InputOTP
            maxLength={6}
            value={value}
            onChange={setValue}
            onComplete={(v) => toast.success(`Código recebido: ${v}`)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className="mono text-[11px]" style={{ color: 'var(--text-mute)' }}>
            {value.length}/6 dígitos
          </div>
        </div>
      </Showcase>
    </div>
  )
}
