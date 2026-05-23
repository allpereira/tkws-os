import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const rows = [
  { code: '2410', name: 'Yachthouse 2104', client: 'Família Andrade', value: 12_500_000, status: { label: 'Atrasado', tone: 'danger' as const } },
  { code: '2411', name: 'Cobertura Titanium', client: 'WS Group', value: 9_500_000, status: { label: 'No prazo', tone: 'success' as const } },
  { code: '2412', name: 'Vitra 1801', client: 'Família Costa', value: 4_200_000, status: { label: 'Em revisão', tone: 'brand' as const } },
  { code: '2413', name: 'Sky Resort', client: 'Família Oz', value: 18_900_000, status: { label: 'Atenção', tone: 'warning' as const } },
]

const prompt: AIPrompt = {
  componente: 'Table',
  import: "import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table'",
  contexto:
    'Tabela HTML simples com cores TKWS · sem sort/filter built-in (para isso, use DataTable + @tanstack/table). Use sempre num-tabular para colunas numéricas (alinha decimal).',
  quandoUsar: [
    'Listas pequenas (≤ 50 linhas) onde a leitura tabular ajuda',
    'Tabelas estáticas (relatórios, exports)',
    'Tabela dentro de Detail screen (Documents, Linhas de orçamento)',
  ],
  props: [],
  antiPatterns: [
    'Table com 400+ linhas · use DataTable + virtual',
    'Table sem TableHead · perde semântica',
    'Coluna numérica sem num-tabular · decimais ficam desalinhados',
  ],
  exemplo: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Código</TableHead>
      <TableHead>Projeto</TableHead>
      <TableHead className="text-right">Valor</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {projects.map(p => (
      <TableRow key={p.id}>
        <TableCell className="mono">{p.code}</TableCell>
        <TableCell>{p.name}</TableCell>
        <TableCell className="text-right">{formatCurrency(p.value)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
  relacionados: ['DataTable', 'RichList'],
}

export function TablePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.2"
        category="Data Display · Table"
        title="Table"
        italic="HTML simples"
        description="Tabela básica. Para sort/filter/paginação, use DataTable. Para muitas linhas, virtualize."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Padrão" />
      <Showcase padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Contrato</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.code}>
                <TableCell className="mono font-bold">#{r.code}</TableCell>
                <TableCell style={{ color: 'var(--text)' }}>{r.name}</TableCell>
                <TableCell>{r.client}</TableCell>
                <TableCell className="text-right font-semibold" style={{ color: 'var(--text)' }}>
                  {formatCurrency(r.value)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge tone={r.status.tone}>{r.status.label}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Showcase>
    </div>
  )
}
