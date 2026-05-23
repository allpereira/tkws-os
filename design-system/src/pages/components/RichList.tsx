import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { RichList, type RichListItem } from '@/components/tkws/rich-list'
import type { AIPrompt } from '@/lib/prompts'

const items: RichListItem[] = [
  { id: '2410', code: '2410', name: 'Yachthouse 2104', client: 'F. Andrade', area: '280 m²', squad: { label: 'Orion', tone: 'purple' }, contractValue: 12_500_000, margin: 0.31, progress: 65, status: { label: 'Atrasado', tone: 'danger' } },
  { id: '2411', code: '2411', name: 'Cobertura Titanium', client: 'WS Group', area: '920 m²', squad: { label: 'Orion', tone: 'purple' }, contractValue: 9_500_000, margin: 0.36, progress: 82, status: { label: 'No prazo', tone: 'success' } },
  { id: '2412', code: '2412', name: 'Vitra 1801', client: 'F. Costa', area: '145 m²', squad: { label: 'Apollo', tone: 'pink' }, contractValue: 4_200_000, margin: 0.28, progress: 45, status: { label: 'Em revisão', tone: 'brand' } },
  { id: '2413', code: '2413', name: 'Sky Resort', client: 'F. Oz', area: '1200 m²', squad: { label: 'Orion', tone: 'purple' }, contractValue: 18_900_000, margin: 0.42, progress: 92, status: { label: 'No prazo', tone: 'success' } },
]

const prompt: AIPrompt = {
  componente: 'RichList',
  import: "import { RichList } from '@/components/tkws/rich-list'",
  contexto:
    'Lista densa com thumb + meta + progress · padrão TKWS para listas de projetos/clientes onde Table seria desumana. Cada linha = item clicável que abre Detail ou Sheet de edição. Mobile esconde colunas extras automaticamente.',
  quandoUsar: [
    'Lista de projetos / obras com progresso',
    'Vista "List" do view switcher (alternativa a Kanban/Table)',
    'Quando densidade + thumb + status são essenciais juntos',
  ],
  props: [
    { name: 'items', type: 'RichListItem[]', description: 'Tipo padrão com code/name/client/squad/value/margin/progress/status' },
    { name: 'onSelect', type: '(it) => void', description: 'Callback clique' },
    { name: 'selectedId', type: 'string', description: 'Item ativo · destaque brand-soft' },
  ],
  antiPatterns: [
    'RichList para < 5 itens · use Cards',
    'Editar inline no item · vire Sheet ou Drawer',
  ],
  exemplo: `<RichList
  items={projects}
  selectedId={current?.id}
  onSelect={(it) => navigate({ to: '/projetos/$id', params: { id: it.id } })}
/>`,
  relacionados: ['DataTable', 'Card', 'Kanban'],
}

export function RichListPage() {
  const [selected, setSelected] = useState<string | undefined>('2411')
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="11.4"
        category="Data Display · Rich List"
        title="Rich List"
        italic="thumb + meta + progresso"
        description="Padrão TKWS para listas operacionais. Mobile esconde colunas extras automaticamente."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Lista de projetos" />
      <Showcase padding="none">
        <RichList items={items} selectedId={selected} onSelect={(it) => setSelected(it.id)} />
      </Showcase>
    </div>
  )
}
