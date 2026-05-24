import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from './dialog'

/**
 * Fiel ao HTML · ds-cmd:
 *   bg surface-1 · border 1px line-3 · radius 14px · shadow-4
 *   max-width 540px · overflow hidden
 */
export const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn('flex h-full w-full flex-col overflow-hidden rounded-[14px] border', className)}
    style={{
      background: 'var(--surface-1)',
      borderColor: 'var(--line-3)',
      boxShadow: 'var(--shadow-4)',
      color: 'var(--text)',
    }}
    {...props}
  />
))
Command.displayName = 'Command'

export function CommandDialog({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Fiel ao HTML · ds-cmd .cmd-search:
 *   padding 14px 18px · bg transparent · border-bottom 1px line-1 · font 15px
 */
export const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center gap-3 border-b px-[18px]"
    style={{ borderColor: 'var(--line-1)' }}
  >
    <Search size={16} style={{ color: 'var(--text-mute)' }} />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex w-full rounded-none bg-transparent py-3.5 text-[15px] outline-none placeholder:text-[var(--text-mute)]',
        className
      )}
      style={{ color: 'var(--text)' }}
      {...props}
    />
  </div>
))
CommandInput.displayName = 'CommandInput'

export const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-80 overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
))
CommandList.displayName = 'CommandList'

export const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn('py-8 text-center text-[13px]', className)}
    style={{ color: 'var(--text-mute)' }}
    {...props}
  />
))
CommandEmpty.displayName = 'CommandEmpty'

/**
 * Fiel ao HTML · ds-cmd .cmd-group heading:
 *   padding 10px 12px 4px · mono 10px tracking 1.3px uppercase text-mute 600
 * ds-cmd .cmd-body padding 8px
 */
export const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-2 [&_[cmdk-group-heading]]:mono [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[1.3px] [&_[cmdk-group-heading]]:text-[var(--text-mute)]',
      className
    )}
    {...props}
  />
))
CommandGroup.displayName = 'CommandGroup'

export const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px', className)}
    style={{ background: 'var(--line-1)' }}
    {...props}
  />
))
CommandSeparator.displayName = 'CommandSeparator'

/**
 * Fiel ao HTML · ds-cmd .cmd-item:
 *   grid 22px 1fr auto · gap 10px · padding 9px 12px · radius 7px
 *   font 13.5px · color text · hover bg brand-soft
 */
export const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2.5 rounded-[7px] px-3 py-[9px] text-[13.5px] outline-none transition-colors',
      'data-[selected=true]:[&]:bg-[var(--brand-soft)] data-[selected=true]:[&]:text-[var(--text)]',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      className
    )}
    style={{ color: 'var(--text)' }}
    {...props}
  />
))
CommandItem.displayName = 'CommandItem'

/**
 * Fiel ao HTML · ds-cmd .cmd-item .kbd:
 *   mono 10px · bg surface-2 · border line-1 · padding 2px 6px · radius 4px
 */
export function CommandShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'mono ml-auto inline-flex items-center rounded-[4px] border px-1.5 py-0.5 text-[10px] font-medium',
        className
      )}
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--line-1)',
        color: 'var(--text-mute)',
      }}
      {...props}
    />
  )
}
