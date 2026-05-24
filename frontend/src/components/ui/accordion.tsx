import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-acc:
 *   container: bg surface-1 · border 1px line-2 · radius 12px · overflow hidden
 *   item border-bottom 1px line-1 (último sem)
 *   trigger: padding 16px 18px · font 14px/600 · color text · hover bg brand-soft
 *   caret: rotate 180 quando open · transition cubic-bezier(.4,.2,.2,1)
 *   content inner: padding 0 18px 16px · font 13px · text-soft · line-height 1.6
 */

export const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, style, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn('overflow-hidden rounded-[12px] border', className)}
    style={{
      background: 'var(--surface-1)',
      borderColor: 'var(--line-2)',
      ...style,
    }}
    {...props as any}
  />
))
Accordion.displayName = 'Accordion'

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b last:border-0', className)}
    style={{ borderColor: 'var(--line-1)' }}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 cursor-pointer items-center justify-between gap-3 px-[18px] py-4 text-left text-[14px] font-semibold transition-colors outline-none',
        'hover:bg-[var(--brand-soft)]',
        'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)]/60',
        '[&[data-state=open]>svg]:rotate-180',
        className
      )}
      style={{ color: 'var(--text)' }}
      {...props}
    >
      {children}
      <ChevronDown
        size={14}
        className="shrink-0 transition-transform duration-200"
        style={{ color: 'var(--text-mute)', transitionTimingFunction: 'cubic-bezier(0.4, 0.2, 0.2, 1)' }}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = 'AccordionTrigger'

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-[13px] leading-[1.6] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    style={{ color: 'var(--text-soft)' }}
    {...props}
  >
    <div className={cn('px-[18px] pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = 'AccordionContent'
