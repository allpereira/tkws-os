import * as React from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

export interface RichListItem {
  id: string
  code: string
  name: string
  client: string
  squad: { label: string; tone: BadgeTone }
  area: string
  contractValue: number
  margin: number
  /** 0-100 */
  progress: number
  status: { label: string; tone: BadgeTone }
}

export interface RichListProps {
  items: RichListItem[]
  onSelect?: (item: RichListItem) => void
  selectedId?: string
  className?: string
}

export function RichList({ items, onSelect, selectedId, className }: RichListProps) {
  return (
    <div className={cn('overflow-hidden rounded-xl border', className)} style={{ borderColor: 'var(--line-1)' }}>
      <div
        className="mono grid grid-cols-[1fr_140px_140px_120px_140px_120px] gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[1.4px] max-[760px]:hidden"
        style={{ background: 'var(--surface-2)', color: 'var(--text-mute)' }}
      >
        <div>Projeto · Cliente</div>
        <div>Squad</div>
        <div>Contrato</div>
        <div>Margem</div>
        <div>Progresso</div>
        <div>Status</div>
      </div>
      <ul>
        {items.map((it) => (
          <li
            key={it.id}
            onClick={() => onSelect?.(it)}
            className={cn(
              'grid cursor-pointer grid-cols-[1fr_140px_140px_120px_140px_120px] items-center gap-3 border-b px-4 py-3 transition-colors hover:bg-white/[0.03] max-[760px]:grid-cols-[1fr_120px]',
              selectedId === it.id && 'bg-[var(--brand-soft)]'
            )}
            style={{ borderColor: 'var(--line-1)' }}
          >
            <div className="flex items-center gap-3">
              <Avatar size="md" square>
                {it.code.slice(0, 2)}
              </Avatar>
              <div>
                <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                  {it.name}
                </div>
                <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                  #{it.code} · {it.client} · {it.area}
                </div>
              </div>
            </div>
            <div className="max-[760px]:hidden">
              <Badge tone={it.squad.tone}>{it.squad.label}</Badge>
            </div>
            <div
              className="num-tabular text-[13px] font-bold max-[760px]:hidden"
              style={{ color: 'var(--text)' }}
            >
              {formatCurrency(it.contractValue)}
            </div>
            <div
              className="num-tabular text-[13px] max-[760px]:hidden"
              style={{
                color:
                  it.margin >= 0.3
                    ? 'var(--success)'
                    : it.margin >= 0.2
                    ? 'var(--warning)'
                    : 'var(--danger)',
              }}
            >
              {Math.round(it.margin * 100)}%
            </div>
            <div className="max-[760px]:hidden">
              <Progress
                value={it.progress}
                tone={it.progress < 30 ? 'danger' : it.progress < 70 ? 'warning' : 'success'}
              />
              <div className="mono mt-1 text-[10px]" style={{ color: 'var(--text-mute)' }}>
                {it.progress}%
              </div>
            </div>
            <div>
              <Badge tone={it.status.tone}>{it.status.label}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
