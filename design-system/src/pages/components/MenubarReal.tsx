import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Menubar (Radix)',
  import: "import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarSub, MenubarSubTrigger, MenubarSubContent, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarLabel } from '@/components/ui/menubar'",
  contexto:
    'Menubar shadcn/Radix · estilo desktop (Arquivo · Editar · Visualizar). Aciona sub-menus, checkboxes, radios. Foco e teclado herdados do Radix · Cmd+? para navegar entre menus.',
  quandoUsar: [
    'Plugin SketchUp (paradigma desktop)',
    'Apps power-user em modo Power',
    'Menus persistentes (sempre visíveis no topo)',
  ],
  props: [],
  antiPatterns: [
    'Menubar em mobile · esconda e use bottom sheet',
    'Menubar para nav primária · use Sidebar/NavigationMenu',
  ],
  exemplo: `<Menubar>
  <MenubarMenu>
    <MenubarTrigger>Arquivo</MenubarTrigger>
    <MenubarContent>
      <MenubarItem shortcut="⌘N">Novo projeto</MenubarItem>
      <MenubarItem shortcut="⌘O">Abrir…</MenubarItem>
      <MenubarSeparator />
      <MenubarSub>
        <MenubarSubTrigger>Exportar</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>PDF</MenubarItem>
          <MenubarItem>XLSX</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
  relacionados: ['DropdownMenu', 'Command Palette'],
}

export function MenubarRealPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="08.5b"
        category="Navigation · Menubar (Radix)"
        title="Menubar"
        italic="paradigma desktop"
        description="Implementação completa via @radix-ui/react-menubar. Sub-menus, checkbox, radio · teclado total."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Menubar full · Arquivo · Editar · Visualizar · Ajuda" />
      <Showcase>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Arquivo</MenubarTrigger>
            <MenubarContent>
              <MenubarLabel>Projeto</MenubarLabel>
              <MenubarItem shortcut="⌘N">Novo projeto</MenubarItem>
              <MenubarItem shortcut="⌘O">Abrir…</MenubarItem>
              <MenubarItem shortcut="⌘S">Salvar</MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Exportar</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>PDF</MenubarItem>
                  <MenubarItem>XLSX</MenubarItem>
                  <MenubarItem>JSON</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem>Sair</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Editar</MenubarTrigger>
            <MenubarContent>
              <MenubarItem shortcut="⌘Z">Desfazer</MenubarItem>
              <MenubarItem shortcut="⌘⇧Z">Refazer</MenubarItem>
              <MenubarSeparator />
              <MenubarItem shortcut="⌘X">Recortar</MenubarItem>
              <MenubarItem shortcut="⌘C">Copiar</MenubarItem>
              <MenubarItem shortcut="⌘V">Colar</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Visualizar</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked>Mostrar grid</MenubarCheckboxItem>
              <MenubarCheckboxItem>Mostrar régua</MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarLabel>Tema</MenubarLabel>
              <MenubarRadioGroup value="dark">
                <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
                <MenubarRadioItem value="light">Light</MenubarRadioItem>
                <MenubarRadioItem value="system">Sistema</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Ajuda</MenubarTrigger>
            <MenubarContent>
              <MenubarItem shortcut="⌘K">Command Palette</MenubarItem>
              <MenubarItem>Documentação</MenubarItem>
              <MenubarItem>Atalhos</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Showcase>
    </div>
  )
}
