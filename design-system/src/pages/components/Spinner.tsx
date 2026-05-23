import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Spinner',
  import: "import { Spinner } from '@/components/ui/spinner'",
  contexto:
    'Spinner loading inline · Loader2 do lucide com animate-spin. Use APENAS quando Skeleton não cabe (ações de < 1s · ex: dentro de botão durante mutation). Para loading de tela, use Skeleton.',
  quandoUsar: [
    'Dentro de Button durante mutation (substituindo o conteúdo)',
    'Inline ao lado de texto · "Salvando..."',
    'Polling discreto no canto',
  ],
  props: [
    { name: 'size', type: 'number', description: 'px · default 16' },
    { name: 'tone', type: '"brand" | "success" | "warning" | "danger" | "neutral"', description: 'Cor' },
    { name: 'label', type: 'string', description: 'Texto à direita' },
  ],
  antiPatterns: [
    'Spinner para loading de página · use Skeleton',
    'Spinner + Skeleton ao mesmo tempo',
  ],
  exemplo: `<Button disabled={mutation.isPending}>
  {mutation.isPending ? <Spinner size={14} /> : 'Salvar'}
</Button>

<Spinner label="Sincronizando catálogo" tone="brand" />`,
  relacionados: ['Skeleton', 'Progress'],
}

export function SpinnerPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="10.7"
        category="Feedback · Spinner"
        title="Spinner"
        italic="loading inline"
        description="Loader rotativo. Use dentro de botões ou inline. Para tela, prefira Skeleton."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Tamanhos e tons" />
      <Showcase>
        <div className="flex flex-wrap items-center gap-6">
          <Spinner size={14} />
          <Spinner size={18} tone="success" />
          <Spinner size={22} tone="warning" />
          <Spinner size={26} tone="danger" />
          <Spinner label="Sincronizando" />
        </div>
      </Showcase>

      <SubHead num="B" title="Dentro de Button" />
      <Showcase>
        <Button disabled>
          <Spinner size={13} tone="neutral" /> Salvando…
        </Button>
      </Showcase>
    </div>
  )
}
