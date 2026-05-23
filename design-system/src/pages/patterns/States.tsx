import { AlertOctagon, Construction, FolderOpen, Inbox, Plug, Search, WifiOff } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Pattern · Estados (Loading · Empty · Error)',
  import: '// Composição: Skeleton + Spinner + EmptyState + Alert',
  contexto:
    'Estados não-óbvios da UI · loading, vazio, erro, sem permissão, sem conexão. Cada um precisa ter mensagem TKWS (editorial, não genérica) + ação clara. Sempre prefira Skeleton sobre Spinner para loadings > 0.5s.',
  quandoUsar: [
    'Loading inicial de tela',
    'Empty list (primeiro registro ou filtros restritivos)',
    'Erro de rede / API',
    'Sem permissão',
    'Em construção (feature flag off)',
  ],
  props: [],
  antiPatterns: [
    '"Loading..." genérico · use Skeleton com estrutura aproximada',
    '"No items found" · vire copy editorial TKWS',
    'Spinner em centro da tela durante 5s · perde paciência',
  ],
  exemplo: `if (q.isPending) return <SkeletonList />
if (q.isError) return <ErrorState onRetry={q.refetch} />
if (q.data?.length === 0) return <EmptyState ... />
return <List items={q.data} />`,
  relacionados: ['EmptyState', 'Skeleton', 'Spinner', 'Alert'],
}

export function StatesPattern() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="P26"
        category="Pattern · Estados"
        title="Estados"
        italic="loading · empty · error · sem permissão"
        description="Sempre TKWS editorial. Skeleton > Spinner. Mensagem específica + ação clara."
        tag="6 estados"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Loading · skeleton" />
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

      <SubHead num="B" title="Loading · spinner com label" />
      <Showcase>
        <Card>
          <CardContent className="!p-6 text-center">
            <Spinner size={28} tone="brand" />
            <div
              className="mono mt-3 text-[11px] font-bold uppercase tracking-[1.6px]"
              style={{ color: 'var(--text-mute)' }}
            >
              Sincronizando catálogo · 18s restantes
            </div>
          </CardContent>
        </Card>
      </Showcase>

      <SubHead num="C" title="Empty · primeiro registro" />
      <Showcase>
        <EmptyState
          icon={<FolderOpen size={22} strokeWidth={1.7} />}
          tone="brand"
          title="Nenhum projeto ainda."
          description="Cadastre o primeiro projeto e o squad começa a montar o briefing junto com você."
          action={<Button>Novo projeto</Button>}
        />
      </Showcase>

      <SubHead num="D" title="Empty · busca sem resultado" />
      <Showcase>
        <EmptyState
          icon={<Search size={22} strokeWidth={1.7} />}
          tone="neutral"
          title="Nada encontrado."
          description='Tente outros termos ou limpe os filtros. Você buscou por "marmoraria são"…'
          action={<Button variant="outline">Limpar filtros</Button>}
        />
      </Showcase>

      <SubHead num="E" title="Empty · inbox zerado" italic="celebração discreta" />
      <Showcase>
        <EmptyState
          icon={<Inbox size={22} strokeWidth={1.7} />}
          tone="success"
          title="Inbox limpo."
          description="Você respondeu tudo. O squad agradece a velocidade."
        />
      </Showcase>

      <SubHead num="F" title="Erro · network" />
      <Showcase>
        <EmptyState
          icon={<WifiOff size={22} strokeWidth={1.7} />}
          tone="danger"
          title="Sem conexão."
          description="Estamos tentando reconectar. Suas alterações estão salvas localmente."
          action={<Button variant="outline">Tentar novamente</Button>}
        />
      </Showcase>

      <SubHead num="G" title="Erro · API · 500" />
      <Showcase>
        <EmptyState
          icon={<AlertOctagon size={22} strokeWidth={1.7} />}
          tone="danger"
          title="Algo deu errado."
          description="Nosso servidor não respondeu (HTTP 500). Já reportamos o erro · você pode tentar de novo em alguns segundos."
          action={<Button>Tentar de novo</Button>}
        />
      </Showcase>

      <SubHead num="H" title="Sem permissão" />
      <Showcase>
        <EmptyState
          icon={<Plug size={22} strokeWidth={1.7} />}
          tone="warning"
          title="Acesso restrito."
          description="Esta área é exclusiva para líderes de squad. Peça acesso ao seu administrador para continuar."
          action={<Button variant="outline">Pedir acesso</Button>}
        />
      </Showcase>

      <SubHead num="I" title="Em construção · feature flag off" />
      <Showcase>
        <EmptyState
          icon={<Construction size={22} strokeWidth={1.7} />}
          tone="brand"
          title="Em construção · maio/2026"
          description="O módulo de Catálogo Externo está em desenvolvimento e libera para o seu plano em 28/05."
        />
      </Showcase>
    </div>
  )
}
