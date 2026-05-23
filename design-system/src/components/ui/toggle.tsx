import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-toggle:
 *   border 1px line-2 · bg transparent · text-soft · 13px/600
 *   padding 8px 12px · radius 8px
 *   hover: bg brand-soft · color text
 *   on: bg brand · color bg · border brand
 *
 * Toggle Group: borders fundidas · radius só no primeiro/último.
 */

const toggleVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-1.5 border text-[13px] font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-[34px] px-3 rounded-[8px]',
        sm: 'h-[28px] px-2.5 rounded-[8px] text-[12px]',
      },
    },
    defaultVariants: { size: 'default' },
  }
)

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

export const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, size, style, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(
      toggleVariants({ size }),
      'data-[state=on]:[&]:border-[var(--brand)] data-[state=on]:[&]:bg-[var(--brand)] data-[state=on]:[&]:text-[var(--bg)]',
      'hover:bg-[var(--brand-soft)] hover:text-[var(--text)]',
      className
    )}
    style={{
      background: 'transparent',
      borderColor: 'var(--line-2)',
      color: 'var(--text-soft)',
      ...style,
    }}
    {...props}
  />
))
Toggle.displayName = 'Toggle'

export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('inline-flex items-center isolate', className)}
    {...props as any}
  />
))
ToggleGroup.displayName = 'ToggleGroup'

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, size, style, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      toggleVariants({ size }),
      // bordas fundidas no group
      'first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none',
      '[&:not(:first-child)]:-ml-px',
      'data-[state=on]:[&]:border-[var(--brand)] data-[state=on]:[&]:bg-[var(--brand)] data-[state=on]:[&]:text-[var(--bg)]',
      'data-[state=on]:[&]:z-10',
      'hover:bg-[var(--brand-soft)] hover:text-[var(--text)] hover:z-10',
      className
    )}
    style={{
      background: 'transparent',
      borderColor: 'var(--line-2)',
      color: 'var(--text-soft)',
      ...style,
    }}
    {...props}
  />
))
ToggleGroupItem.displayName = 'ToggleGroupItem'
