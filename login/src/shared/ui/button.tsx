import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

// Espelha o `.ds-btn` do design system: rounded 10px, font 13px semibold,
// gap 6px entre ícone e label, padding 10/16. Tamanho `lg` cobre o submit
// principal das telas de auth (full-width + padding 12px + 14px).
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-1.5 whitespace-nowrap',
    'rounded-[10px] font-semibold',
    'transition-[background-color,border-color,color] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
    'disabled:pointer-events-none disabled:opacity-40',
    'select-none',
    'border border-transparent',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand text-bg',
          'hover:bg-brand-hover active:bg-brand-press',
        ],
        secondary: [
          'bg-transparent text-brand border-brand',
          'hover:bg-brand-soft',
        ],
        ghost: [
          'bg-transparent text-ink-1',
          'hover:bg-brand-soft',
        ],
        outline: [
          'bg-transparent text-ink-1 border-line-2',
          'hover:bg-surface-2 hover:border-line-3',
        ],
        danger: [
          'bg-danger/10 text-danger border-danger/30',
          'hover:bg-danger/20 hover:border-danger/50',
        ],
        link: [
          'bg-transparent text-brand underline-offset-4',
          'hover:underline hover:text-brand-hover',
          'p-0 h-auto',
        ],
      },
      size: {
        sm: 'px-3 py-[7px] text-xs',
        md: 'px-4 py-[10px] text-[13px]',
        lg: 'w-full px-4 py-3 text-sm',
        icon: 'h-10 w-10 p-0',
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
