import { Calendar, GripVertical, MoreHorizontal, TrendingUp } from 'lucide-react'
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
  /** Destaque de seleção (kanban operacional) */
  selected?: boolean
  /** Sem toque há N dias · ponto vermelho no canto */
  staleDays?: number
  /** Durante drag no board */
  isDragging?: boolean
  /** Preview no DragOverlay */
  overlay?: boolean
  /** Handle de arraste · repasse listeners/attributes do @dnd-kit */
  dragHandleProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  /** Linha de ações rápidas (Chat / Ligar / Avançar) */
  actionRow?: React.ReactNode
  className?: string
}

export function DealCard({
  deal,
  onClick,
  onMore,
  selected,
  staleDays,
  isDragging,
  overlay,
  dragHandleProps,
  actionRow,
  className,
}: DealCardProps) {
  const probTone: 'success' | 'warning' | 'danger' | 'brand' =
    deal.probability >= 70 ? 'success' : deal.probability >= 40 ? 'warning' : deal.probability >= 20 ? 'brand' : 'danger'

  return (
    <article
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer rounded-[12px] border p-3 transition-all',
        'hover:-translate-y-0.5 hover:shadow-md',
        !overlay && 'hover:border-[var(--brand)]',
        selected && 'shadow-md',
        overlay && 'rotate-1 shadow-2xl',
        className
      )}
      style={{
        background: 'var(--surface-1)',
        borderColor: selected ? 'var(--brand)' : 'var(--line-2)',
        opacity: isDragging ? 0.35 : 1,
      }}
    >
      {dragHandleProps && (
        <button
          type="button"
          aria-label="Arrastar"
          className="absolute top-2 left-1 z-[1] flex h-6 w-4 cursor-grab items-center justify-center opacity-0 transition-opacity group-hover:opacity-60 active:cursor-grabbing"
          style={{ color: 'var(--text-mute)' }}
          onClick={(e) => e.stopPropagation()}
          {...dragHandleProps}
        />
      )}

      {staleDays !== undefined && staleDays >= 3 && (
        <span
          className="absolute -top-1 -right-1 z-[1] h-2.5 w-2.5 rounded-full"
          style={{ background: 'var(--danger)', boxShadow: '0 0 0 3px var(--bg)' }}
          title={`Sem toque há ${staleDays} dias`}
        />
      )}

      {/* Header */}
      <header className={cn('flex items-start justify-between gap-2', dragHandleProps && 'pl-3')}>
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
      <div className={cn('mt-3 flex items-end justify-between gap-2', dragHandleProps && 'pl-3')}>
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
      <div className={cn('mt-3', dragHandleProps && 'pl-3')}>
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

      {/* Footer */}
      <footer
        className={cn(
          'mt-3 flex items-center justify-between border-t pt-2.5',
          dragHandleProps && 'pl-3',
        )}
        style={{ borderColor: 'var(--line-1)' }}
      >
        <div className="flex items-center gap-1.5">
          <Avatar size="sm" style={{ background: deal.owner.color ?? 'var(--brand)', height: 20, width: 20, fontSize: 9 }}>
            <AvatarFallback>{deal.owner.initials}</AvatarFallback>
          </Avatar>
          <span className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
            {deal.owner.name}
          </span>
        </div>
        {deal.tag && <Badge tone={deal.tag.tone}>{deal.tag.label}</Badge>}
      </footer>

      {actionRow && !overlay && (
        <div className="mt-2.5 opacity-0 transition-opacity group-hover:opacity-100">{actionRow}</div>
      )}
    </article>
  )
}

/** Cabeçalho de lane · borda colorida no topo (pattern CRM Kanban) */
export function DealLaneHeader({
  label,
  count,
  totalReais,
  color,
  probabilityHint,
  overWip,
  wipLimit,
}: {
  label: string
  count: number
  totalReais: number
  color: string
  probabilityHint?: string
  overWip?: boolean
  wipLimit?: number
}) {
  return (
    <header
      className="rounded-[10px] border p-3"
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--line-1)',
        boxShadow: `inset 0 3px 0 ${color}`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="mono text-[10px] font-bold uppercase tracking-[1.4px]" style={{ color }}>
          {label} · {count}
        </div>
        {overWip && wipLimit !== undefined && <Badge tone="warning">WIP &gt;{wipLimit}</Badge>}
      </div>
      <div
        className="num-tabular serif mt-1 text-[18px] font-normal leading-none"
        style={{ color: 'var(--text)' }}
      >
        {formatCurrency(totalReais)}
      </div>
      {probabilityHint && (
        <div className="mono mt-1 text-[10px]" style={{ color: 'var(--text-mute)' }}>
          {probabilityHint}
        </div>
      )}
    </header>
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
