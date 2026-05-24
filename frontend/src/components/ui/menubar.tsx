import * as React from 'react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const MenubarMenu = MenubarPrimitive.Menu
export const MenubarGroup = MenubarPrimitive.Group
export const MenubarPortal = MenubarPrimitive.Portal
export const MenubarSub = MenubarPrimitive.Sub
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup

/**
 * Fiel ao HTML · ds-menubar:
 *   inline-flex · padding 4px · bg surface-2 · border 1px line-2 · radius 10px
 *   button: padding 6px 12px · radius 6px · font 12.5px/600 · text-soft
 *   hover: bg brand-soft · color text
 *   open: bg brand · color bg
 */
export const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn('inline-flex items-center gap-0.5 rounded-[10px] border p-1', className)}
    style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}
    {...props}
  />
))
Menubar.displayName = 'Menubar'

export const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      'cursor-pointer rounded-[6px] px-3 py-1.5 text-[12.5px] font-semibold outline-none transition-colors',
      'hover:bg-[var(--brand-soft)] hover:text-[var(--text)]',
      'data-[state=open]:[&]:bg-[var(--brand)] data-[state=open]:[&]:text-[var(--bg)]',
      'focus:[&]:bg-[var(--brand-soft)] focus:[&]:text-[var(--text)]',
      className
    )}
    style={{ color: 'var(--text-soft)' }}
    {...props}
  />
))
MenubarTrigger.displayName = 'MenubarTrigger'

export const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
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
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = 'MenubarSubTrigger'

export const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
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
MenubarSubContent.displayName = 'MenubarSubContent'

export const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = 'start', sideOffset = 6, ...props }, ref) => (
  <MenubarPortal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[240px] overflow-hidden rounded-[12px] border p-1.5 data-[state=open]:animate-fade-in',
        className
      )}
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--line-3)',
        boxShadow: 'var(--shadow-3)',
      }}
      {...props}
    />
  </MenubarPortal>
))
MenubarContent.displayName = 'MenubarContent'

export const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
    shortcut?: string
    danger?: boolean
  }
>(({ className, inset, shortcut, danger, children, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[13px] outline-none',
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
  </MenubarPrimitive.Item>
))
MenubarItem.displayName = 'MenubarItem'

export const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-[6px] py-2 pr-2.5 pl-9 text-[13px] outline-none focus:[&]:bg-[var(--brand-soft)]',
      className
    )}
    style={{ color: 'var(--text)' }}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check size={12} style={{ color: 'var(--brand)' }} />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem'

export const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-[6px] py-2 pr-2.5 pl-9 text-[13px] outline-none focus:[&]:bg-[var(--brand-soft)]',
      className
    )}
    style={{ color: 'var(--text)' }}
    {...props}
  >
    <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle size={6} style={{ fill: 'var(--brand)', color: 'var(--brand)' }} />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = 'MenubarRadioItem'

export const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn('mono px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[1.3px]', className)}
    style={{ color: 'var(--text-mute)' }}
    {...props}
  />
))
MenubarLabel.displayName = 'MenubarLabel'

export const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn('mx-1.5 my-1 h-px', className)}
    style={{ background: 'var(--line-1)' }}
    {...props}
  />
))
MenubarSeparator.displayName = 'MenubarSeparator'
