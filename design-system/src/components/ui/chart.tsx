import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Chart container · wrapper shadcn-style para recharts.
 * Aplica os tokens TKWS (axis, grid, tooltip) automaticamente via CSS variables.
 *
 * Uso:
 *   const config = { revenue: { label: 'Receita', color: 'var(--brand)' } }
 *   <ChartContainer config={config}>
 *     <BarChart data={...}>...</BarChart>
 *   </ChartContainer>
 */

export type ChartConfig = Record<string, { label: string; color: string }>

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)
export const useChartConfig = () => React.useContext(ChartContext)

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { config: ChartConfig; aspect?: number }
>(({ className, config, aspect = 16 / 9, children, style, ...props }, ref) => (
  <ChartContext.Provider value={{ config }}>
    <div
      ref={ref}
      className={cn('w-full', className)}
      style={{ aspectRatio: aspect, ...style }}
      {...props}
    >
      {children}
    </div>
  </ChartContext.Provider>
))
ChartContainer.displayName = 'ChartContainer'

export function ChartLegend({ payload }: any) {
  const ctx = useChartConfig()
  if (!payload || !payload.length) return null
  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[11px]" style={{ color: 'var(--text-soft)' }}>
      {payload.map((entry: any) => {
        const key = entry.dataKey ?? entry.value
        const label = ctx?.config[key]?.label ?? entry.value
        const color = entry.color
        return (
          <span key={key} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            {label}
          </span>
        )
      })}
    </div>
  )
}

export function ChartTooltipContent({ active, payload, label }: any) {
  const ctx = useChartConfig()
  if (!active || !payload || !payload.length) return null
  return (
    <div
      className="rounded-lg border p-2 text-[11px] shadow-lg"
      style={{ background: 'var(--surface-3)', borderColor: 'var(--line-2)', color: 'var(--text)' }}
    >
      <div className="mono mb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-mute)' }}>
        {label}
      </div>
      {payload.map((entry: any) => {
        const key = entry.dataKey
        const cfgLabel = ctx?.config[key]?.label ?? key
        return (
          <div key={key} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--text-soft)' }}>
              <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
              {cfgLabel}
            </span>
            <span className="mono font-semibold">{entry.value}</span>
          </div>
        )
      })}
    </div>
  )
}
