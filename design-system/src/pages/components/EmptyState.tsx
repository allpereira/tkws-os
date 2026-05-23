import { FolderOpen, Plus, Search } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'EmptyState',
  import: "import { EmptyState } from '@/components/ui/empty-state'",
  contexto:
    'Estado vazio · primeiro projeto, busca sem resultado, lista vazia. Sempre forneça AÇÃO clara (criar primeiro item, limpar filtros). Não é só "nada aqui" — é direção para próximo passo.',
  quandoUsar: [
    'Lista vazia (sem nenhum registro · onboarding)',
    'Busca sem resultados',
    'Filtros muito restritivos',
    'Pós-conclusão (tudo arquivado!)',
  ],
  props: [
    { name: 'icon', type: 'ReactNode', description: 'lucide-react · 20-24px' },
    { name: 'title', type: 'string', description: 'Frase curta + editorial' },
    { name: 'description', type: 'string', description: 'O que está acontecendo + próximo passo' },
    { name: 'action', type: 'ReactNode', description: 'Botão principal · sempre tenha' },
    { name: 'tone', type: '"neutral" | "brand" | "success" | "warning" | "danger"', description: 'Cor do icon' },
  ],
  antiPatterns: [
    'EmptyState sem action — usuário fica perdido',
    'Mensagem genérica "Nenhum item" — falte personalidade TKWS',
  ],
  exemplo: `<EmptyState
  icon={<FolderOpen size={22}/>}
  title="Nenhum projeto ainda."
  description="Cadastre o primeiro projeto e o squad começa a montar o briefing."
  action={<Button><Plus size={14}/> Novo projeto</Button>}
/>`,
  relacionados: ['Alert', 'Card'],
}

export function EmptyStatePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="10.5"
        category="Feedback · Empty State"
        title="Empty State"
        italic="nada + próximo passo"
        description="Estado vazio com direção. Sempre tenha ação clara. Mensagem editorial — não 'no items found' genérico."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Primeira vez" italic="onboarding" />
      <Showcase>
        <EmptyState
          icon={<FolderOpen size={22} strokeWidth={1.7} />}
          tone="brand"
          title="Nenhum projeto ainda."
          description="Cadastre o primeiro projeto e o squad começa a montar o briefing junto com você."
          action={
            <Button>
              <Plus size={14} /> Novo projeto
            </Button>
          }
        />
      </Showcase>

      <SubHead num="B" title="Busca sem resultado" />
      <Showcase>
        <EmptyState
          icon={<Search size={22} strokeWidth={1.7} />}
          tone="neutral"
          title="Nada encontrado."
          description="Tente outros termos ou limpe os filtros para ampliar a busca."
          action={<Button variant="outline">Limpar filtros</Button>}
        />
      </Showcase>
    </div>
  )
}
