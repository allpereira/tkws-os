import { useState } from 'react'
import { Download, LayoutGrid, List as ListIcon, Plus, Search, SlidersHorizontal, Table as TableIcon } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { TkwsHeader } from '@/components/tkws/header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ActiveFilterChips, FilterSidebar, FilterSection, type FilterChip } from '@/components/tkws/filter-sidebar'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle'
import { RichList, type RichListItem } from '@/components/tkws/rich-list'
import { Kanban, type KanbanCard, type KanbanLane } from '@/components/tkws/kanban'
import { KpiMini } from '@/components/tkws/kpi'
import type { AIPrompt } from '@/lib/prompts'

const items: RichListItem[] = [
  { id: '2410', code: '2410', name: 'Yachthouse 2104', client: 'F. Andrade', area: '280 m²', squad: { label: 'Orion', tone: 'purple' }, contractValue: 12_500_000, margin: 0.31, progress: 65, status: { label: 'Em obra', tone: 'warning' } },
  { id: '2411', code: '2411', name: 'Cobertura Titanium', client: 'WS Group', area: '920 m²', squad: { label: 'Orion', tone: 'purple' }, contractValue: 9_500_000, margin: 0.36, progress: 82, status: { label: 'No prazo', tone: 'success' } },
  { id: '2412', code: '2412', name: 'Vitra 1801', client: 'F. Costa', area: '145 m²', squad: { label: 'Apollo', tone: 'pink' }, contractValue: 4_200_000, margin: 0.28, progress: 45, status: { label: 'Em revisão', tone: 'brand' } },
  { id: '2413', code: '2413', name: 'Sky Resort', client: 'F. Oz', area: '1200 m²', squad: { label: 'Orion', tone: 'purple' }, contractValue: 18_900_000, margin: 0.42, progress: 92, status: { label: 'Entregando', tone: 'success' } },
  { id: '2414', code: '2414', name: 'Campo Belo SP', client: 'Campo Belo Inv.', area: '380 m²', squad: { label: 'Apollo', tone: 'pink' }, contractValue: 6_700_000, margin: 0.24, progress: 15, status: { label: 'Briefing', tone: 'neutral' } },
]

const lanes: KanbanLane[] = [
  { id: 'briefing', title: 'Briefing', tone: 'neutral' },
  { id: 'budget', title: 'Orçamento', tone: 'brand' },
  { id: 'obra', title: 'Em obra', tone: 'warning' },
  { id: 'delivered', title: 'Entregando', tone: 'success' },
]

const cards: KanbanCard[] = items.map((it, i) => ({
  id: it.id,
  title: it.name,
  meta: `#${it.code} · ${it.client}`,
  badge: it.status,
  laneId: ['briefing', 'budget', 'obra', 'obra', 'delivered'][i] ?? 'briefing',
}))

const prompt: AIPrompt = {
  componente: 'Pattern · Project List Screen',
  import: '// Composição: Header + KPI strip + view switcher + filter sidebar + RichList/Kanban/DataTable',
  contexto:
    'Tela de listagem de projetos · view switcher Kanban/Lista/Tabela como tabs · KPI strip no topo · filter sidebar à esquerda com chips ativos · DataTable virtualizado para 100+ items. Estado da view, filtros, sort: tudo na URL via TanStack Router search params.',
  quandoUsar: [
    'Index de qualquer entidade de operação (Projetos, Clientes, Fornecedores)',
    'Sempre que houver 20+ items e múltiplos filtros',
  ],
  props: [],
  antiPatterns: [
    'View atual fora da URL · saved views quebram',
    'Filtros que não persistem na URL',
    'Sem KPI strip em tela operacional · perde leitura rápida',
  ],
  exemplo: `// Use search params do TanStack Router:
const search = useSearch({ from: '/projetos' })
const { view = 'kanban', squad = [], status = [] } = search

// View switcher controla search params:
<Tabs value={view} onValueChange={(v) => navigate({ search: (s) => ({ ...s, view: v }) })} />`,
  relacionados: ['DataTable', 'Kanban', 'RichList', 'FilterSidebar'],
}

