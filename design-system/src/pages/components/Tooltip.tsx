import { Info, Settings, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Tooltip',
  import: "import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'\nimport { TooltipProvider } from '@/components/ui/tooltip' // já está no root",
  contexto:
    'Texto curto explicativo em hover/focus de elementos. Use SOBRE TUDO em botões de ícone sem label visível. Sempre tenha TooltipProvider envolvendo a app (já está no main.tsx).',
  quandoUsar: [
    'Botões de ícone sem label visível (kebab, settings, lupa)',
    'Explicar siglas e códigos (rev.0, BC/SC)',
    'Mostrar atalho de teclado (⌘K)',
  ],
  props: [
    { name: 'delayDuration (Provider)', type: 'number', description: 'Default 150ms · setado no main.tsx' },
    { name: 'side', type: '"top" | "right" | "bottom" | "left"', description: 'Direção · default "top"' },
  ],
  antiPatterns: [
    'Tooltip para conteúdo crítico — pode não aparecer em touch',
    'Tooltip com > 1 linha · use HoverCard ou Popover',
    'Tooltip em tela inteira — confunde com Dialog',
  ],
  exemplo: `<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Excluir">
      <Trash2 size={14} />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Excluir item · ⌫</TooltipContent>
</Tooltip>`,
  relacionados: ['HoverCard', 'Popover'],
}

export function TooltipPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="09.7"
        category="Overlays · Tooltip"
        title="Tooltip"
        italic="texto curto em hover"
        description="Hint mínimo para ações sem label. Use em todo IconButton. ProviderApp já configurado em main.tsx."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Em botões de ícone" />
      <Showcase>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Excluir">
                <Trash2 size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Excluir · ⌫</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Configurações">
                <Settings size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Configurações · ⌘,</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Mais info">
                <Info size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Saiba mais sobre este KPI</TooltipContent>
          </Tooltip>
        </div>
      </Showcase>
    </div>
  )
}
