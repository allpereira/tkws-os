import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Button · padrão TKWS OS (design-system/src/components/ui/button.tsx)
 *
 * Variantes:
 *   default   — brand bg + bg color text (filled)
 *   secondary — transparent + brand color + brand border
 *   outline   — transparent + text + line-2 border (neutro)
 *   ghost     — transparent + text (hover brand-soft)
 *   danger    — danger bg + white text
 *
 * Tamanhos: sm · md (default) · lg · icon
 */

type Variant = 'default' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'destructive'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const sizeClass: Record<Size, string> = {
  sm: 'h-[30px] px-3 text-[12px] rounded-[8px] [&_svg]:size-3',
  md: 'h-[38px] px-4 text-[13px] rounded-[10px] [&_svg]:size-3.5',
  lg: 'h-11 px-5 text-[14px] rounded-[10px] [&_svg]:size-4',
  icon: 'h-9 w-9 rounded-[10px] [&_svg]:size-4',
}

const baseStyle: Record<Exclude<Variant, 'destructive'>, React.CSSProperties> = {
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

const hoverFor: Record<keyof typeof baseStyle, (el: HTMLElement) => void> = {
  default: (el) => { el.style.background = 'var(--brand-h)' },
  secondary: (el) => { el.style.background = 'var(--brand-soft)' },
  outline: (el) => {
    el.style.background = 'var(--surface-2)'
    el.style.borderColor = 'var(--line-3)'
  },
  ghost: (el) => { el.style.background = 'var(--brand-soft)' },
  danger: (el) => { el.style.filter = 'brightness(1.1)' },
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild, type = 'button', style, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const v = (variant === 'destructive' ? 'danger' : variant) as keyof typeof baseStyle

    const classes = cn(
      'inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-semibold transition-all cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)]',
      'disabled:pointer-events-none disabled:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:shrink-0',
      sizeClass[size],
      className,
    )

    const mergedStyle: React.CSSProperties = { ...baseStyle[v], ...style }

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      hoverFor[v]?.(e.currentTarget)
      onMouseEnter?.(e)
    }
    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      Object.assign(e.currentTarget.style, baseStyle[v])
      e.currentTarget.style.filter = ''
      onMouseLeave?.(e)
    }

    if (asChild && React.isValidElement(props.children)) {
      const child = props.children as React.ReactElement<any>
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
        style: { ...mergedStyle, ...(child.props.style ?? {}) },
      })
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        style={mergedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
