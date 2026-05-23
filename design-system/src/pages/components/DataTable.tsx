import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

type Row = {
  code: string
  name: string
  client: string
  area: number
  contract: number
  margin: number
  status: 'no-prazo' | 'atrasado' | 'em-revisao' | 'pausado'
}

const data: Row[] = [
  { code: '2410', name: 'Yachthouse 2104', client: 'Família Andrade', area: 280, contract: 12_500_000, margin: 0.31, status: 'atrasado' },
  { code: '2411', name: 'Cobertura Titanium', client: 'WS Group', area: 920, contract: 9_500_000, margin: 0.36, status: 'no-prazo' },
  { code: '2412', name: 'Vitra 1801', client: 'Família Costa', area: 145, contract: 4_200_000, margin: 0.28, status: 'em-revisao' },
  { code: '2413', name: 'Sky Resort', client: 'Família Oz', area: 1200, contract: 18_900_000, margin: 0.42, status: 'no-prazo' },
  { code: '2414', name: 'Campo Belo SP', client: 'Campo Belo Inv.', area: 380, contract: 6_700_000, margin: 0.24, status: 'pausado' },
]

const toneMap: Record<Row['status'], { label: string; tone: 'success' | 'warning' | 'brand' | 'danger' | 'neutral' }> = {
  'no-prazo': { label: 'No prazo', tone: 'success' },
  'atrasado': { label: 'Atrasado', tone: 'danger' },
  'em-revisao': { label: 'Em revisão', tone: 'brand' },
  'pausado': { label: 'Pausado', tone: 'neutral' },
}

const prompt: AIPrompt = {
  componente: 'DataTable',
  import: "import { useReactTable, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'",
  contexto:
    '@tanstack/table headless · toda a lógica de sort/filter/group/pagination é controlada por hooks. Renderize com primitives Table do design system. Para 400+ linhas, combine com @tanstack/virtual.',
  quandoUsar: [
    'Listas com sort por coluna · filter · paginação',
    'Operação de power-user · densidade necessária',
    'Tabela combinada com toolbar (busca + filtros + bulk)',
  ],
  props: [
    { name: 'columns', type: 'ColumnDef<T>[]', description: 'Definição declarativa das colunas' },
    { name: 'data', type: 'T[]', description: 'Dados · vindos de TanStack Query' },
    { name: 'sorting / onSortingChange', type: 'state', description: 'Sort controlado · search params da URL' },
  ],
  antiPatterns: [
    'DataTable para 5 linhas · use Table simples',
    'Sort/filter feito fora do TanStack Table (perde performance)',
    'Não persistir sort/filter na URL (saved views quebram)',
  ],
  exemplo: `const columns: ColumnDef<Project>[] = [
  { accessorKey: 'code', header: 'Código' },
  { accessorKey: 'name', header: 'Projeto' },
  { accessorKey: 'contract', header: 'Contrato', cell: ({ getValue }) => formatCurrency(getValue<number>()) }
]

const table = useReactTable({
  data, columns,
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})`,
  relacionados: ['Table', 'BulkActionBar', 'FilterSidebar'],
}

export function DataTablePage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    if (!filter) return data
    const q = filter.toLowerCase()
    return data.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q) ||
        r.code.includes(q)
    )
  }, [filter])

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      { accessorKey: 'code', header: 'Código', cell: (c) => <span className="mono font-bold">#{c.getValue<string>()}</span> },
      { accessorKey: 'name', header: 'Projeto', cell: (c) => <span style={{ color: 'var(--text)' }}>{c.getValue<string>()}</span> },
      { accessorKey: 'client', header: 'Cliente' },
      { accessorKey: 'area', header: 'Área', cell: (c) => <span className="mono">{c.getValue<number>()} m²</span> },
      {
        accessorKey: 'contract',
        header: 'Contrato',
        cell: (c) => <span className="num-tabular font-semibold" style={{ color: 'var(--text)' }}>{formatCurrency(c.getValue<number>())}</span>,
      },
      {
        accessorKey: 'margin',
        header: 'Margem',
        cell: (c) => {
          const v = c.getValue<number>()
          const color = v >= 0.3 ? 'var(--success)' : v >= 0.2 ? 'var(--warning)' : 'var(--danger)'
          return <span className="mono" style={{ color }}>{Math.round(v * 100)}%</span>
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (c) => {
          const s = toneMap[c.getValue<Row['status']>()]
          return <Badge tone={s.tone}>{s.label}</Badge>
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.3"
        category="Data Display · DataTable"
        title="DataTable"
        italic="@tanstack/table · headless"
        description="Sort, filter, group, paginação · tudo via hooks. Compose com Table primitives do design system. Virtualize para 400+ linhas."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Sort + filter" />
      <Showcase padding="none">
        <div className="flex items-center justify-between gap-3 border-b p-3" style={{ borderColor: 'var(--line-1)' }}>
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Buscar projeto, cliente, código…"
            className="max-w-xs"
          />
          <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
            {table.getRowModel().rows.length} de {data.length}
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    <button
                      className="flex cursor-pointer items-center gap-1 transition-colors hover:text-[var(--text)]"
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === 'asc' ? (
                        <ArrowUp size={10} />
                      ) : h.column.getIsSorted() === 'desc' ? (
                        <ArrowDown size={10} />
                      ) : (
                        <ChevronsUpDown size={10} style={{ color: 'var(--text-mute)' }} />
                      )}
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Showcase>
    </div>
  )
}
