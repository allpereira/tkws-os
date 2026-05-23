import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '@/lib/utils'

export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & { label?: string }
>(({ className, orientation = 'horizontal', decorative = true, label, ...props }, ref) => {
  if (label) {
    return (
      <div className="my-3 flex items-center gap-3">
        <span className="h-px flex-1" style={{ background: 'var(--line-1)' }} />
        <span
          className="mono text-[10px] font-bold uppercase tracking-[1.6px]"
          style={{ color: 'var(--text-mute)' }}
        >
          {label}
        </span>
        <span className="h-px flex-1" style={{ background: 'var(--line-1)' }} />
      </div>
    )
  }

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      style={{ background: 'var(--line-1)' }}
      {...props}
    />
  )
})
Separator.displayName = 'Separator'
