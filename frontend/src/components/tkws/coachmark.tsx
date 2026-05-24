import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-coachmark-stage:
 *   stage: bg linear-gradient navy · radius 12px · border dashed line-2 · padding 24px
 *   overlay: rgba(0,0,0,0.55) backdrop-blur 2px
 *   target: spot iluminado · box-shadow 0 0 0 9999px rgba(0,0,0,0.65) + 0 0 0 4px brand
 *   balloon: bg surface-1 · border 1px brand · radius 12px · padding 16/18 · shadow-3
 *     ::before: triangulo no topo-left
 *     step: mono 10px / tracking 1.5px uppercase brand · 700
 *     h5: Fraunces 18px · p: 13px text-soft
 *     dots: 6×6 line-3 · active 18×6 brand
 */

export interface CoachmarkProps {
  /** Texto do passo · ex: "Passo 2 de 4 · novidade" */
  step?: string
  /** Título · Fraunces 18px */
  title: React.ReactNode
  /** Descrição */
  description: React.ReactNode
  /** Total de dots na sequência */
  totalSteps?: number
  /** Índice atual (0-based) */
  currentStep?: number
  /** Conteúdo "alvo" do spotlight · ex: botão destacado */
  target: React.ReactNode
  /** Callback para próximo */
  onNext?: () => void
  /** Callback para pular */
  onSkip?: () => void
  /** Label do botão next · default "Próximo →" */
  nextLabel?: React.ReactNode
  className?: string
}

export function Coachmark({
  step,
  title,
  description,
  totalSteps = 1,
  currentStep = 0,
  target,
  onNext,
  onSkip,
  nextLabel = 'Próximo →',
  className,
}: CoachmarkProps) {
  return (
    <div
      className={cn('relative min-h-[360px] overflow-hidden rounded-[12px] border border-dashed p-6', className)}
      style={{
        background: 'linear-gradient(135deg, #08263F 0%, #0E3A5E 100%)',
        borderColor: 'var(--line-2)',
      }}
    >
      {/* Overlay escuro */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Target · spotlight */}
      <div
        className="absolute top-[60px] left-[80px] flex h-[60px] w-[200px] items-center rounded-[10px] px-[18px] font-semibold"
        style={{
          background: 'var(--surface-1)',
          color: 'var(--text)',
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.65), 0 0 0 4px var(--brand)',
          zIndex: 1,
        }}
      >
        {target}
      </div>

      {/* Balloon */}
      <div
        className="absolute top-[140px] left-[80px] w-[320px] rounded-[12px] border p-4"
        style={{
          background: 'var(--surface-1)',
          borderColor: 'var(--brand)',
          boxShadow: 'var(--shadow-3)',
          zIndex: 2,
        }}
      >
        <span
          className="absolute -top-[7px] left-6 h-3 w-3 rotate-45"
          style={{
            background: 'var(--surface-1)',
            borderTop: '1px solid var(--brand)',
            borderLeft: '1px solid var(--brand)',
          }}
        />
        {step && (
          <div
            className="mono mb-1.5 text-[10px] font-bold uppercase tracking-[1.5px]"
            style={{ color: 'var(--brand)' }}
          >
            {step}
          </div>
        )}
        <h5
          className="serif mb-1.5 text-[18px] font-normal"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
        >
          {title}
        </h5>
        <p className="text-[13px] leading-[1.5]" style={{ color: 'var(--text-soft)' }}>
          {description}
        </p>

        <div className="mt-3.5 flex items-center justify-between gap-2">
          {totalSteps > 1 && (
            <span className="inline-flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => {
                const active = i === currentStep
                return (
                  <span
                    key={i}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: active ? 18 : 6,
                      background: active ? 'var(--brand)' : 'var(--line-3)',
                    }}
                  />
                )
              })}
            </span>
          )}
          <span className="ml-auto inline-flex gap-1.5">
            {onSkip && (
              <Button variant="ghost" size="sm" onClick={onSkip}>
                Pular
              </Button>
            )}
            {onNext && (
              <Button size="sm" onClick={onNext}>
                {nextLabel}
              </Button>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
