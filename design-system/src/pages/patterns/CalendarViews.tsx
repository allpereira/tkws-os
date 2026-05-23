import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Pattern · Calendar views',
  import: '// Composição: Header + view switcher (Mês/Semana/Dia) + grid de eventos',
  contexto:
    'Calendar grande · diferente do Calendar primitive (picker pequeno). Mês = grid 7×6 com eventos, Semana = grid 7×24h, Dia = lista vertical. Use cor por categoria de evento. Para CRUD de eventos, abra Sheet de detalhes.',
  quandoUsar: [
    'Tela de Agenda do squad',
    'Aba "Calendário" do projeto',
    'Visão de obra com vistorias programadas',
  ],
  props: [],
  antiPatterns: [
    'Calendar com eventos sobrepondo de forma ilegível · use Sheet para detalhes',
    'Sem cor por categoria · perde leitura rápida',
    'Mês com muitos eventos · vire "Semana" auto',
  ],
  exemplo: `// 3 views via Tabs:
// Mês · grid 7 cols × 6 rows · cada cell tem 0-N eventos
// Semana · grid 8 cols (hora + 7 dias) × 24 horas
// Dia · lista vertical com horário e duração visual`,
  relacionados: ['Calendar', 'Tabs', 'Card'],
}

const events = [
  { id: '1', title: 'Visita Yachthouse', day: 8, color: 'var(--brand)' },
  { id: '2', title: 'Apresentar render', day: 12, color: 'var(--purple)' },
  { id: '3', title: 'Reunião squad', day: 12, color: 'var(--success)' },
  { id: '4', title: 'Vistoria obra', day: 18, color: 'var(--warning)' },
  { id: '5', title: 'Entrega Marina Park', day: 22, color: 'var(--success)' },
  { id: '6', title: 'Cliente Andrade', day: 22, color: 'var(--brand)' },
  { id: '7', title: 'Cotação granito', day: 26, color: 'var(--warning)' },
]

const weekHours = ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h']

const weekEvents = [
  { day: 0, start: 9, span: 1.5, title: 'Standup', color: 'var(--brand)' },
  { day: 1, start: 10, span: 2, title: 'Visita obra · Yachthouse', color: 'var(--warning)' },
  { day: 2, start: 14, span: 1, title: 'Reunião cliente', color: 'var(--purple)' },
  { day: 3, start: 9, span: 3, title: 'Workshop briefing', color: 'var(--brand)' },
  { day: 4, start: 16, span: 1, title: 'Daily squad', color: 'var(--success)' },
  { day: 4, start: 11, span: 1.5, title: 'Apresentar render', color: 'var(--purple)' },
]

const dayEvents = [
  { start: '08:00', end: '09:00', title: 'Standup matinal', color: 'var(--brand)', meta: 'Squad Orion · sala azul' },
  { start: '09:30', end: '11:30', title: 'Visita técnica · Yachthouse 2104', color: 'var(--warning)', meta: 'BC/SC · cliente F. Andrade' },
  { start: '12:00', end: '13:00', title: 'Almoço com fornecedor SG', color: 'var(--text-mute)', meta: 'Marmoraria · cotação granito' },
  { start: '14:00', end: '15:30', title: 'Apresentar render · cliente Costa', color: 'var(--purple)', meta: 'Vitra 1801 · sala 3' },
  { start: '16:00', end: '17:00', title: 'Daily squad Orion', color: 'var(--success)', meta: '5 pessoas · pauta atrasos' },
]

