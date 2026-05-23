import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Button · primitivo · 4 variants × 3 sizes.
 * Sem Radix · puro HTML button + tailwind.
 */

type Variant = 'default' | 'outline' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const variantClass: Record<Variant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-md',
  md: 'h-10 px-4 text-sm rounded-md',
  lg: 'h-11 px-5 text-base rounded-md',
  icon: 'h-9 w-9 rounded-md',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Renders only the children (Slot-like) — útil para <Link asChild> */
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild, type = 'button', ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap',
      'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      variantClass[variant],
      sizeClass[size],
      className,
    )
    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(props.children as React.ReactElement<any>, {
        className: cn(classes, (props.children as any).props.className),
      })
    }
    return <button ref={ref} type={type} className={classes} {...props} />
  },
)
Button.displayName = 'Button'
