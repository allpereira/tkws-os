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

export function EmptyState({ icon, title, description, action, className, as: Heading = 'h3' }: EmptyStateProps) {
  return (
    <div className={cn('bg-card flex flex-col items-center gap-3 rounded-lg border px-6 py-12 text-center', className)}>
      {icon && (
        <div aria-hidden="true" className="bg-muted text-muted-foreground flex h-14 w-14 items-center justify-center rounded-full">
          {icon}
        </div>
      )}
      <Heading className="text-lg font-semibold">{title}</Heading>
      {description && <p className="text-muted-foreground max-w-md text-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
