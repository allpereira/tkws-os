/**
 * Logo TKWS OS — wordmark editorial
 * Usa a fonte Fraunces (serif editorial) para o "TKWS" e Inter light para "OS"
 */
import { cn } from '@/shared/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { tkws: 'text-xl', os: 'text-xs', gap: 'gap-1.5' },
  md: { tkws: 'text-3xl', os: 'text-sm', gap: 'gap-2' },
  lg: { tkws: 'text-4xl', os: 'text-base', gap: 'gap-2.5' },
};

export function Logo({ className, size = 'md' }: LogoProps) {
  const s = sizes[size];
  return (
    <div className={cn('flex items-baseline', s.gap, className)}>
      <span
        className={cn(
          'font-editorial font-light tracking-tight text-ink-1',
          s.tkws,
        )}
      >
        TKWS
      </span>
      <span
        className={cn(
          'font-sans font-light tracking-[0.18em] uppercase text-brand',
          s.os,
        )}
      >
        OS
      </span>
    </div>
  );
}
