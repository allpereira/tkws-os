import { Calendar, FileText, MessageSquare, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { GoalRing } from '@/components/ui/goal-ring'
import { Timeline, type TimelineItem } from '@/components/tkws/timeline'
import type { AIPrompt } from '@/lib/prompts'

const activity: TimelineItem[] = [
  { id: '1', meta: '20 MAI', title: 'Squad enviou novo render do living', description: 'Aprove ou peça ajustes diretamente', tone: 'brand' },
  { id: '2', meta: '18 MAI', title: 'Orçamento revisado em R$ 12,5M', description: 'Detalhes na aba Financeiro', tone: 'success' },
  { id: '3', meta: '15 MAI', title: 'Marmoraria São Gabriel aprovada', tone: 'success' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Portal do Cliente',
  import: '// Composição: Guided density · Card grande · Hero + KPIs simples · Sem jargão técnico',
  contexto:
    'Portal externo para o CLIENTE FINAL (não para o squad). Densidade GUIDED · whitespace radical · linguagem natural ("seu projeto", "ver render") · CTAs gigantes · sem datatable, sem jargão de operação. Mostra status, milestones e ações pendentes.',
  quandoUsar: [
    'Portal de cliente · acompanha próprio projeto',
    'Página de uma família/empresa contratante',
    'Touchpoint mensal · cliente entra 2x por mês',
  ],
  props: [],
  antiPatterns: [
    'Densidade power-user no portal · cliente fica perdido',
    'Jargão TKWS (squad, kanban, lane) · use palavras simples',
    'Datatable no portal · use Cards grandes com 1 item importante por vez',
  ],
  exemplo: `// Layout · 2 colunas
<div className="grid grid-cols-[1fr_360px]">
  <main>
    <ClientHero />
    <NextActions />
    <RecentActivity />
  </main>
  <aside>
    <ProgressCard />
    <SquadCard />
  </aside>
</div>`,
  relacionados: ['DetailHero', 'Timeline', 'GoalRing'],
}

export function ClientPortalPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P-CLIENT"
        category="Pattern · Portal do Cliente"
        title="Portal do Cliente"
        italic="guided · whitespace radical"
        description="Touchpoint mensal · cliente abre 2x por mês. Linguagem natural, densidade baixa, CTAs gigantes."
        tag="portal externo"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Home do cliente · Família Andrade" />
      <Showcase padding="none">
        {/* Topbar simples */}
        <div
          className="flex items-center justify-between border-b px-8 py-4"
          style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
        >
          <div className="serif text-[20px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
            TKWS <em className="italic" style={{ color: 'var(--brand)' }}>OS</em>
          </div>
          <div className="flex items-center gap-3">
            <Avatar size="sm" style={{ background: 'var(--purple)' }}>
              <AvatarFallback>FA</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <div className="text-[12.5px] font-semibold" style={{ color: 'var(--text)' }}>
                Família Andrade
              </div>
              <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                Cliente desde 2019
              </div>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section
          className="border-b px-10 py-12 max-[760px]:px-5 max-[760px]:py-8"
          style={{
            borderColor: 'var(--line-1)',
            background: 'linear-gradient(135deg, var(--brand-soft) 0%, transparent 60%), var(--surface-1)',
          }}
        >
          <div className="mono text-[10.5px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--brand)' }}>
            Seu projeto
          </div>
          <h1
            className="serif mt-2 text-[clamp(36px,5vw,52px)] font-light leading-[1.05] tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Yachthouse 2104
          </h1>
          <p className="mt-3 max-w-2xl text-[15px]" style={{ color: 'var(--text-soft)' }}>
            Apartamento residencial de 280 m² em Balneário Camboriú. Acompanhe a evolução do projeto, aprove etapas e converse com a equipe.
          </p>
        </section>

        {/* Body 2-col */}
        <div className="grid grid-cols-[1fr_360px] gap-0 max-[900px]:grid-cols-1">
          <main className="space-y-5 p-8 max-[760px]:p-5">
            {/* Ação pendente */}
            <Card
              accent="brand"
              className="!p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mono mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--brand)' }}>
                    <Sparkles size={11} /> Sugestão · ação pendente
                  </div>
                  <CardTitle className="!text-[22px]">Aprovar o novo render do living</CardTitle>
                  <CardDescription className="!text-[14px]">
                    O Lucas (líder do squad) enviou hoje a versão com a parede de mármore italiano. Veja e diga se podemos seguir.
                  </CardDescription>
                </div>
                <div className="hidden h-20 w-24 shrink-0 overflow-hidden rounded-lg md:block" style={{ background: 'var(--surface-3)' }}>
                  <div className="flex h-full items-center justify-center mono text-[9px] tracking-wide" style={{ color: 'var(--text-mute)' }}>
                    RENDER
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button>Ver e aprovar</Button>
                <Button variant="outline"><MessageSquare size={12} /> Pedir ajuste</Button>
              </div>
            </Card>

            {/* Próximas etapas */}
            <Card>
              <CardHeader>
                <CardTitle>Próximas etapas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {[
                    { lbl: 'Aprovar render do living', date: 'até 24/05', tone: 'brand' as const, status: 'pendente' },
                    { lbl: 'Visita à obra', date: '28/05 às 10h', tone: 'success' as const, status: 'agendada' },
                    { lbl: 'Aprovar paleta da cozinha', date: 'até 02/06', tone: 'warning' as const, status: 'em breve' },
                  ].map((s) => (
                    <div
                      key={s.lbl}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border p-3"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                    >
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
                      >
                        <Calendar size={14} />
                      </span>
                      <div>
                        <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                          {s.lbl}
                        </div>
                        <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                          {s.date}
                        </div>
                      </div>
                      <Badge tone={s.tone}>{s.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atualizações recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline items={activity} />
              </CardContent>
            </Card>
          </main>

          <aside className="space-y-4 border-l p-6 max-[900px]:border-l-0 max-[900px]:border-t" style={{ borderColor: 'var(--line-1)' }}>
            <Card>
              <CardHeader>
                <CardTitle>Progresso geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <GoalRing value={65} sublabel="concluído" tone="warning" size={140} thickness={11} />
                </div>
                <div className="mt-4 grid gap-2 text-[12.5px]">
                  {[
                    ['Briefing', 100],
                    ['Aprovações', 80],
                    ['Obra', 65],
                    ['Decoração', 12],
                  ].map(([lbl, v]) => (
                    <div key={String(lbl)}>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-soft)' }}>{lbl}</span>
                        <span className="mono font-bold" style={{ color: 'var(--text)' }}>{v}%</span>
                      </div>
                      <Progress value={Number(v)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Equipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar style={{ background: 'var(--brand)' }}><AvatarFallback>LZ</AvatarFallback></Avatar>
                  <div>
                    <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                      Lucas Z.
                    </div>
                    <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                      Líder · Squad Orion
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare size={12} /> Conversar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText size={12} /> Briefing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </Showcase>
    </div>
  )
}
