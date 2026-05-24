import { ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

/**
 * Breadcrumb · padrão TKWS OS · texto mono uppercase.
 * Cada item é clicável (exceto o último, que vira BreadcrumbPage).
 */

export interface BreadcrumbItemDef {
  label: string
  href?: string
  current?: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItemDef[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Navegação hierárquica" className={cn('flex items-center', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 mono text-[11px] uppercase tracking-[1.2px]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1 || item.current
          return (
            <li key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight size={12} style={{ color: 'var(--text-mute)' }} aria-hidden />
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="font-bold"
                  style={{ color: isLast ? 'var(--text)' : 'var(--text-mute)' }}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href as any}
                  className="font-semibold transition-colors hover:underline"
                  style={{ color: 'var(--text-mute)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-mute)')}
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
