import * as React from 'react'
import { cn } from '@/lib/utils'

export interface GanttTask {
  id: string
  name: string
  /** índice 0..periods.length-1 · início */
  startCol: number
  /** quantos colunas ocupa (>= 1) */
  span: number
  /** % de execução 0..100 */
  progress?: number
  tone?: 'brand' | 'success' | 'warning' | 'alert' | 'danger' | 'purple' | 'pink'
  assignee?: string
}

const toneColor: Record<NonNullable<GanttTask['tone']>, string> = {
  brand: 'var(--brand)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  alert: 'var(--alert)',
  danger: 'var(--danger)',
  purple: 'var(--purple)',
  pink: 'var(--pink)',
}

export interface GanttProps {
  /** colunas de tempo · "Mar 1", "Mar 8", "Mar 15"… */
  periods: string[]
  tasks: GanttTask[]
  /** Largura mínima da coluna de label · default 200px */
  labelWidth?: number
  className?: string
}

export function Gantt({ periods, tasks, labelWidth = 200, className }: GanttProps) {
  const gridCols = `${labelWidth}px repeat(${periods.length}, minmax(60px, 1fr))`
  return (
    <div
      className={cn('overflow-x-auto rounded-xl border', className)}
      style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
    >
      <div style={{ minWidth: labelWidth + periods.length * 60 }}>
        {/* Header */}
        <div
          className="grid border-b"
          style={{ gridTemplateColumns: gridCols, borderColor: 'var(--line-1)' }}
        >
          <div
            className="mono px-3 py-2 text-[10.5px] font-bold uppercase tracking-[1.4px]"
            style={{ color: 'var(--text-mute)', background: 'var(--surface-2)' }}
          >
            Tarefa
          </div>
          {periods.map((p) => (
            <div
              key={p}
              className="mono border-l px-2 py-2 text-center text-[10px] font-bold uppercase tracking-[1.4px]"
              style={{
                borderColor: 'var(--line-1)',
                color: 'var(--text-mute)',
                background: 'var(--surface-2)',
              }}
            >
              {p}
            </div>
          ))}
        </div>

        {/* Rows */}
        {tasks.map((task) => {
          const tone = task.tone ?? 'brand'
          const color = toneColor[tone]
          return (
            <div
              key={task.id}
              className="grid border-b last:border-0"
              style={{ gridTemplateColumns: gridCols, borderColor: 'var(--line-1)' }}
            >
              <div className="flex flex-col justify-center px-3 py-2.5">
                <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
                  {task.name}
                </span>
                {task.assignee && (
                  <span className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                    {task.assignee}
                  </span>
                )}
              </div>
              <div
                className="relative col-span-full grid"
                style={{
                  gridTemplateColumns: `repeat(${periods.length}, minmax(60px, 1fr))`,
                  gridColumn: `2 / span ${periods.length}`,
                }}
              >
                {periods.map((_, i) => (
                  <div
                    key={i}
                    className="h-full border-l"
                    style={{ borderColor: 'var(--line-1)' }}
                  />
                ))}
                <div
                  className="absolute top-1/2 -translate-y-1/2 overflow-hidden rounded-md shadow-sm"
                  style={{
                    background: color + '24',
                    border: `1px solid ${color}`,
                    left: `${(task.startCol / periods.length) * 100}%`,
                    width: `${(task.span / periods.length) * 100}%`,
                    height: 22,
                  }}
                >
                  {typeof task.progress === 'number' && (
                    <div
                      className="h-full"
                      style={{ width: `${task.progress}%`, background: color }}
                    />
                  )}
                  <span
                    className="mono absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text)' }}
                  >
                    {task.progress ?? 0}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
