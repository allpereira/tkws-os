import * as React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-dropdown (mesma anatomia do dropdown):
 *   bg surface-2 · border 1px line-3 · radius 12px · padding 6px · shadow-3
 *   item: grid 24px 1fr auto · gap 10px · padding 8px 10px · radius 6px · text · 13px
 *   item.danger: color danger · item .kbd: surface-3 bg, radius 4px, 10px
 *   divider: line-1, margin 4px 6px
 */

export const ContextMenu = ContextMenuPrimitive.Root
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger
export const ContextMenuGroup = ContextMenuPrimitive.Group
export const ContextMenuPortal = ContextMenuPrimitive.Portal
export const ContextMenuSub = ContextMenuPrimitive.Sub
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

export const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPortal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'z-50 min-w-[260px] overflow-hidden rounded-[12px] border p-1.5 data-[state=open]:animate-fade-in',
        className
      )}
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--line-3)',
        boxShadow: 'var(--shadow-3)',
      }}
      {...props}
    />
  </ContextMenuPortal>
))
ContextMenuContent.displayName = 'ContextMenuContent'

export const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
    shortcut?: string
    danger?: boolean
  }
>(({ className, inset, shortcut, danger, children, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[13px] outline-none transition-colors',
      'focus:[&]:bg-[var(--brand-soft)]',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-9',
      className
    )}
    style={{ color: danger ? 'var(--danger)' : 'var(--text)' }}
    {...props}
  >
    {children}
    {shortcut && (
      <span
        className="mono ml-auto inline-flex items-center rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium"
        style={{
          background: 'var(--surface-3)',
          color: 'var(--text-mute)',
        }}
      >
        {shortcut}
      </span>
    )}
  </ContextMenuPrimitive.Item>
))
ContextMenuItem.displayName = 'ContextMenuItem'

export const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-[6px] py-2 pr-2.5 pl-9 text-[13px] outline-none',
      'focus:[&]:bg-[var(--brand-soft)]',
      className
    )}
    style={{ color: 'var(--text)' }}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check size={12} style={{ color: 'var(--brand)' }} />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem'

export const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-[6px] py-2 pr-2.5 pl-9 text-[13px] outline-none',
      'focus:[&]:bg-[var(--brand-soft)]',
      className
    )}
    style={{ color: 'var(--text)' }}
    {...props}
  >
    <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle size={6} style={{ fill: 'var(--brand)', color: 'var(--brand)' }} />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = 'ContextMenuRadioItem'

export const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('mx-1.5 my-1 h-px', className)}
    style={{ background: 'var(--line-1)' }}
    {...props}
  />
))
ContextMenuSeparator.displayName = 'ContextMenuSeparator'

export const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn('mono px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[1.3px]', className)}
    style={{ color: 'var(--text-mute)' }}
    {...props}
  />
))
ContextMenuLabel.displayName = 'ContextMenuLabel'

export const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[13px] outline-none',
      'focus:[&]:bg-[var(--brand-soft)] data-[state=open]:[&]:bg-[var(--brand-soft)]',
      className
    )}
    style={{ color: 'var(--text)' }}
    {...props}
  >
    {children}
    <ChevronRight size={12} className="ml-auto" style={{ color: 'var(--text-mute)' }} />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger'

export const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn('z-50 min-w-[220px] overflow-hidden rounded-[12px] border p-1.5', className)}
    style={{
      background: 'var(--surface-2)',
      borderColor: 'var(--line-3)',
      boxShadow: 'var(--shadow-3)',
    }}
    {...props}
  />
))
ContextMenuSubContent.displayName = 'ContextMenuSubContent'
