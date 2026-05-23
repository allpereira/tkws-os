import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-tag-input:
 *   container flex wrap gap 6 · padding 8/10 · radius 10 · bg surface-2 · border line-2
 *   min-height 44 · focus-within: border brand · bg surface-1
 *   tag: padding 3px 4px 3px 10px · radius 6 · bg brand-soft · border brand · brand 12px/600
 *     x: 16×16 · radius 4 · hover bg rgba(brand, 0.25)
 *   input: flex 1 · min-width 100 · bg transparent · font 13 · padding 4
 *
 * Comportamento:
 *  - Enter (ou Tab) → adiciona tag (limpa input)
 *  - Backspace em input vazio → remove última tag
 *  - Comma → também adiciona tag
 *  - Cada tag dispara onChange com novo array
 */

export interface TagInputProps {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  id?: string
  disabled?: boolean
  className?: string
  /** Permite vírgula como separador */
  commaSeparator?: boolean
  /** Máximo de tags · default ilimitado */
  max?: number
  /** Valida ao adicionar · retornar `false` cancela */
  onBeforeAdd?: (tag: string) => boolean | string
}

export function TagInput({
  value,
  onChange,
  placeholder = 'Adicionar tag · enter para salvar',
  id,
  disabled,
  className,
  commaSeparator = true,
  max,
  onBeforeAdd,
}: TagInputProps) {
  const [draft, setDraft] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const addTag = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return
    if (max !== undefined && value.length >= max) return
    if (value.includes(trimmed)) return
    let tag = trimmed
    if (onBeforeAdd) {
      const r = onBeforeAdd(trimmed)
      if (r === false) return
      if (typeof r === 'string') tag = r
    }
    onChange([...value, tag])
    setDraft('')
  }

  const removeTag = (i: number) => {
    const next = value.slice()
    next.splice(i, 1)
    onChange(next)
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || (commaSeparator && e.key === ',')) {
      if (draft.trim()) {
        e.preventDefault()
        addTag(draft)
      }
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      e.preventDefault()
      removeTag(value.length - 1)
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        'flex min-h-[44px] cursor-text flex-wrap items-center gap-1.5 rounded-[10px] border px-2.5 py-2 transition-all focus-within:[&]:border-[var(--brand)] focus-within:[&]:bg-[var(--surface-1)]',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--line-2)',
      }}
    >
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1.5 rounded-[6px] border px-2.5 py-0.5 text-[12px] font-semibold"
          style={{
            background: 'var(--brand-soft)',
            borderColor: 'var(--brand)',
            color: 'var(--brand)',
            paddingRight: 4,
            paddingLeft: 10,
          }}
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(i)
            }}
            className="inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-[4px] transition-colors hover:bg-[rgba(116,199,228,0.25)]"
            style={{ background: 'transparent', border: 0, color: 'var(--brand)' }}
            aria-label={`Remover ${tag}`}
          >
            <X size={10} strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => draft.trim() && addTag(draft)}
        placeholder={value.length === 0 ? placeholder : ''}
        disabled={disabled}
        className="min-w-[100px] flex-1 bg-transparent p-1 text-[13px] outline-none placeholder:text-[var(--text-mute)]"
        style={{ color: 'var(--text)', border: 0 }}
      />
    </div>
  )
}
