import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-list / ds-list-item:
 *   container: bg surface-1 · border 1px line-2 · radius 12px · overflow hidden
 *   item: grid 36px 1fr auto · gap 12px · padding 14px 16px
 *         border-bottom 1px line-1 · hover bg brand-soft
 *   .ico: 28×28 · radius 8px · bg brand-soft · color brand · font 14px
 *   .ttl: 14px/600 text · .sub: 12px text-mute · .meta: 12px text-mute
 */

export const ListGroup = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('overflow-hidden rounded-[12px] border', className)}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-2)',
      }}
      {...props}
    />
  )
)
ListGroup.displayName = 'ListGroup'

export interface ListGroupItemProps extends React.HTMLAttributes<HTMLLIElement> {
  asButton?: boolean
  active?: boolean
  leading?: React.ReactNode
  trailing?: React.ReactNode
  description?: React.ReactNode
  /** quando clicável */
  onSelect?: () => void
}

export const ListGroupItem = React.forwardRef<HTMLLIElement, ListGroupItemProps>(
  ({ className, asButton = true, active, leading, trailing, description, onSelect, children, ...props }, ref) => {
    const interactive = asButton || onSelect
    return (
      <li
        ref={ref}
        onClick={interactive ? onSelect : undefined}
        className={cn(
          'grid grid-cols-[36px_1fr_auto] items-center gap-3 border-b px-4 py-3.5 transition-colors last:border-0',
          interactive && 'cursor-pointer hover:bg-[var(--brand-soft)]',
          className
        )}
        style={{
          borderColor: 'var(--line-1)',
          background: active ? 'var(--brand-soft)' : 'transparent',
        }}
        {...props}
      >
        {leading ? (
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] text-[14px]"
            style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
          >
            {leading}
          </span>
        ) : (
          <span />
        )}
        <div className="min-w-0">
          <div
            className="truncate text-[14px] font-semibold"
            style={{ color: active ? 'var(--brand)' : 'var(--text)' }}
          >
            {children}
          </div>
          {description && (
            <div className="mt-0.5 text-[12px]" style={{ color: 'var(--text-mute)' }}>
              {description}
            </div>
          )}
        </div>
        {trailing ? (
          <span className="num-tabular text-[12px]" style={{ color: 'var(--text-mute)' }}>
            {trailing}
          </span>
        ) : (
          <span />
        )}
      </li>
    )
  }
)
ListGroupItem.displayName = 'ListGroupItem'
