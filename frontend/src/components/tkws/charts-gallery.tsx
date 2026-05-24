import { cn } from '@/lib/utils'

/**
 * Charts Gallery · família ampla de gráficos editoriais TKWS.
 *
 * Todos sem dependência Recharts · SVG/CSS puros · tokens via CSS vars.
 * Fiel ao tom editorial: tipografia Fraunces nos números grandes,
 * mono para labels, sem grids verbosos, brand como cor primária.
 *
 * Tipos:
 *   - Sparkline · mini line/area inline
 *   - Gauge · medidor 0-100 semicircular
 *   - Waterfall · entradas e saídas cumulativas
 *   - Treemap · proporção visual por área
 *   - RadarChart · spider chart multi-eixo
 *   - BulletChart · KPI com meta + atual + faixas
 *   - RangeBar · barra com min/max + valor atual
 *   - FunnelChart · etapas com %
 *   - StackedBar · barras empilhadas por categoria
 *   - GroupedBar · barras agrupadas
 *   - CalendarHeatmap · ano inteiro (estilo GitHub contributions)
 *   - BurndownChart · linha vs ideal
 *   - ScatterPlot · pontos x/y
 *   - PolarArea · pie com raios variáveis
 */

// =============================================================================
// 1. SPARKLINE · mini line/area inline (24-40px)
// =============================================================================

export interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'purple' | 'pink'
  variant?: 'line' | 'area' | 'bars'
  showDot?: boolean
  className?: string
}

