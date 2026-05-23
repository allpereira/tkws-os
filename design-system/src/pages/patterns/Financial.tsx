import { Download, FileText } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { KpiMini } from '@/components/tkws/kpi'
import { VerticalBar } from '@/components/tkws/charts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const pnl = [
  { lbl: 'Receita bruta', val: 12_500_000, pct: 100, tone: 'success' as const },
  { lbl: 'Impostos', val: -1_690_000, pct: -13.5, tone: 'danger' as const },
  { lbl: 'Custos diretos', val: -7_240_000, pct: -57.9, tone: 'warning' as const },
  { lbl: 'Margem bruta', val: 3_570_000, pct: 28.6, tone: 'success' as const, bold: true },
  { lbl: 'Operacional', val: -1_120_000, pct: -8.9, tone: 'warning' as const },
  { lbl: 'EBITDA', val: 2_450_000, pct: 19.6, tone: 'brand' as const, bold: true },
]

const aging = [
  { range: '0-30 dias', amount: 1_240_000, count: 8 },
  { range: '31-60 dias', amount: 420_000, count: 3 },
  { range: '61-90 dias', amount: 180_000, count: 2 },
  { range: '+90 dias', amount: 95_000, count: 1 },
]

const installments = [
  { id: '1', label: 'Entrada · 20%', value: 2_500_000, date: '14/03/2026', status: { label: 'Pago', tone: 'success' as const } },
  { id: '2', label: '1ª parcela', value: 1_250_000, date: '14/04/2026', status: { label: 'Pago', tone: 'success' as const } },
  { id: '3', label: '2ª parcela', value: 1_250_000, date: '14/05/2026', status: { label: 'Pago', tone: 'success' as const } },
  { id: '4', label: '3ª parcela', value: 1_250_000, date: '14/06/2026', status: { label: 'A vencer (24d)', tone: 'brand' as const } },
  { id: '5', label: '4ª parcela', value: 1_250_000, date: '14/07/2026', status: { label: 'A vencer', tone: 'neutral' as const } },
  { id: '6', label: 'Sinal entrega', value: 5_000_000, date: '15/12/2026', status: { label: 'A vencer', tone: 'neutral' as const } },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Financial Screen',
  import: '// Composição: KPI strip + PNL waterfall + Aging + Pay timeline + Invoice',
  contexto:
    'Tela financeira do projeto · agrupada por blocos: P&L, Aging (vencidos), cronograma de pagamento, faturas. Sempre formate com Intl · NUNCA hardcode "R$". Use cor semântica em variações vs orçado.',
  quandoUsar: [
    'Aba "Financeiro" do detalhe de projeto',
    'Cockpit financeiro do escritório',
    'Visão consolidada de aging para o controller',
  ],
  props: [],
  antiPatterns: [
    'Tabelas sem num-tabular · decimais desalinham',
    'Sem total destacado no PNL',
    'Aging sem ações por linha (cobrar, ligar)',
  ],
  exemplo: `// PNL waterfall · cada linha tem label, valor, % e tone
// EBITDA destacado · bold + brand
// Aging em cards horizontais · cada um clicável para detalhe`,
  relacionados: ['Table', 'KPI', 'Progress'],
}

export function FinancialPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P29"
        category="Pattern · Financeiro"
        title="Financial Screen"
        italic="P&L · aging · cronograma"
        description="Tela financeira do projeto. P&L, aging, cronograma de pagamento, faturas. Intl.NumberFormat sempre."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Yachthouse 2104 · financeiro completo" />
      <Showcase padding="comfortable">
        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-3 max-[760px]:grid-cols-2">
          <KpiMini label="Receita total" value="R$ 12,5M" hint="contrato firmado" tone="brand" />
          <KpiMini label="Margem real" value="28,6%" hint="vs 32% planejado" tone="warning" />
          <KpiMini label="Recebido" value="R$ 5,0M" hint="40% do contrato" tone="success" />
          <KpiMini label="Vencido" value="R$ 95k" hint="+90 dias" tone="danger" />
        </div>

        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* PNL · 7 col */}
          <div className="col-span-7 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>P&L · até EBITDA</CardTitle>
                <Badge tone="brand">Mês corrente</Badge>
              </CardHeader>
              <CardContent className="!p-0">
                <Table>
                  <TableBody>
                    {pnl.map((r) => (
                      <TableRow key={r.lbl}>
                        <TableCell
                          className={r.bold ? 'font-bold' : ''}
                          style={{ color: r.bold ? 'var(--text)' : 'var(--text-soft)' }}
                        >
                          {r.lbl}
                        </TableCell>
                        <TableCell
                          className={`num-tabular text-right ${r.bold ? 'font-bold text-[15px]' : ''}`}
                          style={{
                            color: r.tone === 'danger' ? 'var(--danger)' : r.bold ? 'var(--brand)' : 'var(--text)',
                          }}
                        >
                          {formatCurrency(r.val)}
                        </TableCell>
                        <TableCell
                          className="num-tabular mono w-20 text-right text-[11px]"
                          style={{ color: 'var(--text-mute)' }}
                        >
                          {r.pct}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Aging · 5 col */}
          <div className="col-span-5 max-[900px]:col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Aging de recebíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {aging.map((a, i) => (
                    <div
                      key={i}
                      className="rounded-lg border p-3"
                      style={{
                        background: 'var(--surface-2)',
                        borderColor: i === 3 ? 'var(--danger)' : 'var(--line-1)',
                      }}
                    >
                      <div
                        className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]"
                        style={{ color: i === 3 ? 'var(--danger)' : 'var(--text-mute)' }}
                      >
                        {a.range}
                      </div>
                      <div className="serif mt-1.5 text-[20px] font-light leading-none" style={{ color: 'var(--text)' }}>
                        {formatCurrency(a.amount)}
                      </div>
                      <div className="mono mt-1 text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                        {a.count} fatura{a.count > 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Cobrar todas vencidas
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Pay timeline · 12 col */}
          <div className="col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Cronograma de pagamento</CardTitle>
                <Button variant="outline" size="sm">
                  <Download size={12} /> Exportar
                </Button>
              </CardHeader>
              <CardContent className="!p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell style={{ color: 'var(--text)' }}>{p.label}</TableCell>
                        <TableCell className="mono">{p.date}</TableCell>
                        <TableCell className="text-right num-tabular font-bold" style={{ color: 'var(--text)' }}>
                          {formatCurrency(p.value)}
                        </TableCell>
                        <TableCell><Badge tone={p.status.tone}>{p.status.label}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <FileText size={11} /> NF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Bar chart · entradas vs saídas · 12 col */}
          <div className="col-span-12">
            <Card>
              <CardHeader>
                <CardTitle>Fluxo de caixa do projeto (R$ M)</CardTitle>
              </CardHeader>
              <CardContent>
                <VerticalBar
                  data={[
                    { label: 'Mar', value: 2.5 },
                    { label: 'Abr', value: 1.25 },
                    { label: 'Mai', value: 1.25 },
                    { label: 'Jun', value: 1.25 },
                    { label: 'Jul', value: 1.25 },
                    { label: 'Dez', value: 5.0 },
                  ]}
                  tone="success"
                  height={200}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progresso financeiro */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-[12.5px]">
            <span style={{ color: 'var(--text-soft)' }}>Progresso financeiro</span>
            <span className="mono font-bold" style={{ color: 'var(--text)' }}>
              40% recebido · R$ 5,0M / R$ 12,5M
            </span>
          </div>
          <Progress value={40} tone="brand" />
        </div>
      </Showcase>
    </div>
  )
}
