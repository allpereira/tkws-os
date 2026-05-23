import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Icon · atom · wrapper de lucide-react com defaults TKWS.
 *
 * Centraliza:
 *  - tamanhos semânticos (xs/sm/md/lg/xl/2xl) ou pixel arbitrário
 *  - tons semânticos via CSS vars (brand/success/warning/alert/danger/muted)
 *  - stroke-width padrão 1.7 (peso editorial, intermediário)
 *  - cursor-pointer apenas se `onClick`
 *
 * Uso:
 *   import { Icon } from '@/components/atoms'
 *   import { Plus, Search } from 'lucide-react'
 *
 *   <Icon icon={Plus} size="md" />
 *   <Icon icon={Search} size="lg" tone="brand" />
 *   <Icon icon={X} size={11} strokeWidth={2.4} />
 *
 * Quando NÃO usar:
 *  - dentro de um Button (use o lucide direto · o Button já normaliza)
 *  - quando precisar de tons custom · use o lucide direto com style
 */

export const iconSize = {
  xs: 11, // inline em badge/chip/tag
  sm: 12, // botões sm, kbd, shortcut
  md: 14, // botões default, dropdown items
  lg: 16, // navigation primary, search, header
  xl: 20, // section heads, alert icon box
  '2xl': 24, // hero, empty state, welcome modal
} as const

export type IconSize = keyof typeof iconSize

export const iconTone = {
  default: 'currentColor',
  brand: 'var(--brand)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  alert: 'var(--alert)',
  danger: 'var(--danger)',
  purple: 'var(--purple)',
  pink: 'var(--pink)',
  text: 'var(--text)',
  soft: 'var(--text-soft)',
  muted: 'var(--text-mute)',
} as const

export type IconTone = keyof typeof iconTone

export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'size'> {
  /** Componente lucide-react (ou compatível) · ex: import { Plus } from 'lucide-react' */
  icon: LucideIcon
  /** Tamanho semântico ou pixels arbitrários · default 'md' (14px) */
  size?: IconSize | number
  /** Tom · default 'default' (currentColor — herda do parent) */
  tone?: IconTone
  /** Peso do traço · default 1.7 (editorial · entre fino e bold) */
  strokeWidth?: number
  /** Adiciona aria-hidden quando não há label · default true */
  decorative?: boolean
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      icon: IconComponent,
      size = 'md',
      tone = 'default',
      strokeWidth = 1.7,
      className,
      decorative = true,
      style,
      'aria-label': ariaLabel,
      onClick,
      ...rest
    },
    ref
  ) => {
    const px = typeof size === 'number' ? size : iconSize[size]
    return (
      <IconComponent
        ref={ref as any}
        size={px}
        strokeWidth={strokeWidth}
        aria-hidden={!ariaLabel && decorative ? true : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
        className={cn(onClick && 'cursor-pointer transition-colors', className)}
        style={{ color: iconTone[tone], ...style }}
        {...rest}
      />
    )
  }
)
Icon.displayName = 'Icon'
