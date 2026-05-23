import { useEffect, useState } from 'react'
import { Calendar, FilePlus, FolderOpen, Settings, Users } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Command Palette',
  import: "import { CommandDialog, CommandInput, CommandList, CommandItem, CommandGroup, CommandShortcut, CommandSeparator, CommandEmpty } from '@/components/ui/command'",
  contexto:
    'Command palette ⌘K (CtrlK) com busca fuzzy (cmdk). É o atalho principal de power-user no TKWS OS. Inclui ações rápidas, navegação, mudança de tema. Disparado por keydown global.',
  quandoUsar: [
    'Atalho universal — toda app TKWS expõe ⌘K',
    'Navegação rápida entre rotas',
    'Comandos rápidos (criar, alternar tema, configurações)',
  ],
  props: [
    { name: 'open / onOpenChange', type: 'controlled', description: 'Estado externo · disparado por keydown' },
  ],
  antiPatterns: [
    'Esconder ações que só estão no command palette · power-user invisível',
    'Sem CommandEmpty · UX feia quando não há match',
  ],
  exemplo: `const [open, setOpen] = useState(false)

useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOpen(o => !o)
    }
  }
  document.addEventListener('keydown', down)
  return () => document.removeEventListener('keydown', down)
}, [])

<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Buscar ações, projetos, clientes…" />
  <CommandList>
    <CommandEmpty>Nada encontrado.</CommandEmpty>
    <CommandGroup heading="Ações">
      <CommandItem><FilePlus size={14}/> Novo projeto <CommandShortcut>⌘N</CommandShortcut></CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>`,
  relacionados: ['DropdownMenu', 'Combobox', 'Sheet'],
}

export function CommandPage() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="09.9"
        category="Overlays · Command Palette"
        title="Command Palette"
        italic="⌘K · power-user"
        description="Atalho universal com busca fuzzy. Toda app TKWS expõe um. Use para navegar, criar e configurar rapidamente."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Disparar com ⌘K" />
      <Showcase>
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpen(true)}>Abrir Command Palette</Button>
          <span
            className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]"
            style={{ color: 'var(--text-mute)' }}
          >
            ou pressione ⌘K
          </span>
        </div>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Buscar ações, projetos, clientes…" />
          <CommandList>
            <CommandEmpty>Nada encontrado.</CommandEmpty>
            <CommandGroup heading="Ações">
              <CommandItem onSelect={() => setOpen(false)}>
                <FilePlus size={14} /> Novo projeto
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Users size={14} /> Novo cliente
                <CommandShortcut>⌘⇧C</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navegar">
              <CommandItem onSelect={() => setOpen(false)}>
                <FolderOpen size={14} /> Projetos
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Calendar size={14} /> Agenda
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Settings size={14} /> Configurações
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Showcase>
    </div>
  )
}
