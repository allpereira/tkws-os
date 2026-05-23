import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * CategoryTree · sidebar de categorias do catálogo.
 * Fiel ao HTML · ds-category-tree:
 *   bg surface-1 · border 1px line-2 · radius 12px · padding 8px
 *   ct-h: mono 10px tracking 1.3px uppercase text-mute border-bottom line-1
 *   ct-item: grid (1fr auto) · padding 8px 14px · radius 7px · 13px
 *     hover: bg surface-2
 *     active: bg brand-soft · color brand · weight 600
 *   ct (count): mono 10px · bg surface-2 · radius 999px
 *     active: bg brand · color bg
 *   ct-children: ml-14 · pl-10 · border-left 1px line-1 · font 12px
 */

export interface CategoryNode {
  id: string
  label: string
  count?: number
  children?: CategoryNode[]
}

export interface CategoryTreeProps {
  title?: string
  categories: CategoryNode[]
  activeId?: string
  /** Ids expandidos · controle externo opcional */
  expanded?: string[]
  onSelect?: (id: string) => void
  onToggleExpand?: (id: string) => void
  className?: string
}

export function CategoryTree({
  title = 'Categorias',
  categories,
  activeId,
  expanded,
  onSelect,
  onToggleExpand,
  className,
}: CategoryTreeProps) {
  // Auto-manage expand quando externo não controlado
  const [internalExpanded, setInternalExpanded] = React.useState<string[]>(() =>
    categories.filter((c) => c.children).map((c) => c.id)
  )
  const expandedIds = expanded ?? internalExpanded

  function toggle(id: string) {
    if (onToggleExpand) onToggleExpand(id)
    else setInternalExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <aside
      className={cn('flex flex-col gap-[2px] rounded-[12px] border p-2', className)}
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-2)' }}
    >
      <div
        className="mono mb-1 px-3.5 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-[1.3px]"
        style={{ color: 'var(--text-mute)', borderBottom: '1px solid var(--line-1)' }}
      >
        {title}
      </div>

      {categories.map((cat) => {
        const isExpanded = expandedIds.includes(cat.id)
        const isActive = activeId === cat.id
        const hasChildren = !!cat.children && cat.children.length > 0
        return (
          <React.Fragment key={cat.id}>
            <button
              type="button"
              onClick={() => {
                onSelect?.(cat.id)
                if (hasChildren) toggle(cat.id)
              }}
              className={cn(
                'grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-2 rounded-[7px] px-3.5 py-2 text-left text-[13px] transition-colors',
                'hover:bg-[var(--surface-2)]',
                isActive && 'font-semibold'
              )}
              style={{
                background: isActive ? 'var(--brand-soft)' : 'transparent',
                color: isActive ? 'var(--brand)' : 'var(--text-soft)',
              }}
            >
              <span className="inline-flex items-center gap-1.5 truncate">
                {hasChildren && (
                  <ChevronDown
                    size={11}
                    className="transition-transform"
                    style={{
                      transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                      color: 'var(--text-mute)',
                    }}
                  />
                )}
                {cat.label}
              </span>
              {cat.count !== undefined && (
                <span
                  className="mono inline-flex items-center justify-center rounded-full px-1.5 py-px text-[10px] font-medium"
                  style={{
                    background: isActive ? 'var(--brand)' : 'var(--surface-2)',
                    color: isActive ? 'var(--bg)' : 'var(--text-mute)',
                  }}
                >
                  {cat.count}
                </span>
              )}
            </button>

            {hasChildren && isExpanded && (
              <div
                className="ml-[14px] mb-1 flex flex-col gap-px border-l pl-[10px]"
                style={{ borderColor: 'var(--line-1)' }}
              >
                {cat.children!.map((child) => {
                  const childActive = activeId === child.id
                  return (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => onSelect?.(child.id)}
                      className={cn(
                        'grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-left text-[12px] transition-colors',
                        'hover:bg-[var(--surface-2)]'
                      )}
                      style={{
                        background: childActive ? 'var(--brand-soft)' : 'transparent',
                        color: childActive ? 'var(--brand)' : 'var(--text-soft)',
                      }}
                    >
                      <span className="truncate">{child.label}</span>
                      {child.count !== undefined && (
                        <span
                          className="mono inline-flex items-center justify-center rounded-full px-1.5 py-px text-[9.5px]"
                          style={{
                            background: childActive ? 'var(--brand)' : 'var(--surface-2)',
                            color: childActive ? 'var(--bg)' : 'var(--text-mute)',
                          }}
                        >
                          {child.count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </React.Fragment>
        )
      })}
    </aside>
  )
}
