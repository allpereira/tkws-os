import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'HoverCard',
  import: "import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'",
  contexto:
    'Preview rico ao hover de um link ou nome (cliente, projeto, pessoa). Entre Tooltip (texto curto) e Popover (clique). Não dispara em touch — sempre tenha caminho redundante para mobile.',
  quandoUsar: [
    'Preview de pessoa/cliente ao hover do nome em listas',
    'Detalhe rápido de projeto sem mudar tela',
    'Mostrar capa + KPIs principais do item',
  ],
  props: [
    { name: 'openDelay / closeDelay', type: 'number', description: 'Default 700/300ms' },
  ],
  antiPatterns: [
    'HoverCard como único caminho para info — invisível em touch',
    'HoverCard em botão · use Tooltip',
    'HoverCard que precisa de input — vire Popover',
  ],
  exemplo: `<HoverCard>
  <HoverCardTrigger className="underline cursor-help">
    Família Andrade
  </HoverCardTrigger>
  <HoverCardContent>
    <div className="flex items-start gap-3">
      <Avatar><AvatarFallback>FA</AvatarFallback></Avatar>
      <div>
        <div className="serif text-[16px]">Família Andrade</div>
        <div className="mono text-[10.5px]">3 projetos · R$ 32,4M</div>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>`,
  relacionados: ['Tooltip', 'Popover'],
}

export function HoverCardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="09.8"
        category="Overlays · HoverCard"
        title="HoverCard"
        italic="preview rico em hover"
        description="Card flutuante com info sumária do item. Entre Tooltip e Popover. Cuidado: hover não funciona em touch."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Preview de cliente" />
      <Showcase>
        <p className="text-[14px]" style={{ color: 'var(--text-soft)' }}>
          Projeto em obra para{' '}
          <HoverCard>
            <HoverCardTrigger asChild>
              <button
                className="cursor-help underline-offset-4 hover:underline"
                style={{ color: 'var(--brand)' }}
              >
                Família Andrade
              </button>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex items-start gap-3">
                <Avatar size="lg" style={{ background: 'var(--purple)' }}>
                  <AvatarFallback>FA</AvatarFallback>
                </Avatar>
                <div>
                  <div className="serif text-[16px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                    Família Andrade
                  </div>
                  <div className="mono mt-1 text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                    3 projetos · R$ 32,4M · BC/SC
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge tone="success">No prazo</Badge>
                    <Badge tone="brand">VIP</Badge>
                  </div>
                  <div className="mt-3 text-[12px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                    Cliente recorrente desde 2019 · referência em residências de alto padrão.
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          {' '}— entrega prevista 15/06.
        </p>
      </Showcase>
    </div>
  )
}
