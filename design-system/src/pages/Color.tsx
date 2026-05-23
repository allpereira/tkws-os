import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { SubHead } from '@/components/docs/Showcase'

type Swatch = { name: string; cssVar: string; hex: string; description?: string }

const surfaces: Swatch[] = [
  { name: '--bg', cssVar: 'var(--bg)', hex: '#061828', description: 'Canvas · fundo base' },
  { name: '--surface-1', cssVar: 'var(--surface-1)', hex: '#08263F', description: 'Cards · containers principais' },
  { name: '--surface-2', cssVar: 'var(--surface-2)', hex: '#0A2F4D', description: 'Inputs · áreas internas' },
  { name: '--surface-3', cssVar: 'var(--surface-3)', hex: '#0E3A5E', description: 'Hover · elevated' },
  { name: '--surface-4', cssVar: 'var(--surface-4)', hex: '#103E66', description: 'Strongest · destaques' },
]

const brand: Swatch[] = [
  { name: '--brand', cssVar: 'var(--brand)', hex: '#74C7E4', description: 'Acento principal · ações primárias' },
  { name: '--brand-h', cssVar: 'var(--brand-h)', hex: '#7FD3F0', description: 'Hover' },
  { name: '--brand-p', cssVar: 'var(--brand-p)', hex: '#5BA5C2', description: 'Pressed' },
  { name: '--brand-soft', cssVar: 'var(--brand-soft)', hex: 'rgba(116,199,228,0.14)', description: 'Background suave · seleção' },
]

const ink: Swatch[] = [
  { name: '--text', cssVar: 'var(--text)', hex: '#F5FAFC', description: 'Títulos, valor primário' },
  { name: '--text-soft', cssVar: 'var(--text-soft)', hex: '#B6C5D4', description: 'Body, descrição' },
  { name: '--text-mute', cssVar: 'var(--text-mute)', hex: '#7F94A8', description: 'Labels, meta' },
]

const semantic: Swatch[] = [
  { name: '--success', cssVar: 'var(--success)', hex: '#5FD9A5', description: 'No prazo · OK · concluído' },
  { name: '--warning', cssVar: 'var(--warning)', hex: '#F2C94C', description: 'Atenção · revisar' },
  { name: '--alert', cssVar: 'var(--alert)', hex: '#F2994A', description: 'Risco · ação necessária' },
  { name: '--danger', cssVar: 'var(--danger)', hex: '#EB5757', description: 'Atrasado · erro · crítico' },
]

const taxonomy: Swatch[] = [
  { name: '--purple', cssVar: 'var(--purple)', hex: '#BB6BD9', description: 'Squad Orion · signature' },
  { name: '--pink', cssVar: 'var(--pink)', hex: '#F178B6', description: 'Squad Apollo · marketing' },
]

function SwatchCard({ s }: { s: Swatch }) {
  const [copied, setCopied] = useState(false)
  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
    >
      <div className="h-24 w-full" style={{ background: s.cssVar }} />
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="min-w-0">
          <code className="mono block text-[11.5px] font-bold" style={{ color: 'var(--text)' }}>
            {s.name}
          </code>
          <code className="mono block text-[10px]" style={{ color: 'var(--text-mute)' }}>
            {s.hex}
          </code>
        </div>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(`var(${s.name})`)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
          }}
          aria-label="Copiar variável"
          className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors"
          style={{
            background: 'var(--surface-2)',
            color: copied ? 'var(--success)' : 'var(--text-soft)',
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>
      </div>
      {s.description && (
        <div
          className="border-t px-3 py-2 text-[11.5px]"
          style={{ borderColor: 'var(--line-1)', color: 'var(--text-mute)' }}
        >
          {s.description}
        </div>
      )}
    </div>
  )
}

function Grid({ items }: { items: Swatch[] }) {
  return (
    <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-2">
      {items.map((s) => (
        <SwatchCard key={s.name} s={s} />
      ))}
    </div>
  )
}

export function ColorPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="05"
        category="Fundamentos · Cor"
        title="Navy + cyan + 6 semânticas."
        italic="Nada além."
        description="Cores existem para classificar — status, squad, severidade. Nunca para decorar. Toda variável tem versão dark/light e é acessada via CSS var(). Hex inline está proibido (anti-pattern)."
        tag="paleta disciplinada"
      />

      <SubHead num="05.1" title="Surfaces" italic="navy base · 5 níveis" tag="bg → surface-4" />
      <Grid items={surfaces} />

      <SubHead num="05.2" title="Brand" italic="único acento · TKWS cyan" tag="default / hover / pressed / soft" />
      <Grid items={brand} />

      <SubHead num="05.3" title="Ink" italic="3 níveis de texto" tag="text → text-soft → text-mute" />
      <Grid items={ink} />

      <SubHead num="05.4" title="Semantic" italic="status e severidade" tag="success / warning / alert / danger" />
      <Grid items={semantic} />

      <SubHead num="05.5" title="Taxonomy" italic="classificação visual de squads" tag="purple · Orion · pink · Apollo" />
      <Grid items={taxonomy} />
    </div>
  )
}
