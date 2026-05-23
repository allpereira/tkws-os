import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Kbd, KbdCombo } from '@/components/ui/kbd'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Kbd · KbdCombo',
  import: "import { Kbd, KbdCombo } from '@/components/ui/kbd'",
  contexto:
    'Display de tecla(s). Use em Tooltip, Command Palette, ajuda de atalhos. KbdCombo agrupa teclas (⌘ + K) com separator opcional. Mac vs Windows é responsabilidade do consumidor — use ⌘ no Mac, Ctrl no Windows.',
  quandoUsar: [
    'Tooltip de IconButton com atalho',
    'Command Palette · CommandShortcut',
    'Tabela de atalhos em "Ajuda"',
  ],
  props: [
    { name: 'size', type: '"sm" | "md"', description: 'Default sm (compacto)' },
    { name: 'keys (KbdCombo)', type: 'string[]', description: 'Lista de teclas · pode ter ⌘, ⌥, ⌃' },
  ],
  antiPatterns: [
    'Texto inline em vez de <Kbd> · perde reconhecibilidade visual',
    'Mostrar tecla Mac em usuários Windows · detecte ou condicione',
  ],
  exemplo: `<Tooltip>
  <TooltipTrigger asChild><Button>Salvar</Button></TooltipTrigger>
  <TooltipContent>Salvar · <KbdCombo keys={['⌘','S']} /></TooltipContent>
</Tooltip>`,
  relacionados: ['Command Palette', 'Tooltip'],
}

export function KbdPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="10.8"
        category="Feedback · Kbd"
        title="Kbd"
        italic="tecla / atalho"
        description="Display estilizado de tecla. KbdCombo agrupa atalhos completos."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Tecla única" />
      <Showcase>
        <div className="flex flex-wrap items-center gap-3 text-[13px]" style={{ color: 'var(--text-soft)' }}>
          Pressione <Kbd>Esc</Kbd> para fechar · <Kbd>↵</Kbd> para enviar · <Kbd>Tab</Kbd> para navegar
        </div>
      </Showcase>

      <SubHead num="B" title="Combos" />
      <Showcase>
        <div className="flex flex-col gap-3 text-[13px]" style={{ color: 'var(--text-soft)' }}>
          <div className="flex items-center gap-3">
            Command Palette: <KbdCombo keys={['⌘', 'K']} />
          </div>
          <div className="flex items-center gap-3">
            Novo projeto: <KbdCombo keys={['⌘', 'N']} />
          </div>
          <div className="flex items-center gap-3">
            Buscar global: <KbdCombo keys={['⌘', '⇧', 'F']} />
          </div>
        </div>
      </Showcase>
    </div>
  )
}
