import * as React from 'react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import { cn } from '@/lib/utils'

export const HoverCard = HoverCardPrimitive.Root
export const HoverCardTrigger = HoverCardPrimitive.Trigger

export const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 6, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 w-72 rounded-xl border p-4 shadow-xl outline-none data-[state=open]:animate-fade-in',
      className
    )}
    style={{
      background: 'var(--surface-1)',
      borderColor: 'var(--line-2)',
      color: 'var(--text)',
    }}
    {...props}
  />
))
HoverCardContent.displayName = 'HoverCardContent'
