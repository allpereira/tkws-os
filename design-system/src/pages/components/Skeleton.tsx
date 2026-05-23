import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Skeleton',
  import: "import { Skeleton } from '@/components/ui/skeleton'",
  contexto:
    'Loading placeholder shimmer. Reproduza a estrutura aproximada do conteúdo final — não use spinner genérico. Skeleton deve durar < 1s · acima disso, layout pode mudar.',
  quandoUsar: [
    'Loading inicial de tela com TanStack Query isPending',
    'Lista enquanto fetch (mostre 3-5 skeletons)',
    'KPI cards enquanto sumário carrega',
  ],
  props: [],
  antiPatterns: [
    'Skeleton genérico (retângulo gigante)',
    'Skeleton + Spinner ao mesmo tempo',
    'Skeleton em refetch · use isFetching com indicador discreto no canto',
  ],
  exemplo: `if (query.isPending) {
  return (
    <Card>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-2 h-6 w-48" />
      <Skeleton className="mt-3 h-3 w-full" />
    </Card>
  )
}`,
  relacionados: ['Progress'],
}

export function SkeletonPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="10.3"
        category="Feedback · Skeleton"
        title="Skeleton"
        italic="shimmer loading"
        description="Placeholder que reproduz estrutura final. Para loadings curtos. Acima de 1s, considere outra UX."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Card loading" />
      <Showcase>
        <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="mt-3 h-7 w-32" />
              <Skeleton className="mt-3 h-2.5 w-full" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      </Showcase>

      <SubHead num="B" title="Lista" />
      <Showcase>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border p-3"
              style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
            >
              <Skeleton className="h-9 w-9 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-2.5 w-28" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </Showcase>
    </div>
  )
}
