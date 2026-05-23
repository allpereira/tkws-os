import { Filter, MessageSquare, Phone, Plus, Search } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KpiMini } from '@/components/tkws/kpi'
import { Timeline, type TimelineItem } from '@/components/tkws/timeline'
import { cn, formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

interface Lead {
  id: string
  initials: string
  name: string
  italic?: string
  value: number
  meta: string
  lastTouch: string
  status: { label: string; tone: 'success' | 'warning' | 'brand' | 'neutral' | 'danger' }
  color: string
}

const leads: Lead[] = [
  { id: '1', initials: 'FA', name: 'Família', italic: 'Andrade', value: 12_500_000, meta: 'Yachthouse · 280 m² · BC/SC', lastTouch: 'hoje · 09:42', status: { label: 'Aguardando aprovação', tone: 'warning' }, color: 'var(--purple)' },
  { id: '2', initials: 'WS', name: 'WS', italic: 'Group', value: 9_500_000, meta: 'Cobertura · 920 m² · BC/SC', lastTouch: 'ontem', status: { label: 'Em obra', tone: 'success' }, color: 'var(--brand)' },
  { id: '3', initials: 'FC', name: 'Família', italic: 'Costa', value: 4_200_000, meta: 'Vitra 1801 · 145 m² · BC/SC', lastTouch: 'há 2 dias', status: { label: 'Briefing', tone: 'brand' }, color: 'var(--pink)' },
  { id: '4', initials: 'FO', name: 'Família', italic: 'Oz', value: 18_900_000, meta: 'Sky Resort · 1200 m² · BC/SC', lastTouch: 'há 5 dias', status: { label: 'Cold lead', tone: 'neutral' }, color: 'var(--success)' },
]

const detailActivity: TimelineItem[] = [
  { id: '1', meta: '20 MAI · 09:42', title: 'Cliente perguntou sobre alternativa de granito', tone: 'brand' },
  { id: '2', meta: '18 MAI', title: 'Apresentação do moodboard · cliente curtiu', tone: 'success' },
  { id: '3', meta: '15 MAI', title: 'Visita técnica realizada · 280 m² confirmados', tone: 'neutral' },
  { id: '4', meta: '12 MAI', title: 'Briefing assinado', tone: 'success' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Full CRM',
  import: '// Composição: Topbar + KPI + 2-col layout (clean list + detail panel)',
  contexto:
    'CRM completo · diferente do List screen padrão. Foco em RELACIONAMENTO (não em CRUD denso). Lista editorial à esquerda (clean-client-row) com nome serif grande + último toque · panel à direita com ações grandes, sugestão IA "próximo passo" e timeline. Densidade Guided/Standard.',
  quandoUsar: [
    'CRM comercial · gestão de leads e clientes',
    'Quando o foco é "quando foi a última conversa" e não "qual o ID"',
    'Modo Standard/Guided do TKWS',
  ],
  props: [],
  antiPatterns: [
    'Densidade Power num CRM · perde tom relacional',
    'Sem "última interação" visível · vira list genérica',
    'Sem sugestão proativa de próximo passo',
  ],
  exemplo: `// 2-col layout
<div className="grid grid-cols-[1fr_400px]">
  <CleanList items={leads} />
  <ClientDetail current={selected} />
</div>`,
  relacionados: ['ClientPortal', 'ProjectList', 'Timeline'],
}

export function FullCRMPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P41"
        category="Pattern · Full CRM"
        title="Full CRM"
        italic="relacional · editorial"
        description="CRM completo com lista clean editorial à esquerda e detail panel à direita. Densidade Guided/Standard."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="CRM · pipeline comercial" />
      <Showcase padding="none">
        {/* Topbar */}
        <div
          className="flex items-center gap-3 border-b p-5 max-[760px]:flex-wrap"
          style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
        >
          <Input icon={<Search size={14} />} placeholder="Buscar cliente, projeto, código…" className="max-w-md flex-1" />
          <Button variant="outline" size="sm">
            <Filter size={12} /> Filtros
          </Button>
          <Button>
            <Plus size={14} /> Novo cliente
          </Button>
        </div>

        {/* KPI strip natural */}
        <div className="grid grid-cols-3 gap-3 border-b p-6 max-[760px]:grid-cols-1" style={{ borderColor: 'var(--line-1)' }}>
          <KpiMini label="Em conversa" value="14" hint="ativos no mês" tone="brand" />
          <KpiMini label="Aguardando você" value="3" hint="próximas ações" tone="warning" />
          <KpiMini label="Cold leads" value="8" hint="sem contato +30d" tone="neutral" />
        </div>

        {/* 2-col layout */}
        <div className="grid grid-cols-[1fr_400px] gap-0 max-[900px]:grid-cols-1" style={{ minHeight: 540 }}>
          {/* Lista clean · estilo editorial */}
          <div className="overflow-y-auto">
            <ul>
              {leads.map((l, i) => {
                const selected = i === 0
                return (
                  <li
                    key={l.id}
                    className={cn(
                      'grid cursor-pointer grid-cols-[52px_1fr_auto] items-center gap-5 border-b px-8 py-5 transition-colors',
                      selected ? 'bg-[var(--brand-soft)]' : 'hover:bg-white/[0.03]'
                    )}
                    style={{
                      borderColor: 'var(--line-1)',
                      boxShadow: selected ? 'inset 4px 0 0 var(--brand)' : 'none',
                    }}
                  >
                    <Avatar size="xl" square style={{ background: l.color, borderRadius: 14 }}>
                      <AvatarFallback>{l.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="serif text-[22px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                        {l.name}{' '}
                        {l.italic && (
                          <em className="italic" style={{ color: 'var(--text-soft)' }}>
                            {l.italic}
                          </em>
                        )}
                      </div>
                      <div className="mt-1 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                        {l.meta}
                      </div>
                      <div className="mono mt-1 inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                        Último toque · {l.lastTouch}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="serif text-[22px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                        {formatCurrency(l.value)}
                      </div>
                      <Badge tone={l.status.tone}>{l.status.label}</Badge>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Detail panel · linguagem natural · CTAs grandes */}
          <aside
            className="overflow-y-auto border-l max-[900px]:border-l-0 max-[900px]:border-t"
            style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
          >
            {/* Hero */}
            <div
              className="p-7 text-center"
              style={{ background: 'linear-gradient(135deg, var(--brand-soft), transparent 70%)', borderBottom: '1px solid var(--line-1)' }}
            >
              <Avatar size="xl" square style={{ background: 'var(--purple)', margin: '0 auto 14px', borderRadius: 18, height: 72, width: 72, fontSize: 22 }}>
                <AvatarFallback>FA</AvatarFallback>
              </Avatar>
              <h3 className="serif text-[26px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                Família <em className="italic" style={{ color: 'var(--text-soft)' }}>Andrade</em>
              </h3>
              <div className="mt-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                Cliente desde 2019 · 3 projetos concluídos
              </div>

              {/* Big actions */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <Button variant="outline"><MessageSquare size={12} /> WhatsApp</Button>
                <Button variant="outline"><Phone size={12} /> Ligar</Button>
                <Button>Próximo passo</Button>
              </div>
            </div>

            {/* Simple KPIs · 2 essenciais */}
            <div className="grid grid-cols-2 border-b" style={{ borderColor: 'var(--line-1)' }}>
              <div className="border-r p-5 text-center" style={{ borderColor: 'var(--line-1)' }}>
                <div className="mono text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  Em contrato
                </div>
                <div className="serif mt-1 text-[26px] font-light" style={{ color: 'var(--text)' }}>
                  R$ 12,5M
                </div>
              </div>
              <div className="p-5 text-center">
                <div className="mono text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  Projetos totais
                </div>
                <div className="serif mt-1 text-[26px] font-light" style={{ color: 'var(--text)' }}>
                  4
                </div>
              </div>
            </div>

            {/* Next step card · sugestão proativa */}
            <div className="p-5">
              <Card accent="brand">
                <CardHeader>
                  <div className="mono text-[10px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--brand)' }}>
                    ★ Sugestão · Lúmen
                  </div>
                </CardHeader>
                <CardContent>
                  <h5 className="serif text-[18px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                    Apresentar a alternativa de granito hoje.
                  </h5>
                  <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                    A Marmoraria Itajaí cotou 18% mais barato com prazo melhor. Use a cotação no portal antes da reunião de quinta.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm">Marcar como feito</Button>
                    <Button variant="ghost" size="sm">Mais tarde</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Histórico</CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline items={detailActivity} />
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </Showcase>
    </div>
  )
}
