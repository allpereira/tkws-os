import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckCardOption<T extends string = string> {
  value: T
  title: string
  description?: string
  icon?: React.ReactNode
  /** Disable individual */
  disabled?: boolean
}

export interface CheckCardsProps<T extends string = string> {
  options: CheckCardOption<T>[]
  value: T[]
  onChange: (value: T[]) => void
  /** Limita seleção · ex: max=3 */
  max?: number
  /** grid cols · default 3 */
  cols?: 2 | 3 | 4
  className?: string
}

/**
 * Check Cards · multi-seleção visual com cards. Diferente do RadioCard (1 de N),
 * permite múltiplos selecionados. Use para escolhas contextuais com descrição.
 */
export function CheckCards<T extends string = string>({
  options,
  value,
  onChange,
  max,
  cols = 3,
  className,
}: CheckCardsProps<T>) {
  function toggle(v: T) {
    const isSelected = value.includes(v)
    if (isSelected) {
      onChange(value.filter((x) => x !== v))
    } else {
      if (max !== undefined && value.length >= max) return
      onChange([...value, v])
    }
  }

  return (
    <div
      className={cn(
        'grid gap-3',
        cols === 2 && 'grid-cols-2 max-[760px]:grid-cols-1',
        cols === 3 && 'grid-cols-3 max-[760px]:grid-cols-1',
        cols === 4 && 'grid-cols-4 max-[760px]:grid-cols-2',
        className
      )}
    >
      {options.map((opt) => {
        const selected = value.includes(opt.value)
        const blocked = !selected && max !== undefined && value.length >= max
        return (
          <button
            type="button"
            key={opt.value}
            disabled={opt.disabled || blocked}
            onClick={() => toggle(opt.value)}
            className={cn(
              'group relative grid grid-cols-[auto_1fr] items-start gap-3 rounded-xl border p-4 text-left outline-none transition-all',
              'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            style={{
              background: selected ? 'var(--brand-soft)' : 'var(--surface-2)',
              borderColor: selected ? 'var(--brand)' : 'var(--line-2)',
              cursor: opt.disabled || blocked ? 'not-allowed' : 'pointer',
            }}
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded border"
              style={{
                background: selected ? 'var(--brand)' : 'var(--surface-1)',
                borderColor: selected ? 'var(--brand)' : 'var(--line-3)',
              }}
            >
              {selected && <Check size={12} strokeWidth={3} style={{ color: 'var(--bg)' }} />}
            </span>
            <div>
              {opt.icon && <span className="mb-1.5 inline-flex" style={{ color: selected ? 'var(--brand)' : 'var(--text-mute)' }}>{opt.icon}</span>}
              <div className="text-[13.5px] font-bold" style={{ color: 'var(--text)' }}>
                {opt.title}
              </div>
              {opt.description && (
                <div className="mt-1 text-[12px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                  {opt.description}
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
