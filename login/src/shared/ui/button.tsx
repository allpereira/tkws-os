import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-md font-medium text-sm',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
    'disabled:pointer-events-none disabled:opacity-40',
    'select-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand text-bg font-semibold',
          'hover:bg-brand-hover active:bg-brand-press',
          'shadow-sm hover:shadow-glow',
        ],
        secondary: [
          'bg-surface-2 text-ink-2 border border-line-2',
          'hover:bg-surface-3 hover:border-line-3 active:bg-surface-3',
        ],
        ghost: [
          'bg-transparent text-ink-3',
          'hover:bg-brand-soft hover:text-ink-1',
        ],
        danger: [
          'bg-danger/10 text-danger border border-danger/30',
          'hover:bg-danger/20 hover:border-danger/50',
        ],
        link: [
          'bg-transparent text-brand underline-offset-4',
          'hover:underline hover:text-brand-hover',
          'p-0 h-auto',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={loading ?? disabled}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { buttonVariants };
