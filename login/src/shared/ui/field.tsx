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
  // Espelha o par `.ds-field` + `.ds-label` do design system:
  // label monospaced 10.5px uppercase com tracking 1.2px, gap 6px label/input.
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[10.5px] font-semibold uppercase leading-none tracking-[0.12em] text-ink-4"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs leading-snug text-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs leading-snug text-ink-4">{hint}</p>
      )}
    </div>
  );
}
