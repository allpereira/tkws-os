import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-switch:
 *   36×20px · radius 999px
 *   off: bg line-2 · dot text color (var(--text))
 *   on: bg brand · dot bg color (var(--bg))
 *   thumb 16px · transição com curve snap cubic-bezier(.6,.05,.4,1.4)
 */

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, style, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:[&]:bg-[var(--brand)]',
      className
    )}
    style={{
      background: 'var(--line-2)',
      ...style,
    }}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full shadow-md ring-0',
        'data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-0.5',
        'data-[state=checked]:[&]:bg-[var(--bg)] data-[state=unchecked]:[&]:bg-[var(--text)]'
      )}
      style={{
        transition: 'transform 0.2s cubic-bezier(.6,.05,.4,1.4), background 0.2s ease',
      }}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = 'Switch'
