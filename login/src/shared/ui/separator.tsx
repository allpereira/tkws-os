/**
 * Separator — espelha o `Separator` do design system.
 * Com `label`, renderiza um divisor horizontal com texto monospaced
 * centralizado (ex.: "OU CONTINUE COM"). Sem `label`, é só uma linha.
 */
import { cn } from '@/shared/lib/utils';

interface SeparatorProps {
  label?: string;
  className?: string;
}

export function Separator({ label, className }: SeparatorProps) {
  if (label) {
    return (
      <div className={cn('my-1 flex items-center gap-3', className)}>
        <span className="h-px flex-1 bg-line-1" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-4">
          {label}
        </span>
        <span className="h-px flex-1 bg-line-1" />
      </div>
    );
  }

  return <div className={cn('h-px w-full bg-line-1', className)} role="separator" />;
}
