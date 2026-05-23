import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-card:
 *   background surface-1 · border 1px solid line-2 · radius 14px · padding 20px
 *   transition 0.18s · hover translateY(-2px) + border line-3 + shadow-2
 *   head, title (15px/700), sub (12px/text-mute), body (13px), foot (border-top line-1)
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'selected'
  accent?: 'brand' | 'purple' | 'pink' | 'success' | 'warning' | 'alert' | 'danger'
}

const accentColor: Record<NonNullable<CardProps['accent']>, string> = {
  brand: 'var(--brand)',
  purple: 'var(--purple)',
  pink: 'var(--pink)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  alert: 'var(--alert)',
  danger: 'var(--danger)',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', accent, style, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const isHover = variant === 'hover'
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[14px] border p-5 transition-all duration-[180ms] ease-out',
          isHover && 'cursor-pointer',
          variant === 'selected' && 'ring-2 ring-[var(--brand)]',
          className
        )}
        style={{
          background: 'var(--surface-1)',
          borderColor: 'var(--line-2)',
          borderLeftWidth: accent ? '3px' : '1px',
          borderLeftColor: accent ? accentColor[accent] : 'var(--line-2)',
          ...style,
        }}
        onMouseEnter={(e) => {
          if (isHover) {
            const el = e.currentTarget
            el.style.transform = 'translateY(-2px)'
            el.style.borderColor = 'var(--line-3)'
            el.style.boxShadow = 'var(--shadow-2)'
          }
          onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          if (isHover) {
            const el = e.currentTarget
            el.style.transform = 'translateY(0)'
            el.style.borderColor = 'var(--line-2)'
            el.style.boxShadow = ''
          }
          onMouseLeave?.(e)
        }}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mb-3 flex items-start justify-between gap-3', className)}
      {...props}
    />
  )
}

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-[15px] font-bold leading-tight', className)}
    style={{ color: 'var(--text)' }}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('mt-0.5 text-[12px]', className)}
      style={{ color: 'var(--text-mute)' }}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('text-[13px] leading-[1.55]', className)}
      style={{ color: 'var(--text-soft)' }}
      {...props}
    />
  )
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-3.5 flex items-center justify-between pt-3 text-[12px]', className)}
      style={{ borderTop: '1px solid var(--line-1)', color: 'var(--text-mute)' }}
      {...props}
    />
  )
}
