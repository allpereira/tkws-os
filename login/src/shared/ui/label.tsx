import { forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';

export const Label = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'block text-xs font-medium text-ink-3 tracking-wide uppercase',
      'leading-none mb-1.5',
      className,
    )}
    {...props}
  />
));

Label.displayName = 'Label';
