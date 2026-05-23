import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: 'default' | 'error' | 'success'
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state = 'default', icon, type = 'text', ...props }, ref) => {
    const borderClass =
      state === 'error'
        ? 'border-destructive focus-visible:ring-destructive/30'
        : state === 'success'
        ? 'border-green-500 focus-visible:ring-green-500/30'
        : 'border-input focus-visible:ring-ring/30'

    const baseClass = cn(
      'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      borderClass,
      className,
    )

    if (icon) {
      return (
        <div className="relative">
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            {icon}
          </span>
          <input ref={ref} type={type} className={cn(baseClass, 'pl-10')} {...props} />
        </div>
      )
    }
    return <input ref={ref} type={type} className={baseClass} {...props} />
  },
)
Input.displayName = 'Input'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { state?: InputProps['state'] }>(
  ({ className, state = 'default', ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[88px] w-full resize-y rounded-md border bg-background px-3 py-2 text-sm',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        state === 'error' && 'border-destructive focus-visible:ring-destructive/30',
        state === 'success' && 'border-green-500',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export function Label({ className, children, required, htmlFor, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className={cn('text-sm font-medium leading-none', className)} {...props}>
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )
}

export function Field({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1.5', className)}>{children}</div>
}

export function FieldHint({
  children,
  state,
}: {
  children: React.ReactNode
  state?: 'default' | 'error' | 'success'
}) {
  const color =
    state === 'error' ? 'text-destructive' : state === 'success' ? 'text-green-600' : 'text-muted-foreground'
  return <span className={cn('text-xs', color)}>{children}</span>
}
