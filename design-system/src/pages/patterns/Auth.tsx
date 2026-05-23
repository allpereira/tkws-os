import { useState } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Input, Field, FieldHint } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Pattern · Auth Flows',
  import: '// Composição: Card centrado + Input + react-hook-form + Clerk/auth.js no backend',
  contexto:
    'Auth flows do TKWS: Login · Recovery · 2FA OTP. Sempre split-screen com brand à esquerda (renders, manifesto) e form à direita. Estado de erro inline · sem alert genérico. Use Clerk como provider recomendado (ver 05-STACK.md).',
  quandoUsar: [
    'Tela de login do TKWS OS',
    'Recuperação de senha',
    '2FA por OTP (Google Authenticator, SMS)',
  ],
  props: [],
  antiPatterns: [
    'Login sem split-screen editorial · perde o tom',
    'Mensagem de erro genérica "Erro" · sempre seja específico (email não cadastrado vs senha errada)',
    'Sem "lembrar de mim" em login · UX ruim',
  ],
  exemplo: `// Login com react-hook-form + Zod
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const form = useForm({ resolver: zodResolver(schema) })

<Form {...form}>
  <form onSubmit={form.handleSubmit(login)}>...</form>
</Form>`,
  relacionados: ['Form', 'Input OTP'],
}

export function AuthPattern() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="P-AUTH"
        category="Pattern · Auth"
        title="Auth Flows"
        italic="Login · Recovery · 2FA"
        description="Split-screen com brand editorial à esquerda e form à direita. Padrão TKWS para entrada."
        tag="3 flows"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="3 flows · veja cada um na tab" />
      <Showcase padding="none">
        <Tabs defaultValue="login">
          <div className="border-b p-4" style={{ borderColor: 'var(--line-1)' }}>
            <TabsList variant="pill">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="recovery">Recuperação</TabsTrigger>
              <TabsTrigger value="otp">2FA · OTP</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="login">
            <SplitFrame>
              <LoginForm />
            </SplitFrame>
          </TabsContent>

          <TabsContent value="recovery">
            <SplitFrame>
              <RecoveryForm />
            </SplitFrame>
          </TabsContent>

          <TabsContent value="otp">
            <SplitFrame>
              <OtpForm />
            </SplitFrame>
          </TabsContent>
        </Tabs>
      </Showcase>
    </div>
  )
}

function SplitFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_460px] max-[900px]:grid-cols-1" style={{ minHeight: 560 }}>
      <aside
        className="relative overflow-hidden p-12 max-[900px]:hidden"
        style={{
          background: 'linear-gradient(135deg, var(--surface-3) 0%, var(--surface-4) 60%, var(--brand-soft) 100%)',
        }}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="serif text-[22px] font-normal italic tracking-tight" style={{ color: 'var(--brand)' }}>
            TKWS <em>OS</em>
          </div>
          <div>
            <h2
              className="serif text-[40px] font-light leading-[1.05] tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              Para arquitetos. <em className="italic" style={{ color: 'var(--brand)' }}>Não para back-office.</em>
            </h2>
            <p className="mt-3 text-[14px]" style={{ color: 'var(--text-soft)' }}>
              O sistema operacional dos estúdios de arquitetura premium do Brasil.
            </p>
          </div>
        </div>
      </aside>
      <div className="flex flex-col justify-center p-10 max-[900px]:p-5" style={{ background: 'var(--surface-1)' }}>
        {children}
      </div>
    </div>
  )
}

function LoginForm() {
  return (
    <form className="grid w-full max-w-sm gap-5">
      <div>
        <h1 className="serif text-[28px] font-light tracking-tight" style={{ color: 'var(--text)' }}>
          Bem-vindo de volta.
        </h1>
        <p className="mt-1 text-[13.5px]" style={{ color: 'var(--text-soft)' }}>
          Use seu email corporativo para entrar.
        </p>
      </div>
      <Field>
        <Label htmlFor="lg-em" required>Email</Label>
        <Input id="lg-em" type="email" defaultValue="allysson@tkws.com.br" />
      </Field>
      <Field>
        <Label htmlFor="lg-pw" required>Senha</Label>
        <Input id="lg-pw" type="password" placeholder="••••••••" />
        <FieldHint>
          <a className="hover:text-[var(--brand)]" style={{ color: 'var(--brand)', cursor: 'pointer' }}>
            Esqueceu a senha?
          </a>
        </FieldHint>
      </Field>
      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox defaultChecked />
        <span className="text-[12.5px]" style={{ color: 'var(--text)' }}>Lembrar deste dispositivo</span>
      </label>
      <Button className="w-full">Entrar</Button>
      <Separator label="OU CONTINUE COM" />
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline">Google</Button>
        <Button variant="outline">Microsoft</Button>
      </div>
    </form>
  )
}

function RecoveryForm() {
  const [sent, setSent] = useState(false)
  return (
    <form className="grid w-full max-w-sm gap-5">
      <Button variant="ghost" size="sm" className="mr-auto -ml-3" type="button">
        <ArrowLeft size={12} /> Voltar para login
      </Button>
      <div>
        <h1 className="serif text-[28px] font-light tracking-tight" style={{ color: 'var(--text)' }}>
          Recuperar acesso.
        </h1>
        <p className="mt-1 text-[13.5px]" style={{ color: 'var(--text-soft)' }}>
          Enviaremos um link por email para você redefinir sua senha.
        </p>
      </div>
      {!sent ? (
        <>
          <Field>
            <Label htmlFor="rec-em" required>Email cadastrado</Label>
            <Input id="rec-em" type="email" placeholder="seu@email.com" />
          </Field>
          <Button onClick={() => setSent(true)} type="button" className="w-full">
            <Mail size={14} /> Enviar link de recuperação
          </Button>
        </>
      ) : (
        <div className="rounded-xl border p-5 text-center" style={{ background: 'rgba(95,217,165,0.12)', borderColor: 'var(--success)' }}>
          <Badge tone="success" pulse>Email enviado</Badge>
          <div
            className="serif mt-3 text-[18px] font-normal tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Confira sua caixa de entrada.
          </div>
          <div className="mt-2 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
            Se não chegar em 5 minutos, verifique a pasta de spam ou{' '}
            <a className="underline" style={{ color: 'var(--brand)', cursor: 'pointer' }}>
              tente outro email
            </a>
            .
          </div>
        </div>
      )}
    </form>
  )
}

function OtpForm() {
  const [code, setCode] = useState('')
  return (
    <form className="grid w-full max-w-sm gap-5">
      <div>
        <h1 className="serif text-[28px] font-light tracking-tight" style={{ color: 'var(--text)' }}>
          Verificação em 2 etapas.
        </h1>
        <p className="mt-1 text-[13.5px]" style={{ color: 'var(--text-soft)' }}>
          Digite o código de 6 dígitos do seu app autenticador.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 py-3">
        <InputOTP maxLength={6} value={code} onChange={setCode}>
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
        <div className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
          {code.length}/6 dígitos
        </div>
      </div>
      <Button className="w-full" disabled={code.length < 6}>Verificar e entrar</Button>
      <div className="text-center text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
        Não recebeu?{' '}
        <a className="underline" style={{ color: 'var(--brand)', cursor: 'pointer' }}>
          Tente outro método
        </a>
      </div>
    </form>
  )
}