export function Sparkline({
  data,
  width = 100,
  height = 32,
  tone = 'brand',
  variant = 'line',
  showDot = true,
  className,
}: SparklineProps) {
  if (data.length === 0) return null
  const color = `var(--${tone})`
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = data.length === 1 ? 0 : width / (data.length - 1)

  const points = data.map((v, i) => ({
    x: i * stepX,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  if (variant === 'bars') {
    const barW = (width / data.length) * 0.7
    return (
      <svg width={width} height={height} className={className}>
        {data.map((v, i) => {
          const barH = ((v - min) / range) * (height - 2)
          return (
            <rect
              key={i}
              x={i * (width / data.length) + (width / data.length - barW) / 2}
              y={height - barH}
              width={barW}
              height={barH}
              rx={1}
              fill={color}
              opacity={0.85}
            />
          )
        })}
      </svg>
    )
  }

  return (
    <svg width={width} height={height} className={className}>
      {variant === 'area' && (
        <path d={areaPath} fill={color} opacity={0.18} />
      )}
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {showDot && (
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={2.5} fill={color} />
      )}
    </svg>
  )
}

// =============================================================================
// 2. GAUGE · medidor 0-100 semicircular
// =============================================================================

export interface GaugeProps {
  value: number // 0-100
  size?: number
  thickness?: number
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'auto'
  label?: string
  hint?: string
  className?: string
}

export function Gauge({
  value,
  size = 160,
  thickness = 14,
  tone = 'auto',
  label,
  hint,
  className,
}: GaugeProps) {
  const v = Math.max(0, Math.min(100, value))
  const radius = size / 2 - thickness / 2 - 2
  const cx = size / 2
  const cy = size - 6
  const arc = Math.PI * radius
  const offset = arc - (v / 100) * arc

  const autoTone = v < 33 ? 'danger' : v < 66 ? 'warning' : 'success'
  const color = `var(--${tone === 'auto' ? autoTone : tone})`

  return (
    <div className={cn('inline-flex flex-col items-center gap-1', className)}>
      <svg width={size} height={cy + 16} viewBox={`0 0 ${size} ${cy + 16}`}>
        <path
          d={`M ${thickness / 2 + 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - thickness / 2 - 2} ${cy}`}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={thickness}
          strokeLinecap="round"
        />
        <path
          d={`M ${thickness / 2 + 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - thickness / 2 - 2} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={arc}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,.2,.2,1)' }}
        />
        <text
          x={cx}
          y={cy - 14}
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontSize={size / 4.5}
          fontWeight={300}
          letterSpacing="-0.02em"
          fill="var(--text)"
        >
          {Math.round(v)}
          <tspan fontSize={size / 12} fill="var(--text-mute)" dx="2">%</tspan>
        </text>
      </svg>
      {label && (
        <div className="mono text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
          {label}
        </div>
      )}
      {hint && (
        <div className="text-[11px]" style={{ color: 'var(--text-soft)' }}>
          {hint}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// 3. WATERFALL · entradas e saídas cumulativas
// =============================================================================

export interface WaterfallBar {
  label: string
  value: number // positivo = ganho, negativo = perda
  type?: 'start' | 'end' | 'positive' | 'negative'
}

export interface WaterfallProps {
  bars: WaterfallBar[]
  width?: number
  height?: number
  className?: string
}

export function Waterfall({ bars, width = 720, height = 240, className }: WaterfallProps) {
  // Calcula cumulativos para posicionar barras
  let running = 0
  const computed = bars.map((b) => {
    const type =
      b.type ??
      (b === bars[0] ? 'start' : b === bars[bars.length - 1] ? 'end' : b.value >= 0 ? 'positive' : 'negative')
    const start = type === 'start' ? 0 : type === 'end' ? 0 : running
    const end = type === 'end' ? running + b.value : running + b.value
    const result = { ...b, type, start, end, total: running + (type === 'start' ? b.value : type === 'end' ? 0 : b.value) }
    if (type === 'start' || type === 'positive') running += b.value
    if (type === 'negative') running += b.value
    if (type === 'end') {
      result.start = 0
      result.end = running
    }
    return result
  })

  const allValues = computed.flatMap((b) => [b.start, b.end])
  const min = Math.min(0, ...allValues)
  const max = Math.max(...allValues)
  const range = max - min || 1
  const colW = (width - 40) / bars.length
  const gap = colW * 0.25
  const barW = colW - gap

  const toneOf = (t: string) =>
    t === 'start' || t === 'end' ? 'var(--brand)' : t === 'positive' ? 'var(--success)' : 'var(--danger)'

  return (
    <svg width={width} height={height} className={className}>
      {/* eixo zero */}
      <line
        x1={20}
        x2={width - 20}
        y1={height - 24 - ((0 - min) / range) * (height - 50)}
        y2={height - 24 - ((0 - min) / range) * (height - 50)}
        stroke="var(--line-2)"
        strokeDasharray="2 3"
      />
      {computed.map((b, i) => {
        const yTop = height - 24 - ((Math.max(b.start, b.end) - min) / range) * (height - 50)
        const yBot = height - 24 - ((Math.min(b.start, b.end) - min) / range) * (height - 50)
        const h = Math.max(2, yBot - yTop)
        const x = 20 + i * colW + gap / 2
        return (
          <g key={i}>
            <rect
              x={x}
              y={yTop}
              width={barW}
              height={h}
              fill={toneOf(b.type)}
              opacity={0.92}
              rx={2}
            />
            <text
              x={x + barW / 2}
              y={yTop - 6}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="10"
              fontWeight="600"
              fill="var(--text)"
            >
              {b.value > 0 ? '+' : ''}
              {b.value}
            </text>
            <text
              x={x + barW / 2}
              y={height - 8}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="9"
              letterSpacing="0.5"
              fill="var(--text-mute)"
            >
              {b.label.toUpperCase()}
            </text>
            {i < computed.length - 1 && (
              <line
                x1={x + barW}
                x2={20 + (i + 1) * colW + gap / 2}
                y1={b.type === 'negative' ? yBot : yTop}
                y2={b.type === 'negative' ? yBot : yTop}
                stroke="var(--line-3)"
                strokeDasharray="2 2"
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}

// =============================================================================
// 4. TREEMAP · proporção por área
// =============================================================================

export interface TreemapCell {
  label: string
  value: number
  tone?: 'brand' | 'success' | 'warning' | 'alert' | 'danger' | 'purple' | 'pink'
}

export interface TreemapProps {
  cells: TreemapCell[]
  width?: number
  height?: number
  className?: string
}

export function Treemap({ cells, width = 600, height = 320, className }: TreemapProps) {
  // squarified-ish · simples por colunas alternadas
  const total = cells.reduce((a, c) => a + c.value, 0)
  const sorted = [...cells].sort((a, b) => b.value - a.value)

  // layout simples · primeira ocupa metade, depois divide horizontal/vertical alternado
  let placed: { cell: TreemapCell; x: number; y: number; w: number; h: number }[] = []
  let cursorX = 0
  let cursorY = 0
  let remainingW = width
  let remainingH = height
  let horizontal = true

  sorted.forEach((c, i) => {
    const ratio = c.value / total
    if (i === sorted.length - 1) {
      // último ocupa o resto
      placed.push({ cell: c, x: cursorX, y: cursorY, w: remainingW, h: remainingH })
      return
    }
    if (horizontal) {
      const w = Math.round(remainingW * (ratio * total / (sorted.slice(i).reduce((a, x) => a + x.value, 0))))
      placed.push({ cell: c, x: cursorX, y: cursorY, w, h: remainingH })
      cursorX += w
      remainingW -= w
    } else {
      const h = Math.round(remainingH * (ratio * total / (sorted.slice(i).reduce((a, x) => a + x.value, 0))))
      placed.push({ cell: c, x: cursorX, y: cursorY, w: remainingW, h })
      cursorY += h
      remainingH -= h
    }
    horizontal = !horizontal
  })

  return (
    <svg width={width} height={height} className={className}>
      {placed.map((p, i) => {
        const tone = p.cell.tone ?? (['brand', 'success', 'purple', 'warning', 'pink', 'alert', 'danger'] as const)[i % 7]
        return (
          <g key={i}>
            <rect
              x={p.x + 2}
              y={p.y + 2}
              width={Math.max(0, p.w - 4)}
              height={Math.max(0, p.h - 4)}
              fill={`var(--${tone})`}
              opacity={0.18}
              stroke={`var(--${tone})`}
              strokeWidth={1.5}
              rx={6}
            />
            <text
              x={p.x + 12}
              y={p.y + 20}
              fontFamily="JetBrains Mono, monospace"
              fontSize="9.5"
              letterSpacing="1.2"
              fill="var(--text-mute)"
            >
              {p.cell.label.toUpperCase()}
            </text>
            <text
              x={p.x + 12}
              y={p.y + 44}
              fontFamily="Fraunces, serif"
              fontSize={Math.min(28, p.w / 6, p.h / 4)}
              fontWeight={300}
              letterSpacing="-0.025em"
              fill={`var(--${tone})`}
            >
              {p.cell.value}
            </text>
            <text
              x={p.x + 12}
              y={p.y + p.h - 12}
              fontFamily="JetBrains Mono, monospace"
              fontSize="9"
              fill="var(--text-mute)"
            >
              {Math.round((p.cell.value / total) * 100)}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// =============================================================================
// 5. RADAR CHART · spider chart multi-eixo
// =============================================================================

export interface RadarAxis {
  label: string
  value: number // 0-100
  /** Comparativo opcional · linha em segunda cor */
  compare?: number
}

export interface RadarChartProps {
  axes: RadarAxis[]
  size?: number
  className?: string
}

export function RadarChart({ axes, size = 280, className }: RadarChartProps) {
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 36
  const angleStep = (Math.PI * 2) / axes.length

  const point = (i: number, v: number, r: number = radius) => {
    const a = i * angleStep - Math.PI / 2
    const dist = (v / 100) * r
    return { x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist, ax: cx + Math.cos(a) * r, ay: cy + Math.sin(a) * r }
  }

  const polygon = axes.map((a, i) => point(i, a.value)).map((p) => `${p.x},${p.y}`).join(' ')
  const comparePolygon = axes
    .filter((a) => a.compare !== undefined)
    .map((a, i) => point(i, a.compare!))
    .map((p) => `${p.x},${p.y}`)
    .join(' ')

  return (
    <svg width={size} height={size} className={className}>
      {/* anéis */}
      {[0.25, 0.5, 0.75, 1].map((r, i) => (
        <polygon
          key={i}
          points={axes
            .map((_, j) => {
              const p = point(j, r * 100)
              return `${p.x},${p.y}`
            })
            .join(' ')}
          fill="none"
          stroke="var(--line-1)"
          strokeWidth={0.8}
          strokeDasharray={r === 1 ? '0' : '2 3'}
        />
      ))}
      {/* eixos */}
      {axes.map((_, i) => {
        const p = point(i, 100)
        return (
          <line key={i} x1={cx} y1={cy} x2={p.ax} y2={p.ay} stroke="var(--line-1)" strokeWidth={0.8} />
        )
      })}
      {/* comparativo */}
      {comparePolygon && (
        <polygon
          points={comparePolygon}
          fill="var(--text-mute)"
          fillOpacity={0.1}
          stroke="var(--text-mute)"
          strokeWidth={1.2}
          strokeDasharray="3 3"
        />
      )}
      {/* área principal */}
      <polygon
        points={polygon}
        fill="var(--brand)"
        fillOpacity={0.2}
        stroke="var(--brand)"
        strokeWidth={1.5}
      />
      {/* pontos */}
      {axes.map((a, i) => {
        const p = point(i, a.value)
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill="var(--brand)" />
      })}
      {/* labels */}
      {axes.map((a, i) => {
        const p = point(i, 122)
        return (
          <text
            key={i}
            x={p.ax}
            y={p.ay}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9.5"
            letterSpacing="0.8"
            fill="var(--text-soft)"
          >
            {a.label.toUpperCase()}
          </text>
        )
      })}
    </svg>
  )
}

// =============================================================================
// 6. BULLET CHART · KPI atual vs meta com faixas
// =============================================================================

export interface BulletChartProps {
  label: string
  actual: number
  target: number
  max: number
  ranges?: { value: number; tone: 'danger' | 'warning' | 'success' }[]
  unit?: string
  className?: string
}

export function BulletChart({
  label,
  actual,
  target,
  max,
  ranges = [
    { value: max * 0.5, tone: 'danger' },
    { value: max * 0.8, tone: 'warning' },
    { value: max, tone: 'success' },
  ],
  unit = '',
  className,
}: BulletChartProps) {
  const sorted = [...ranges].sort((a, b) => a.value - b.value)

  return (
    <div className={cn('grid grid-cols-[200px_1fr_120px] items-center gap-4', className)}>
      <div>
        <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
          {label}
        </div>
        <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
          meta {target}
          {unit}
        </div>
      </div>
      <div className="relative h-6 overflow-hidden rounded-[4px]" style={{ background: 'var(--surface-2)' }}>
        {sorted.map((r, i) => {
          const prev = i === 0 ? 0 : sorted[i - 1].value
          const w = ((r.value - prev) / max) * 100
          const left = (prev / max) * 100
          return (
            <div
              key={i}
              className="absolute inset-y-0"
              style={{
                left: `${left}%`,
                width: `${w}%`,
                background: `var(--${r.tone})`,
                opacity: 0.12,
              }}
            />
          )
        })}
        {/* actual bar */}
        <div
          className="absolute inset-y-1 rounded-[2px]"
          style={{
            left: 0,
            width: `${(actual / max) * 100}%`,
            background: 'var(--text)',
          }}
        />
        {/* target tick */}
        <div
          className="absolute top-0 bottom-0 w-[2.5px]"
          style={{
            left: `calc(${(target / max) * 100}% - 1px)`,
            background: 'var(--brand)',
          }}
        />
      </div>
      <div className="text-right">
        <div className="serif font-light" style={{ fontSize: 22, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {actual}
          <em className="serif italic" style={{ fontSize: 12, color: 'var(--text-mute)' }}>
            {unit}
          </em>
        </div>
        <div className="mono text-[10.5px]" style={{ color: actual >= target ? 'var(--success)' : 'var(--warning)' }}>
          {Math.round((actual / target) * 100)}% da meta
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 7. STACKED BAR · barras empilhadas por categoria
// =============================================================================

export interface StackedBarSeries {
  name: string
  values: number[]
  tone: 'brand' | 'success' | 'warning' | 'alert' | 'danger' | 'purple' | 'pink'
}

export interface StackedBarChartProps {
  labels: string[]
  series: StackedBarSeries[]
  width?: number
  height?: number
  className?: string
}

export function StackedBarChart({ labels, series, width = 640, height = 260, className }: StackedBarChartProps) {
  const totals = labels.map((_, i) => series.reduce((a, s) => a + (s.values[i] ?? 0), 0))
  const max = Math.max(...totals, 1)
  const colW = (width - 40) / labels.length
  const gap = colW * 0.3
  const barW = colW - gap

  return (
    <div className={className}>
      <svg width={width} height={height}>
        {labels.map((label, i) => {
          const x = 20 + i * colW + gap / 2
          let yCursor = height - 24
          return (
            <g key={i}>
              {series.map((s) => {
                const v = s.values[i] ?? 0
                const h = (v / max) * (height - 50)
                yCursor -= h
                return (
                  <rect
                    key={s.name}
                    x={x}
                    y={yCursor}
                    width={barW}
                    height={h}
                    fill={`var(--${s.tone})`}
                    opacity={0.85}
                  />
                )
              })}
              <text
                x={x + barW / 2}
                y={height - 8}
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                letterSpacing="0.5"
                fill="var(--text-mute)"
              >
                {label.toUpperCase()}
              </text>
            </g>
          )
        })}
      </svg>
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3">
        {series.map((s) => (
          <span
            key={s.name}
            className="inline-flex items-center gap-1.5 text-[11.5px]"
            style={{ color: 'var(--text-soft)' }}
          >
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: `var(--${s.tone})` }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// 8. GROUPED BAR · barras agrupadas (lado-a-lado)
// =============================================================================

export function GroupedBarChart({ labels, series, width = 640, height = 260, className }: StackedBarChartProps) {
  const max = Math.max(...series.flatMap((s) => s.values), 1)
  const colW = (width - 40) / labels.length
  const gap = colW * 0.25
  const groupW = colW - gap
  const barW = groupW / series.length

  return (
    <div className={className}>
      <svg width={width} height={height}>
        {labels.map((label, i) => {
          const baseX = 20 + i * colW + gap / 2
          return (
            <g key={i}>
              {series.map((s, sIdx) => {
                const v = s.values[i] ?? 0
                const h = (v / max) * (height - 50)
                return (
                  <rect
                    key={s.name}
                    x={baseX + sIdx * barW}
                    y={height - 24 - h}
                    width={barW - 2}
                    height={h}
                    fill={`var(--${s.tone})`}
                    rx={2}
                  />
                )
              })}
              <text
                x={baseX + groupW / 2}
                y={height - 8}
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                letterSpacing="0.5"
                fill="var(--text-mute)"
              >
                {label.toUpperCase()}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="mt-3 flex flex-wrap gap-3">
        {series.map((s) => (
          <span
            key={s.name}
            className="inline-flex items-center gap-1.5 text-[11.5px]"
            style={{ color: 'var(--text-soft)' }}
          >
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: `var(--${s.tone})` }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// 9. CALENDAR HEATMAP · ano inteiro (estilo GitHub contributions)
// =============================================================================

export interface CalendarHeatmapProps {
  /** Array de 364 ou 365 valores · 0-100 */
  values: number[]
  className?: string
  tone?: 'brand' | 'success' | 'warning'
}

export function CalendarHeatmap({ values, tone = 'brand', className }: CalendarHeatmapProps) {
  const weeks = 52
  const days = 7
  const cellSize = 11
  const gap = 2.5
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const max = Math.max(...values, 1)

  const opacityFor = (v: number) => {
    if (v === 0) return 0
    if (v < max * 0.25) return 0.2
    if (v < max * 0.5) return 0.4
    if (v < max * 0.75) return 0.7
    return 1
  }

  return (
    <div className={cn('inline-block', className)}>
      <svg width={weeks * (cellSize + gap) + 30} height={days * (cellSize + gap) + 24}>
        {/* month labels */}
        {months.map((m, i) => (
          <text
            key={m}
            x={30 + (i * weeks / 12) * (cellSize + gap)}
            y={10}
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
            letterSpacing="0.8"
            fill="var(--text-mute)"
          >
            {m.toUpperCase()}
          </text>
        ))}
        {/* day labels */}
        {['SEG', 'QUA', 'SEX'].map((d, i) => (
          <text
            key={d}
            x={0}
            y={26 + (i * 2 + 1) * (cellSize + gap)}
            fontFamily="JetBrains Mono, monospace"
            fontSize="8.5"
            letterSpacing="0.5"
            fill="var(--text-mute)"
          >
            {d}
          </text>
        ))}
        {/* cells */}
        {Array.from({ length: weeks }).map((_, w) =>
          Array.from({ length: days }).map((_, d) => {
            const idx = w * days + d
            const v = values[idx] ?? 0
            return (
              <rect
                key={`${w}-${d}`}
                x={30 + w * (cellSize + gap)}
                y={18 + d * (cellSize + gap)}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={v === 0 ? 'var(--surface-2)' : `var(--${tone})`}
                opacity={v === 0 ? 1 : opacityFor(v)}
              />
            )
          })
        )}
      </svg>
      {/* legend */}
      <div className="mono mt-2 flex items-center justify-end gap-1.5 text-[10px]" style={{ color: 'var(--text-mute)' }}>
        <span>Menos</span>
        {[0, 0.2, 0.4, 0.7, 1].map((o, i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-[2px]"
            style={{
              background: o === 0 ? 'var(--surface-2)' : `var(--${tone})`,
              opacity: o === 0 ? 1 : o,
            }}
          />
        ))}
        <span>Mais</span>
      </div>
    </div>
  )
}

// =============================================================================
// 10. BURNDOWN · linha atual vs ideal
// =============================================================================

export interface BurndownProps {
  actual: number[]
  ideal: number[]
  labels?: string[]
  width?: number
  height?: number
  className?: string
}

export function Burndown({
  actual,
  ideal,
  labels,
  width = 640,
  height = 260,
  className,
}: BurndownProps) {
  const max = Math.max(...actual, ...ideal, 1)
  const stepX = (width - 40) / Math.max(actual.length, ideal.length) - 1 - 1
  const pad = 20
  const innerH = height - 40

  const toPath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * stepX} ${pad + innerH - (v / max) * innerH}`).join(' ')

  return (
    <svg width={width} height={height} className={className}>
      {/* grid horizontal */}
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <g key={p}>
          <line
            x1={pad}
            x2={width - pad}
            y1={pad + p * innerH}
            y2={pad + p * innerH}
            stroke="var(--line-1)"
          />
          <text
            x={pad - 6}
            y={pad + p * innerH + 4}
            textAnchor="end"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
            fill="var(--text-mute)"
          >
            {Math.round(max * (1 - p))}
          </text>
        </g>
      ))}
      {/* ideal · dashed */}
      <path d={toPath(ideal)} fill="none" stroke="var(--text-mute)" strokeWidth={1.5} strokeDasharray="4 3" />
      {/* actual · solid · brand */}
      <path d={toPath(actual)} fill="none" stroke="var(--brand)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* actual dots */}
      {actual.map((v, i) => (
        <circle key={i} cx={pad + i * stepX} cy={pad + innerH - (v / max) * innerH} r={2.5} fill="var(--brand)" />
      ))}
      {/* labels */}
      {labels?.map((l, i) => (
        <text
          key={i}
          x={pad + i * stepX}
          y={height - 6}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          letterSpacing="0.5"
          fill="var(--text-mute)"
        >
          {l.toUpperCase()}
        </text>
      ))}
    </svg>
  )
}

// =============================================================================
// 11. SCATTER PLOT · pontos x/y
// =============================================================================

export interface ScatterPoint {
  x: number
  y: number
  label?: string
  size?: number
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'purple' | 'pink'
}

export interface ScatterPlotProps {
  points: ScatterPoint[]
  xLabel?: string
  yLabel?: string
  width?: number
  height?: number
  className?: string
}

export function ScatterPlot({ points, xLabel, yLabel, width = 520, height = 320, className }: ScatterPlotProps) {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const xMin = Math.min(...xs)
  const xMax = Math.max(...xs)
  const yMin = Math.min(...ys)
  const yMax = Math.max(...ys)
  const xRange = xMax - xMin || 1
  const yRange = yMax - yMin || 1

  const pad = 36
  const innerW = width - pad * 2
  const innerH = height - pad * 2

  const px = (x: number) => pad + ((x - xMin) / xRange) * innerW
  const py = (y: number) => pad + innerH - ((y - yMin) / yRange) * innerH

  return (
    <svg width={width} height={height} className={className}>
      {/* axes */}
      <line x1={pad} x2={pad} y1={pad} y2={pad + innerH} stroke="var(--line-2)" />
      <line x1={pad} x2={pad + innerW} y1={pad + innerH} y2={pad + innerH} stroke="var(--line-2)" />
      {/* grid */}
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={`h${p}`}
          x1={pad}
          x2={pad + innerW}
          y1={pad + p * innerH}
          y2={pad + p * innerH}
          stroke="var(--line-1)"
          strokeDasharray="2 3"
        />
      ))}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={px(p.x)}
            cy={py(p.y)}
            r={p.size ?? 6}
            fill={`var(--${p.tone ?? 'brand'})`}
            fillOpacity={0.6}
            stroke={`var(--${p.tone ?? 'brand'})`}
            strokeWidth={1.5}
          />
          {p.label && (
            <text
              x={px(p.x)}
              y={py(p.y) - 10}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="9"
              fill="var(--text-soft)"
            >
              {p.label}
            </text>
          )}
        </g>
      ))}
      {xLabel && (
        <text
          x={pad + innerW / 2}
          y={height - 8}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          letterSpacing="0.8"
          fill="var(--text-mute)"
        >
          {xLabel.toUpperCase()}
        </text>
      )}
      {yLabel && (
        <text
          x={10}
          y={pad + innerH / 2}
          textAnchor="middle"
          transform={`rotate(-90, 10, ${pad + innerH / 2})`}
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          letterSpacing="0.8"
          fill="var(--text-mute)"
        >
          {yLabel.toUpperCase()}
        </text>
      )}
    </svg>
  )
}

