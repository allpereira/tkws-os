import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-input + ds-textarea:
 *   width 100% · padding 10px 13px · bg surface-2 · border 1px line-2
 *   radius 10px · color text · font 14px
 *   focus: border brand · bg surface-1
 *   err: border danger
 *   icon: padding-left 38px · ic left 12px
 *   field: gap 4px · hint 12px text-mute · err 12px danger
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Estado de validação · expõe success além de error · prefer this over `error` */
  state?: 'default' | 'error' | 'success'
  /** @deprecated use `state="error"` · mantido para retro-compat */
  error?: boolean
  icon?: React.ReactNode
}

function resolveState(state?: InputProps['state'], error?: boolean): 'default' | 'error' | 'success' {
  if (state) return state
  if (error) return 'error'
  return 'default'
}

function borderForState(s: 'default' | 'error' | 'success') {
  if (s === 'error') return 'var(--danger)'
  if (s === 'success') return 'var(--success)'
  return 'var(--line-2)'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', state, error, icon, style, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <span
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-mute"
          >
            {icon}
          </span>
          <InputBare ref={ref} type={type} state={state} error={error} className={cn('pl-[38px]', className)} style={style} {...props} />
        </div>
      )
    }
    return <InputBare ref={ref} type={type} state={state} error={error} className={className} style={style} {...props} />
  }
)
Input.displayName = 'Input'

const InputBare = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, error, style, ...props }, ref) => {
    const s = resolveState(state, error)
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-[10px] border px-[13px] py-[10px] text-[14px] transition-all',
          'placeholder:text-[var(--text-mute)] outline-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--brand)]/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'bg-surface-2 text-text',
          className
        )}
        style={{
          borderColor: borderForState(s),
          ...style,
        }}
        onFocus={(e) => {
          if (s === 'default') {
            e.currentTarget.style.borderColor = 'var(--brand)'
            e.currentTarget.style.background = 'var(--surface-1)'
          }
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = borderForState(s)
          e.currentTarget.style.background = 'var(--surface-2)'
          props.onBlur?.(e)
        }}
        {...props}
      />
    )
  }
)
InputBare.displayName = 'InputBare'

export function FieldHint({
  children,
  error,
  state,
}: {
  children: React.ReactNode
  /** @deprecated use `state="error"` */
  error?: boolean
  state?: 'default' | 'error' | 'success'
}) {
  const s = state ?? (error ? 'error' : 'default')
  const color = s === 'error' ? 'var(--danger)' : s === 'success' ? 'var(--success)' : 'var(--text-mute)'
  return (
    <span className="block text-[12px] leading-tight" style={{ color }}>
      {children}
    </span>
  )
}

export function Field({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('grid gap-1', className)}>{children}</div>
}
