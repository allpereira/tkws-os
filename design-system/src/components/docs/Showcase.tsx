import { type ReactNode, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · demo-card:
 *   bg surface-1 · border 1px line-1 · radius 14px · padding 24px · mb 16px
 *   demo-title: mono 10px tracking 1.5px uppercase text-mute weight 600 mb 14px
 *   demo-canvas: padding 24px · bg surface-2 · radius 10px
 */

type Props = {
  title?: string
  description?: string
  children: ReactNode
  code?: string
  className?: string
  /** Padding do canvas interno · default usa o padrão do HTML (24px). */
  padding?: 'comfortable' | 'compact' | 'none'
  /** Cor de fundo do canvas · default surface-2 (fiel ao HTML). */
  bg?: 'surface-1' | 'surface-2' | 'bg'
}

export function Showcase({
  title,
  description,
  children,
  code,
  className,
  padding = 'comfortable',
  bg = 'surface-2',
}: Props) {
  const [copied, setCopied] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const copy = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section
      className={cn(
        'mb-4 overflow-hidden rounded-[14px] border p-6 max-[760px]:p-4',
        className
      )}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-1)',
      }}
    >
      {(title || description || code) && (
        <header className="mb-[14px] flex items-center justify-between gap-3">
          <div>
            {title && (
              <div
                className="mono text-[10px] font-semibold uppercase tracking-[1.5px]"
                style={{ color: 'var(--text-mute)' }}
              >
                {title}
              </div>
            )}
            {description && (
              <div
                className="mt-1 text-[12.5px]"
                style={{ color: 'var(--text-soft)' }}
              >
                {description}
              </div>
            )}
          </div>
          {code && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowCode((s) => !s)}
                className="mono cursor-pointer rounded-[6px] border px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all"
                style={{
                  background: showCode ? 'var(--brand-soft)' : 'var(--surface-2)',
                  borderColor: showCode ? 'var(--brand)' : 'var(--line-2)',
                  color: showCode ? 'var(--brand)' : 'var(--text-soft)',
                }}
              >
                {showCode ? 'Esconder código' : '< / > Código'}
              </button>
              <button
                onClick={copy}
                aria-label="Copiar código"
                className="inline-flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-[6px] border transition-all hover:brightness-125"
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--line-2)',
                  color: copied ? 'var(--success)' : 'var(--text-soft)',
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>
          )}
        </header>
      )}

      {/* Canvas interno · surface-2 · radius 10 · padding 24 */}
      <div
        className={cn(
          'rounded-[10px]',
          padding === 'comfortable' && 'p-6 max-[760px]:p-4',
          padding === 'compact' && 'p-4',
          padding === 'none' && 'p-0'
        )}
        style={{
          background:
            bg === 'surface-1'
              ? 'var(--surface-1)'
              : bg === 'bg'
              ? 'var(--bg)'
              : 'var(--surface-2)',
        }}
      >
        {children}
      </div>

      {code && showCode && (
        <div className="mt-4 border-t" style={{ borderColor: 'var(--line-1)' }}>
          <pre
            className="mono mt-4 overflow-x-auto rounded-[10px] p-5 text-[12px] leading-relaxed"
            style={{
              background: 'var(--bg)',
              color: 'var(--text-soft)',
              maxHeight: 420,
            }}
          >
            <code>{code}</code>
          </pre>
        </div>
      )}
    </section>
  )
}

/**
 * Sub-head · 06.X numerator + title + tag
 * Fiel ao HTML · sub-head:
 *   mono 11px tracking 1.5px (mas usei 10px/1.5px fiel)
 */
export function SubHead({ num, title, italic, tag }: { num: string; title: string; italic?: string; tag?: string }) {
  return (
    <div
      className="mb-4 mt-12 flex items-baseline gap-3 border-b pb-2.5"
      style={{ borderColor: 'var(--line-1)' }}
    >
      <span
        className="mono text-[10.5px] font-bold uppercase tracking-[1.5px]"
        style={{ color: 'var(--brand)' }}
      >
        {num}
      </span>
      <h3
        className="serif text-[22px] font-normal tracking-tight"
        style={{ color: 'var(--text)' }}
      >
        {title}
        {italic && (
          <em className="italic" style={{ color: 'var(--text-soft)' }}>
            {' '}
            · {italic}
          </em>
        )}
      </h3>
      {tag && (
        <span
          className="mono ml-auto rounded-[6px] border px-1.5 py-0.5 text-[9.5px] font-semibold"
          style={{ background: 'var(--surface-2)', color: 'var(--text-mute)', borderColor: 'var(--line-1)' }}
        >
          {tag}
        </span>
      )}
    </div>
  )
}
