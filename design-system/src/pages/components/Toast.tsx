import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Toast (sonner)',
  import: "import { toast } from 'sonner'\nimport { Toaster } from 'sonner' // já está no Layout",
  contexto:
    'Toast = feedback flutuante efêmero. Use APÓS toda mutation: success/error/info. Não bloqueia, some sozinho. Para feedback que precisa ficar visível, use Alert inline.',
  quandoUsar: [
    'Confirmação de mutation (criado, salvo, excluído)',
    'Erro de rede ou validação não-inline',
    'Informações temporárias (link copiado, autosave)',
  ],
  props: [
    { name: 'toast.success(msg)', type: 'fn', description: 'Verde' },
    { name: 'toast.error(msg)', type: 'fn', description: 'Vermelho · após mutation falha' },
    { name: 'toast.warning(msg)', type: 'fn', description: 'Amarelo' },
    { name: 'toast.info(msg)', type: 'fn', description: 'Neutro' },
    { name: 'toast(msg, { description, action })', type: 'fn', description: 'Customizado · com action' },
  ],
  antiPatterns: [
    'Toast para ação destrutiva confirmada · use AlertDialog',
    'Toast que precisa ser lido · use Alert',
    'Empilhar 5 toasts iguais · debounce',
  ],
  exemplo: `mutation.onSuccess(() => {
  toast.success('Projeto criado', {
    description: '#2410 · Yachthouse · enviado ao squad',
    action: { label: 'Ver', onClick: () => navigate({ to: '/projetos/2410' }) }
  })
})`,
  relacionados: ['Alert', 'AlertDialog'],
}

export function ToastPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="10.2"
        category="Feedback · Toast"
        title="Toast"
        italic="sonner · efêmero"
        description="Notificação flutuante via sonner. Use após mutations. Não bloqueia. Para info permanente, use Alert."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Variantes" />
      <Showcase>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.success('Projeto salvo · #2410')}>
            success
          </Button>
          <Button variant="outline" onClick={() => toast.error('Falha ao salvar · tente novamente')}>
            error
          </Button>
          <Button variant="outline" onClick={() => toast.warning('Margem abaixo do target (23%)')}>
            warning
          </Button>
          <Button variant="outline" onClick={() => toast.info('Autosave em 3s…')}>
            info
          </Button>
          <Button
            onClick={() =>
              toast('Orçamento enviado ao cliente', {
                description: 'Família Andrade · 14/03 às 09:42',
                action: { label: 'Ver', onClick: () => toast.success('Abrindo orçamento…') },
              })
            }
          >
            com action
          </Button>
        </div>
      </Showcase>
    </div>
  )
}
