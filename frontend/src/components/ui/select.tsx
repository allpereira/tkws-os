import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Select · usando native <select> · acessibilidade gratuita.
 * Para combobox com search use Combobox (será adicionado quando precisar).
 */

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  state?: 'default' | 'error' | 'success'
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, state = 'default', children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'flex h-10 w-full appearance-none rounded-md border bg-background pr-9 pl-3 py-2 text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          state === 'error' ? 'border-destructive' : 'border-input',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
      />
    </div>
  ),
)
Select.displayName = 'Select'
