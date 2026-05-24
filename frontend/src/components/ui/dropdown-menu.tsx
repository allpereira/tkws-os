import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-dropdown:
 *   bg surface-2 · border 1px line-3 · radius 12px · padding 6px
 *   shadow-3 · min-width 280px
 *
 * .dd-label: mono 10px · tracking 1.3px · uppercase · text-mute · 600 · padding 8px 10px
 * .dd-item:  grid 24px 1fr auto · gap 10px · padding 8px 10px · radius 6px
 *            font 13px · color text · hover bg brand-soft · .danger color danger
 * .dd-item .kbd: mono 10px · bg surface-3 · padding 2px 6px · radius 4px · text-mute
 * .dd-divider: height 1px · bg line-1 · margin 4px 6px
 */

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal
export const DropdownMenuSub = DropdownMenuPrimitive.Sub
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[13px] outline-none',
      'data-[state=open]:[&]:bg-[var(--brand-soft)] focus:[&]:bg-[var(--brand-soft)]',
      className
    )}
    style={{ color: 'var(--text)' }}
    {...props}
  >
    {children}
    <ChevronRight size={12} className="ml-auto" style={{ color: 'var(--text-mute)' }} />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger'

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[220px] overflow-hidden rounded-[12px] border p-1.5 data-[state=open]:animate-fade-in',
      className
    )}
    style={{
      background: 'var(--surface-2)',
      borderColor: 'var(--line-3)',
      boxShadow: 'var(--shadow-3)',
    }}
    {...props}
  />
))
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent'

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[280px] overflow-hidden rounded-[12px] border p-1.5 data-[state=open]:animate-fade-in',
        className
      )}
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--line-3)',
        boxShadow: 'var(--shadow-3)',
      }}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
    shortcut?: string
    danger?: boolean
  }
>(({ className, inset, shortcut, children, danger, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
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
  </DropdownMenuPrimitive.Item>
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
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
      <DropdownMenuPrimitive.ItemIndicator>
        <Check size={12} style={{ color: 'var(--brand)' }} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
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
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle size={6} style={{ fill: 'var(--brand)', color: 'var(--brand)' }} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'mono px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[1.3px]',
      className
    )}
    style={{ color: 'var(--text-mute)' }}
    {...props}
  />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('mx-1.5 my-1 h-px', className)}
    style={{ background: 'var(--line-1)' }}
    {...props}
  />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'