export function ProjectListPattern() {
  const [view, setView] = useState<'kanban' | 'list' | 'table'>('list')
  const [chips, setChips] = useState<FilterChip[]>([
    { id: 'sq', label: 'Squad', value: 'Orion' },
    { id: 'st', label: 'Status', value: 'Em obra · No prazo' },
  ])

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P09.1"
        category="Pattern · List Screen"
        title="Project List"
        italic="index editorial"
        description="Tela de listagem com Kanban/List/Table, filter sidebar, chips ativos, KPI strip. Toda a state na URL."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Tela completa · Projetos · Squad Orion" />
      <Showcase padding="none">
        {/* Header da tela */}
        <div className="p-6" style={{ background: 'var(--surface-1)' }}>
          <TkwsHeader
            crumb="Operação · Projetos"
            title="43 projetos"
            italic="R$ 87,4M em portfólio"
            description="Gestão completa do portfólio · da captação à entrega"
            actions={
              <>
                <Button variant="outline" size="sm">
                  <Download size={12} /> Exportar
                </Button>
                <Button>
                  <Plus size={14} /> Novo projeto
                </Button>
              </>
            }
          />
        </div>

        {/* KPI strip */}
        <div
          className="grid grid-cols-4 gap-3 border-y p-6 max-[760px]:grid-cols-2"
          style={{ background: 'var(--bg)', borderColor: 'var(--line-1)' }}
        >
          <KpiMini label="No prazo" value="38" hint="de 43 projetos" tone="success" />
          <KpiMini label="Atrasados" value="5" hint="8 dias média" tone="danger" />
          <KpiMini label="Em revisão" value="12" hint="aguardando cliente" tone="warning" />
          <KpiMini label="Margem média" value="31%" hint="vs 30% planejado" tone="brand" />
        </div>

        {/* Toolbar */}
        <div
          className="flex items-center justify-between gap-3 border-b p-4 max-[760px]:flex-col max-[760px]:items-stretch"
          style={{ borderColor: 'var(--line-1)' }}
        >
          <div className="flex flex-1 items-center gap-3">
            <Input icon={<Search size={14} />} placeholder="Buscar projeto, cliente, código…" className="max-w-xs" />
            <Tabs value={view} onValueChange={(v) => setView(v as any)}>
              <TabsList variant="pill">
                <TabsTrigger value="kanban">
                  <LayoutGrid size={12} /> Kanban
                </TabsTrigger>
                <TabsTrigger value="list">
                  <ListIcon size={12} /> Lista
                </TabsTrigger>
                <TabsTrigger value="table">
                  <TableIcon size={12} /> Tabela
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="brand">{chips.length} filtros ativos</Badge>
            <Button variant="outline" size="sm">
              <SlidersHorizontal size={12} /> Mais filtros
            </Button>
          </div>
        </div>

        {/* Chips */}
        {chips.length > 0 && (
          <div className="border-b p-4" style={{ borderColor: 'var(--line-1)' }}>
            <ActiveFilterChips
              chips={chips}
              onRemove={(id) => setChips((c) => c.filter((x) => x.id !== id))}
              onClear={() => setChips([])}
            />
          </div>
        )}

        {/* Body 2-col */}
        <div className="grid grid-cols-[260px_1fr] gap-0 max-[900px]:grid-cols-1">
          <div className="border-r p-4 max-[900px]:border-b max-[900px]:border-r-0" style={{ borderColor: 'var(--line-1)' }}>
            <FilterSidebar>
              <FilterSection label="Squad">
                <ToggleGroup type="multiple" defaultValue={['orion']}>
                  <ToggleGroupItem value="orion">Orion</ToggleGroupItem>
                  <ToggleGroupItem value="apollo">Apollo</ToggleGroupItem>
                  <ToggleGroupItem value="neptune">Neptune</ToggleGroupItem>
                </ToggleGroup>
              </FilterSection>
              <FilterSection label="Status">
                <ToggleGroup type="multiple" defaultValue={['obra', 'prazo']}>
                  <ToggleGroupItem value="briefing">Briefing</ToggleGroupItem>
                  <ToggleGroupItem value="obra">Em obra</ToggleGroupItem>
                  <ToggleGroupItem value="prazo">No prazo</ToggleGroupItem>
                  <ToggleGroupItem value="entrega">Entregando</ToggleGroupItem>
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
            </FilterSidebar>
          </div>

          <div className="p-4">
            {view === 'list' && <RichList items={items} selectedId="2411" />}
            {view === 'kanban' && <Kanban lanes={lanes} cards={cards} />}
            {view === 'table' && (
              <div
                className="rounded-xl border p-6 text-center"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
              >
                <span className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  DataTable renderiza aqui · ver /components/data-table
                </span>
              </div>
            )}
          </div>
        </div>
      </Showcase>
    </div>
  )
}
