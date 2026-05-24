import * as React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RatingProps {
  value: number
  /** total de estrelas · default 5 */
  max?: number
  /** somente leitura · default false */
  readOnly?: boolean
  onChange?: (value: number) => void
  size?: number
  className?: string
  label?: string
}

export function Rating({
  value,
  max = 5,
  readOnly,
  onChange,
  size = 18,
  className,
  label,
}: RatingProps) {
  const [hover, setHover] = React.useState<number | null>(null)
  const active = hover ?? value

  return (
    <div
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={label ?? `${value} de ${max}`}
      className={cn('inline-flex items-center gap-1', className)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < active
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(i + 1)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onClick={() => !readOnly && onChange?.(i + 1)}
            aria-label={`${i + 1} estrela${i > 0 ? 's' : ''}`}
            className={cn(
              'rounded-md p-0.5 outline-none transition-transform',
              !readOnly && 'cursor-pointer hover:scale-110 focus-visible:ring-2 focus-visible:ring-[var(--brand)]'
            )}
          >
            <Star
              size={size}
              strokeWidth={1.5}
              style={{
                color: filled ? 'var(--warning)' : 'var(--line-3)',
                fill: filled ? 'var(--warning)' : 'transparent',
              }}
            />
          </button>
        )
      })}
      <span className="mono ml-1.5 text-[11px]" style={{ color: 'var(--text-mute)' }}>
        {value.toFixed(1)} / {max}
      </span>
    </div>
  )
}
