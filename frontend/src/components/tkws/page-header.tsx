import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  crumb?: string
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ crumb, title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-4 border-b pb-4', className)}>
      <div className="flex-1 min-w-0">
        {crumb && (
          <div className="text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-wider">
            {crumb}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  )
}
