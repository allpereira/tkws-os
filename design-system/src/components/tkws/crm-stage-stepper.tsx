import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * StageStepper · indicador horizontal de estágio do funil de vendas.
 *   Estágios passados ficam preenchidos · estágio atual destacado em brand
 *   · futuros mais opacos. Click muda estágio se onChange.
 *
 * Diferente do WizardSteps (criação multi-step): este é READ + UPDATE de estágio
 * de um deal/lead em pipeline comercial.
 */

export interface Stage {
  id: string
  label: string
  /** Tom opcional do estágio (perdido = danger etc.) */
  tone?: 'brand' | 'success' | 'warning' | 'danger'
}

export interface StageStepperProps {
  stages: Stage[]
  /** Índice do estágio atual */
  current: number
  /** Click muda estágio · habilita progressão visual */
  onChange?: (index: number) => void
  /** Permite voltar a estágios anteriores · default true */
  allowBack?: boolean
  className?: string
}

const toneColor: Record<NonNullable<Stage['tone']>, string> = {
  brand: 'var(--brand)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
}

export function StageStepper({ stages, current, onChange, allowBack = true, className }: StageStepperProps) {
  return (
    <ol
      className={cn('flex items-center overflow-x-auto', className)}
      role="list"
      aria-label="Estágio do funil"
    >
      {stages.map((stage, i) => {
        const isPast = i < current
        const isCurrent = i === current
        const isFuture = i > current
        const currentTone = stage.tone ?? 'brand'
        const color = toneColor[currentTone]

        const clickable = onChange && (allowBack ? i <= current + 1 : i === current + 1)

        return (
          <React.Fragment key={stage.id}>
            <li className="flex shrink-0 items-center">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onChange?.(i)}
                className={cn(
                  'group flex items-center gap-2 rounded-md px-2.5 py-1.5 transition-all',
                  clickable && 'cursor-pointer hover:bg-white/[0.04]'
                )}
              >
                <span
                  className="mono inline-flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold"
                  style={{
                    background: isPast ? color : isCurrent ? color + '22' : 'transparent',
                    borderColor: isPast || isCurrent ? color : 'var(--line-3)',
                    color: isPast ? 'var(--bg)' : isCurrent ? color : 'var(--text-mute)',
                  }}
                >
                  {isPast ? <Check size={12} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className="whitespace-nowrap text-[12.5px] font-semibold"
                  style={{
                    color: isCurrent ? 'var(--text)' : isPast ? 'var(--text-soft)' : 'var(--text-mute)',
                    opacity: isFuture ? 0.7 : 1,
                  }}
                >
                  {stage.label}
                </span>
              </button>
            </li>
            {i < stages.length - 1 && (
              <li
                className="h-px min-w-6 flex-1"
                style={{
                  background: i < current ? color : 'var(--line-2)',
                }}
              />
            )}
          </React.Fragment>
        )
      })}
    </ol>
  )
}
