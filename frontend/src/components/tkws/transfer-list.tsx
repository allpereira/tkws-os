import * as React from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface TransferItem {
  id: string
  label: string
  meta?: string
}

export interface TransferListProps {
  source: TransferItem[]
  target: TransferItem[]
  onChange: (next: { source: TransferItem[]; target: TransferItem[] }) => void
  sourceTitle?: string
  targetTitle?: string
  className?: string
}

export function TransferList({
  source,
  target,
  onChange,
  sourceTitle = 'Disponíveis',
  targetTitle = 'Selecionados',
  className,
}: TransferListProps) {
  const [sourceSel, setSourceSel] = React.useState<Set<string>>(new Set())
  const [targetSel, setTargetSel] = React.useState<Set<string>>(new Set())
  const [sourceQuery, setSourceQuery] = React.useState('')
  const [targetQuery, setTargetQuery] = React.useState('')

  function toggleSourceItem(id: string) {
    const next = new Set(sourceSel)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSourceSel(next)
  }

  function toggleTargetItem(id: string) {
    const next = new Set(targetSel)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setTargetSel(next)
  }

  function moveToTarget() {
    if (sourceSel.size === 0) return
    const moved = source.filter((it) => sourceSel.has(it.id))
    const remaining = source.filter((it) => !sourceSel.has(it.id))
    onChange({ source: remaining, target: [...target, ...moved] })
    setSourceSel(new Set())
  }

  function moveToSource() {
    if (targetSel.size === 0) return
    const moved = target.filter((it) => targetSel.has(it.id))
    const remaining = target.filter((it) => !targetSel.has(it.id))
    onChange({ source: [...source, ...moved], target: remaining })
    setTargetSel(new Set())
  }

  const filteredSource = source.filter((it) =>
    it.label.toLowerCase().includes(sourceQuery.toLowerCase())
  )
  const filteredTarget = target.filter((it) =>
    it.label.toLowerCase().includes(targetQuery.toLowerCase())
  )

  return (
    <div className={cn('grid grid-cols-[1fr_auto_1fr] gap-3 max-[760px]:grid-cols-1', className)}>
      <Pane
        title={sourceTitle}
        count={source.length}
        items={filteredSource}
        selected={sourceSel}
        onToggle={toggleSourceItem}
        query={sourceQuery}
        onQueryChange={setSourceQuery}
      />

      <div className="flex flex-col items-center justify-center gap-2 max-[760px]:flex-row">
        <Button
          variant="outline"
          size="icon"
          disabled={sourceSel.size === 0}
          onClick={moveToTarget}
          aria-label="Mover para selecionados"
        >
          <ChevronRight size={14} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={targetSel.size === 0}
          onClick={moveToSource}
          aria-label="Mover para disponíveis"
        >
          <ChevronLeft size={14} />
        </Button>
      </div>

      <Pane
        title={targetTitle}
        count={target.length}
        items={filteredTarget}
        selected={targetSel}
        onToggle={toggleTargetItem}
        query={targetQuery}
        onQueryChange={setTargetQuery}
      />
    </div>
  )
}

function Pane({
  title,
  count,
  items,
  selected,
  onToggle,
  query,
  onQueryChange,
}: {
  title: string
  count: number
  items: TransferItem[]
  selected: Set<string>
  onToggle: (id: string) => void
  query: string
  onQueryChange: (q: string) => void
}) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
    >
      <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: 'var(--line-1)' }}>
        <span
          className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]"
          style={{ color: 'var(--text-mute)' }}
        >
          {title}
        </span>
        <span
          className="mono rounded-full px-1.5 py-0.5 text-[10px] font-bold"
          style={{ background: 'var(--surface-2)', color: 'var(--text-soft)' }}
        >
          {count}
        </span>
      </div>
      <div className="p-2">
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar…"
          icon={<Search size={14} />}
          className="h-8 text-[12px]"
        />
      </div>
      <ul className="max-h-72 flex-1 overflow-y-auto px-2 pb-2">
        {items.map((it) => {
          const isSel = selected.has(it.id)
          return (
            <li
              key={it.id}
              onClick={() => onToggle(it.id)}
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[12.5px] transition-colors',
                isSel ? 'bg-[var(--brand-soft)]' : 'hover:bg-white/[0.04]'
              )}
            >
              <Checkbox checked={isSel} onCheckedChange={() => onToggle(it.id)} />
              <div className="min-w-0">
                <div className="truncate font-medium" style={{ color: 'var(--text)' }}>
                  {it.label}
                </div>
                {it.meta && (
                  <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                    {it.meta}
                  </div>
                )}
              </div>
            </li>
          )
        })}
        {items.length === 0 && (
          <li className="px-3 py-6 text-center text-[12px]" style={{ color: 'var(--text-mute)' }}>
            Vazio
          </li>
        )}
      </ul>
    </div>
  )
}
