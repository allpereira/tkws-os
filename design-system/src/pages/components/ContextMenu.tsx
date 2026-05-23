import { Copy, Edit, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'ContextMenu',
  import: "import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel } from '@/components/ui/context-menu'",
  contexto:
    'Menu via right-click. Em apps power-user, é o atalho mais rápido (Plugin SketchUp, modo Power). Sempre duplicar ações em DropdownMenu/kebab para descobribilidade — context menu é atalho, não único caminho.',
  quandoUsar: [
    'Modo Power (densidade alta) — atalhos sobre células de tabela',
    'Plugin SketchUp · paradigma desktop',
    'Itens com dezenas de ações onde kebab seria poluído',
  ],
  props: [],
  antiPatterns: [
    'ContextMenu como ÚNICO caminho — não funciona em mobile',
    'ContextMenu em UI guided (Standard/Guided) — esconde funções',
  ],
  exemplo: `<ContextMenu>
  <ContextMenuTrigger>
    {/* Área que recebe right-click */}
    <div>Item da tabela</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Editar</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Excluir</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
  relacionados: ['DropdownMenu', 'Command Palette'],
}

export function ContextMenuPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="09.5"
        category="Overlays · Context Menu"
        title="Context Menu"
        italic="right-click · power-user"
        description="Menu via clique direito. Sempre duplicar em kebab para descobribilidade. Não funciona em mobile."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Right-click no card" />
      <Showcase>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              className="cursor-context-menu rounded-xl border p-6 text-center text-[13px]"
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--line-2)',
                color: 'var(--text-soft)',
              }}
            >
              Clique com o botão direito aqui
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>#2410 Yachthouse</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem shortcut="⌘E"><Edit size={13} /> Editar</ContextMenuItem>
            <ContextMenuItem shortcut="⌘D"><Copy size={13} /> Duplicar</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem style={{ color: 'var(--danger)' }} shortcut="⌫">
              <Trash2 size={13} /> Excluir
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Showcase>
    </div>
  )
}
