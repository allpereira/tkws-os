import { useState } from 'react'
import { Star, Pin, Bell, BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Toggle, ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle'
import { Label } from '@/components/ui/label'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Toggle · ToggleGroup',
  import: "import { Toggle, ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle'",
  contexto:
    'Toggle individual = botão liga/desliga (mostra Favoritos, Fixados). ToggleGroup = filtros rápidos (UF, Status) — single ou multiple. Diferente de Tabs: toggle NÃO troca conteúdo, só liga/desliga estado.',
  quandoUsar: [
    'Filtros rápidos inline em toolbars (Status, UF, Período)',
    'Bolean visual (Favoritos, Fixados, Alertas)',
    'Multi-select onde Checkbox seria visualmente pesado',
  ],
  props: [
    { name: 'type (Group)', type: '"single" | "multiple"', description: 'Modo do grupo' },
    { name: 'pressed / value', type: 'boolean | string[]', description: 'Estado' },
  ],
  antiPatterns: [
    'Toggle para navegação — use Tabs',
    'Toggle Group com 8+ itens — vire FilterSidebar',
  ],
  exemplo: `<Label>Status</Label>
<ToggleGroup type="multiple" defaultValue={['no-prazo', 'atrasado']}>
  <ToggleGroupItem value="no-prazo">No prazo</ToggleGroupItem>
  <ToggleGroupItem value="atrasado">Atrasado</ToggleGroupItem>
  <ToggleGroupItem value="definindo">Definindo</ToggleGroupItem>
  <ToggleGroupItem value="pausado">Pausado</ToggleGroupItem>
</ToggleGroup>`,
  relacionados: ['Checkbox', 'RadioGroup', 'Tabs'],
}

export function TogglePage() {
  const [favorito, setFavorito] = useState(true)
  const [pinned, setPinned] = useState(false)

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="08.2"
        category="Navigation · Toggle"
        title="Toggle · Toggle Group"
        italic="filtros rápidos"
        description="Liga/desliga visual ou grupo de filtros (single ou multiple). Diferente de Tabs: não troca conteúdo, só estado."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Toggle individual" />
      <Showcase>
        <div className="flex flex-wrap gap-2">
          <Toggle pressed={favorito} onPressedChange={setFavorito}>
            <Star size={13} /> Favoritos
          </Toggle>
          <Toggle pressed={pinned} onPressedChange={setPinned}>
            <Pin size={13} /> Fixados
          </Toggle>
          <Toggle defaultPressed>
            <Bell size={13} /> Alertas
          </Toggle>
          <Toggle>
            <BarChart3 size={13} /> Compactos
          </Toggle>
        </div>
      </Showcase>

      <SubHead num="B" title="ToggleGroup · seleção única (UF)" />
      <Showcase>
        <Label>UF</Label>
        <div className="mt-2">
          <ToggleGroup type="single" defaultValue="sc">
            {['SC', 'SP', 'PR', 'RJ', 'Outras'].map((uf) => (
              <ToggleGroupItem key={uf} value={uf.toLowerCase()}>
                {uf}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </Showcase>

      <SubHead num="C" title="ToggleGroup · seleção múltipla (Status)" />
      <Showcase>
        <Label>Status</Label>
        <div className="mt-2">
          <ToggleGroup type="multiple" defaultValue={['no-prazo', 'atrasado']}>
            <ToggleGroupItem value="no-prazo">No prazo</ToggleGroupItem>
            <ToggleGroupItem value="atrasado">Atrasado</ToggleGroupItem>
            <ToggleGroupItem value="definindo">Definindo</ToggleGroupItem>
            <ToggleGroupItem value="pausado">Pausado</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Showcase>
    </div>
  )
}
