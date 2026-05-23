import * as React from 'react'
import { Flame, Snowflake, ThermometerSun } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * LeadScore · indicador de temperatura do lead.
 *   hot   · brand/danger  · ação urgente, lead aquecido
 *   warm  · warning       · em negociação
 *   cold  · neutral       · sem toque recente
 *
 * Score 0-100 mapeia para temperatura. Use prop temperature direto se preferir.
 */

export type LeadTemperature = 'hot' | 'warm' | 'cold'

export interface LeadScoreProps {
  /** Score 0-100 · se passar, sobrescreve temperature */
  score?: number
  /** Temperature explícita (alternativa a score) */
  temperature?: LeadTemperature
  /** Tamanho · default md */
  size?: 'sm' | 'md' | 'lg'
  /** Mostra label "Quente · 87" ou só ícone+número */
  showLabel?: boolean
  className?: string
}

function tempFromScore(s: number): LeadTemperature {
  if (s >= 70) return 'hot'
  if (s >= 40) return 'warm'
  return 'cold'
}

const config: Record<LeadTemperature, { color: string; bg: string; icon: React.ComponentType<any>; label: string }> = {
  hot: { color: 'var(--danger)', bg: 'rgba(235,87,87,0.14)', icon: Flame, label: 'Quente' },
  warm: { color: 'var(--warning)', bg: 'rgba(242,201,76,0.18)', icon: ThermometerSun, label: 'Morno' },
  cold: { color: 'var(--text-mute)', bg: 'var(--surface-3)', icon: Snowflake, label: 'Frio' },
}

const sizeMap = {
  sm: { box: 'h-6 px-2 text-[10.5px] gap-1', icon: 11 },
  md: { box: 'h-7 px-2.5 text-[11.5px] gap-1.5', icon: 12 },
  lg: { box: 'h-8 px-3 text-[12.5px] gap-1.5', icon: 14 },
}

export function LeadScore({ score, temperature, size = 'md', showLabel = true, className }: LeadScoreProps) {
  const temp: LeadTemperature = temperature ?? (score !== undefined ? tempFromScore(score) : 'cold')
  const c = config[temp]
  const s = sizeMap[size]
  const Icon = c.icon

  return (
    <span
      className={cn(
        'mono inline-flex items-center rounded-full border font-bold uppercase tracking-[0.6px]',
        s.box,
        className
      )}
      style={{
        background: c.bg,
        borderColor: c.color,
        color: c.color,
      }}
    >
      <Icon size={s.icon} strokeWidth={1.8} />
      {showLabel && <span>{c.label}</span>}
      {score !== undefined && <span>· {score}</span>}
    </span>
  )
}
