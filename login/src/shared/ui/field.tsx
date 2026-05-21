/**
 * Field — wrapper de Label + Input + mensagem de erro.
 * Encapsula o padrão repetitivo de formulários.
 */
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-ink-3 tracking-wide uppercase leading-none"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-danger leading-snug">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-ink-4 leading-snug">{hint}</p>
      )}
    </div>
  );
}
