import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'

const samples = [
  {
    label: 'Display · Hero',
    font: 'Fraunces',
    weight: 300,
    size: 76,
    tracking: '-0.04em',
    leading: 1.02,
    css: "font-family:'Fraunces',serif; font-weight:300; letter-spacing:-0.04em;",
    text: 'Para arquitetos.',
  },
  {
    label: 'Heading · Section',
    font: 'Fraunces',
    weight: 400,
    size: 36,
    tracking: '-0.025em',
    leading: 1.08,
    css: "font-family:'Fraunces',serif; font-weight:400; letter-spacing:-0.025em;",
    text: 'O catálogo completo.',
  },
  {
    label: 'Lede · Subhead',
    font: 'Inter',
    weight: 400,
    size: 18,
    leading: 1.55,
    css: "font-family:'Inter',sans-serif; font-weight:400; line-height:1.55;",
    text: 'Construído sobre shadcn/ui + Radix Primitives + Tailwind v4. Acessibilidade resolvida.',
  },
  {
    label: 'Body',
    font: 'Inter',
    weight: 400,
    size: 15,
    leading: 1.55,
    css: "font-family:'Inter',sans-serif; font-weight:400; line-height:1.55;",
    text: 'Texto corrido em parágrafos. Hierarquia por contraste de família, não por tamanho exagerado. O conjunto Fraunces+Inter cria a sensação editorial sem sacrificar legibilidade operacional.',
  },
  {
    label: 'Label · Meta',
    font: 'JetBrains Mono',
    weight: 600,
    size: 11,
    tracking: '1.4px',
    leading: 1.3,
    transform: 'uppercase' as const,
    css: "font-family:'JetBrains Mono',monospace; font-weight:600; letter-spacing:1.4px; text-transform:uppercase;",
    text: '#2410 · Squad Orion · 28/03',
  },
  {
    label: 'KPI · Display number',
    font: 'Fraunces',
    weight: 300,
    size: 56,
    tracking: '-0.04em',
    leading: 1,
    css: "font-family:'Fraunces',serif; font-weight:300; letter-spacing:-0.04em;",
    text: 'R$ 87,4M',
  },
]

export function TypographyPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="04"
        category="Fundamentos · Tipografia"
        title="Três famílias."
        italic="Zero compromisso."
        description="Fraunces (serif editorial) para títulos e KPIs. Inter (geometric humanist) para corpo e UI. JetBrains Mono (mono ligature) para códigos, métricas e timestamps. Nada além disso."
        tag="3 famílias"
      />

      <SubHead num="04.1" title="Escala completa" italic="6 funções tipográficas" tag="display · heading · lede · body · label · kpi" />

      <div className="grid gap-px overflow-hidden rounded-2xl" style={{ background: 'var(--line-1)' }}>
        {samples.map((s, i) => (
          <div
            key={i}
            className="grid grid-cols-[260px_1fr] gap-5 px-6 py-7 max-[760px]:grid-cols-1"
            style={{ background: 'var(--surface-1)' }}
          >
            <div className="flex flex-col gap-1">
              <span
                className="mono text-[10.5px] font-bold uppercase tracking-[1.6px]"
                style={{ color: 'var(--text-mute)' }}
              >
                {s.label}
              </span>
              <span className="serif text-[14px]" style={{ color: 'var(--text-soft)' }}>
                {s.font} · {s.weight}
              </span>
              <code
                className="mono text-[10.5px]"
                style={{ color: 'var(--text-mute)' }}
              >
                {s.size}px · {s.tracking ?? '—'}
              </code>
            </div>
            <div
              style={{
                fontFamily:
                  s.font === 'Fraunces'
                    ? "'Fraunces', Georgia, serif"
                    : s.font === 'Inter'
                    ? "'Inter', sans-serif"
                    : "'JetBrains Mono', monospace",
                fontWeight: s.weight,
                fontSize: `${s.size}px`,
                letterSpacing: s.tracking,
                lineHeight: s.leading,
                textTransform: s.transform,
                color: 'var(--text)',
              }}
            >
              {s.text}
            </div>
          </div>
        ))}
      </div>

      <SubHead num="04.2" title="Combinações" italic="quando misturar" tag="hierarquia" />

      <Showcase
        title="Title + meta inline"
        description="Padrão TKWS para card heads — Fraunces no nome, Mono na meta."
      >
        <div>
          <h4 className="serif text-[24px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
            Yachthouse 2104 <em className="italic" style={{ color: 'var(--text-soft)' }}>· Família Andrade</em>
          </h4>
          <div className="mono mt-1 text-[11px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
            #2410 · rev.0 · BC/SC · 280 m²
          </div>
        </div>
      </Showcase>
    </div>
  )
}
