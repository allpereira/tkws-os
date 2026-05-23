import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'brand'
  /** Nível do heading · default 'h2' · ajuste para respeitar hierarquia da página */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  className?: string
}

const toneBg: Record<NonNullable<EmptyStateProps['tone']>, string> = {
  neutral: 'var(--surface-2)',
  brand: 'var(--brand-soft)',
  success: 'rgba(95,217,165,0.12)',
  warning: 'rgba(242,201,76,0.14)',
  danger: 'rgba(235,87,87,0.12)',
}
const toneColor: Record<NonNullable<EmptyStateProps['tone']>, string> = {
  neutral: 'var(--text-mute)',
  brand: 'var(--brand)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = 'neutral',
  as: Heading = 'h2',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-2xl border px-6 py-12 text-center',
        'bg-surface-1 border-line-1',
        className
      )}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: toneBg[tone], color: toneColor[tone] }}
        >
          {icon}
        </div>
      )}
      <Heading className="serif text-text text-[20px] font-normal tracking-tight">
        {title}
      </Heading>
      {description && (
        <p className="text-soft max-w-md text-[13.5px] leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