// =============================================================================
// 12. POLAR AREA · pie com raios variáveis
// =============================================================================

export interface PolarSlice {
  label: string
  value: number
  tone?: 'brand' | 'success' | 'warning' | 'alert' | 'danger' | 'purple' | 'pink'
}

export interface PolarAreaProps {
  slices: PolarSlice[]
  size?: number
  className?: string
}

export function PolarArea({ slices, size = 280, className }: PolarAreaProps) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 36
  const max = Math.max(...slices.map((s) => s.value), 1)
  const angle = (Math.PI * 2) / slices.length

  return (
    <svg width={size} height={size} className={className}>
      {/* anéis guia */}
      {[0.5, 1].map((p) => (
        <circle key={p} cx={cx} cy={cy} r={maxR * p} fill="none" stroke="var(--line-1)" strokeDasharray={p === 1 ? '0' : '2 3'} />
      ))}
      {slices.map((s, i) => {
        const r = (s.value / max) * maxR
        const start = i * angle - Math.PI / 2
        const end = start + angle
        const x1 = cx + Math.cos(start) * r
        const y1 = cy + Math.sin(start) * r
        const x2 = cx + Math.cos(end) * r
        const y2 = cy + Math.sin(end) * r
        const tone = s.tone ?? (['brand', 'success', 'purple', 'warning', 'pink', 'alert', 'danger'] as const)[i % 7]
        return (
          <g key={i}>
            <path
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${angle > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`}
              fill={`var(--${tone})`}
              fillOpacity={0.55}
              stroke={`var(--${tone})`}
              strokeWidth={1.5}
            />
          </g>
        )
      })}
      {slices.map((s, i) => {
        const a = (i + 0.5) * angle - Math.PI / 2
        const lx = cx + Math.cos(a) * (maxR + 18)
        const ly = cy + Math.sin(a) * (maxR + 18)
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9.5"
            letterSpacing="0.8"
            fill="var(--text-soft)"
          >
            {s.label.toUpperCase()}
          </text>
        )
      })}
    </svg>
  )
}

// =============================================================================
// 13. RANGE BAR · valor entre min/max com posição atual
// =============================================================================

export interface RangeBarProps {
  label: string
  min: number
  max: number
  current: number
  unit?: string
  className?: string
}

export function RangeBar({ label, min, max, current, unit = '', className }: RangeBarProps) {
  const pct = ((current - min) / (max - min)) * 100
  const isOk = current >= min * 0.85 && current <= max * 1.15
  return (
    <div className={cn('grid grid-cols-[1fr_auto] items-center gap-3', className)}>
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-[12.5px] font-semibold" style={{ color: 'var(--text)' }}>
            {label}
          </span>
          <span className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
            {min}{unit} – {max}{unit}
          </span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full" style={{ background: 'var(--surface-3)' }}>
          <div
            className="absolute inset-y-0 rounded-full"
            style={{
              left: '15%',
              right: '15%',
              background: 'var(--brand-soft)',
            }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
            style={{
              left: `calc(${Math.max(0, Math.min(100, pct))}% - 6px)`,
              background: isOk ? 'var(--success)' : 'var(--warning)',
              boxShadow: '0 0 0 2px var(--bg)',
            }}
          />
        </div>
      </div>
      <div
        className="serif font-light"
        style={{ fontSize: 18, color: 'var(--text)', letterSpacing: '-0.02em' }}
      >
        {current}
        <em className="text-[10px] mono" style={{ color: 'var(--text-mute)' }}>
          {unit}
        </em>
      </div>
    </div>
  )
}

// =============================================================================
// 14. FUNNEL CHART · etapas com %
// =============================================================================

export interface FunnelStep {
  label: string
  value: number
  tone?: 'brand' | 'success' | 'purple' | 'warning' | 'pink' | 'danger'
}

export interface FunnelChartProps {
  steps: FunnelStep[]
  width?: number
  className?: string
}

export function FunnelChart({ steps, width = 480, className }: FunnelChartProps) {
  const max = steps[0]?.value ?? 1
  return (
    <div className={cn('flex flex-col gap-1', className)} style={{ width }}>
      {steps.map((s, i) => {
        const pct = (s.value / max) * 100
        const tone = s.tone ?? (['brand', 'purple', 'success', 'warning', 'danger'] as const)[i % 5]
        return (
          <div
            key={i}
            className="relative flex items-center"
            style={{ width: `${pct}%`, height: 44 }}
          >
            <div
              className="absolute inset-0 rounded-[4px]"
              style={{
                background: `var(--${tone})`,
                opacity: 0.85 - i * 0.08,
              }}
            />
            <div className="relative z-10 flex w-full items-center justify-between px-3" style={{ color: 'var(--bg)' }}>
              <span className="text-[12px] font-semibold">{s.label}</span>
              <span className="mono text-[11px] font-bold">
                {s.value.toLocaleString('pt-BR')} ({Math.round((s.value / max) * 100)}%)
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
