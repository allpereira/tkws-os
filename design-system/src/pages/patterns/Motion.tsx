import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Pattern · Motion (linguagem)',
  import: "import { motion, AnimatePresence } from 'motion/react'",
  contexto:
    'Motion é LINGUAGEM, não decoração. 3 curvas + 4 durações TKWS. Toda transição comunica estado. SEMPRE respeite prefers-reduced-motion via useReducedMotion(). Use AnimatePresence para entrada/saída de elementos.',
  quandoUsar: [
    'Modal abrir/fechar (fade + scale)',
    'Tab change (slide horizontal)',
    'List add/remove (stagger)',
    'Page transition (editorial · 300ms)',
  ],
  props: [],
  antiPatterns: [
    'Animação decorativa (brilho pulsando sem motivo) · proibido',
    'Duração > 500ms em interação · UX trava',
    'Ignorar prefers-reduced-motion · barreira de acessibilidade',
    'Bounce/elastic em UI séria · perde tom editorial',
  ],
  exemplo: `// 3 curvas TKWS:
const ease = {
  default: [0.4, 0.2, 0.2, 1],      // ease-out moderno · 200ms
  snap: [0.6, 0.05, 0.4, 1.4],      // overshoot pequeno · switches
  editorial: [0.25, 0.46, 0.45, 0.94] // chegada calma · page transitions
}

<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: ease.editorial }}
/>`,
  relacionados: ['Dialog', 'Sheet', 'BulkActionBar'],
}

const curves = [
  { name: 'default', val: 'cubic-bezier(.4, .2, .2, 1)', use: 'ease-out moderno · 200ms · maioria das transições UI' },
  { name: 'snap', val: 'cubic-bezier(.6, .05, .4, 1.4)', use: 'overshoot pequeno · switches, toggles' },
  { name: 'editorial', val: 'cubic-bezier(.25, .46, .45, .94)', use: 'chegada calma · page transitions, hero' },
]

const durations = [
  { ms: 150, lbl: 'Micro-interações', use: 'hover, focus, click feedback' },
  { ms: 200, lbl: 'Estados de UI', use: 'tab troca, dropdown abre' },
  { ms: 300, lbl: 'Transições de página', use: 'rota nova, modal entrada' },
  { ms: 500, lbl: 'Hero · editorial', use: 'splash, login, KPIs preenchendo' },
]

export function MotionPattern() {
  const [show, setShow] = useState(true)
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="P30b"
        category="Pattern · Motion"
        title="Motion · linguagem"
        italic="3 curvas · 4 durações"
        description="Animação como linguagem, não decoração. Toda transição comunica estado. Respeite prefers-reduced-motion."
        tag="motion library"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="3 curvas TKWS" />
      <Showcase>
        <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          {curves.map((c) => (
            <Card key={c.name}>
              <Badge tone="brand">{c.name}</Badge>
              <code className="mono mt-3 block break-all text-[10.5px] font-bold" style={{ color: 'var(--text)' }}>
                {c.val}
              </code>
              <p className="mt-2 text-[12px]" style={{ color: 'var(--text-soft)' }}>
                {c.use}
              </p>
            </Card>
          ))}
        </div>
      </Showcase>

      <SubHead num="B" title="4 durações" />
      <Showcase>
        <div className="grid grid-cols-4 gap-3 max-[760px]:grid-cols-2">
          {durations.map((d) => (
            <Card key={d.ms}>
              <div className="serif text-[40px] font-light leading-none" style={{ color: 'var(--brand)' }}>
                {d.ms}
                <span className="mono ml-1 text-[14px]" style={{ color: 'var(--text-mute)' }}>ms</span>
              </div>
              <div className="mono mt-2 text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                {d.lbl}
              </div>
              <p className="mt-2 text-[12px]" style={{ color: 'var(--text-soft)' }}>
                {d.use}
              </p>
            </Card>
          ))}
        </div>
      </Showcase>

      <SubHead num="C" title="Exemplos vivos" italic="clique e veja a animação" />
      <Showcase>
        <div className="flex flex-col items-start gap-4">
          <Button onClick={() => setShow((s) => !s)}>
            {show ? 'Esconder' : 'Mostrar'} elemento
          </Button>

          <AnimatePresence mode="wait">
            {show && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="rounded-2xl border p-7 shadow-2xl"
                style={{
                  background:
                    'linear-gradient(135deg, var(--brand-soft) 0%, transparent 60%), var(--surface-1)',
                  borderColor: 'var(--brand)',
                  width: 320,
                }}
              >
                <div className="mono text-[10px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--brand)' }}>
                  Editorial curve · 300ms
                </div>
                <div className="serif mt-2 text-[24px] font-light tracking-tight" style={{ color: 'var(--text)' }}>
                  Chegada calma.
                </div>
                <p className="mt-2 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                  Use motion para comunicar estado · não para decorar.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Showcase>

      <SubHead num="D" title="Stagger · lista que entra em cascata" />
      <Showcase>
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-2"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.li
              key={i}
              variants={{
                hidden: { opacity: 0, x: -12 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.4, 0.2, 0.2, 1] } },
              }}
              className="rounded-md border p-3"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
            >
              <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
                Item {i + 1}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </Showcase>
    </div>
  )
}
