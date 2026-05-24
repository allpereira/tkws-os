import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-radio:
 *   18×18px · radius 50% · border 1.5px line-3 · bg surface-2
 *   checked: border brand + dot 9px brand
 *
 *   ds-radio-row (RadioCard):
 *     padding 10px 14px · radius 10px · bg surface-2 · border 1px line-2
 *     selected: border brand · bg brand-soft
 *     b: 13px/600 text · span: 11px/text-mute
 */

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-2', className)} {...props} />
))
RadioGroup.displayName = 'RadioGroup'

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'aspect-square h-[18px] w-[18px] rounded-full outline-none transition-colors',
      'focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:[&]:border-[var(--brand)]',
      className
    )}
    style={{
      background: 'var(--surface-2)',
      border: '1.5px solid var(--line-3)',
    }}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="block h-[9px] w-[9px] rounded-full" style={{ background: 'var(--brand)' }} />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = 'RadioGroupItem'

/** Card-style radio · padrão ds-radio-row · 10px 14px padding · 10px radius. */
export const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    title: string
    description?: string
  }
>(({ className, title, description, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'group flex cursor-pointer items-center gap-2.5 rounded-[10px] border px-3.5 py-2.5 text-left outline-none transition-all',
      'data-[state=checked]:[&]:border-[var(--brand)] data-[state=checked]:[&]:bg-[var(--brand-soft)]',
      'hover:brightness-110',
      className
    )}
    style={{
      background: 'var(--surface-2)',
      borderColor: 'var(--line-2)',
    }}
    {...props}
  >
    <span
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
      style={{
        background: 'var(--surface-1)',
        border: '1.5px solid var(--line-3)',
      }}
    >
      <RadioGroupPrimitive.Indicator>
        <span className="block h-[9px] w-[9px] rounded-full" style={{ background: 'var(--brand)' }} />
      </RadioGroupPrimitive.Indicator>
    </span>
    <div>
      <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
        {title}
      </div>
      {description && (
        <div className="mt-0.5 text-[11px]" style={{ color: 'var(--text-mute)' }}>
          {description}
        </div>
      )}
    </div>
  </RadioGroupPrimitive.Item>
))
RadioCard.displayName = 'RadioCard'
