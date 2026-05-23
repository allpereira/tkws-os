import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-label:
 *   display block · mono 10.5px · tracking 1.2px · uppercase
 *   color text-mute · weight 600 · margin-bottom 6px
 *   .req: color danger
 */

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ className, required, children, style, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'mono inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[1.2px] peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    style={{ color: 'var(--text-mute)', ...style }}
    {...props}
  >
    {children}
    {required && (
      <span style={{ color: 'var(--danger)' }} aria-hidden>
        *
      </span>
    )}
  </LabelPrimitive.Root>
))
Label.displayName = 'Label'
