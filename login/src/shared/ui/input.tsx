import { forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    // Espelha o `.ds-input` do design system: 10px de border-radius, padding
    // 10px×13px, surface-2 com border line-2; foco vira borda brand + surface-1.
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex w-full rounded-[10px] px-[13px] py-[10px]',
          'bg-surface-2 border',
          'text-sm text-ink-1 placeholder:text-ink-4',
          'transition-[border-color,background-color] duration-150',
          'focus-visible:outline-none focus-visible:border-brand focus-visible:bg-surface-1',
          'disabled:cursor-not-allowed disabled:opacity-40',
          'autofill:bg-surface-2',
          error
            ? 'border-danger/60 focus-visible:border-danger'
            : 'border-line-2 hover:border-line-3',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
