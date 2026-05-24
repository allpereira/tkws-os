import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Avatar · TKWS OS · iniciais sobre fundo brand/purple.
 * Forma simples (sem Radix) · circle por padrão, square opcional.
 */

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeMap: Record<Size, { side: number; font: number }> = {
  xs: { side: 20, font: 9 },
  sm: { side: 28, font: 11 },
  md: { side: 36, font: 13 },
  lg: { side: 52, font: 18 },
  xl: { side: 72, font: 24 },
}

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: Size | number
  square?: boolean
}

export function Avatar({ size = 'md', square, className, style, children, ...props }: AvatarProps) {
  const s = typeof size === 'number' ? { side: size, font: Math.max(9, size * 0.36) } : sizeMap[size]
  return (
    <span
      className={cn('inline-flex items-center justify-center overflow-hidden font-semibold uppercase', className)}
      style={{
        width: s.side,
        height: s.side,
        fontSize: s.font,
        borderRadius: square ? 10 : 999,
        background: 'var(--brand-soft)',
        color: 'var(--brand)',
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}

export function AvatarFallback({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center justify-center', className)}>{children}</span>
}

/** Helper para gerar iniciais a partir de um nome */
export function initialsOf(name?: string | null, max = 2): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, max).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
