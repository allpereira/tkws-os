import { useState } from 'react'
import { AtSign, Bookmark, Building2, ChevronRight, FileText, MapPin, Paperclip, Send, Sparkles, Tag, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { KpiMini } from '@/components/tkws/kpi'
import { ChannelBar } from '@/components/tkws/crm-channel-bar'
import { LeadScore } from '@/components/tkws/crm-lead-score'
import { StageStepper } from '@/components/tkws/crm-stage-stepper'
import { DealCard, type Deal } from '@/components/tkws/crm-deal-card'
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
  { id: '2', meta: 'HOJE · 08:14', title: 'Apresentação enviada por email', description: 'Proposta 02 · R$ 12,5M · sumário em PDF', tone: 'brand' },
  { id: '3', meta: '18 MAI · 16:20', title: 'Reunião realizada · 1h 12min', description: 'Lucas Z. · alinhamento de escopo · próximos passos definidos', tone: 'brand' },
  { id: '4', meta: '12 MAI · 11:14', title: 'Visita técnica · 280 m² confirmados', description: 'Foto 360° no portal · cliente curtiu', tone: 'warning' },
  { id: '5', meta: '08 MAI · 09:00', title: 'Lead criado via indicação', description: 'Família Costa indicou · primeiro contato por WhatsApp', tone: 'neutral' },
]

