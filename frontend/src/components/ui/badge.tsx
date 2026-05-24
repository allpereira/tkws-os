import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Badge · padrão TKWS OS · tons soft (bg-soft + cor).
 *
 * Tons: brand · success · warning · alert · danger · purple · pink · neutral
 * Aliases compat: default→brand · secondary→neutral · destructive→danger · outline→outline
 */

export type BadgeTone =
  | 'brand'
  | 'success'
  | 'warning'
  | 'alert'
  | 'danger'
  | 'purple'
  | 'pink'
  | 'neutral'
  | 'outline'

export type BadgeVariant =
  | BadgeTone
  | 'default'
  | 'secondary'
  | 'destructive'

const toneStyle: Record<BadgeTone, React.CSSProperties> = {
  brand:   { background: 'var(--brand-soft)', color: 'var(--brand)', border: '1px solid transparent' },
  success: { background: 'rgba(95, 217, 165, 0.14)', color: 'var(--success)', border: '1px solid transparent' },
  warning: { background: 'rgba(242, 201, 76, 0.14)', color: 'var(--warning)', border: '1px solid transparent' },
  alert:   { background: 'rgba(242, 153, 74, 0.14)', color: 'var(--alert)', border: '1px solid transparent' },
  danger:  { background: 'rgba(235, 87, 87, 0.14)', color: 'var(--danger)', border: '1px solid transparent' },
  purple:  { background: 'rgba(187, 107, 217, 0.14)', color: 'var(--purple)', border: '1px solid transparent' },
  pink:    { background: 'rgba(241, 120, 182, 0.14)', color: 'var(--pink)', border: '1px solid transparent' },
  neutral: { background: 'var(--surface-2)', color: 'var(--text-soft)', border: '1px solid var(--line-1)' },
  outline: { background: 'transparent', color: 'var(--text-soft)', border: '1px solid var(--line-2)' },
}

const aliasMap: Record<string, BadgeTone> = {
  default: 'brand',
  secondary: 'neutral',
  destructive: 'danger',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  tone?: BadgeTone
  pulse?: boolean
}

export function Badge({ className, variant = 'brand', tone, pulse, style, children, ...props }: BadgeProps) {
  const finalTone: BadgeTone = tone ?? (aliasMap[variant] ?? (variant as BadgeTone))
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
        'mono uppercase tracking-[0.06em]',
        className,
      )}
      style={{ ...toneStyle[finalTone], ...style }}
      {...props}
    >
      {pulse && (
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full animate-breathe"
          style={{ background: 'currentColor' }}
        />
      )}
      {children}
    </span>
  )
}
