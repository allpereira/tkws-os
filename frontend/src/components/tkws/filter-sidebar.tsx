import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FilterChip {
  id: string
  label: string
  value: string
}

export interface FilterSidebarProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function FilterSidebar({ title = 'Filtros', children, className }: FilterSidebarProps) {
  return (
    <aside
      className={cn(
        'sticky top-4 flex h-fit flex-col gap-4 rounded-xl border p-4',
        className
      )}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-1)',
      }}
    >
      <header className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--line-1)' }}>
        <span
          className="mono text-[10.5px] font-bold uppercase tracking-[1.6px]"
          style={{ color: 'var(--text-mute)' }}
        >
          {title}
        </span>
      </header>
      {children}
    </aside>
  )
}

export function FilterSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <span
        className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]"
        style={{ color: 'var(--text-mute)' }}
      >
        {label}
      </span>
      {children}
    </section>
  )
}

export function ActiveFilterChips({
  chips,
  onRemove,
  onClear,
}: {
  chips: FilterChip[]
  onRemove: (id: string) => void
  onClear?: () => void
}) {
  if (chips.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.id}
          onClick={() => onRemove(c.id)}
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-colors hover:brightness-110"
          style={{
            background: 'var(--brand-soft)',
            borderColor: 'var(--brand)',
            color: 'var(--brand)',
          }}
        >
          <span style={{ color: 'var(--text-mute)' }}>{c.label}:</span>
          <span>{c.value}</span>
          <X size={11} />
        </button>
      ))}
      {onClear && chips.length > 1 && (
        <button
          onClick={onClear}
          className="mono text-[10.5px] font-bold uppercase tracking-[1.4px] transition-colors hover:text-[var(--danger)]"
          style={{ color: 'var(--text-mute)' }}
        >
          Limpar tudo
        </button>
      )}
    </div>
  )
}
