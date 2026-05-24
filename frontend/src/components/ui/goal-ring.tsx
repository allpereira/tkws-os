
export interface GoalRingProps {
  /** 0-100 */
  value: number
  /** label central · ex. "82%" */
  label?: string
  /** sublabel · ex. "do orçamento" */
  sublabel?: string
  size?: number
  thickness?: number
  tone?: 'brand' | 'success' | 'warning' | 'danger'
}

const toneColor: Record<NonNullable<GoalRingProps['tone']>, string> = {
  brand: 'var(--brand)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
}

export function GoalRing({
  value,
  label,
  sublabel,
  size = 120,
  thickness = 10,
  tone = 'brand',
}: GoalRingProps) {
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const v = Math.max(0, Math.min(100, value))
  const offset = circumference - (v / 100) * circumference

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={toneColor[tone]}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.25,0.46,0.45,0.94)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="serif text-[28px] font-normal leading-none tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          {label ?? `${Math.round(v)}%`}
        </span>
        {sublabel && (
          <span
            className="mt-1 text-[10.5px] leading-tight"
            style={{ color: 'var(--text-mute)' }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}
