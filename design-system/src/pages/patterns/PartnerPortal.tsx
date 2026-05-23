import { CheckCircle2, FileText, MessageSquare, Package } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { KpiMini } from '@/components/tkws/kpi'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const cotacoes = [
  { id: '1', projeto: 'Yachthouse 2104', item: 'Granito São Gabriel · 18 m²', valor: 124_500, prazo: '12 dias', status: { label: 'Aguardando resposta', tone: 'warning' as const } },
  { id: '2', projeto: 'Cobertura Titanium', item: 'Quartzito Imperial · 8 m²', valor: 86_200, prazo: '8 dias', status: { label: 'Cliente aceitou', tone: 'success' as const } },
  { id: '3', projeto: 'Vitra 1801', item: 'Mármore Carrara · 6 m²', valor: 56_700, prazo: '14 dias', status: { label: 'Pendente cotação', tone: 'danger' as const } },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Portal dos Parceiros',
  import: '// Composição: Standard density · Tables + KPI strip · Linguagem operacional',
  contexto:
    'Portal externo para FORNECEDORES e PARCEIROS. Densidade STANDARD · não Guided (cliente) e não Power (squad). Lista de cotações pendentes, prazos, status de pagamento. Foco em ação: aceitar/recusar cotação, enviar nota fiscal.',
  quandoUsar: [
    'Portal de fornecedor (Marmoraria, Marcenaria, Iluminação)',
    'Portal de despachante / parceiro logístico',
    'Touchpoint diário ou semanal · operacional',
  ],
  props: [],
  antiPatterns: [
    'Densidade Power-user em portal · parceiro fica perdido',
    'Densidade Guided em portal de fornecedor com 100+ cotações',
    'Sem KPI strip operacional · perde leitura rápida',
  ],
  exemplo: `// Portal de fornecedor
// 1) Topbar com brand WS Group
// 2) KPI strip (pendentes · este mês · pagamento)
// 3) Table com ações inline (Aceitar · Recusar · Ver detalhes)
// 4) Sheet para detalhes de cada cotação`,
  relacionados: ['DataTable', 'Sheet', 'Table'],
}

export function PartnerPortalPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P-PARTNER"
        category="Pattern · Portal dos Parceiros"
        title="Portal dos Parceiros"
        italic="standard density · operacional"
        description="Para fornecedores e despachantes. Densidade standard, ações rápidas em cada cotação."
        tag="portal externo"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Home do fornecedor · Marmoraria São Gabriel" />
      <Showcase padding="none">
        {/* Topbar */}
        <div
          className="flex items-center justify-between border-b px-8 py-4"
          style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
        >
          <div className="flex items-center gap-3">
            <div className="serif text-[18px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
              TKWS <em className="italic" style={{ color: 'var(--brand)' }}>OS</em>
            </div>
            <Badge tone="purple">Portal · Parceiros</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Avatar size="sm" style={{ background: 'var(--warning)', color: 'var(--bg)' }}>
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <div className="text-[12.5px] font-semibold" style={{ color: 'var(--text)' }}>
                Marmoraria São Gabriel
              </div>
              <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                Parceiro Premium
              </div>
            </div>
          </div>
        </div>

        {/* Header da página */}
        <div className="border-b p-8 max-[760px]:p-5" style={{ borderColor: 'var(--line-1)' }}>
          <h1 className="serif text-[clamp(28px,4vw,40px)] font-light tracking-tight" style={{ color: 'var(--text)' }}>
            Bom dia,{' '}
            <em className="italic" style={{ color: 'var(--brand)' }}>
              3 cotações esperam você
            </em>
          </h1>
          <p className="mt-2 text-[14px]" style={{ color: 'var(--text-soft)' }}>
            Veja prazo, valor e responda direto pelo painel.
          </p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-3 border-b p-6 max-[760px]:grid-cols-2" style={{ borderColor: 'var(--line-1)' }}>
          <KpiMini label="Aguardando resposta" value="3" hint="prazo médio 4 dias" tone="warning" />
          <KpiMini label="Aprovadas este mês" value="12" hint="R$ 1,2M total" tone="success" />
          <KpiMini label="Pagamento pendente" value="R$ 320k" hint="2 NFs em aberto" tone="brand" />
          <KpiMini label="Avaliação" value="4,8" hint="78 avaliações" tone="success" />
        </div>

        {/* Cotações ativas */}
        <div className="p-6 max-[760px]:p-3">
          <Card>
            <CardHeader>
              <CardTitle>Cotações ativas</CardTitle>
              <Button variant="outline" size="sm">Histórico completo</Button>
            </CardHeader>
            <CardContent className="!p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cotacoes.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell style={{ color: 'var(--text)' }}>{c.projeto}</TableCell>
                      <TableCell>{c.item}</TableCell>
                      <TableCell className="text-right font-bold" style={{ color: 'var(--text)' }}>
                        {formatCurrency(c.valor)}
                      </TableCell>
                      <TableCell className="mono">{c.prazo}</TableCell>
                      <TableCell><Badge tone={c.status.tone}>{c.status.label}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button variant="outline" size="sm">
                            <MessageSquare size={11} />
                          </Button>
                          <Button size="sm">
                            <CheckCircle2 size={11} /> Aceitar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Atalhos */}
          <div className="mt-5 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
            {[
              { lbl: 'Catálogo', desc: 'Atualize seus produtos disponíveis', icon: <Package size={18} /> },
              { lbl: 'Notas fiscais', desc: '2 NFs pendentes para emitir', icon: <FileText size={18} /> },
              { lbl: 'Conversas', desc: '4 mensagens não lidas', icon: <MessageSquare size={18} /> },
            ].map((s) => (
              <Card key={s.lbl} variant="hover">
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
                  >
                    {s.icon}
                  </span>
                  <div>
                    <CardTitle className="!text-[16px]">{s.lbl}</CardTitle>
                    <div className="mt-0.5 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Showcase>
    </div>
  )
}
