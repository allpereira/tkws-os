import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Bookmark,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  MapPin,
  MessageCircle,
  Paperclip,
  Phone,
  Plus,
  Send,
  Sparkles,
  Tag,
  Trophy,
  User as UserIcon,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { InlineEdit } from '@/components/ui/inline-edit'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { KpiMini } from '@/components/tkws/kpi'
import { ChannelBar } from '@/components/tkws/crm-channel-bar'
import { LeadScore } from '@/components/tkws/crm-lead-score'
import { StageStepper } from '@/components/tkws/crm-stage-stepper'
import { Timeline, type TimelineItem } from '@/components/tkws/timeline'
import { formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const stages = [
  { id: 'lead', label: 'Lead' },
  { id: 'qualified', label: 'Qualificado' },
  { id: 'proposal', label: 'Proposta' },
  { id: 'negotiation', label: 'Negociação' },
  { id: 'won', label: 'Fechado', tone: 'success' as const },
]

const activities: TimelineItem[] = [
  { id: '1', meta: 'AGORA · 09:42', title: 'Cliente respondeu via WhatsApp', description: '"Pode mandar a alternativa de granito até quarta?"', tone: 'success' },
  { id: '2', meta: 'HOJE · 08:14', title: 'Proposta 02 enviada', description: 'PDF com sumário executivo · R$ 12,5M', tone: 'brand' },
  { id: '3', meta: 'ONTEM · 16:20', title: 'Reunião · 1h 12min', description: 'Lucas Z. · alinhamento de escopo · próximos passos', tone: 'brand' },
  { id: '4', meta: '18 MAI', title: 'Visita técnica · 280 m² confirmados', description: 'Foto 360° anexada · cliente curtiu', tone: 'warning' },
  { id: '5', meta: '12 MAI', title: 'Briefing assinado', tone: 'success' },
  { id: '6', meta: '08 MAI', title: 'Lead criado via indicação', description: 'Família Costa indicou · primeiro contato por WhatsApp', tone: 'neutral' },
]

const checklist = [
  { id: 'c1', label: 'Briefing assinado', done: true },
  { id: 'c2', label: 'Visita técnica realizada', done: true },
  { id: 'c3', label: 'Moodboard aprovado', done: true },
  { id: 'c4', label: 'Proposta comercial enviada', done: true },
  { id: 'c5', label: 'Apresentação do orçamento final', done: false, urgent: true },
  { id: 'c6', label: 'Contrato assinado', done: false },
  { id: 'c7', label: 'Pagamento sinal', done: false },
]

const products = [
  { id: 'p1', name: 'Sofá modular Camboriú', sku: 'TKWS-CMB-203', qty: 1, unit: 24_500_00, total: 24_500_00 },
  { id: 'p2', name: 'Mesa de jantar Itajaí · 10 lugares', sku: 'TKWS-ITJ-101', qty: 1, unit: 18_900_00, total: 18_900_00 },
  { id: 'p3', name: 'Granito alternativo (sob cotação)', sku: 'TKWS-GRT-018', qty: 14, unit: 4_200_00, total: 58_800_00 },
  { id: 'p4', name: 'Iluminação cênica · sala principal', sku: 'TKWS-ILU-042', qty: 1, unit: 12_400_00, total: 12_400_00 },
]

const prompt: AIPrompt = {
  componente: 'Pattern · CRM Oportunidade · Detalhe',
  import: '// Composição: Hero focado em valor + StageStepper proeminente como CTA primária + Tabs (Atividade · Produtos · Checklist · Docs) + Right rail com cliente, owner e sugestão',
  contexto:
    'Tela de uma única oportunidade. Diferente do CRM Contact Detail (foco em pessoa), aqui o foco é o DEAL: valor, etapa, probabilidade e fechamento. StageStepper é a estrela · clique avança · botão "Avançar etapa" sempre visível. Checklist de etapa para zero-typing. Composer rápido para registrar atividade. Tudo orientado a "1 clique mata 1 ação".',
  quandoUsar: [
    'Clique numa linha da lista de Oportunidades · view focada',
    'Modal full-screen ao clicar num card no Kanban',
    'URL compartilhável de uma oportunidade específica',
    'Reunião 1:1 entre comercial e gestor · revisar uma oportunidade',
  ],
  props: [],
  antiPatterns: [
    'StageStepper pequeno · perde a ação principal da tela',
    'Sem botão "Avançar etapa" persistente · força usar o stepper',
    'Activity composer escondido em modal · contexto-switch desnecessário',
    'Header sem InlineEdit em campos-chave (valor, fecha em) · força sair da tela pra editar',
    'Sem checklist da etapa · operador esquece "o que falta pra fechar"',
  ],
  exemplo: `<OpportunityHero opp={opp}>
  <InlineEdit value={opp.value} display={formatCurrency} />
</OpportunityHero>
<StageStepper stages={stages} current={3} onChange={moveStage} />
<Tabs>
  <TabsContent value="activity"><Timeline /></TabsContent>
  <TabsContent value="products"><ProductTable /></TabsContent>
  <TabsContent value="checklist"><StageChecklist /></TabsContent>
</Tabs>
<RightRail client={client} owner={owner} suggestion={suggestion} />`,
  relacionados: ['CRMContactDetail', 'StageStepper', 'InlineEdit', 'Timeline'],
}

export function CRMOpportunityDetailPattern() {
  const [stage, setStage] = useState(3) // Negociação
  const [activeTab, setActiveTab] = useState('activity')
  const [composerType, setComposerType] = useState('whatsapp')
  const [draft, setDraft] = useState('')
  const [value, setValue] = useState('12500000') // em reais
  const [closeDate, setCloseDate] = useState('15 jun')
  const [probability, setProbability] = useState('78')

  const nextStage = stages[stage + 1]

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="CRM.P6"
        category="Pattern · Oportunidade · Detalhe"
        title="Detalhe da oportunidade"
        italic="deal focado · avançar etapa"
        description="Tela de uma única oportunidade. StageStepper proeminente como CTA primária, InlineEdit nos campos-chave, checklist da etapa para zero-digitação e composer rápido para atividades."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Detalhe · Yachthouse 2104 · Família Andrade" />
      <Showcase padding="none" bg="bg">
        <div className="overflow-hidden rounded-[10px]" style={{ background: 'var(--bg)' }}>
          {/* Breadcrumb · back link */}
          <div className="flex items-center justify-between border-b px-6 py-2.5" style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#"><ArrowLeft size={11} className="inline -mt-px" /> CRM</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Oportunidades</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Yachthouse 2104 · Decoração full</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <X size={12} /> Marcar como perdida
              </Button>
            </div>
          </div>

          {/* HERO · foco no deal */}
          <div
            className="border-b p-6"
            style={{
              borderColor: 'var(--line-1)',
              background: 'linear-gradient(135deg, var(--brand-soft) 0%, transparent 70%), var(--surface-1)',
            }}
          >
            <div className="flex items-start justify-between gap-6 max-[900px]:flex-col">
              {/* Left · título do deal */}
              <div className="min-w-0 flex-1">
                <div className="mono text-[10.5px] font-semibold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                  OPORTUNIDADE · #OP-2104 · CONTA: FAMÍLIA ANDRADE
                </div>
                <h1 className="serif mt-1 text-[34px] font-normal leading-[1.05]" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                  Yachthouse 2104
                  <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>
                    {' '}
                    · Decoração full
                  </em>
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 size={12} /> Yachthouse · 280 m²
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12} /> Balneário Camboriú · SC
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <UserIcon size={12} /> Lucas Zucchi
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <LeadScore temperature="hot" />
                  <Badge tone="brand">VIP</Badge>
                  <Badge tone="success">Indicação</Badge>
                  <Badge tone="purple">High-end</Badge>
                </div>
              </div>

              {/* Right · ações primárias */}
              <div className="flex shrink-0 flex-col items-end gap-3">
                <div className="flex items-center gap-2">
                  <ChannelBar
                    variant="cards"
                    channels={[
                      { kind: 'whatsapp', badge: 1, onClick: () => toast.success('WhatsApp aberto') },
                      { kind: 'phone', onClick: () => toast.success('Discando…') },
                      { kind: 'email', onClick: () => toast.success('Email aberto') },
                    ]}
                  />
                </div>
                {nextStage && (
                  <Button onClick={() => { setStage(stage + 1); toast.success(`Movido para ${nextStage.label}`) }}>
                    Avançar para {nextStage.label} <ArrowRight size={13} />
                  </Button>
                )}
                {!nextStage && (
                  <Button>
                    <Trophy size={14} /> Marcar como Fechado
                  </Button>
                )}
              </div>
            </div>

            {/* HERO · KPIs editáveis inline · centrais ao deal */}
            <div className="mt-6 grid grid-cols-4 gap-4 rounded-[12px] border p-4 max-[760px]:grid-cols-2"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}>
              <div>
                <div className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  Valor da oportunidade
                </div>
                <div className="serif mt-1 text-[26px] font-light leading-none" style={{ color: 'var(--text)' }}>
                  <InlineEdit
                    value={value}
                    onChange={(v) => { setValue(v); toast.success('Valor atualizado') }}
                    type="number"
                    width={140}
                    display={(v) => <>{formatCurrency(Number(v) / 100)}</>}
                  />
                </div>
                <div className="mono mt-1 text-[10px]" style={{ color: 'var(--text-mute)' }}>
                  Clique para editar
                </div>
              </div>
              <div>
                <div className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  Probabilidade
                </div>
                <div className="serif mt-1 text-[26px] font-light leading-none" style={{ color: 'var(--success)' }}>
                  <InlineEdit
                    value={probability}
                    onChange={setProbability}
                    type="number"
                    width={80}
                    display={(v) => <>{v}%</>}
                  />
                </div>
                <div className="mt-2">
                  <Progress value={Number(probability)} tone="success" />
                </div>
              </div>
              <div>
                <div className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  Previsão de fechamento
                </div>
                <div className="serif mt-1 text-[26px] font-light leading-none" style={{ color: 'var(--text)' }}>
                  <InlineEdit value={closeDate} onChange={setCloseDate} width={120} />
                </div>
                <div className="mono mt-1 inline-flex items-center gap-1 text-[10px]" style={{ color: 'var(--warning)' }}>
                  <Calendar size={10} /> em 26 dias
                </div>
              </div>
              <div>
                <div className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  Valor ponderado
                </div>
                <div className="serif mt-1 text-[26px] font-light leading-none" style={{ color: 'var(--brand)' }}>
                  {formatCurrency((Number(value) * Number(probability)) / 100 / 100)}
                </div>
                <div className="mono mt-1 text-[10px]" style={{ color: 'var(--text-mute)' }}>
                  valor × probabilidade
                </div>
              </div>
            </div>
          </div>

          {/* STAGE STEPPER · GRANDE · CTA principal da tela */}
          <div className="border-b px-6 py-5" style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="mono text-[10.5px] font-bold uppercase tracking-[1.5px]" style={{ color: 'var(--text-mute)' }}>
                Etapa do pipeline · clique para avançar
              </div>
              <div className="mono text-[10.5px] font-bold uppercase tracking-[1.5px]" style={{ color: 'var(--brand)' }}>
                {stages[stage].label}
              </div>
            </div>
            <StageStepper stages={stages} current={stage} onChange={(i) => { setStage(i); toast.success(`Etapa: ${stages[i].label}`) }} />
          </div>

          {/* CONTENT · 2 col layout */}
          <div className="grid grid-cols-[1fr_340px] gap-0 max-[900px]:grid-cols-1">
            <div className="p-6">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList variant="underline" className="!border-b-0 !-mt-2 !mb-4">
                  <TabsTrigger value="activity" underline>Atividade</TabsTrigger>
                  <TabsTrigger value="checklist" underline>Checklist · 5 de 7</TabsTrigger>
                  <TabsTrigger value="products" underline>Produtos · {products.length}</TabsTrigger>
                  <TabsTrigger value="docs" underline>Documentos · 8</TabsTrigger>
                </TabsList>

                {/* ATIVIDADE */}
                <TabsContent value="activity">
                  {/* Sugestão Lúmen · próximo passo */}
                  <Card accent="brand" className="mb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-[10px]" style={{ background: 'var(--brand)', color: 'var(--bg)' }}>
                          <Sparkles size={18} strokeWidth={1.7} />
                        </span>
                        <div>
                          <div className="mono text-[10px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--brand)' }}>
                            Sugestão Lúmen · Próximo passo
                          </div>
                          <div className="serif mt-1 text-[18px] font-normal" style={{ color: 'var(--text)' }}>
                            Mandar cotação alternativa de granito até quarta
                          </div>
                          <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                            Cliente perguntou agora via WhatsApp · Marmoraria Itajaí cotou 18% mais barato · proposta pronta para envio.
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button size="sm">Enviar agora</Button>
                      </div>
                    </div>
                  </Card>

                  {/* Composer · com tabs de tipo · 1 clique pra escolher canal */}
                  <Card className="mb-5">
                    <CardHeader>
                      <CardTitle>Registrar interação</CardTitle>
                      <Badge tone="neutral">Atalho: T</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {/* Type pills · seleção visual rápida */}
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'whatsapp', label: 'WhatsApp', tone: 'success' },
                            { id: 'call', label: 'Ligação', tone: 'brand' },
                            { id: 'email', label: 'Email', tone: 'purple' },
                            { id: 'meeting', label: 'Reunião', tone: 'warning' },
                            { id: 'note', label: 'Nota', tone: 'neutral' },
                            { id: 'visit', label: 'Visita técnica', tone: 'pink' },
                          ].map((t) => {
                            const active = composerType === t.id
                            return (
                              <button
                                key={t.id}
                                onClick={() => setComposerType(t.id)}
                                className="mono rounded-full border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[1.1px] transition-colors"
                                style={{
                                  background: active ? `var(--${t.tone === 'neutral' ? 'surface-3' : t.tone})` : 'var(--surface-2)',
                                  color: active ? (t.tone === 'neutral' ? 'var(--text)' : 'var(--bg)') : 'var(--text-soft)',
                                  borderColor: active ? `var(--${t.tone === 'neutral' ? 'line-3' : t.tone})` : 'var(--line-2)',
                                }}
                              >
                                {t.label}
                              </button>
                            )
                          })}
                        </div>
                        <Textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder="O que aconteceu? Detalhes, próximos passos, contexto…"
                          rows={3}
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            <Button variant="ghost" size="sm">
                              <Paperclip size={12} /> Anexar
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Bookmark size={12} /> Template
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Tag size={12} /> Tag
                            </Button>
                          </div>
                          <Button
                            disabled={!draft.trim()}
                            onClick={() => { toast.success('Atividade registrada'); setDraft('') }}
                          >
                            <Send size={12} /> Registrar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Histórico</CardTitle>
                      <Badge tone="brand">{activities.length} eventos</Badge>
                    </CardHeader>
                    <CardContent>
                      <Timeline items={activities} />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* CHECKLIST · zero-digitação */}
                <TabsContent value="checklist">
                  <Card>
                    <CardHeader>
                      <CardTitle>Checklist de fechamento</CardTitle>
                      <Badge tone="success">5 de 7 · 71%</Badge>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid gap-1.5">
                        {checklist.map((c) => (
                          <li
                            key={c.id}
                            className="group flex cursor-pointer items-center gap-3 rounded-[10px] border p-3 transition-colors hover:bg-white/[0.025]"
                            style={{
                              background: c.done ? 'rgba(95,217,165,0.06)' : 'var(--surface-2)',
                              borderColor: c.urgent && !c.done ? 'var(--warning)' : 'var(--line-1)',
                            }}
                          >
                            <button
                              className="flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all"
                              style={{
                                background: c.done ? 'var(--success)' : 'transparent',
                                borderColor: c.done ? 'var(--success)' : c.urgent ? 'var(--warning)' : 'var(--line-3)',
                              }}
                            >
                              {c.done && <CheckCircle2 size={14} strokeWidth={3} style={{ color: 'var(--bg)' }} />}
                            </button>
                            <span
                              className="flex-1 text-[13.5px]"
                              style={{
                                color: c.done ? 'var(--text-mute)' : 'var(--text)',
                                textDecoration: c.done ? 'line-through' : 'none',
                              }}
                            >
                              {c.label}
                            </span>
                            {c.urgent && !c.done && <Badge tone="warning">Próximo passo</Badge>}
                            {c.done && (
                              <span className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                                feito
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                      <Button variant="ghost" size="sm" className="mt-3">
                        <Plus size={12} /> Adicionar item ao checklist
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* PRODUTOS · tabela leve */}
                <TabsContent value="products">
                  <Card>
                    <CardHeader>
                      <CardTitle>Produtos · escopo do deal</CardTitle>
                      <Button variant="outline" size="sm">
                        <Plus size={12} /> Adicionar produto
                      </Button>
                    </CardHeader>
                    <CardContent className="!p-0">
                      <table className="w-full text-[13px]">
                        <thead>
                          <tr className="border-b" style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}>
                            <th className="mono px-4 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>Produto</th>
                            <th className="mono px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>SKU</th>
                            <th className="mono px-3 py-2.5 text-right text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>Qtd</th>
                            <th className="mono px-3 py-2.5 text-right text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>Unit.</th>
                            <th className="mono px-4 py-2.5 text-right text-[9.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p) => (
                            <tr key={p.id} className="border-b" style={{ borderColor: 'var(--line-1)' }}>
                              <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text)' }}>{p.name}</td>
                              <td className="mono px-3 py-3 text-[11.5px]" style={{ color: 'var(--text-mute)' }}>{p.sku}</td>
                              <td className="num-tabular px-3 py-3 text-right">{p.qty}</td>
                              <td className="num-tabular px-3 py-3 text-right">{formatCurrency(p.unit / 100)}</td>
                              <td className="num-tabular px-4 py-3 text-right font-semibold" style={{ color: 'var(--text)' }}>{formatCurrency(p.total / 100)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: 'var(--surface-2)' }}>
                            <td colSpan={4} className="mono px-4 py-3 text-right text-[10.5px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                              Total do escopo
                            </td>
                            <td className="num-tabular serif px-4 py-3 text-right text-[18px] font-normal" style={{ color: 'var(--text)' }}>
                              {formatCurrency(products.reduce((acc, p) => acc + p.total, 0) / 100)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* DOCS */}
                <TabsContent value="docs">
                  <Card>
                    <CardHeader>
                      <CardTitle>Documentos</CardTitle>
                      <Button variant="outline" size="sm">
                        <Plus size={12} /> Upload
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid gap-1.5">
                        {[
                          { name: 'Proposta-comercial-v2.pdf', meta: 'enviada hoje · 08:14' },
                          { name: 'Briefing-yachthouse-2104.pdf', meta: '12 mai · 15:30' },
                          { name: 'Moodboard-aprovado.pdf', meta: '18 mai · 16:20' },
                          { name: 'Plantas-280m2.dwg', meta: '08 mai · 09:00' },
                        ].map((d) => (
                          <li key={d.name} className="flex items-center justify-between gap-3 rounded-[10px] border p-3"
                            style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}>
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-md" style={{ background: 'var(--surface-3)', color: 'var(--brand)' }}>
                                <FileText size={15} />
                              </span>
                              <div>
                                <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{d.name}</div>
                                <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>{d.meta}</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">Abrir</Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* RIGHT RAIL */}
            <aside className="space-y-4 border-l p-6 max-[900px]:border-l-0 max-[900px]:border-t" style={{ borderColor: 'var(--line-1)' }}>
              {/* Cliente */}
              <Card>
                <CardHeader>
                  <CardTitle>Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar size="lg" square style={{ background: 'var(--purple)', borderRadius: 14 }}>
                      <AvatarFallback>FA</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="serif text-[18px] font-normal leading-tight" style={{ color: 'var(--text)' }}>
                        Família <em className="italic" style={{ color: 'var(--text-soft)' }}>Andrade</em>
                      </div>
                      <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                        Cliente desde 2019 · 3 projetos
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-1.5 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="mono text-[10px] font-bold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>LTV</span>
                      <span className="num-tabular font-semibold" style={{ color: 'var(--text)' }}>{formatCurrency(241_000_00)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="mono text-[10px] font-bold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>NPS</span>
                      <span className="font-semibold" style={{ color: 'var(--success)' }}>9,2</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Abrir perfil
                  </Button>
                </CardContent>
              </Card>

              {/* Owner */}
              <Card>
                <CardHeader>
                  <CardTitle>Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar size="md" style={{ background: 'var(--brand)' }}>
                      <AvatarFallback>LZ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>Lucas Zucchi</div>
                      <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>Líder · Squad Orion</div>
                    </div>
                  </div>
                  <Select defaultValue="lz">
                    <SelectTrigger className="mt-3 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lz">Lucas Zucchi (atual)</SelectItem>
                      <SelectItem value="av">Transferir → Ana Vieira</SelectItem>
                      <SelectItem value="jq">Transferir → João Quintela</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Detalhes */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-2 text-[12px]">
                    {[
                      ['Origem', 'Indicação'],
                      ['Indicado por', 'Família Costa'],
                      ['Criado em', '08 mai 2026'],
                      ['Idade do deal', '17 dias'],
                      ['Reuniões', '4'],
                      ['Próx. contato', 'Quarta · 09h'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-2">
                        <dt className="mono text-[9.5px] font-bold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>{k}</dt>
                        <dd className="text-right font-semibold" style={{ color: 'var(--text)' }}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>

              {/* Próxima ação · CTA persistente */}
              <Card accent="brand">
                <CardHeader>
                  <CardTitle>Próxima ação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="serif text-[15px] font-normal leading-tight" style={{ color: 'var(--text)' }}>
                    Apresentação do orçamento final
                  </div>
                  <div className="mono mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[1.3px]" style={{ color: 'var(--warning)' }}>
                    <Calendar size={10} /> Amanhã · 14h
                  </div>
                  <Button size="sm" className="mt-3 w-full">
                    Marcar como feito
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
