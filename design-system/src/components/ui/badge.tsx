import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-badge:
 *   padding 3px 9px · radius 999px · font 10.5px · weight 700
 *   letter-spacing 0.4px · uppercase · border 1px solid currentColor
 *   SEM background fill · só texto + border na cor (era erro anterior).
 */

export type BadgeTone =
  | 'success'
  | 'warning'
  | 'alert'
  | 'danger'
  | 'brand'
  | 'purple'
  | 'pink'
  | 'neutral'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  /** dot · usado com badge para indicar status pulsante */
  pulse?: boolean
}

const toneColor: Record<BadgeTone, string> = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  alert: 'var(--alert)',
  danger: 'var(--danger)',
  brand: 'var(--brand)',
  purple: 'var(--purple)',
  pink: 'var(--pink)',
  neutral: 'var(--text-mute)',
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ tone = 'brand', pulse, className, children, style, ...props }, ref) => {
    const color = toneColor[tone]
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-2.5 py-[3px] text-[10.5px] font-bold uppercase leading-none tracking-[0.4px]',
          className
        )}
        style={{
          color,
          borderColor: color,
          background: 'transparent',
          ...style,
        }}
        {...props}
      >
        {pulse && (
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              background: 'currentColor',
              animation: 'alive-breathe 2.2s ease-in-out infinite',
            }}
          />
        )}
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'
