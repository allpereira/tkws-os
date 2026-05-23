import { Camera, CheckCircle2, Clock, ImageIcon } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Gantt, type GanttTask } from '@/components/tkws/gantt'
import type { AIPrompt } from '@/lib/prompts'

const punchItems = [
  { id: '1', code: '#001', amb: 'Living', desc: 'Esquadria com vão na junta superior · 3mm', sev: 'media' as const, status: { label: 'Em correção', tone: 'warning' as const }, assignee: 'Equipe Vasconcelos' },
  { id: '2', code: '#002', amb: 'Cozinha', desc: 'Granito São Gabriel com mancha · trocar peça 4', sev: 'alta' as const, status: { label: 'Aguardando peça', tone: 'danger' as const }, assignee: 'Marmoraria SG' },
  { id: '3', code: '#003', amb: 'Master', desc: 'Iluminação cênica · ajustar foco da arandela', sev: 'baixa' as const, status: { label: 'Resolvido', tone: 'success' as const }, assignee: 'Lúmen' },
  { id: '4', code: '#004', amb: 'BWC Master', desc: 'Box de vidro · raspar selante', sev: 'baixa' as const, status: { label: 'Resolvido', tone: 'success' as const }, assignee: 'Vidraçaria Pelotas' },
]

const sevColor: Record<'baixa' | 'media' | 'alta', { color: string; bg: string }> = {
  baixa: { color: 'var(--success)', bg: 'rgba(95,217,165,0.14)' },
  media: { color: 'var(--warning)', bg: 'rgba(242,201,76,0.14)' },
  alta: { color: 'var(--danger)', bg: 'rgba(235,87,87,0.14)' },
}

const ganttTasks: GanttTask[] = [
  { id: '1', name: 'Demolição', startCol: 0, span: 2, progress: 100, tone: 'success' },
  { id: '2', name: 'Hidráulica', startCol: 1, span: 3, progress: 80, tone: 'success' },
  { id: '3', name: 'Marcenaria', startCol: 2, span: 4, progress: 45, tone: 'warning' },
  { id: '4', name: 'Granito (atrasado)', startCol: 3, span: 2, progress: 30, tone: 'danger' },
  { id: '5', name: 'Pisos', startCol: 4, span: 3, progress: 10, tone: 'brand' },
  { id: '6', name: 'Iluminação', startCol: 5, span: 2, progress: 0, tone: 'purple' },
  { id: '7', name: 'Decoração', startCol: 6, span: 2, progress: 0, tone: 'pink' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Arquitetura & Obra',
  import: '// Composição: Gantt + Punch list + Floor plan + Photos',
  contexto:
    'Tela de obra · cronograma Gantt, punch list com severidade, plantas com anotações, galeria de fotos. Cada item de punch list é clicável (Sheet de detalhes). Severidade colorida (baixa/média/alta).',
  quandoUsar: [
    'Aba "Obra" do detalhe de projeto',
    'Vistoria com cliente',
    'Daily standup do squad de obra',
  ],
  props: [],
  antiPatterns: [
    'Punch list sem severidade · perde priorização',
    'Gantt sem cor de atraso · invisível',
    'Fotos sem data/contexto · perde valor de auditoria',
  ],
  exemplo: `// Punch list é uma lista de items
// Cada item: código + ambiente + descrição + severidade + responsável + status
// Filtros por: ambiente, severidade, responsável, status`,
  relacionados: ['Gantt', 'Timeline', 'Card'],
}

export function ArchObraPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P31"
        category="Pattern · Arquitetura & Obra"
        title="Arch & Obra"
        italic="cronograma · punch list · fotos"
        description="Tela de obra: Gantt, punch list por severidade, fotos. Cada punch item é Sheet."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Yachthouse 2104 · obra · maio 2026" />
      <Showcase padding="comfortable">
        {/* Gantt */}
        <Card className="mb-5">
          <CardHeader>
            <CardTitle>Cronograma de obra</CardTitle>
            <Badge tone="warning">8 dias atrasado</Badge>
          </CardHeader>
          <CardContent className="!p-0">
            <Gantt
              periods={['Mar W1', 'Mar W2', 'Mar W3', 'Mar W4', 'Abr W1', 'Abr W2', 'Abr W3', 'Abr W4']}
              tasks={ganttTasks}
            />
          </CardContent>
        </Card>

        {/* Punch list + Floor plan */}
        <div className="grid grid-cols-[1fr_360px] gap-5 max-[900px]:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Punch list · 4 items</CardTitle>
              <Button variant="outline" size="sm">+ Novo item</Button>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {punchItems.map((p) => {
                  const sev = sevColor[p.sev]
                  return (
                    <li
                      key={p.id}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border p-3"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
                    >
                      <div
                        className="flex h-12 w-12 flex-col items-center justify-center rounded-md"
                        style={{ background: sev.bg, color: sev.color }}
                      >
                        <span className="mono text-[10px] font-bold uppercase">{p.sev}</span>
                        <span className="mono text-[9px] font-bold">{p.code}</span>
                      </div>
                      <div>
                        <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                          {p.amb} · {p.desc}
                        </div>
                        <div className="mono mt-0.5 text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                          Responsável: {p.assignee}
                        </div>
                      </div>
                      <Badge tone={p.status.tone}>{p.status.label}</Badge>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planta baixa</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="flex h-72 items-center justify-center rounded-lg"
                style={{ background: 'var(--surface-2)' }}
              >
                <div className="text-center">
                  <ImageIcon size={32} style={{ color: 'var(--text-mute)' }} />
                  <div className="mono mt-2 text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                    SVG anotada · 4 marcações ativas
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <KpiSmall label="Total" value="280" suffix="m²" />
                <KpiSmall label="Ambientes" value="5" />
                <KpiSmall label="Marcações" value="4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fotos da obra */}
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>Fotos · 18/05/2026</CardTitle>
            <div className="flex gap-2">
              <Badge tone="brand"><Camera size={11} /> 12 fotos</Badge>
              <Button variant="outline" size="sm">Ver tudo</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 max-[760px]:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--surface-3) 0%, var(--surface-4) 60%, var(--brand-soft) 100%)',
                  }}
                >
                  <div className="absolute bottom-1.5 left-1.5">
                    <Badge tone="neutral">
                      <Clock size={9} /> 14:32
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progresso de execução */}
        <div className="mt-5 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          {[
            { lbl: 'Estrutura', v: 100, tone: 'success' as const },
            { lbl: 'Acabamento', v: 45, tone: 'warning' as const },
            { lbl: 'Decoração', v: 12, tone: 'brand' as const },
          ].map((s) => (
            <Card key={s.lbl}>
              <CardContent className="!p-4">
                <div className="mono text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  {s.lbl}
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="serif text-[36px] font-light leading-none" style={{ color: 'var(--text)' }}>
                    {s.v}%
                  </span>
                  {s.v === 100 && <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />}
                </div>
                <div className="mt-3">
                  <Progress value={s.v} tone={s.tone} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Showcase>
    </div>
  )
}

function KpiSmall({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-md border p-2 text-center" style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}>
      <div className="mono text-[9px] font-bold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
        {label}
      </div>
      <div className="serif mt-0.5 text-[18px] font-light leading-none" style={{ color: 'var(--text)' }}>
        {value} {suffix && <span className="text-[12px]" style={{ color: 'var(--text-mute)' }}>{suffix}</span>}
      </div>
    </div>
  )
}

const ImageIcon2 = ImageIcon
