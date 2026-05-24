import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ClipboardProps {
  value: string
  className?: string
  /** Texto opcional ao lado do ícone */
  label?: string
  /** Default 'icon' (botão pequeno) · 'inline' (input + botão) */
  variant?: 'icon' | 'inline'
}

export function Clipboard({ value, label, variant = 'icon', className }: ClipboardProps) {
  const [copied, setCopied] = React.useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (variant === 'inline') {
    return (
      <div
        className={cn('inline-flex items-stretch overflow-hidden rounded-md border', className)}
        style={{ borderColor: 'var(--line-2)' }}
      >
        <input
          readOnly
          value={value}
          className="mono w-full bg-transparent px-3 py-1.5 text-[12.5px] outline-none"
          style={{ color: 'var(--text-soft)' }}
        />
        <button
          onClick={copy}
          aria-label="Copiar"
          className="flex shrink-0 cursor-pointer items-center gap-1.5 border-l px-3 text-[11.5px] font-semibold transition-colors"
          style={{
            background: copied ? 'var(--success)' : 'var(--surface-2)',
            borderColor: 'var(--line-2)',
            color: copied ? 'var(--bg)' : 'var(--text-soft)',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'OK' : 'Copiar'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={copy}
      aria-label="Copiar"
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors',
        className
      )}
      style={{
        background: copied ? 'var(--success)' : 'var(--surface-2)',
        borderColor: copied ? 'var(--success)' : 'var(--line-2)',
        color: copied ? 'var(--bg)' : 'var(--text-soft)',
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {label ?? (copied ? 'Copiado' : 'Copiar')}
    </button>
  )
}
