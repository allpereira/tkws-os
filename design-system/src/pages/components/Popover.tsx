import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input, Field } from '@/components/ui/input'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Popover',
  import: "import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'",
  contexto:
    'Popover = container flutuante para conteúdo rico (form curto, settings inline, datepicker). Diferente de Tooltip (texto curto) e DropdownMenu (lista de actions). Fecha em clique fora e ESC.',
  quandoUsar: [
    'Settings inline (formato de tabela, tema)',
    'Datepicker (Popover + Calendar)',
    'Combobox (Popover + Command)',
    'Filtros avançados de coluna',
  ],
  props: [
    { name: 'align', type: '"start" | "center" | "end"', description: 'Alinhamento horizontal · default "center"' },
    { name: 'sideOffset', type: 'number', description: 'Espaço do trigger · default 6' },
  ],
  antiPatterns: [
    'Popover com 3 palavras · use Tooltip',
    'Popover com lista de ações · use DropdownMenu',
    'Popover acima de Dialog · stacking confuso',
  ],
  exemplo: `<Popover>
  <PopoverTrigger asChild><Button variant="outline">Configurar</Button></PopoverTrigger>
  <PopoverContent>
    <Label>Densidade</Label>
    <Slider defaultValue={[50]} max={100} />
  </PopoverContent>
</Popover>`,
  relacionados: ['Tooltip', 'DropdownMenu', 'HoverCard'],
}

export function PopoverPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="09.6"
        category="Overlays · Popover"
        title="Popover"
        italic="conteúdo flutuante rico"
        description="Container flutuante para form curto, settings ou pickers. Diferente de Tooltip (texto) e Dropdown (ações)."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Settings inline" />
      <Showcase>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Configurar densidade</Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72">
            <div className="grid gap-4">
              <div>
                <Label>Densidade da tabela</Label>
                <div className="mt-3">
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="mono mt-1 flex justify-between text-[10px]" style={{ color: 'var(--text-mute)' }}>
                  <span>Confortável</span>
                  <span>Compacto</span>
                </div>
              </div>
              <Field>
                <Label htmlFor="rows">Linhas por página</Label>
                <Input id="rows" type="number" defaultValue={25} />
              </Field>
            </div>
          </PopoverContent>
        </Popover>
      </Showcase>
    </div>
  )
}