export function CalendarViewsPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P15"
        category="Pattern · Calendar"
        title="Calendar views"
        italic="mês · semana · dia"
        description="3 views de calendário · troca via tabs. Cor por categoria. Click no evento abre Sheet."
        tag="3 views"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="View switcher · agenda do squad" />
      <Showcase padding="comfortable">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon"><ChevronLeft size={14} /></Button>
              <CardTitle>Maio 2026</CardTitle>
              <Button variant="outline" size="icon"><ChevronRight size={14} /></Button>
            </div>
            <Button><Plus size={14} /> Novo evento</Button>
          </CardHeader>
          <CardContent className="!p-0">
            <Tabs defaultValue="month">
              <div className="border-b p-3" style={{ borderColor: 'var(--line-1)' }}>
                <TabsList variant="pill">
                  <TabsTrigger value="month">Mês</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="day">Dia</TabsTrigger>
                </TabsList>
              </div>

              {/* MÊS */}
              <TabsContent value="month" className="!mt-0">
                <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--line-1)' }}>
                  {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((d) => (
                    <div
                      key={d}
                      className="mono px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[1.4px]"
                      style={{ color: 'var(--text-mute)', borderRight: '1px solid var(--line-1)' }}
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7" style={{ background: 'var(--line-1)', gap: 1 }}>
                  {Array.from({ length: 35 }).map((_, i) => {
                    const day = i - 4 + 1
                    const isThisMonth = day >= 1 && day <= 31
                    const dayEv = events.filter((e) => e.day === day)
                    return (
                      <div
                        key={i}
                        className={cn('flex min-h-[88px] flex-col gap-1 p-2', !isThisMonth && 'opacity-40')}
                        style={{ background: 'var(--surface-1)' }}
                      >
                        <span
                          className="mono text-[11px] font-bold"
                          style={{ color: day === 18 ? 'var(--brand)' : 'var(--text)' }}
                        >
                          {isThisMonth ? day : ''}
                        </span>
                        {dayEv.map((e) => (
                          <span
                            key={e.id}
                            className="truncate rounded px-1.5 py-0.5 text-[9.5px] font-semibold"
                            style={{ background: e.color + '24', color: e.color, border: `1px solid ${e.color}` }}
                          >
                            {e.title}
                          </span>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              {/* SEMANA */}
              <TabsContent value="week" className="!mt-0">
                <div className="overflow-x-auto">
                  <div className="grid" style={{ gridTemplateColumns: '60px repeat(7, minmax(80px, 1fr))', minWidth: 720 }}>
                    {/* Header */}
                    <div className="border-b p-2" style={{ borderColor: 'var(--line-1)' }} />
                    {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((d, i) => (
                      <div
                        key={d}
                        className="mono border-b border-l p-2 text-center text-[10px] font-bold uppercase tracking-[1.4px]"
                        style={{ borderColor: 'var(--line-1)', color: 'var(--text-mute)' }}
                      >
                        {d} <span style={{ color: 'var(--text)' }}>{i + 18}</span>
                      </div>
                    ))}

                    {/* Hours rows */}
                    {weekHours.map((h, hi) => (
                      <>
                        <div key={`h-${hi}`} className="mono border-b p-2 text-[10px]" style={{ borderColor: 'var(--line-1)', color: 'var(--text-mute)' }}>
                          {h}
                        </div>
                        {Array.from({ length: 7 }).map((_, di) => {
                          const ev = weekEvents.find((e) => e.day === di && Math.floor(e.start - 8) === hi)
                          return (
                            <div
                              key={`c-${hi}-${di}`}
                              className="relative min-h-[40px] border-b border-l"
                              style={{ borderColor: 'var(--line-1)' }}
                            >
                              {ev && (
                                <div
                                  className="absolute inset-x-1 top-1 rounded-md p-1"
                                  style={{
                                    background: ev.color + '2a',
                                    border: `1px solid ${ev.color}`,
                                    height: ev.span * 40 - 6,
                                  }}
                                >
                                  <div className="mono truncate text-[9px] font-bold" style={{ color: ev.color }}>
                                    {ev.title}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* DIA */}
              <TabsContent value="day" className="!mt-0">
                <div className="p-5">
                  <div className="mono mb-4 text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                    Sexta-feira, 22 de maio
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-3">
                    {dayEvents.map((e) => (
                      <>
                        <div className="mono text-right text-[11px] font-bold" style={{ color: 'var(--text-mute)' }}>
                          {e.start}
                          <div className="text-[9.5px] font-normal" style={{ color: 'var(--text-mute)' }}>
                            até {e.end}
                          </div>
                        </div>
                        <div
                          className="grid grid-cols-[6px_1fr] gap-3 rounded-lg border p-3"
                          style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                        >
                          <span className="rounded-full" style={{ background: e.color }} />
                          <div>
                            <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                              {e.title}
                            </div>
                            <div className="mono mt-0.5 text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                              {e.meta}
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
            Categorias:
          </span>
          {[
            { c: 'var(--brand)', l: 'Reuniões internas' },
            { c: 'var(--warning)', l: 'Obra' },
            { c: 'var(--purple)', l: 'Clientes' },
            { c: 'var(--success)', l: 'Entregas' },
          ].map((c) => (
            <Badge key={c.l} tone="neutral">
              <span className="h-2 w-2 rounded-full" style={{ background: c.c }} /> {c.l}
            </Badge>
          ))}
        </div>
      </Showcase>
    </div>
  )
}
