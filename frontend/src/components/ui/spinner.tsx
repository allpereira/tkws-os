import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number
  label?: string
}

export function Spinner({ size = 16, label, className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label ?? 'Carregando'}
      className={cn('inline-flex items-center gap-2', className)}
      {...props}
    >
      <Loader2 size={size} className="text-primary animate-spin" strokeWidth={1.8} />
      {label && <span className="text-muted-foreground text-sm">{label}</span>}
    </span>
  )
}
