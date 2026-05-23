import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-btn:
 *   • padding 10px 16px · radius 10px · font 13px · weight 600
 *   • default: brand bg + bg color text
 *   • secondary: transparent + brand color + brand border
 *   • ghost: transparent + text color · hover brand-soft
 *   • outline: transparent + text + line-2 border · hover surface-2
 *   • danger: var(--danger) bg + #fff text
 *   • sm: padding 7px 12px · font 12px
 */

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        secondary: '',
        outline: '',
        ghost: '',
        danger: '',
      },
      size: {
        default: 'h-[38px] px-4 text-[13px] [&_svg]:size-3.5',
        sm: 'h-[30px] px-3 text-[12px] rounded-[8px] [&_svg]:size-3',
        lg: 'h-11 px-5 text-[14px] [&_svg]:size-4',
        icon: 'h-9 w-9 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const baseStyle: Record<string, React.CSSProperties> = {
  default: {
    background: 'var(--brand)',
    color: 'var(--bg)',
    border: '1px solid var(--brand)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--brand)',
    border: '1px solid var(--brand)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--text)',
    border: '1px solid var(--line-2)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'var(--danger)',
    color: '#fff',
    border: '1px solid var(--danger)',
  },
}

const hoverFor: Record<string, (e: HTMLElement) => void> = {
  default: (e) => {
    e.style.background = 'var(--brand-h)'
  },
  secondary: (e) => {
    e.style.background = 'var(--brand-soft)'
  },
  outline: (e) => {
    e.style.background = 'var(--surface-2)'
    e.style.borderColor = 'var(--line-3)'
  },
  ghost: (e) => {
    e.style.background = 'var(--brand-soft)'
  },
  danger: (e) => {
    e.style.filter = 'brightness(1.1)'
  },
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size, asChild = false, style, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const Comp: any = asChild ? Slot : 'button'
    const v = (variant ?? 'default') as keyof typeof baseStyle
    return (
      <Comp
        className={cn(buttonVariants({ variant: v as any, size, className }))}
        style={{ ...baseStyle[v], ...style }}
        ref={ref}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
          const el = e.currentTarget
          hoverFor[v]?.(el)
          onMouseEnter?.(e as any)
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
          const el = e.currentTarget
          Object.assign(el.style, baseStyle[v])
          el.style.filter = ''
          onMouseLeave?.(e as any)
        }}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
