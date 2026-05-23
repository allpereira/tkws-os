import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { ActiveFilterChips, FilterSection, FilterSidebar, type FilterChip } from '@/components/tkws/filter-sidebar'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'FilterSidebar · ActiveFilterChips',
  import: "import { FilterSidebar, FilterSection, ActiveFilterChips } from '@/components/tkws/filter-sidebar'",
  contexto:
    'Sidebar de filtros sticky em listas. Compõe ToggleGroup, Slider, Input, etc. Chips ativos abaixo do toolbar mostram filtros aplicados — clicar remove individualmente. Persista no URL via search params.',
  quandoUsar: [
    'Listas com 4+ filtros simultâneos',
    'Quando o usuário precisa "saved views" via URL',
    'Lista de projetos / clientes / fornecedores com filtros operacionais',
  ],
  props: [
    { name: 'title (FilterSidebar)', type: 'string', description: 'Default "Filtros"' },
    { name: 'children', type: 'ReactNode (FilterSection)', description: 'Quantas seções precisar' },
    { name: 'chips / onRemove / onClear (Chips)', type: 'controlled', description: 'Estado dos filtros ativos' },
  ],
  antiPatterns: [
    'Filtros que não persistem na URL · perde "voltar" e "compartilhar"',
    'FilterSidebar com 10+ seções · vire Sheet de filtros avançados',
  ],
  exemplo: `<div className="grid grid-cols-[260px_1fr] gap-5">
  <FilterSidebar>
    <FilterSection label="Squad">
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="orion">Orion</ToggleGroupItem>
        <ToggleGroupItem value="apollo">Apollo</ToggleGroupItem>
      </ToggleGroup>
    </FilterSection>
  </FilterSidebar>
  <div>
    <ActiveFilterChips chips={activeChips} onRemove={removeOne} onClear={clearAll} />
    {/* DataTable */}
  </div>
</div>`,
  relacionados: ['Sheet (filtros mobile)', 'DataTable', 'ToggleGroup'],
}

export function FilterSidebarPage() {
  const [range, setRange] = useState([400_000, 12_000_000])
  const [chips, setChips] = useState<FilterChip[]>([
    { id: 'sq', label: 'Squad', value: 'Orion' },
    { id: 'uf', label: 'UF', value: 'SC' },
    { id: 'val', label: 'Valor', value: 'R$ 0,4M → 12M' },
  ])

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="12.4"
        category="Layout · Filter Sidebar"
        title="Filter Sidebar"
        italic="filtros + chips ativos"
        description="Sidebar com filtros compostos · chips ativos remove-on-click. Persista na URL para saved views."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Sidebar + chips" />
      <Showcase padding="comfortable">
        <div className="mb-4">
          <ActiveFilterChips
            chips={chips}
            onRemove={(id) => setChips((c) => c.filter((x) => x.id !== id))}
            onClear={() => setChips([])}
          />
        </div>
        <div className="grid grid-cols-[260px_1fr] gap-5 max-[760px]:grid-cols-1">
          <FilterSidebar>
            <FilterSection label="Squad">
              <ToggleGroup type="multiple" defaultValue={['orion']}>
                <ToggleGroupItem value="orion">Orion</ToggleGroupItem>
                <ToggleGroupItem value="apollo">Apollo</ToggleGroupItem>
                <ToggleGroupItem value="neptune">Neptune</ToggleGroupItem>
              </ToggleGroup>
            </FilterSection>
            <FilterSection label="UF">
              <ToggleGroup type="single" defaultValue="sc">
                {['SC', 'SP', 'PR', 'RJ'].map((uf) => (
                  <ToggleGroupItem key={uf} value={uf.toLowerCase()}>
                    {uf}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FilterSection>
            <FilterSection label="Valor do contrato">
              <Slider value={range} min={400_000} max={20_000_000} step={50_000} onValueChange={setRange} />
              <div className="mono flex justify-between text-[10.5px]" style={{ color: 'var(--text-soft)' }}>
                <span>{formatCurrency(range[0])}</span>
                <span>{formatCurrency(range[1])}</span>
              </div>
            </FilterSection>
            <FilterSection label="Busca textual">
              <Input icon={<Search size={14} />} placeholder="Código, cliente…" />
            </FilterSection>
          </FilterSidebar>
          <div
            className="flex min-h-[280px] items-center justify-center rounded-xl border p-6 text-center text-[13px]"
            style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)', color: 'var(--text-mute)' }}
          >
            <div>
              <div
                className="mono text-[10px] font-bold uppercase tracking-[1.6px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Resultados
              </div>
              <div className="serif mt-2 text-[24px] font-light" style={{ color: 'var(--text)' }}>
                43 projetos
              </div>
              <div className="mt-2 text-[12px]">DataTable / RichList renderiza aqui.</div>
            </div>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
