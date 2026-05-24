import * as React from 'react'
import { cn } from '@/lib/utils'

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md'
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, size = 'sm', ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        'mono inline-flex items-center justify-center rounded-md border font-semibold leading-none',
        size === 'sm' ? 'h-5 min-w-5 px-1.5 text-[10px]' : 'h-6 min-w-6 px-2 text-[11px]',
        className
      )}
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--line-2)',
        color: 'var(--text-soft)',
        boxShadow: 'inset 0 -1px 0 var(--line-1)',
      }}
      {...props}
    />
  )
)
Kbd.displayName = 'Kbd'

/** Combo de teclas separadas por + · ex: <KbdCombo keys={['⌘','K']} /> */
export function KbdCombo({
  keys,
  size = 'sm',
  separator = ' ',
}: {
  keys: string[]
  size?: 'sm' | 'md'
  separator?: string
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((k, i) => (
        <React.Fragment key={i}>
          <Kbd size={size}>{k}</Kbd>
          {i < keys.length - 1 && separator !== '' && (
            <span className="text-[10px]" style={{ color: 'var(--text-mute)' }}>
              {separator}
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  )
}
