import { useState } from 'react'
import { Archive, Copy, Edit, MoreVertical, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'DropdownMenu',
  import: "import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu'",
  contexto:
    'Menu contextual disparado por clique em botão (kebab, dots, "Mais"). Use para ações secundárias do item — editar, duplicar, arquivar, excluir. Para opções de configuração que persistem (visíveis em colunas), use CheckboxItem.',
  quandoUsar: [
    'Ações secundárias por item de lista (kebab menu)',
    'Configurações de tabela (mostrar/esconder colunas) — CheckboxItem',
    'Atalhos rápidos no header',
  ],
  props: [
    { name: 'shortcut (Item)', type: 'string', description: 'Exibe atalho ⌘+letra à direita' },
    { name: 'inset', type: 'boolean', description: 'Alinha texto quando há checkbox/icon ao lado' },
  ],
  antiPatterns: [
    'DropdownMenu como navegação principal — use Sidebar',
    'DropdownMenu com 15+ itens — vire Command Palette',
    'Ações destrutivas sem destaque — coloque por último, em vermelho',
  ],
  exemplo: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon"><MoreVertical size={14} /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem shortcut="⌘E"><Edit size={13}/> Editar</DropdownMenuItem>
    <DropdownMenuItem shortcut="⌘D"><Copy size={13}/> Duplicar</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem><Archive size={13}/> Arquivar</DropdownMenuItem>
    <DropdownMenuItem style={{color:'var(--danger)'}}>
      <Trash2 size={13}/> Excluir
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
  relacionados: ['Command Palette', 'ContextMenu', 'Popover'],
}

export function DropdownPage() {
  const [showCode, setShowCode] = useState(true)
  const [showClient, setShowClient] = useState(true)
  const [showMargin, setShowMargin] = useState(false)

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="09.4"
        category="Overlays · Dropdown Menu"
        title="Dropdown Menu"
        italic="ações contextuais"
        description="Kebab menu por item · configurações de visualização · atalhos. Use CheckboxItem para preferências persistentes."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Ações por item" italic="kebab menu" />
      <Showcase>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Mais ações">
              <MoreVertical size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>#2410 · Yachthouse</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem shortcut="⌘E"><Edit size={13} /> Editar</DropdownMenuItem>
            <DropdownMenuItem shortcut="⌘D"><Copy size={13} /> Duplicar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Archive size={13} /> Arquivar</DropdownMenuItem>
            <DropdownMenuItem style={{ color: 'var(--danger)' }}>
              <Trash2 size={13} /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Showcase>

      <SubHead num="B" title="Visualização · colunas" italic="CheckboxItem" />
      <Showcase>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Colunas</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Colunas visíveis</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={showCode} onCheckedChange={setShowCode}>
              Código
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={showClient} onCheckedChange={setShowClient}>
              Cliente
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={showMargin} onCheckedChange={setShowMargin}>
              Margem
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Showcase>
    </div>
  )
}
