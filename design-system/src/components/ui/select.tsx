import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

/**
 * Fiel ao HTML · ds-select:
 *   padding 10px 36px 10px 14px (right 36px para o chevron)
 *   bg surface-2 · border 1px line-2 · radius 10px
 *   font 14px · cursor pointer
 *   focus: border brand · bg surface-1
 */
export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, style, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-[10px] border px-[14px] py-[10px] text-[14px] outline-none transition-all',
      'data-[placeholder]:text-[var(--text-mute)]',
      'focus:[&]:border-[var(--brand)] focus:[&]:bg-[var(--surface-1)]',
      'data-[state=open]:[&]:border-[var(--brand)] data-[state=open]:[&]:bg-[var(--surface-1)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      '[&>span]:line-clamp-1',
      className
    )}
    style={{
      background: 'var(--surface-2)',
      borderColor: 'var(--line-2)',
      color: 'var(--text)',
      ...style,
    }}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', style, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        'relative z-50 max-h-96 min-w-32 overflow-hidden rounded-[10px] border p-1.5 animate-fade-in',
        position === 'popper' && 'data-[side=bottom]:translate-y-1',
        className
      )}
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--line-3)',
        boxShadow: 'var(--shadow-3)',
        ...style,
      }}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center">
        <ChevronUp size={12} style={{ color: 'var(--text-mute)' }} />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center">
        <ChevronDown size={12} style={{ color: 'var(--text-mute)' }} />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = 'SelectContent'

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('mono px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider', className)}
    style={{ color: 'var(--text-mute)' }}
    {...props}
  />
))
SelectLabel.displayName = 'SelectLabel'

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, style, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-[6px] py-2 pr-2.5 pl-8 text-[13px] outline-none',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'focus:[&]:bg-[var(--brand-soft)] focus:[&]:text-[var(--text)]',
      'data-[state=checked]:[&]:bg-[var(--brand-soft)] data-[state=checked]:[&]:text-[var(--brand)]',
      className
    )}
    style={{ color: 'var(--text)', ...style }}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check size={12} style={{ color: 'var(--brand)' }} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px', className)}
    style={{ background: 'var(--line-1)' }}
    {...props}
  />
))
SelectSeparator.displayName = 'SelectSeparator'
