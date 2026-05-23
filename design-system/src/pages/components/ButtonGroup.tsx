import { LayoutGrid, List, Rows3 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'ButtonGroup',
  import: "import { ButtonGroup } from '@/components/ui/button-group'",
  contexto:
    'Agrupa botões correlacionados com borders fundidas (segmented control). Use para ações relacionadas (anterior/próximo, copiar/baixar) ou para Toggle Group visualmente mais sólido. Diferente de ToggleGroup: ButtonGroup NÃO é stateful · cada botão é independente.',
  quandoUsar: [
    'Ações correlacionadas (Copiar · Editar · Compartilhar)',
    'Visual segmented control sem state interno',
    'Combos de Anterior/Próximo, +/−',
  ],
  props: [
    { name: 'orientation', type: '"horizontal" | "vertical"', description: 'Default horizontal' },
  ],
  antiPatterns: [
    'ButtonGroup para seleção mutuamente exclusiva · use ToggleGroup',
    'ButtonGroup com botões de tamanhos diferentes',
  ],
  exemplo: `<ButtonGroup>
  <Button variant="outline" size="sm"><LayoutGrid size={12}/> Grid</Button>
  <Button variant="outline" size="sm"><List size={12}/> List</Button>
  <Button variant="outline" size="sm"><Rows3 size={12}/> Rows</Button>
</ButtonGroup>`,
  relacionados: ['ToggleGroup', 'Button'],
}

export function ButtonGroupPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="06.18"
        category="Foundation · ButtonGroup"
        title="Button Group"
        italic="segmented · ações"
        description="Agrupa botões correlacionados com borders fundidas. Sem state interno · cada botão é independente."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="View switcher visual" />
      <Showcase>
        <ButtonGroup>
          <Button variant="outline" size="sm"><LayoutGrid size={12} /> Grid</Button>
          <Button variant="outline" size="sm"><List size={12} /> Lista</Button>
          <Button variant="outline" size="sm"><Rows3 size={12} /> Rows</Button>
        </ButtonGroup>
      </Showcase>

      <SubHead num="B" title="Vertical · toolbar lateral" />
      <Showcase>
        <ButtonGroup orientation="vertical">
          <Button variant="outline" size="icon" aria-label="Grid"><LayoutGrid size={13} /></Button>
          <Button variant="outline" size="icon" aria-label="List"><List size={13} /></Button>
          <Button variant="outline" size="icon" aria-label="Rows"><Rows3 size={13} /></Button>
        </ButtonGroup>
      </Showcase>
    </div>
  )
}
