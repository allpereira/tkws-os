import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-textarea:
 *   width 100% · padding 10px 13px · bg surface-2 · border 1px line-2
 *   radius 10px · font 14px · min-height 90px · resize vertical
 *   focus: border brand · bg surface-1
 *   err: border danger
 */

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Estado de validação · expõe success além de error */
  state?: 'default' | 'error' | 'success'
  /** @deprecated use `state="error"` */
  error?: boolean
}

function borderForState(s: 'default' | 'error' | 'success') {
  if (s === 'error') return 'var(--danger)'
  if (s === 'success') return 'var(--success)'
  return 'var(--line-2)'
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, error, style, ...props }, ref) => {
    const s = state ?? (error ? 'error' : 'default')
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[90px] w-full rounded-[10px] border px-[13px] py-[10px] text-[14px] transition-all',
          'placeholder:text-[var(--text-mute)] outline-none resize-y',
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
Textarea.displayName = 'Textarea'
