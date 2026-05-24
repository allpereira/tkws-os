import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  as?: 'h2' | 'h3' | 'h4'
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  as: Heading = 'h3',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-[14px] border px-6 py-14 text-center',
        className,
      )}
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
        >
          {icon}
        </div>
      )}
      <Heading
        className="serif text-[20px] font-normal leading-tight"
        style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
      >
        {title}
      </Heading>
      {description && (
        <p className="max-w-md text-[13px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
