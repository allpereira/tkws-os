import { useState } from 'react'
import { Edit3, MessageSquare, Paperclip, Share2 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { DetailHero } from '@/components/tkws/detail-hero'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar'
import { KpiMini, KpiHero } from '@/components/tkws/kpi'
import { Timeline, type TimelineItem } from '@/components/tkws/timeline'
import { Progress } from '@/components/ui/progress'
import { GoalRing } from '@/components/ui/goal-ring'
import type { AIPrompt } from '@/lib/prompts'

const activity: TimelineItem[] = [
  { id: '1', meta: '20 MAI · 09:42', title: 'Cliente aprovou novo cronograma', tone: 'success' },
  { id: '2', meta: '18 MAI · 16:20', title: 'Replanejamento submetido ao cliente', tone: 'brand' },
  { id: '3', meta: '15 MAI · 11:14', title: 'Atraso de 8 dias na entrega do granito', tone: 'danger' },
  { id: '4', meta: '12 MAI · 14:08', title: 'Visita técnica · 280 m² confirmados', tone: 'warning' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Project Detail Screen',
  import: '// Composição: DetailHero + Tabs underline + cada tab é uma seção rica',
  contexto:
    'Tela de detalhe · DetailHero no topo (cover + KPIs + actions) · Tabs underline para sub-navegação · cada tab tem layout próprio. URL guarda a tab ativa (search params).',
  quandoUsar: [
    'Detail de Projeto, Cliente, Fornecedor',
    'Sempre que houver 4+ aspectos do mesmo registro',
  ],
  props: [],
  antiPatterns: [
    'Tab ativa fora da URL',
    'DetailHero sem cover · perde tom editorial',
    'Mais de 7 tabs · sidebar é melhor',
  ],
  exemplo: `// Layout principal:
<DetailHero ... />
<Tabs value={tab} onValueChange={(v) => navigate({ search: (s) => ({ ...s, tab: v }) })}>
  <TabsList variant="underline">
    <TabsTrigger value="overview" underline>Visão Geral</TabsTrigger>
    ...
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
</Tabs>`,
  relacionados: ['DetailHero', 'Tabs', 'KPI'],
}

export function ProjectDetailPattern() {
  const [tab, setTab] = useState('overview')
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P09.2"
        category="Pattern · Detail Screen"
        title="Project Detail"
        italic="hero + tabs"
        description="Detail editorial com cover, KPIs e tabs underline. Tab ativa via URL."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Yachthouse 2104 · detalhe completo" />
      <Showcase padding="comfortable">
        <DetailHero
          cover={
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, var(--surface-3) 0%, var(--surface-4) 60%, var(--brand-soft) 100%)',
                color: 'var(--text-mute)',
              }}
            >
              <span className="mono text-[10.5px] font-bold uppercase tracking-[1.6px]">RENDER · LIVING</span>
            </div>
          }
          code="PROJETO #2410 · REV.2"
          title="Yachthouse 2104"
          italic="Família Andrade"
          subtitle="Apartamento residencial · 280 m² · Balneário Camboriú, SC · Squad Orion"
          status={{ label: 'Em obra · atrasado 8d', tone: 'danger' }}
          meta={[
            { label: 'Contrato', value: 'R$ 12,5M' },
            { label: 'Margem', value: '31%' },
            { label: 'Progresso', value: '65%' },
            { label: 'Entrega', value: '15/06' },
          ]}
          actions={
            <>
              <Button variant="outline" size="sm"><Share2 size={12} /> Compartilhar</Button>
              <Button size="sm"><Edit3 size={12} /> Editar</Button>
            </>
          }
        />

        <div className="mt-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList variant="underline">
              <TabsTrigger value="overview" underline>Visão Geral</TabsTrigger>
              <TabsTrigger value="briefing" underline>Briefing</TabsTrigger>
              <TabsTrigger value="budget" underline>Orçamento</TabsTrigger>
              <TabsTrigger value="finance" underline>Financeiro</TabsTrigger>
              <TabsTrigger value="obra" underline>Obra</TabsTrigger>
              <TabsTrigger value="docs" underline>Documentos</TabsTrigger>
              <TabsTrigger value="team" underline>Equipe</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-[1fr_320px] gap-6 max-[900px]:grid-cols-1">
                <div className="grid gap-5">
                  <div className="grid grid-cols-3 gap-3">
                    <KpiHero label="Custo previsto" value="R$ 8,6M" delta={{ value: '+2,1% vs orçado', trend: 'up' }} hint="vs R$ 8,4M planejado" />
                    <KpiHero label="Etapas concluídas" value="11/18" delta={{ value: '-1 atraso', trend: 'down' }} hint="9 dias acima do prazo" />
                    <KpiHero label="Satisfação NPS" value="9,2" delta={{ value: '+0,4', trend: 'up' }} hint="média do squad: 8,4" />
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Progresso · etapas principais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {[
                          { lbl: 'Briefing', v: 100, tone: 'success' as const },
                          { lbl: 'Orçamento', v: 100, tone: 'success' as const },
                          { lbl: 'Contrato', v: 100, tone: 'success' as const },
                          { lbl: 'Execução · obra', v: 65, tone: 'warning' as const },
                          { lbl: 'Decoração e mobiliário', v: 12, tone: 'brand' as const },
                          { lbl: 'Entrega final', v: 0, tone: 'brand' as const },
                        ].map((s) => (
                          <div key={s.lbl}>
                            <div className="flex items-center justify-between text-[12px]">
                              <span style={{ color: 'var(--text-soft)' }}>{s.lbl}</span>
                              <span className="mono font-bold" style={{ color: 'var(--text)' }}>
                                {s.v}%
                              </span>
                            </div>
                            <div className="mt-1.5">
                              <Progress value={s.v} tone={s.tone} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <aside className="grid gap-4">
                  <Card>
                    <CardHeader><CardTitle>Squad</CardTitle></CardHeader>
                    <CardContent>
                      <div className="mb-3 flex items-center gap-2">
                        <AvatarGroup>
                          <Avatar size="md" style={{ background: 'var(--brand)' }}><AvatarFallback>LZ</AvatarFallback></Avatar>
                          <Avatar size="md" style={{ background: 'var(--purple)' }}><AvatarFallback>AV</AvatarFallback></Avatar>
                          <Avatar size="md" style={{ background: 'var(--success)' }}><AvatarFallback>JQ</AvatarFallback></Avatar>
                          <Avatar size="md" style={{ background: 'var(--warning)', color: 'var(--bg)' }}><AvatarFallback>RL</AvatarFallback></Avatar>
                        </AvatarGroup>
                        <Badge tone="purple">Orion · 5</Badge>
                      </div>
                      <div className="text-[12px]" style={{ color: 'var(--text-soft)' }}>
                        Líder: <b style={{ color: 'var(--text)' }}>Lucas Z.</b> · arquitetos: 3 · designer: 1 · gestor obra: 1
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Saúde financeira</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-around">
                        <GoalRing value={31} sublabel="Margem" tone="warning" size={100} thickness={9} />
                        <GoalRing value={65} sublabel="Execução" tone="warning" size={100} thickness={9} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Atividade recente</CardTitle></CardHeader>
                    <CardContent>
                      <Timeline items={activity.slice(0, 3)} />
                    </CardContent>
                  </Card>
                </aside>
              </div>
            </TabsContent>

            {['briefing', 'budget', 'finance', 'obra', 'docs', 'team'].map((id) => (
              <TabsContent key={id} value={id}>
                <Card>
                  <CardHeader><CardTitle>Tab · {id}</CardTitle></CardHeader>
                  <CardContent>
                    <p>Conteúdo específico desta aba · pode usar Form, DataTable, Gantt, Timeline, etc.</p>
                    <div className="mt-3 flex gap-2">
                      <Badge tone="brand"><MessageSquare size={11} /> 12 comentários</Badge>
                      <Badge tone="neutral"><Paperclip size={11} /> 8 anexos</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Showcase>
    </div>
  )
}
