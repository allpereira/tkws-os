import * as React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'

const seriesColors = [
  'var(--brand)',
  'var(--purple)',
  'var(--success)',
  'var(--warning)',
  'var(--alert)',
  'var(--danger)',
  'var(--pink)',
]

const tooltipStyle: React.CSSProperties = {
  background: 'var(--surface-3)',
  border: '1px solid var(--line-2)',
  borderRadius: 8,
  fontSize: 11,
  color: 'var(--text)',
}

const axisStyle = { fontSize: 10, fill: 'var(--text-mute)' }

export interface BarChartData {
  label: string
  value: number
  /** stack key opcional */
  group?: string
}

export function VerticalBar({
  data,
  height = 220,
  tone = 'brand',
}: {
  data: BarChartData[]
  height?: number
  tone?: 'brand' | 'success' | 'warning' | 'danger'
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="var(--line-1)" vertical={false} />
        <XAxis dataKey="label" tick={axisStyle} axisLine={{ stroke: 'var(--line-2)' }} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--surface-3)', opacity: 0.5 }} />
        <Bar dataKey="value" fill={`var(--${tone})`} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export interface DonutDatum {
  name: string
  value: number
  color?: string
}

export function Donut({
  data,
  height = 240,
  innerRadius = 60,
  outerRadius = 90,
}: {
  data: DonutDatum[]
  height?: number
  innerRadius?: number
  outerRadius?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ fontSize: 11, color: 'var(--text-soft)' }}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={1.5}
          stroke="var(--surface-1)"
          strokeWidth={2}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color ?? seriesColors[i % seriesColors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export interface LineSeries {
  name: string
  color?: string
}
export interface LinePoint {
  label: string
  [key: string]: number | string
}

export function LineSeriesChart({
  data,
  series,
  height = 240,
}: {
  data: LinePoint[]
  series: LineSeries[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="var(--line-1)" vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={axisStyle} axisLine={{ stroke: 'var(--line-2)' }} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--line-3)' }} />
        <Legend
          verticalAlign="top"
          iconType="circle"
          height={28}
          wrapperStyle={{ fontSize: 11, color: 'var(--text-soft)' }}
        />
        {series.map((s, i) => (
          <Line
            key={s.name}
            type="monotone"
            dataKey={s.name}
            stroke={s.color ?? seriesColors[i % seriesColors.length]}
            strokeWidth={1.8}
            dot={{ r: 2.5 }}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

/** Heatmap simples · grid CSS · usado em calendar/contributions. */
export function Heatmap({
  rows,
  cols,
  data,
  scale = ['rgba(116,199,228,0.06)', 'rgba(116,199,228,0.25)', 'rgba(116,199,228,0.55)', 'var(--brand)'],
  labelsX,
  labelsY,
}: {
  rows: number
  cols: number
  /** matriz [rows][cols] de 0..1 */
  data: number[][]
  scale?: string[]
  labelsX?: string[]
  labelsY?: string[]
}) {
  function colorFor(v: number) {
    const idx = Math.min(scale.length - 1, Math.floor(v * scale.length))
    return scale[idx]
  }
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid items-center gap-1" style={{ gridTemplateColumns: `28px repeat(${cols}, 1fr)` }}>
          <span className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
            {labelsY?.[r] ?? ''}
          </span>
          {Array.from({ length: cols }).map((_, c) => {
            const v = data[r]?.[c] ?? 0
            return (
              <div
                key={c}
                title={`${labelsY?.[r] ?? r}, ${labelsX?.[c] ?? c}: ${Math.round(v * 100)}%`}
                className="aspect-square min-w-3 rounded-[3px]"
                style={{ background: colorFor(v) }}
              />
            )
          })}
        </div>
      ))}
      {labelsX && (
        <div className="grid gap-1 pt-1" style={{ gridTemplateColumns: `28px repeat(${cols}, 1fr)` }}>
          <span />
          {labelsX.map((l, i) => (
            <span key={i} className="mono text-center text-[9px]" style={{ color: 'var(--text-mute)' }}>
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
