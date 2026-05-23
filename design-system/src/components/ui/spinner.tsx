import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-spinner:
 *   ring 22×22 default · border 2.5px solid surface-3 + top brand
 *   sm 14×14 / 2px · lg 32×32 / 3px · xl 48×48 / 4px
 *   success/warning/danger · troca border-top-color
 *
 * Variant 'dots' replica ds-dots: 3 dots brand · bounce 1.2s
 */

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'
export type SpinnerTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral'

const toneColor: Record<SpinnerTone, string> = {
  brand: 'var(--brand)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  neutral: 'var(--text-mute)',
}

const ringSize: Record<SpinnerSize, { px: number; border: string }> = {
  sm: { px: 14, border: '2px' },
  md: { px: 22, border: '2.5px' },
  lg: { px: 32, border: '3px' },
  xl: { px: 48, border: '4px' },
}

const dotSize: Record<SpinnerSize, number> = {
  sm: 5,
  md: 7,
  lg: 10,
  xl: 12,
}

/** Aceita size como literal (sm/md/lg/xl) ou número (px) para retro-compat. */
function resolvePixels(size: SpinnerSize | number, lookup: Record<SpinnerSize, { px: number } | number>) {
  if (typeof size === 'number') return size
  const v = lookup[size]
  return typeof v === 'number' ? v : v.px
}

function resolveBorder(size: SpinnerSize | number): string {
  if (typeof size === 'number') {
    if (size <= 14) return '2px'
    if (size <= 22) return '2.5px'
    if (size <= 32) return '3px'
    return '4px'
  }
  return ringSize[size].border
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize | number
  tone?: SpinnerTone
  variant?: 'ring' | 'dots'
  label?: string
}

export function Spinner({
  size = 'md',
  tone = 'brand',
  variant = 'ring',
  label,
  className,
  ...props
}: SpinnerProps) {
  const ringPx = resolvePixels(size, ringSize as any)
  const dotPx = resolvePixels(typeof size === 'number' ? Math.max(4, Math.round(size / 3)) : size, dotSize as any)
  const borderWidth = resolveBorder(size)
  return (
    <span
      role="status"
      aria-label={label ?? 'Carregando'}
      className={cn('inline-flex items-center gap-2', className)}
      {...props}
    >
      {variant === 'ring' ? (
        <span
          className="inline-block animate-spin rounded-full"
          style={{
            width: ringPx,
            height: ringPx,
            borderStyle: 'solid',
            borderWidth,
            borderColor: 'var(--surface-3)',
            borderTopColor: toneColor[tone],
            animationDuration: '0.8s',
            animationTimingFunction: 'linear',
          }}
        />
      ) : (
        <span className="inline-flex items-center gap-[5px]">
          {[0, 0.15, 0.3].map((delay, i) => (
            <span
              key={i}
              className="inline-block rounded-full"
              style={{
                width: dotPx,
                height: dotPx,
                background: toneColor[tone],
                animation: 'dot-bounce 1.2s ease-in-out infinite',
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </span>
      )}
      {label && (
        <span
          className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]"
          style={{ color: 'var(--text-mute)' }}
        >
          {label}
        </span>
      )}
    </span>
  )
}
