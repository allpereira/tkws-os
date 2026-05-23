import { PageHeader } from '@/components/docs/PageHeader'
import { SubHead } from '@/components/docs/Showcase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Inspiration {
  name: string
  italic?: string
  who: string
  what: string
  why: string
  tags: string[]
  color: string
}

const inspirations: Inspiration[] = [
  {
    name: 'Linear',
    italic: 'issue tracker',
    who: 'Karri Saarinen + time',
    what: 'Issue tracker que parece editorial. Performance brutal · keyboard-first · animações sutis e propositais.',
    why: 'O patamar de polish que queremos. Toda transição comunica estado. Cmd-K como atalho universal.',
    tags: ['polish', 'keyboard-first', 'motion'],
    color: 'linear-gradient(135deg, #5E6AD2 0%, #8B6FF5 100%)',
  },
  {
    name: 'Arc',
    italic: 'browser',
    who: 'The Browser Company',
    what: 'Browser que repensa abas, sidebar, espaços. Materialidade · brand consistente · pequenos detalhes encantadores.',
    why: 'Como criar produto que sobrepõe a categoria. Espaços = squads no TKWS. Picture-in-picture.',
    tags: ['brand', 'materialidade', 'experimentação'],
    color: 'linear-gradient(135deg, #FF7A45 0%, #FFB47A 100%)',
  },
  {
    name: 'Cron',
    italic: 'calendar (agora Notion Calendar)',
    who: 'Raphael Schaad + Notion',
    what: 'Calendário Mac-class. Atalhos teclado · drag granular · scheduling cross-timezone. Visual editorial denso.',
    why: 'Padrão de densidade Power que respeita whitespace. Calendar como deve ser feito.',
    tags: ['densidade', 'teclado', 'calendar'],
    color: 'linear-gradient(135deg, #1E1E1E 0%, #0F4C81 100%)',
  },
  {
    name: 'Raycast',
    italic: 'launcher',
    who: 'Thomas Paul Mann + time',
    what: 'Spotlight com superpoderes. Extensions · command palette infinito · resultados em tempo real.',
    why: 'Modelo do nosso Command Palette. Extensions = integrações TKWS (SketchUp, Notion).',
    tags: ['command-palette', 'extensibilidade', 'speed'],
    color: 'linear-gradient(135deg, #FF6363 0%, #FF9F45 100%)',
  },
  {
    name: 'Pitch',
    italic: 'apresentações',
    who: 'Christian Reber + time',
    what: 'Slides colaborativos em tempo real. Editor visual de alta qualidade · brand consistente · co-presence sutil.',
    why: 'Como Briefing/Moodboard funcionariam em tempo real com o cliente.',
    tags: ['co-presence', 'editor-visual', 'colaboração'],
    color: 'linear-gradient(135deg, #FF6F61 0%, #FFC76F 100%)',
  },
  {
    name: 'Notion',
    italic: 'docs & wiki',
    who: 'Ivan Zhao + time',
    what: 'Blocos componíveis · banco de dados embarcado · paginação infinita performática.',
    why: 'Como Briefing/Spec deveriam ser componíveis. Database = nosso DataTable + Kanban.',
    tags: ['blocos', 'database-views', 'composable'],
    color: 'linear-gradient(135deg, #000 0%, #303030 100%)',
  },
  {
    name: 'Figma',
    italic: 'design tool',
    who: 'Evan Wallace, Dylan Field',
    what: 'Editor multiplayer rodando no browser. Performance impossível · sincronia perfeita · plugins.',
    why: 'Padrão de colaboração em tempo real. Como Floorplan/Spec poderiam funcionar.',
    tags: ['multiplayer', 'browser-native', 'plugins'],
    color: 'linear-gradient(135deg, #1ABCFE 0%, #A259FF 100%)',
  },
  {
    name: 'Stripe',
    italic: 'pagamentos',
    who: 'Patrick & John Collison',
    what: 'API e dashboard em harmonia. Docs editoriais · forms perfeitos · gráficos sem ruído.',
    why: 'Padrão de financeiro/invoicing. Como o dashboard deve combinar densidade e calma.',
    tags: ['docs', 'forms', 'dashboard'],
    color: 'linear-gradient(135deg, #635BFF 0%, #00D4FF 100%)',
  },
  {
    name: 'Apple HIG',
    italic: 'guidelines',
    who: 'Apple Inc.',
    what: 'Princípio: defaults excelentes · controles secundários escondidos. Materialidade sutil. Type forte.',
    why: 'Whitespace radical. Hierarquia tipográfica. Materialidade como linguagem.',
    tags: ['whitespace', 'hierarquia', 'materialidade'],
    color: 'linear-gradient(135deg, #000 0%, #525252 100%)',
  },
]

export function InspirationsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="P40"
        category="Documentação · Inspirações"
        title="Quem inspira."
        italic="9 produtos referência"
        description="Quando estiver em dúvida sobre uma decisão de UI, abra um destes. Não é para copiar — é para calibrar o patamar de polish e o tom editorial."
        tag={`${inspirations.length} referências`}
      />

      <SubHead num="A" title="Por que cada um" />
      <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {inspirations.map((i) => (
          <Card key={i.name} className="!p-0 overflow-hidden">
            <div className="aspect-[16/10]" style={{ background: i.color }} />
            <CardContent className="!p-5">
              <div className="flex items-baseline gap-2">
                <h3 className="serif text-[22px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                  {i.name}
                </h3>
                {i.italic && (
                  <span className="serif italic text-[14px]" style={{ color: 'var(--text-soft)' }}>
                    · {i.italic}
                  </span>
                )}
              </div>
              <div className="mono mt-1 text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                {i.who}
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                {i.what}
              </p>
              <p className="mt-3 border-t pt-3 text-[12.5px] leading-relaxed" style={{ borderColor: 'var(--line-1)', color: 'var(--text)' }}>
                <b style={{ color: 'var(--brand)' }}>Para nós:</b> {i.why}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {i.tags.map((t) => (
                  <Badge key={t} tone="neutral">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SubHead num="B" title="Anti-inspirações" italic="o que NÃO somos" />
      <div className="grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
        {[
          { lbl: 'ERPs B2B genéricos', why: 'Tabelas densas demais · UX dos anos 2000 · cores random.' },
          { lbl: 'Templates landing-page', why: 'Gradient roxo · animações decorativas · KPIs sem contexto.' },
          { lbl: 'Dashboards "Material" puros', why: 'Densidade Google sem alma · botões redondos por padrão · ripples ruidosos.' },
        ].map((a) => (
          <div
            key={a.lbl}
            className="rounded-xl border p-5"
            style={{ background: 'rgba(235,87,87,0.05)', borderColor: 'var(--danger)' }}
          >
            <div className="mono text-[10px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--danger)' }}>
              ✗ NÃO somos
            </div>
            <h4 className="serif mt-2 text-[18px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
              {a.lbl}
            </h4>
            <p className="mt-2 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
              {a.why}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
