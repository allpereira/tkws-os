import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KpiHero, KpiMini } from '@/components/tkws/kpi'
import { GoalRing } from '@/components/ui/goal-ring'
import { Donut, LineSeriesChart } from '@/components/tkws/charts'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Timeline, type TimelineItem } from '@/components/tkws/timeline'
import type { AIPrompt } from '@/lib/prompts'

const series = [{ label: 'Jan', value: 32 }, { label: 'Fev', value: 42 }, { label: 'Mar', value: 55 }, { label: 'Abr', value: 64 }, { label: 'Mai', value: 71 }, { label: 'Jun', value: 87 }]
const lineData = [
  { label: 'Jan', Orion: 4.2, Apollo: 2.1, Neptune: 1.8 },
  { label: 'Fev', Orion: 5.1, Apollo: 2.8, Neptune: 2.1 },
  { label: 'Mar', Orion: 6.3, Apollo: 3.2, Neptune: 2.4 },
  { label: 'Abr', Orion: 5.8, Apollo: 4.1, Neptune: 3.0 },
  { label: 'Mai', Orion: 7.4, Apollo: 4.6, Neptune: 3.2 },
  { label: 'Jun', Orion: 8.2, Apollo: 5.1, Neptune: 3.8 },
]

const activity: TimelineItem[] = [
  { id: '1', meta: 'agora', title: 'Atraso reportado · Yachthouse 2104', tone: 'danger' },
  { id: '2', meta: 'há 12 min', title: 'Cobertura Titanium moveu para Decoração', tone: 'success' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Views by Role · Cockpit',
  import: '// Composição: Tabs · cada tab = cockpit completo da role',
  contexto:
    'Mesmo dataset, lentes diferentes por role. Diretor vê portfólio + margem · Líder vê squad + carga · Arquiteto vê backlog + nextupp · Cliente vê seu projeto · Fornecedor vê cotações. Demonstra que TKWS roda em 3 densidades sobre o mesmo modelo.',
  quandoUsar: [
    'Demonstração executiva para venda do produto',
    'Onboarding de C-level · "veja como cada persona usa"',
    'Documentação interna · alinhar expectativa',
  ],
  props: [],
  antiPatterns: [
    'Mostrar dados diferentes por role · use o mesmo dataset',
    'Cockpit do diretor com densidade Power · ele quer leitura',
  ],
  exemplo: `// Cada tab tem layout próprio
<Tabs value={role}>
  <TabsList>
    <TabsTrigger value="director">Diretor</TabsTrigger>
    <TabsTrigger value="lead">Líder Squad</TabsTrigger>
    <TabsTrigger value="architect">Arquiteto</TabsTrigger>
    <TabsTrigger value="client">Cliente</TabsTrigger>
  </TabsList>
  <TabsContent value="director"><DirectorCockpit /></TabsContent>
  <TabsContent value="lead"><LeadCockpit /></TabsContent>
  ...
</Tabs>`,
  relacionados: ['Dashboard', 'ClientPortal', 'Personas'],
}

export function ViewsByRolePattern() {
  const [tab, setTab] = useState('director')

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P36"
        category="Pattern · Views by Role"
        title="Visões do mesmo projeto"
        italic="por persona"
        description="O mesmo dataset com lentes diferentes. Diretor · Líder · Arquiteto · Cliente vêem o mesmo projeto, mas a UI muda."
        tag="cockpit por role"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Cockpit · 4 roles" />
      <Showcase padding="comfortable">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList variant="pill">
            <TabsTrigger value="director">Diretor</TabsTrigger>
            <TabsTrigger value="lead">Líder Squad</TabsTrigger>
            <TabsTrigger value="architect">Arquiteto</TabsTrigger>
            <TabsTrigger value="client">Cliente</TabsTrigger>
          </TabsList>

          {/* DIRETOR · power density · KPIs hero + charts */}
          <TabsContent value="director">
            <Badge tone="purple">Power · keyboard-first</Badge>
            <div className="mt-3 grid grid-cols-12 gap-3">
              <div className="col-span-12 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
                <KpiHero label="Portfólio total" value="R$ 87,4M" hint="43 projetos · 7 squads" delta={{ value: '+12% YoY', trend: 'up' }} series={series} />
                <KpiHero label="Margem média" value="31,2%" hint="alvo: 30%" delta={{ value: '+1,2pp', trend: 'up' }} series={series.map((s) => ({ ...s, value: s.value * 0.7 }))} />
                <KpiHero label="NPS" value="9,1" hint="17 reviews" delta={{ value: '-0,2', trend: 'down' }} series={series.map((s) => ({ ...s, value: s.value * 0.9 }))} />
              </div>
              <div className="col-span-8 max-[900px]:col-span-12">
                <Card>
                  <CardHeader><CardTitle>Receita por squad · 6 meses</CardTitle></CardHeader>
                  <CardContent>
                    <LineSeriesChart
                      data={lineData}
                      series={[
                        { name: 'Orion', color: 'var(--purple)' },
                        { name: 'Apollo', color: 'var(--pink)' },
                        { name: 'Neptune', color: 'var(--brand)' },
                      ]}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-4 max-[900px]:col-span-12">
                <Card>
                  <CardHeader><CardTitle>Portfólio por squad</CardTitle></CardHeader>
                  <CardContent>
                    <Donut
                      data={[
                        { name: 'Orion', value: 42, color: 'var(--purple)' },
                        { name: 'Apollo', value: 28, color: 'var(--pink)' },
                        { name: 'Neptune', value: 18, color: 'var(--brand)' },
                        { name: 'Outros', value: 12, color: 'var(--text-mute)' },
                      ]}
                      height={200}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* LÍDER SQUAD · power density · foco em squad */}
          <TabsContent value="lead">
            <Badge tone="brand">Power · squad em foco</Badge>
            <div className="mt-3 grid grid-cols-12 gap-3">
              <div className="col-span-12 grid grid-cols-4 gap-3 max-[760px]:grid-cols-2">
                <KpiMini label="Squad Orion" value="18" hint="projetos ativos" tone="brand" />
                <KpiMini label="Atrasos" value="3" hint="8d média" tone="danger" />
                <KpiMini label="Carga média" value="3,6" hint="proj / arquiteto" tone="warning" />
                <KpiMini label="Margem squad" value="34%" hint="vs 30% meta" tone="success" />
              </div>
              <div className="col-span-8 max-[900px]:col-span-12">
                <Card>
                  <CardHeader><CardTitle>Carga por pessoa · Orion</CardTitle></CardHeader>
                  <CardContent>
                    <ol className="grid gap-3">
                      {[
                        { ini: 'LZ', name: 'Lucas Z. · líder', projetos: 5, max: 6, color: 'var(--brand)' },
                        { ini: 'AV', name: 'Ana V. · arquiteta sênior', projetos: 4, max: 5, color: 'var(--purple)' },
                        { ini: 'JQ', name: 'João Q. · arquiteto pleno', projetos: 3, max: 4, color: 'var(--success)' },
                        { ini: 'RL', name: 'Rita L. · designer', projetos: 4, max: 5, color: 'var(--warning)' },
                        { ini: 'PM', name: 'Pedro M. · gestor obra', projetos: 2, max: 3, color: 'var(--alert)' },
                      ].map((p) => (
                        <li key={p.ini} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border p-3" style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}>
                          <Avatar size="md" style={{ background: p.color }}><AvatarFallback>{p.ini}</AvatarFallback></Avatar>
                          <div>
                            <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{p.name}</div>
                            <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>{p.projetos}/{p.max} projetos</div>
                          </div>
                          <Badge tone={p.projetos === p.max ? 'danger' : p.projetos === p.max - 1 ? 'warning' : 'success'}>
                            {p.projetos === p.max ? 'no limite' : 'ok'}
                          </Badge>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-4 max-[900px]:col-span-12">
                <Card>
                  <CardHeader><CardTitle>Saúde do squad</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <GoalRing value={84} sublabel="saúde" tone="success" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ARQUITETO · standard density · backlog pessoal */}
          <TabsContent value="architect">
            <Badge tone="success">Standard · clique + teclado</Badge>
            <div className="mt-3 grid grid-cols-12 gap-3">
              <div className="col-span-12 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
                <KpiMini label="Meus projetos" value="4" hint="ativos" tone="brand" />
                <KpiMini label="Aguardando você" value="2" hint="renders pendentes" tone="warning" />
                <KpiMini label="Esta semana" value="8" hint="tarefas" tone="success" />
              </div>
              <div className="col-span-12">
                <Card>
                  <CardHeader><CardTitle>Próximos passos</CardTitle></CardHeader>
                  <CardContent>
                    <ol className="grid gap-2">
                      {[
                        { lbl: 'Finalizar render do living · Yachthouse 2104', deadline: 'hoje', urg: 'danger' as const },
                        { lbl: 'Revisar moodboard · Vitra 1801', deadline: 'amanhã', urg: 'warning' as const },
                        { lbl: 'Cotar marmoraria alternativa', deadline: 'sexta', urg: 'brand' as const },
                      ].map((t, i) => (
                        <li
                          key={i}
                          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border p-3"
                          style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                        >
                          <span className="mono text-[10px] font-bold" style={{ color: 'var(--text-mute)' }}>0{i + 1}</span>
                          <span className="text-[13px]" style={{ color: 'var(--text)' }}>{t.lbl}</span>
                          <Badge tone={t.urg}>{t.deadline}</Badge>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* CLIENTE · guided density */}
          <TabsContent value="client">
            <Badge tone="warning">Guided · linguagem natural</Badge>
            <div className="mt-3 grid grid-cols-[1fr_360px] gap-4 max-[900px]:grid-cols-1">
              <Card accent="brand">
                <CardHeader>
                  <CardTitle className="!text-[22px]">Seu projeto está em boas mãos.</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[14px]" style={{ color: 'var(--text-soft)' }}>
                    Lucas (seu líder) está revisando o novo render. Você terá uma novidade até quarta.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge tone="success" pulse>Em obra · 65%</Badge>
                    <Badge tone="brand">3 milestones próximos</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Próximas etapas</CardTitle></CardHeader>
                <CardContent>
                  <Timeline items={activity} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Showcase>
    </div>
  )
}
