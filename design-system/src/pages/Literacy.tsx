import { Brain, KeyRound, MousePointer2 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { SubHead } from '@/components/docs/Showcase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Level {
  id: 'power' | 'standard' | 'guided'
  label: string
  italic: string
  icon: React.ReactNode
  color: string
  characteristics: string[]
  examples: string[]
  components: string[]
  density: string
}

const levels: Level[] = [
  {
    id: 'power',
    label: 'Power',
    italic: 'densidade alta · keyboard-first',
    icon: <KeyRound size={18} />,
    color: 'var(--purple)',
    characteristics: [
      'Atalhos teclado para tudo (⌘K, ⌘Enter, ⌘P…)',
      'DataTables ricas · 30+ linhas visíveis',
      'Menubar style desktop',
      'Context menu (right-click) ativo',
      'Densidade 12-13px em texto operacional',
    ],
    examples: [
      'Líder de squad gerenciando 20 projetos',
      'Diretor criativo no Dashboard',
      'Plugin SketchUp (paradigma desktop)',
      'Modo Power do app TKWS OS',
    ],
    components: ['DataTable', 'Kanban swimlanes', 'Menubar', 'ContextMenu', 'Command Palette', 'Resizable'],
    density: '12-13px · spacing 8-12px · 50 rows/screen',
  },
  {
    id: 'standard',
    label: 'Standard',
    italic: 'densidade média · clique + teclado',
    icon: <MousePointer2 size={18} />,
    color: 'var(--brand)',
    characteristics: [
      'Atalhos opcionais · UI completa visível',
      'RichList ou Kanban single-row',
      'Sidebar com ícones + labels',
      'Tabs underline para navegação interna',
      'Densidade 13-14px em texto',
    ],
    examples: [
      'Arquiteto pleno em projeto',
      'Designer de interiores em moodboard',
      'Gestor de obra em punch list',
      'Fornecedor no portal de cotações',
    ],
    components: ['RichList', 'Card', 'Kanban', 'Sheet', 'Tabs (pill + underline)'],
    density: '13-14px · spacing 12-16px · 15 rows/screen',
  },
  {
    id: 'guided',
    label: 'Guided',
    italic: 'densidade baixa · linguagem natural',
    icon: <Brain size={18} />,
    color: 'var(--warning)',
    characteristics: [
      'Cards grandes · 1 ação principal por tela',
      'Sem jargão TKWS · linguagem do cliente',
      'CTAs gigantes · 14px+ · cor brand',
      'Sem datatable · sem menubar · sem command palette',
      'Densidade 15-16px em texto',
    ],
    examples: [
      'Cliente final no portal',
      'CEO de empresa contratante revisando status',
      'Onboarding de qualquer persona',
      'Páginas públicas (landing, marketing)',
    ],
    components: ['DetailHero', 'Card grande', 'EmptyState', 'GoalRing', 'Timeline', 'Alert'],
    density: '15-16px · spacing 18-28px · 3 ações/tela',
  },
]

export function LiteracyPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="P38"
        category="Documentação · Densidades"
        title="Cultura digital"
        italic="3 níveis de densidade"
        description="O TKWS OS roda em 3 densidades sobre o mesmo data model. Você ESCOLHE a densidade pela persona, não pelo capricho. Power, Standard e Guided convivem na mesma plataforma."
        tag="Power · Standard · Guided"
      />

      <div className="mb-7 grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
        {levels.map((l) => (
          <Card key={l.id} className="!p-0 overflow-hidden">
            <div className="flex items-center gap-3 p-5" style={{ background: `linear-gradient(135deg, ${l.color}22 0%, transparent 60%)` }}>
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: l.color, color: 'var(--bg)' }}
              >
                {l.icon}
              </span>
              <div>
                <h3 className="serif text-[22px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                  {l.label}
                </h3>
                <div className="mono text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  {l.italic}
                </div>
              </div>
            </div>
            <CardContent className="!p-5">
              <div
                className="mono mb-3 text-[10px] font-bold uppercase tracking-[1.4px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Características
              </div>
              <ul className="space-y-2">
                {l.characteristics.map((c, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[16px_1fr] gap-2 text-[12.5px] leading-relaxed"
                    style={{ color: 'var(--text-soft)' }}
                  >
                    <span style={{ color: l.color }}>•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <div
                className="mono mt-4 rounded-md border p-2.5 text-[10px] font-bold uppercase tracking-[1.4px]"
                style={{ background: 'var(--surface-2)', borderColor: l.color, color: l.color }}
              >
                {l.density}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SubHead num="A" title="Quando usar cada um" />
      {levels.map((l) => (
        <section
          key={l.id}
          className="mb-5 rounded-xl border p-5"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Badge tone={l.id === 'power' ? 'purple' : l.id === 'standard' ? 'brand' : 'warning'}>{l.label}</Badge>
            <span className="serif text-[18px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
              Use quando…
            </span>
          </div>

          <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
            <div>
              <div className="mono mb-2 text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                Exemplos de uso
              </div>
              <ul className="space-y-1.5">
                {l.examples.map((e, i) => (
                  <li key={i} className="text-[13px]" style={{ color: 'var(--text-soft)' }}>
                    · {e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mono mb-2 text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                Componentes típicos
              </div>
              <div className="flex flex-wrap gap-1.5">
                {l.components.map((c) => (
                  <Badge key={c} tone="neutral">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
