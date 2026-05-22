/**
 * AuthStage — layout split-screen editorial das telas de autenticação.
 *
 * Espelha o `.auth-stage` do design system (seção 09.6): card 14px de raio,
 * dois painéis 1fr/1fr, esquerda em gradient navy + ruído + frase Fraunces,
 * direita em surface-1 com formulário. Em telas < 760px o painel da esquerda
 * é ocultado.
 *
 * Ver: design-system V1, `.auth-stage`, `.auth-art`, `.auth-form`.
 */
import type { ReactNode } from 'react';
import { Logo } from '@/shared/ui/logo';
import { cn } from '@/shared/lib/utils';

interface AuthStageProps {
  /** Frase em destaque no painel esquerdo (suporta <em> para itálico cyan). */
  quote: ReactNode;
  /** Citação curta abaixo da frase (ex.: "· The TKWS OS Manifesto"). */
  quoteCite: string;
  /** Texto monospaced à esquerda do meta-row. */
  metaLeft: string;
  /** Texto monospaced à direita do meta-row. */
  metaRight: string;
  /** Conteúdo do formulário (lado direito do split). */
  children: ReactNode;
  /** Variante do brand-block — versão (default: "v1.0"). */
  tag?: string;
  /** Largura máxima do form interno (default: 380px). */
  formMaxWidth?: string;
}

export function AuthStage({
  quote,
  quoteCite,
  metaLeft,
  metaRight,
  tag = 'v1.0',
  formMaxWidth = '380px',
  children,
}: AuthStageProps) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-bg p-4 md:p-8">
      <div
        className={cn(
          'grid w-full max-w-[1080px] overflow-hidden',
          'rounded-[14px] border border-line-2 shadow-card-lg',
          'min-h-[540px] grid-cols-1 md:grid-cols-2',
        )}
      >
        {/* ── Painel esquerdo: gradient + noise + texto editorial ─────────── */}
        <aside
          className={cn(
            'relative hidden flex-col justify-between overflow-hidden p-10 md:flex',
          )}
          style={{
            background:
              'linear-gradient(135deg, #08263F 0%, #103E66 50%, #0E3A5E 100%)',
          }}
          aria-hidden="true"
        >
          {/* Ruído sutil — mix-blend overlay */}
          <div className="pointer-events-none absolute inset-0 mix-blend-overlay bg-noise" />

          {/* Brand block */}
          <div className="relative z-[1]">
            <Logo size="md" tag={tag} />
          </div>

          {/* Quote editorial */}
          <div className="relative z-[1]">
            <blockquote className="max-w-[340px] font-editorial text-[28px] font-light leading-[1.2] tracking-[-0.025em] text-ink-1 [&_em]:italic [&_em]:text-brand">
              {quote}
            </blockquote>
            <cite className="mt-[18px] block font-mono text-[10px] not-italic uppercase tracking-[0.15em] text-ink-4">
              {quoteCite}
            </cite>
          </div>

          {/* Meta row */}
          <div className="relative z-[1] flex justify-between font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-4">
            <span>{metaLeft}</span>
            <span>{metaRight}</span>
          </div>
        </aside>

        {/* ── Painel direito: formulário ─────────────────────────────────── */}
        <section className="flex flex-col justify-center bg-surface-1 px-7 py-10 md:px-12 md:py-14">
          <div
            className="mx-auto w-full"
            style={{ maxWidth: formMaxWidth }}
          >
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
