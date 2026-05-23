import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Menubar',
  import: "import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@/components/ui/menubar' (futuro)",
  contexto:
    'Menubar é a barra estilo desktop (Arquivo · Editar · Visualizar). Use em apps power-user (Plugin SketchUp, modo Power). Para web normal, prefira sidebar + command palette ⌘K.',
  quandoUsar: [
    'Apps com paradigma desktop (Plugin SketchUp do TKWS OS)',
    'Operação avançada com atalhos teclado',
    'Modo Power (densidade alta)',
  ],
  props: [],
  antiPatterns: [
    'Menubar em mobile — esconda e use bottom sheet',
    'Menubar para CRUD básico — use command palette',
  ],
  exemplo: `<Menubar>
  <MenubarMenu>
    <MenubarTrigger>Arquivo</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Novo projeto · ⌘N</MenubarItem>
      <MenubarItem>Abrir… · ⌘O</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Exportar PDF</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
  relacionados: ['DropdownMenu', 'Command Palette'],
}

/** Demonstrado com DropdownMenu até o componente Menubar ser portado. */
export function MenubarPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="08.5"
        category="Navigation · Menubar"
        title="Menubar"
        italic="apps power-user"
        description="Barra estilo desktop. Use no Plugin SketchUp e no modo Power. Para web normal, use sidebar + ⌘K."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Demonstração com DropdownMenu" />
      <Showcase title="Composição estilo Menubar">
        <div className="flex items-center gap-px rounded-lg border p-1"
             style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}>
          {[
            { trigger: 'Arquivo', items: ['Novo projeto · ⌘N', 'Abrir… · ⌘O', '—', 'Exportar PDF'] },
            { trigger: 'Editar', items: ['Desfazer · ⌘Z', 'Refazer · ⌘⇧Z', '—', 'Buscar · ⌘F'] },
            { trigger: 'Visualizar', items: ['Tema · Dark', 'Tema · Light', '—', 'Tela cheia · ⌃⌘F'] },
            { trigger: 'Ajuda', items: ['Atalhos · ⌘K', 'Documentação'] },
          ].map((m) => (
            <DropdownMenu key={m.trigger}>
              <DropdownMenuTrigger asChild>
                <button
                  className="cursor-pointer rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors hover:bg-white/[0.06]"
                  style={{ color: 'var(--text-soft)' }}
                >
                  {m.trigger}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>{m.trigger}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {m.items.map((it, i) =>
                  it === '—' ? (
                    <DropdownMenuSeparator key={i} />
                  ) : (
                    <DropdownMenuItem key={i}>{it}</DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      </Showcase>
    </div>
  )
}
