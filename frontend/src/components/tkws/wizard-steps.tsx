import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface WizardStep {
  label: string
  description?: string
}

export interface WizardStepsProps {
  steps: WizardStep[]
  /** índice do step atual */
  current: number
  className?: string
  onStepClick?: (index: number) => void
}

export function WizardSteps({ steps, current, className, onStepClick }: WizardStepsProps) {
  return (
    <ol
      className={cn(
        'flex items-center gap-2 overflow-x-auto rounded-xl border p-4',
        className
      )}
      style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
    >
      {steps.map((step, i) => {
        const isDone = i < current
        const isCurrent = i === current
        const isClickable = onStepClick && isDone
        return (
          <React.Fragment key={i}>
            <li
              onClick={() => isClickable && onStepClick(i)}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-md px-2 py-1',
                isClickable && 'cursor-pointer hover:brightness-110'
              )}
            >
              <span
                className="mono inline-flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold"
                style={{
                  borderColor: isCurrent || isDone ? 'var(--brand)' : 'var(--line-3)',
                  background: isDone ? 'var(--brand)' : isCurrent ? 'var(--brand-soft)' : 'transparent',
                  color: isDone ? 'var(--bg)' : isCurrent ? 'var(--brand)' : 'var(--text-mute)',
                }}
              >
                {isDone ? <Check size={12} strokeWidth={3} /> : i + 1}
              </span>
              <div className="flex flex-col leading-tight">
                <span
                  className="text-[12.5px] font-bold"
                  style={{ color: isCurrent ? 'var(--text)' : isDone ? 'var(--text-soft)' : 'var(--text-mute)' }}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                    {step.description}
                  </span>
                )}
              </div>
            </li>
            {i < steps.length - 1 && (
              <span
                className="h-px min-w-6 flex-1"
                style={{
                  background: i < current ? 'var(--brand)' : 'var(--line-2)',
                }}
              />
            )}
          </React.Fragment>
        )
      })}
    </ol>
  )
}
