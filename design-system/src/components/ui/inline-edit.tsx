import * as React from 'react'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-cell-edit:
 *   default: padding 4/8 · radius 5 · hover bg brand-soft + ✎ pencil brand
 *   editing: bg surface-1 · border brand · padding 4/6 · shadow 0 0 0 2px brand-soft
 *     input: bg transparent · border 0 · font inherit/13px · outline none
 *
 * Comportamento:
 *  - Click → entra em modo edit
 *  - Enter / blur → commit
 *  - Escape → cancela (volta valor anterior)
 */

export interface InlineEditProps {
  value: string
  onChange: (next: string) => void
  /** Renderiza valor com style customizado (cor/peso) · default span do texto */
  display?: (value: string) => React.ReactNode
  /** Tipo do input · text · number */
  type?: 'text' | 'number'
  className?: string
  /** Largura do input em edit mode (px) · default fit-content */
  width?: number
  /** Alinhamento do texto · default left */
  align?: 'left' | 'right' | 'center'
}

export function InlineEdit({
  value,
  onChange,
  display,
  type = 'text',
  className,
  width,
  align = 'left',
}: InlineEditProps) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (editing) {
      setDraft(value)
      requestAnimationFrame(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      })
    }
  }, [editing, value])

  const commit = () => {
    onChange(draft)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-[5px]',
          className
        )}
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--brand)',
          padding: '4px 6px',
          boxShadow: '0 0 0 2px var(--brand-soft)',
        }}
      >
        <input
          ref={inputRef}
          type={type}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            else if (e.key === 'Escape') cancel()
          }}
          className="num-tabular bg-transparent text-[13px] outline-none"
          style={{
            color: 'var(--text)',
            border: 0,
            width: width ?? 'auto',
            textAlign: align,
          }}
        />
      </span>
    )
  }

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={`Editar ${value}`}
      onClick={() => setEditing(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setEditing(true)
        }
      }}
      className={cn(
        'group inline-flex cursor-pointer items-center gap-1.5 rounded-[5px] px-2 py-1 outline-none transition-colors',
        'hover:bg-[var(--brand-soft)]',
        'focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60',
        className
      )}
    >
      <span style={{ textAlign: align }}>{display ? display(value) : value}</span>
      <Pencil
        aria-hidden="true"
        size={10}
        className="text-brand opacity-0 transition-opacity group-hover:opacity-100"
      />
    </span>
  )
}
