import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML:
 *   ds-tabs (pill): padding 4px, gap 2px, radius 12px, surface-2 bg
 *     button: padding 8px 14px, radius 8px, font 13px/600
 *     ACTIVE: background brand · color bg · shadow 0 1px 4px brand-soft
 *   ds-tabs-u (underline): border-bottom line-2
 *     button: padding 12px 16px, font 14px/600, text-mute
 *     ACTIVE: color text · border-bottom brand
 */

export const Tabs = TabsPrimitive.Root

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & { variant?: 'pill' | 'underline' }
>(({ className, variant = 'pill', ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      variant === 'pill'
        ? 'inline-flex items-center gap-0.5 rounded-[12px] border p-1'
        : 'inline-flex w-full items-center gap-0 border-b',
      className
    )}
    style={{
      background: variant === 'pill' ? 'var(--surface-2)' : 'transparent',
      borderColor: variant === 'pill' ? 'var(--line-2)' : 'var(--line-2)',
    }}
    data-variant={variant}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { underline?: boolean }
>(({ className, underline, style, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex cursor-pointer items-center gap-2 whitespace-nowrap font-semibold outline-none transition-all',
      'focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      underline
        ? 'border-b-2 border-transparent px-4 py-3 text-[14px] text-[var(--text-mute)] hover:text-[var(--text)] data-[state=active]:[&]:border-[var(--brand)] data-[state=active]:[&]:text-[var(--text)]'
        : 'rounded-[8px] px-3.5 py-2 text-[13px] text-[var(--text-mute)] hover:text-[var(--text)] data-[state=active]:[&]:bg-[var(--brand)] data-[state=active]:[&]:text-[var(--bg)] data-[state=active]:[&]:shadow-[0_1px_4px_var(--brand-soft)]',
      className
    )}
    style={style}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 outline-none data-[state=active]:animate-fade-in focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = 'TabsContent'
