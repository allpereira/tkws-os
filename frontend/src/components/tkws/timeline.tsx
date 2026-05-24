import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TimelineItem {
  id: string
  /** mono uppercase · ex: "14 MAR · 09:42" */
  meta: string
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
}

const toneColor: Record<NonNullable<TimelineItem['tone']>, string> = {
  brand: 'var(--brand)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  neutral: 'var(--text-mute)',
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn('relative', className)}>
      {items.map((item, i) => {
        const tone = item.tone ?? 'brand'
        const isLast = i === items.length - 1
        return (
          <li key={item.id} className="grid grid-cols-[28px_1fr] gap-3 pb-5 last:pb-0">
            <div className="relative">
              <span
                className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: toneColor[tone],
                  color: toneColor[tone],
                }}
              >
                {item.icon ?? (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: toneColor[tone] }}
                  />
                )}
              </span>
              {!isLast && (
                <span
                  className="absolute left-[13px] top-7 bottom-[-12px] w-px"
                  style={{ background: 'var(--line-2)' }}
                />
              )}
            </div>
            <div className="pb-2">
              <div
                className="mono text-[10px] font-bold uppercase tracking-[1.4px]"
                style={{ color: 'var(--text-mute)' }}
              >
                {item.meta}
              </div>
              <div
                className="mt-0.5 text-[13.5px] font-semibold"
                style={{ color: 'var(--text)' }}
              >
                {item.title}
              </div>
              {item.description && (
                <div
                  className="mt-1 text-[12.5px] leading-relaxed"
                  style={{ color: 'var(--text-soft)' }}
                >
                  {item.description}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
