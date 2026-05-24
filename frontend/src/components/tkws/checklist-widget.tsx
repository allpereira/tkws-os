import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-checklist:
 *   container bg surface-1 · border line-2 · radius 14px · shadow-3 · max-w 340px
 *   header: padding 14/18 · border-bottom line-1 · gradient brand-soft → transparent
 *     h5: Fraunces 17px · em italic brand
 *     progress-pill: mono 10.5px · bg surface-2 · radius 999px · padding 3/8
 *   body: padding 8px 0
 *   row: grid 20px 1fr auto · gap 12 · padding 10/18 · border-bottom line-1
 *     done: body text-mute line-through · check bg success
 *     current: check border brand bg brand-soft · go border+color brand
 *     check: 18×18 radius 50% border 1.5px line-3
 *     body: 13px text · meta 11px text-mute
 *     go: mono 10px · bg transparent · border line-2 · radius 999 · padding 3/8
 */

export interface ChecklistItem {
  id: string
  title: React.ReactNode
  meta?: React.ReactNode
  /** Estado · default 'pending' */
  state?: 'pending' | 'current' | 'done'
  /** Texto à direita · ex: "+5pt", "→", "10min" */
  trailing?: React.ReactNode
}

export interface ChecklistWidgetProps {
  title: React.ReactNode
  /** Texto em italic do título · `<em>` */
  italic?: string
  items: ChecklistItem[]
  /** Progresso · ex: "3 de 6" — derivado automaticamente se omitido */
  progress?: string
  onSelect?: (id: string) => void
  className?: string
}

export function ChecklistWidget({
  title,
  italic,
  items,
  progress,
  onSelect,
  className,
}: ChecklistWidgetProps) {
  const total = items.length
  const done = items.filter((i) => i.state === 'done').length
  const progressLabel = progress ?? `${done} de ${total}`

  return (
    <div
      className={cn('max-w-[340px] overflow-hidden rounded-[14px] border', className)}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-2)',
        boxShadow: 'var(--shadow-3)',
      }}
    >
      <div
        className="flex items-center justify-between border-b px-[18px] py-3.5"
        style={{
          borderColor: 'var(--line-1)',
          background: 'linear-gradient(135deg, var(--brand-soft), transparent)',
        }}
      >
        <h5
          className="serif text-[17px] font-normal"
          style={{ color: 'var(--text)', letterSpacing: '-0.015em' }}
        >
          {title}
          {italic && (
            <em className="italic font-normal" style={{ color: 'var(--brand)' }}>
              {' '}
              {italic}
            </em>
          )}
        </h5>
        <span
          className="mono rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
          style={{ background: 'var(--surface-2)', color: 'var(--text-soft)' }}
        >
          {progressLabel}
        </span>
      </div>

      <div className="py-2">
        {items.map((item, i) => {
          const state = item.state ?? 'pending'
          const isLast = i === items.length - 1
          return (
            <div
              key={item.id}
              onClick={() => onSelect?.(item.id)}
              className={cn(
                'grid cursor-pointer grid-cols-[20px_1fr_auto] items-center gap-3 px-[18px] py-2.5 transition-colors hover:bg-[var(--surface-2)]',
                !isLast && 'border-b'
              )}
              style={{ borderColor: 'var(--line-1)' }}
            >
              <span
                className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px]"
                style={{
                  borderColor:
                    state === 'done'
                      ? 'var(--success)'
                      : state === 'current'
                      ? 'var(--brand)'
                      : 'var(--line-3)',
                  background:
                    state === 'done'
                      ? 'var(--success)'
                      : state === 'current'
                      ? 'var(--brand-soft)'
                      : 'transparent',
                }}
              >
                {state === 'done' && <Check size={10} strokeWidth={3} style={{ color: 'var(--bg)' }} />}
              </span>
              <div>
                <div
                  className={cn(
                    'text-[13px] font-medium',
                    state === 'done' && 'line-through decoration-1'
                  )}
                  style={{
                    color: state === 'done' ? 'var(--text-mute)' : 'var(--text)',
                  }}
                >
                  {item.title}
                </div>
                {item.meta && (
                  <div
                    className="mt-0.5 text-[11px] font-normal"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    {item.meta}
                  </div>
                )}
              </div>
              {item.trailing && (
                <span
                  className="mono rounded-full border px-2 py-0.5 text-[10px]"
                  style={{
                    borderColor: state === 'current' ? 'var(--brand)' : 'var(--line-2)',
                    color: state === 'current' ? 'var(--brand)' : 'var(--text-mute)',
                  }}
                >
                  {item.trailing}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
