import * as React from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from 'recharts'
import { cn } from '@/lib/utils'

export interface KpiSeriesPoint {
  label: string
  value: number
}

export interface KpiHeroProps {
  label: string
  value: string
  hint?: string
  delta?: { value: string; trend: 'up' | 'down' | 'neutral' }
  series?: KpiSeriesPoint[]
  className?: string
}

const trendColor = {
  up: 'var(--success)',
  down: 'var(--danger)',
  neutral: 'var(--text-mute)',
}

export function KpiHero({ label, value, hint, delta, series, className }: KpiHeroProps) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-xl border p-5', className)}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-1)',
      }}
    >
      <div
        className="mono text-[10.5px] font-bold uppercase tracking-[1.6px]"
        style={{ color: 'var(--text-mute)' }}
      >
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-2.5">
        <span
          className="serif text-[40px] font-light leading-none tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          {value}
        </span>
        {delta && (
          <span
            className="mono inline-flex items-center gap-1 text-[11.5px] font-bold"
            style={{ color: trendColor[delta.trend] }}
          >
            {delta.trend === 'up' && <TrendingUp size={12} />}
            {delta.trend === 'down' && <TrendingDown size={12} />}
            {delta.value}
          </span>
        )}
      </div>
      {hint && (
        <div className="mt-2 text-[12px]" style={{ color: 'var(--text-soft)' }}>
          {hint}
        </div>
      )}
      {series && series.length > 0 && (
        <div className="mt-4 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="kpi-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={{ stroke: 'var(--line-3)' }}
                contentStyle={{
                  background: 'var(--surface-3)',
                  border: '1px solid var(--line-2)',
                  borderRadius: 8,
                  fontSize: 11,
                  color: 'var(--text)',
                }}
                labelStyle={{ color: 'var(--text-mute)' }}
                formatter={(v: number) => [v, label]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--brand)"
                strokeWidth={1.5}
                fill="url(#kpi-grad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export function KpiMini({
  label,
  value,
  hint,
  tone = 'brand',
  className,
}: {
  label: string
  value: string
  hint?: string
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
  className?: string
}) {
  const valueColor =
    tone === 'brand'
      ? 'var(--text)'
      : tone === 'neutral'
      ? 'var(--text-soft)'
      : `var(--${tone})`

  return (
    <div
      className={cn('rounded-lg border p-3.5', className)}
      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
    >
      <div
        className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]"
        style={{ color: 'var(--text-mute)' }}
      >
        {label}
      </div>
      <div
        className="serif mt-1.5 text-[24px] font-light leading-none tracking-tight"
        style={{ color: valueColor }}
      >
        {value}
      </div>
      {hint && (
        <div className="mono mt-1 text-[10px]" style={{ color: 'var(--text-mute)' }}>
          {hint}
        </div>
      )}
    </div>
  )
}
