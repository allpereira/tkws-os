/**
 * Logo TKWS OS — brand-block editorial.
 *
 * Espelha o `brand-block` do design system (auth flows): wordmark "TKWS *OS*"
 * em Fraunces light com o "OS" em itálico cyan, acompanhado de uma tag
 * monospaced opcional (ex.: "v1.0") em pill brand.
 *
 * Ver: design-system V1, seção 09.6 Auth flows e tokens `--brand` / `--text`.
 */
import { cn } from '@/shared/lib/utils';

interface LogoProps {
  className?: string;
  /** Tamanho do wordmark. */
  size?: 'sm' | 'md' | 'lg';
  /** Tag opcional ao lado do wordmark (ex.: "v1.0", "BETA"). */
  tag?: string;
}

const sizes = {
  sm: { wordmark: 'text-xl', tag: 'text-[8px] px-1.5 py-[2px]' },
  md: { wordmark: 'text-[28px]', tag: 'text-[9px] px-[7px] py-[3px]' },
  lg: { wordmark: 'text-[36px]', tag: 'text-[10px] px-2 py-[3px]' },
};

export function Logo({ className, size = 'md', tag }: LogoProps) {
  const s = sizes[size];
  return (
    <div className={cn('inline-flex items-baseline gap-2.5', className)}>
      <span
        className={cn(
          'font-editorial font-light leading-none tracking-[-0.02em] text-ink-1',
          s.wordmark,
        )}
      >
        TKWS <em className="font-editorial italic text-brand">OS</em>
      </span>
      {tag && (
        <span
          className={cn(
            'font-mono font-extrabold leading-none tracking-[0.12em]',
            'rounded bg-brand text-bg',
            s.tag,
          )}
        >
          {tag}
        </span>
      )}
    </div>
  );
}
