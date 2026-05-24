import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Card · padrão TKWS OS · surface-1 + line-1 + radius 14.
 * Suporta `accent` (brand|success|warning|danger|purple) que pinta a borda esquerda 3px.
 */

type Accent = 'brand' | 'success' | 'warning' | 'danger' | 'purple'

const accentVar: Record<Accent, string> = {
  brand: 'var(--brand)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  purple: 'var(--purple)',
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: Accent
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, accent, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-[14px] border p-5',
        className,
      )}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-1)',
        color: 'var(--text)',
        ...(accent ? { boxShadow: `inset 3px 0 0 ${accentVar[accent]}` } : null),
        ...style,
      }}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-3 flex flex-col gap-1', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('serif text-[18px] font-normal leading-tight', className)}
      style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-[13px] leading-relaxed', className)}
      style={{ color: 'var(--text-soft)' }}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-4 flex items-center justify-end gap-2', className)} {...props} />
}
