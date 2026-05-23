import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Separator } from '@/components/ui/separator'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Separator',
  import: "import { Separator } from '@/components/ui/separator'",
  contexto:
    'Linha horizontal ou vertical para separar grupos. Versão labeled exibe texto centralizado entre duas linhas (útil para "OU" em forms). Decorativo por padrão — não é semântico.',
  quandoUsar: [
    'Separar grupos em menus, listas, sidebar',
    'Vertical entre actions em toolbars',
    'Labeled para "OU continue com..." em auth',
  ],
  props: [
    { name: 'orientation', type: '"horizontal" | "vertical"', description: 'Direção' },
    { name: 'label', type: 'string', description: 'Texto centralizado · força orientação horizontal' },
  ],
  antiPatterns: [
    'Bordas duplicadas — se o container já tem border, separator é redundante',
    'Separator em contextos com muito padding — use whitespace',
  ],
  exemplo: `<Separator />
<Separator orientation="vertical" className="h-6" />
<Separator label="OU CONTINUE COM" />`,
  relacionados: ['ScrollArea', 'DropdownMenuSeparator'],
}

export function SeparatorPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="06.17"
        category="Foundation · Separator"
        title="Separator"
        italic="horizontal · vertical · labeled"
        description="Linha sutil para separar grupos. Use com parcimônia — em UIs com border, separator vira ruído."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Horizontal" />
      <Showcase>
        <div className="space-y-3">
          <div className="text-[13px]" style={{ color: 'var(--text-soft)' }}>Bloco superior</div>
          <Separator />
          <div className="text-[13px]" style={{ color: 'var(--text-soft)' }}>Bloco inferior</div>
        </div>
      </Showcase>

      <SubHead num="B" title="Labeled" />
      <Showcase>
        <Separator label="OU CONTINUE COM" />
      </Showcase>

      <SubHead num="C" title="Vertical inline" />
      <Showcase>
        <div className="flex items-center gap-3 text-[13px]" style={{ color: 'var(--text-soft)' }}>
          <span>Editar</span>
          <Separator orientation="vertical" className="h-5" />
          <span>Duplicar</span>
          <Separator orientation="vertical" className="h-5" />
          <span style={{ color: 'var(--danger)' }}>Excluir</span>
        </div>
      </Showcase>
    </div>
  )
}
