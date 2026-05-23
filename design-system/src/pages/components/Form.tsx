import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const schema = z.object({
  name: z.string().min(3, 'Nome muito curto · mínimo 3'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

type FormData = z.infer<typeof schema>

const prompt: AIPrompt = {
  componente: 'Form (RHF + Zod)',
  import: "import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'\nimport { useForm } from 'react-hook-form'\nimport { zodResolver } from '@hookform/resolvers/zod'",
  contexto:
    'Form wrapper integrando react-hook-form + Zod + Radix. FormField fornece contexto · FormControl associa input/label/error via aria. SEMPRE use isso para forms TKWS — nada de useState manual para validação.',
  quandoUsar: [
    'TODO form com 2+ campos',
    'Validação inline com Zod schema (mesmo schema usado no backend)',
    'Erros amarrados ao campo via aria-describedby (acessível)',
  ],
  props: [
    { name: 'Form', type: 'FormProvider', description: 'Aceita os métodos do useForm via {...form}' },
    { name: 'FormField', type: 'name + render', description: 'Vincula um Controller ao schema' },
    { name: 'FormItem', type: 'wrapper', description: 'Container do field · grid gap' },
    { name: 'FormLabel · FormControl · FormDescription · FormMessage', type: 'parts', description: 'Acessíveis · aria automático' },
  ],
  antiPatterns: [
    'useState manual para form · usa RHF',
    'Validação em onChange custom · usa zodResolver',
    'Submit sem RHF.handleSubmit · perde validação',
  ],
  exemplo: `const schema = z.object({
  name: z.string().min(3),
  email: z.string().email()
})

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { name: '', email: '' }
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField name="name" control={form.control} render={({field}) => (
      <FormItem>
        <FormLabel required>Nome</FormLabel>
        <FormControl><Input {...field}/></FormControl>
        <FormMessage />
      </FormItem>
    )} />
    <Button type="submit">Salvar</Button>
  </form>
</Form>`,
  relacionados: ['Input', 'Textarea', 'Select', 'Label'],
}

export function FormPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '' },
  })

  function onSubmit(values: FormData) {
    toast.success(`Formulário enviado para ${values.email}`)
    form.reset()
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.11"
        category="Inputs · Form"
        title="Form"
        italic="react-hook-form + Zod"
        description="Wrapper integrado RHF + Zod + Radix. Acessível, tipado, validado. Padrão TKWS para TODO form."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Form completo com validação inline" />
      <Showcase>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-md gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Nome do cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Família Andrade" {...field} />
                  </FormControl>
                  <FormDescription>Aparece em todos os documentos do projeto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contato@cliente.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notas iniciais para o squad…" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Cadastrar cliente
              </Button>
            </div>
          </form>
        </Form>
      </Showcase>
    </div>
  )
}
