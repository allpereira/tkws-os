import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-avatar:
 *   default 36px / sm 28px / lg 56px / xl 80px
 *   font-weight 700 · bg brand · color bg
 *   square: border-radius 10px
 *   group: border 2px solid surface-1 · margin-left -10px · hover translateY(-2px)
 */

const sizeMap = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-[12px]',
  lg: 'h-14 w-14 text-[18px]',
  xl: 'h-20 w-20 text-[24px]',
}

type Size = keyof typeof sizeMap

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: Size
  /** Forma · 'circle' (default) ou 'square' · prefer over `square` */
  shape?: 'circle' | 'square'
  /** @deprecated use `shape="square"` */
  square?: boolean
}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = 'md', shape, square, style, ...props }, ref) => {
  const isSquare = shape === 'square' || square === true
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden font-bold',
        sizeMap[size],
        isSquare ? 'rounded-[10px]' : 'rounded-full',
        className
      )}
      style={{ background: 'var(--brand)', color: 'var(--bg)', ...style }}
      {...props}
    />
  )
})
Avatar.displayName = 'Avatar'

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
))
AvatarImage.displayName = 'AvatarImage'

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn('flex h-full w-full items-center justify-center', className)}
    {...props}
  />
))
AvatarFallback.displayName = 'AvatarFallback'

/**
 * Avatar Group · sobreposição com border externa de surface-1.
 * Cada item sobreposto em -10px · hover lift sutil.
 */
export function AvatarGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-center', className)}>
      {React.Children.map(children, (child, i) => (
        <div
          key={i}
          className="-ml-2.5 transition-transform first:ml-0 hover:-translate-y-0.5 hover:z-10 relative"
          style={{
            // ring/border externo no surface-1 igual ao HTML
            boxShadow: '0 0 0 2px var(--surface-1)',
            borderRadius: '50%',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
