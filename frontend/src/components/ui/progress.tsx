import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-progress:
 *   height 6px · bg surface-3 · radius 999px · overflow hidden
 *   bar: bg brand (ou success/warning/danger) · transition 0.5s cubic-bezier(.4,.2,.2,1)
 */

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  tone?: 'brand' | 'success' | 'warning' | 'danger'
}

const toneColor: Record<NonNullable<ProgressProps['tone']>, string> = {
  brand: 'var(--brand)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, tone = 'brand', style, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-1.5 w-full overflow-hidden rounded-full', className)}
    style={{ background: 'var(--surface-3)', ...style }}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 rounded-full"
      style={{
        background: toneColor[tone],
        transform: `translateX(-${100 - (value || 0)}%)`,
        transition: 'transform 0.5s cubic-bezier(.4,.2,.2,1)',
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = 'Progress'
