import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-checkbox:
 *   18×18px · radius 5px · border 1.5px line-3 · bg surface-2
 *   checked: bg brand · border brand · check em var(--bg) bold
 */

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, style, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] outline-none transition-colors',
      'focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:[&]:bg-[var(--brand)] data-[state=checked]:[&]:border-[var(--brand)]',
      className
    )}
    style={{
      background: 'var(--surface-2)',
      border: '1.5px solid var(--line-3)',
      ...style,
    }}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center" style={{ color: 'var(--bg)' }}>
      <Check size={12} strokeWidth={3.5} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'