const deals: Deal[] = [
  { id: '1', account: 'FAMÍLIA ANDRADE', title: 'Yachthouse 2104 · Decoração full', value: 1_250_000_000, probability: 78, expectedClose: '15 jun', owner: { initials: 'LZ', name: 'Lucas Z.' }, temperature: 'hot', tag: { label: 'VIP', tone: 'brand' } },
  { id: '2', account: 'FAMÍLIA ANDRADE', title: 'Apto temporada · 95 m²', value: 380_000_000, probability: 35, expectedClose: '15 set', owner: { initials: 'LZ', name: 'Lucas Z.' }, temperature: 'warm' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · CRM Contact Detail',
  import: '// Composição: Hero + StageStepper + ChannelBar + Tabs (Atividade / Deals / Notas / Docs) + Composer',
  contexto:
    'Tela de detalhe do contato no CRM. Hero com avatar grande + nome editorial + LeadScore. StageStepper no topo · ChannelBar para ações rápidas. Tabs com Atividade (Timeline) · Deals (cards) · Notas · Docs. Composer inline ao final para registrar nova interação.',
  quandoUsar: [
    'Detail screen de qualquer contato/cliente no CRM',
    'Sheet expandido a partir da lista de leads',
    'Modal full-screen ao clicar em deal card',
  ],
  props: [],
  antiPatterns: [
    'Header sem ChannelBar · perde o atalho de ação rápida',
    'Activity sem categoria/tone · perde leitura',
    'Composer sem template · força digitação repetitiva',
  ],
  exemplo: `// Layout principal:
<Hero contact={contact} />
<StageStepper stages={stages} current={2} onChange={moveStage} />
<ChannelBar channels={contact.channels} variant="cards" />
<Tabs>
  <TabsContent value="activity"><Timeline /></TabsContent>
  <TabsContent value="deals"><DealCard /></TabsContent>
</Tabs>
<Composer onSend={logActivity} />`,
  relacionados: ['ContactCard', 'StageStepper', 'ChannelBar', 'Timeline'],
}

export function CRMContactDetailPattern() {
  const [stage, setStage] = useState(3)
  const [activeTab, setActiveTab] = useState('activity')
  const [composerType, setComposerType] = useState('note')
  const [draft, setDraft] = useState('')

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="CRM.P3"
        category="Pattern · CRM Contact Detail"
        title="Contact Detail"
        italic="cliente · deals · atividade"
        description="Tela de detalhe do contato. Hero + StageStepper + ChannelBar + Tabs (Atividade · Deals · Notas · Docs) + Composer inline."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Contact Detail · Família Andrade" />
      <Showcase padding="none" bg="bg">
        <div className="overflow-hidden rounded-[10px]" style={{ background: 'var(--bg)' }}>
          {/* Breadcrumb */}
          <div className="border-b px-6 py-2.5" style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">CRM</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Contatos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Família Andrade</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Hero */}
          <div
            className="border-b p-6"
            style={{
              borderColor: 'var(--line-1)',
              background: 'linear-gradient(135deg, var(--brand-soft) 0%, transparent 70%), var(--surface-1)',
            }}
          >
            <div className="flex items-start justify-between gap-5 max-[760px]:flex-col">
              <div className="flex items-start gap-4">
                <Avatar size="xl" square style={{ background: 'var(--purple)', borderRadius: 18 }}>
                  <AvatarFallback>FA</AvatarFallback>
                </Avatar>
                <div>
                  <div className="mono text-[10.5px] font-semibold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
                    CONTATO · #2410 · CLIENTE PF
                  </div>
                  <h1
                    className="serif mt-1 text-[36px] font-normal leading-[1.05]"
                    style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
                  >
                    Família <em className="italic" style={{ color: 'var(--text-soft)' }}>Andrade</em>
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 size={12} /> Cliente PF · desde 2019
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} /> Balneário Camboriú · SC
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <AtSign size={12} /> andrade@email.com
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <LeadScore score={87} />
                    <Badge tone="brand">VIP</Badge>
                    <Badge tone="purple">3 projetos</Badge>
                    <Badge tone="success">NPS 9,2</Badge>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <ChannelBar
                  variant="cards"
                  channels={[
                    { kind: 'phone', onClick: () => toast.success('Discando…') },
                    { kind: 'whatsapp', badge: 3, onClick: () => toast.success('WhatsApp aberto') },
                    { kind: 'email', onClick: () => toast.success('Compose aberto') },
                    { kind: 'video', onClick: () => toast.success('Sala criada') },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Stage stepper */}
          <div
            className="border-b px-6 py-4"
            style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
          >
            <StageStepper stages={stages} current={stage} onChange={setStage} />
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-3 border-b p-6 max-[760px]:grid-cols-2" style={{ borderColor: 'var(--line-1)' }}>
            <KpiMini label="Valor em pipeline" value="R$ 16,3M" hint="2 deals abertos" tone="brand" />
            <KpiMini label="Fechado histórico" value="R$ 24,1M" hint="3 projetos entregues" tone="success" />
            <KpiMini label="Último toque" value="agora" hint="WhatsApp · respondeu" tone="success" />
            <KpiMini label="Probabilidade ponderada" value="R$ 11,1M" hint="média 68%" tone="warning" />
          </div>

          {/* Tabs underline */}
          <div className="sticky top-0 z-10 border-b px-6" style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList variant="underline" className="!border-b-0">
                <TabsTrigger value="activity" underline>Atividade</TabsTrigger>
                <TabsTrigger value="deals" underline>Deals · 2</TabsTrigger>
                <TabsTrigger value="notes" underline>Notas</TabsTrigger>
                <TabsTrigger value="docs" underline>Documentos · 14</TabsTrigger>
                <TabsTrigger value="people" underline>Pessoas · 3</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div className="grid grid-cols-[1fr_320px] gap-0 max-[900px]:grid-cols-1">
            <div className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="activity">
                  {/* Sugestão IA · próximo passo */}
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
                            Mandar a cotação alternativa do granito até quarta
                          </div>
                          <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                            Cliente perguntou agora via WhatsApp · Marmoraria Itajaí cotou 18% mais barato · pronto para envio.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Resolver</Button>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Histórico de atividade</CardTitle>
                      <Badge tone="brand">{activities.length} eventos</Badge>
                    </CardHeader>
                    <CardContent>
                      <Timeline items={activities} />
                    </CardContent>
                  </Card>

                  {/* Composer */}
                  <Card className="mt-5">
                    <CardHeader>
                      <CardTitle>Registrar interação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        <Select value={composerType} onValueChange={setComposerType}>
                          <SelectTrigger className="max-w-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="note">📝 Nota</SelectItem>
                            <SelectItem value="call">📞 Ligação</SelectItem>
                            <SelectItem value="email">✉ Email enviado</SelectItem>
                            <SelectItem value="meeting">📅 Reunião</SelectItem>
                            <SelectItem value="visit">🏗 Visita</SelectItem>
                          </SelectContent>
                        </Select>
                        <Textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder="O que aconteceu? Detalhes do contato, próximos passos, contexto…"
                          rows={3}
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Paperclip size={12} /> Anexar
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Tag size={12} /> Tag
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Bookmark size={12} /> Template
                            </Button>
                          </div>
                          <Button
                            disabled={!draft.trim()}
                            onClick={() => {
                              toast.success('Atividade registrada')
                              setDraft('')
                            }}
                          >
                            <Send size={12} /> Registrar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="deals">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deals do cliente</CardTitle>
                      <Button variant="outline" size="sm">+ Novo deal</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {deals.map((d) => (
                          <DealCard key={d.id} deal={d} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes">
                  <Card>
                    <CardContent className="!p-6 text-center">
                      <span className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                        Sem notas ainda · use o composer da aba Atividade para criar
                      </span>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="docs">
                  <Card>
                    <CardContent className="!p-6 text-center">
                      <span className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                        14 documentos · contratos · plantas · briefings
                      </span>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="people">
                  <Card>
                    <CardContent>
                      <ul className="grid gap-2">
                        {[
                          { ini: 'JA', name: 'Júlia Andrade', role: 'Decisora principal · contato direto', email: 'julia@andrade.com' },
                          { ini: 'CA', name: 'Carlos Andrade', role: 'Esposo · co-decisor', email: 'carlos@andrade.com' },
                          { ini: 'MA', name: 'Maria Andrade', role: 'Filha · interessada na suíte 1', email: 'maria@andrade.com' },
                        ].map((p) => (
                          <li
                            key={p.ini}
                            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[10px] border p-3"
                            style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                          >
                            <Avatar size="md" style={{ background: 'var(--purple)' }}>
                              <AvatarFallback>{p.ini}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                                {p.name}
                              </div>
                              <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                                {p.role}
                              </div>
                            </div>
                            <ChannelBar
                              size="sm"
                              channels={[
                                { kind: 'phone' },
                                { kind: 'whatsapp' },
                                { kind: 'email' },
                              ]}
                            />
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right rail */}
            <aside className="space-y-4 border-l p-6 max-[900px]:border-l-0 max-[900px]:border-t" style={{ borderColor: 'var(--line-1)' }}>
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
                      <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                        Lucas Zucchi
                      </div>
                      <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                        Líder · Squad Orion
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Transferir
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalhes</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-2.5 text-[12px]">
                    {[
                      ['CPF', '012.345.678-90'],
                      ['Telefone', '(47) 98xxx-xxxx'],
                      ['LTV', formatCurrency(241_000_00)],
                      ['Indicado por', 'Família Costa'],
                      ['Próx. contato', 'Quarta · 09h'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-2">
                        <dt className="mono text-[9.5px] font-bold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                          {k}
                        </dt>
                        <dd className="font-semibold" style={{ color: 'var(--text)' }}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone="brand">VIP</Badge>
                    <Badge tone="purple">High-end</Badge>
                    <Badge tone="success">Recorrente</Badge>
                    <Badge tone="pink">BC/SC</Badge>
                    <Badge tone="warning">Apresentar até quarta</Badge>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
