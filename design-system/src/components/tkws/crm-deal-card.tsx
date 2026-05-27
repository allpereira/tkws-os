import * as React from 'react'
import { Calendar, MoreHorizontal, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { LeadScore, type LeadTemperature } from './crm-lead-score'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

/**
 * DealCard · cartão de oportunidade/deal no pipeline comercial.
 *   • Header: account name (Fraunces) + dropdown actions
 *   • Body: deal name + valor + close date
 *   • Score: temperatura (LeadScore)
 *   • Footer: probability (Progress) + owner avatar
 */

export interface Deal {
  id: string
  /** Conta (cliente) */
  account: string
  /** Nome do deal (ex: "Yachthouse 280m² · Decoração full") */
  title: string
  /** Valor em centavos · use formatCurrency(value/100) */
  value: number
  /** Probabilidade 0-100 */
  probability: number
  /** Data de fechamento esperada · "15 jun" */
  expectedClose: string
  /** Owner */
  owner: { initials: string; name: string; color?: string }
  /** Temperatura do lead */
  temperature?: LeadTemperature
  /** Badge de etiqueta · "VIP", "Referência", etc. */
  tag?: { label: string; tone: BadgeTone }
}

export interface DealCardProps {
  deal: Deal
  /** Click no card todo · ex: abrir Sheet de detalhes */
  onClick?: () => void
  /** Click no kebab */
  onMore?: () => void
  /**
   * Exibe a barra de probabilidade. Default true. Desligue em boards onde a
   * probabilidade é derivada da coluna/etapa (mesma para todos os cards da
   * lane) e a barra vira ruído redundante.
   */
  showProbability?: boolean
  className?: string
}

export function DealCard({ deal, onClick, onMore, showProbability = true, className }: DealCardProps) {
  const probTone: 'success' | 'warning' | 'danger' | 'brand' =
    deal.probability >= 70 ? 'success' : deal.probability >= 40 ? 'warning' : deal.probability >= 20 ? 'brand' : 'danger'

  return (
    <article
      onClick={onClick}
      className={cn(
        'group cursor-pointer rounded-[12px] border p-3 transition-all',
        'hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-md',
        className
      )}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-2)',
      }}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mono text-[9.5px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
            {deal.account}
          </div>
          <h4
            className="serif mt-0.5 line-clamp-2 text-[14px] font-normal leading-tight"
            style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
          >
            {deal.title}
          </h4>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onMore?.()
          }}
          aria-label="Mais"
          className="h-6 w-6 shrink-0 cursor-pointer rounded-md text-[var(--text-mute)] opacity-0 transition-opacity hover:bg-white/[0.06] group-hover:opacity-100"
        >
          <MoreHorizontal size={13} className="mx-auto" />
        </button>
      </header>

      {/* Valor + close */}
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <div className="num-tabular serif text-[20px] font-normal leading-none" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {formatCurrency(deal.value / 100)}
          </div>
          <div className="mono mt-1 inline-flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-mute)' }}>
            <Calendar size={9} />
            {deal.expectedClose}
          </div>
        </div>
        {deal.temperature && <LeadScore temperature={deal.temperature} size="sm" />}
      </div>

      {/* Probability */}
      {showProbability && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[10.5px]">
            <span className="mono uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
              Probabilidade
            </span>
            <span className="mono font-bold" style={{ color: 'var(--text)' }}>
              {deal.probability}%
            </span>
          </div>
          <Progress value={deal.probability} tone={probTone === 'brand' ? 'brand' : probTone} />
        </div>
      )}

      {/* Footer · owner primeiro · tag longa embaixo */}
      <footer className="mt-3 flex flex-col gap-1.5 border-t pt-2.5" style={{ borderColor: 'var(--line-1)' }}>
        <div className="flex min-w-0 items-center gap-1.5">
          <Avatar size="sm" style={{ background: deal.owner.color ?? 'var(--brand)', height: 20, width: 20, fontSize: 9 }}>
            <AvatarFallback>{deal.owner.initials}</AvatarFallback>
          </Avatar>
          <span className="mono min-w-0 truncate text-[10px]" style={{ color: 'var(--text-mute)' }}>
            {deal.owner.name}
          </span>
        </div>
        {deal.tag ? (
          <div className="min-w-0 w-full">
            <Badge tone={deal.tag.tone} className="w-full whitespace-normal px-2 py-1 text-left leading-snug">
              {deal.tag.label}
            </Badge>
          </div>
        ) : null}
      </footer>
    </article>
  )
}

/** Total card · soma de deals em uma lane */
export function DealLaneTotal({
  count,
  total,
  label = 'Total',
  trend,
}: {
  count: number
  total: number
  label?: string
  trend?: { value: string; positive?: boolean }
}) {
  return (
    <div
      className="rounded-[10px] border p-3"
      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
    >
      <div className="mono text-[9.5px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
        {label} · {count}
      </div>
      <div className="num-tabular serif mt-1 text-[18px] font-normal leading-none" style={{ color: 'var(--text)' }}>
        {formatCurrency(total / 100)}
      </div>
      {trend && (
        <div className="mono mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: trend.positive ? 'var(--success)' : 'var(--danger)' }}>
          <TrendingUp size={9} style={{ transform: trend.positive ? 'none' : 'rotate(180deg)' }} />
          {trend.value}
        </div>
      )}
    </div>
  )
}
