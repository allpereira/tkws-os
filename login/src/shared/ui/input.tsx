import { forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md px-3 py-2',
          'bg-surface-2 border',
          'text-sm text-ink-1 placeholder:text-ink-4',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:border-brand/60',
          'disabled:cursor-not-allowed disabled:opacity-40',
          'autofill:bg-surface-2',
          error
            ? 'border-danger/60 focus-visible:ring-danger/40'
            : 'border-line-2 hover:border-line-3',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
