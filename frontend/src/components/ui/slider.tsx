import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-slider:
 *   track: 4px · bg surface-3 · radius 999px
 *   fill: 4px · bg brand
 *   thumb: 18px · bg var(--bg) · border 2px brand · shadow-2
 *   hover thumb: scale 1.15
 */

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, ...props }, ref) => {
  const count = (value ?? defaultValue ?? [0]).length
  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value as any}
      defaultValue={defaultValue as any}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-1 w-full grow overflow-hidden rounded-full"
        style={{ background: 'var(--surface-3)' }}
      >
        <SliderPrimitive.Range
          className="absolute h-full"
          style={{ background: 'var(--brand)' }}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: count }).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-[18px] w-[18px] rounded-full outline-none transition-transform hover:scale-[1.15] focus-visible:scale-[1.15] focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
          style={{
            background: 'var(--bg)',
            border: '2px solid var(--brand)',
            boxShadow: 'var(--shadow-2)',
          }}
        />
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = 'Slider'
