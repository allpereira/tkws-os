import { formatCurrency, cn } from '@/lib/utils'

/**
 * SalesFunnel · visualização de funil de vendas em SVG.
 *   Cada estágio é uma trapezoidal · largura proporcional ao total de deals.
 *   Cores semânticas por estágio. Mostra count + valor por estágio.
 *
 * Diferente do Kanban: o Funnel é VISUAL/EXECUTIVO (dashboard) · não tem DnD.
 * Kanban é OPERACIONAL.
 */

export interface FunnelStage {
  id: string
  label: string
  count: number
  /** Valor total dos deals neste estágio · em centavos */
  value: number
  /** Conversão para próximo · % (opcional, exibe entre estágios) */
  conversion?: number
  color?: string
}

export interface SalesFunnelProps {
  stages: FunnelStage[]
  className?: string
  /** Altura total · default 280 */
  height?: number
}

const defaultColors = [
  'var(--brand)',
  'var(--purple)',
  'var(--pink)',
  'var(--warning)',
  'var(--success)',
  'var(--danger)',
]

export function SalesFunnel({ stages, className, height = 280 }: SalesFunnelProps) {
  const maxCount = Math.max(...stages.map((s) => s.count), 1)

  return (
    <div className={cn('rounded-[12px] border p-5', className)} style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}>
      <div className="flex" style={{ height }}>
        {stages.map((stage, i) => {
          const widthPct = (stage.count / maxCount) * 100
          const color = stage.color ?? defaultColors[i % defaultColors.length]
          return (
            <div key={stage.id} className="flex flex-1 flex-col items-center justify-center gap-2">
              {/* trapézio · usa svg simples */}
              <div className="relative flex items-center justify-center" style={{ height: height * 0.6 }}>
                <svg
                  viewBox="0 0 100 60"
                  preserveAspectRatio="none"
                  className="h-full"
                  style={{ width: `min(100%, ${Math.max(40, widthPct)}%)`, minWidth: 60 }}
                >
                  <defs>
                    <linearGradient id={`grad-${stage.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={color} stopOpacity="0.65" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="0,0 100,0 92,60 8,60"
                    fill={`url(#grad-${stage.id})`}
                    stroke={color}
                    strokeWidth="1.5"
                  />
                  <text
                    x="50"
                    y="38"
                    textAnchor="middle"
                    fill="var(--text)"
                    fontFamily="Fraunces"
                    fontSize="18"
                    fontWeight="400"
                  >
                    {stage.count}
                  </text>
                </svg>

                {/* conversão entre estágios */}
                {i < stages.length - 1 && stage.conversion !== undefined && (
                  <div
                    className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-md border px-1.5 py-0.5"
                    style={{
                      background: 'var(--surface-2)',
                      borderColor: 'var(--line-2)',
                    }}
                  >
                    <span className="mono text-[9px] font-bold" style={{ color: stage.conversion >= 60 ? 'var(--success)' : stage.conversion >= 30 ? 'var(--warning)' : 'var(--danger)' }}>
                      {stage.conversion}%
                    </span>
                  </div>
                )}
              </div>

              {/* labels */}
              <div className="text-center">
                <div className="mono text-[9.5px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                  {stage.label}
                </div>
                <div className="num-tabular mono mt-0.5 text-[11px] font-bold" style={{ color: 'var(--text)' }}>
                  {formatCurrency(stage.value / 100)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
