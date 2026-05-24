import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor

/**
 * Fiel ao HTML · ds-pop-content:
 *   bg surface-2 · border 1px solid line-3 · radius 12px · padding 16px
 *   shadow-3 · min-width 280px
 */
export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 6, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[280px] rounded-[12px] border p-4 outline-none data-[state=open]:animate-fade-in',
        className
      )}
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--line-3)',
        color: 'var(--text)',
        boxShadow: 'var(--shadow-3)',
      }}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = 'PopoverContent'
