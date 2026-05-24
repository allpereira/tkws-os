import * as React from 'react'
import { cn } from '@/lib/utils'
import { Breadcrumb, type BreadcrumbItemDef } from '@/components/ui/breadcrumb'

/**
 * PageHeader · padrão TKWS OS · Fraunces serif + crumb mono uppercase + actions.
 *
 * Aceita:
 *   - crumb (string simples · ex: "CRM") OU breadcrumbs (lista)
 *   - title (string)
 *   - italic (frase italiana opcional pós-título, ex: "Família Andrade")
 *   - description
 *   - actions
 */

export interface PageHeaderProps {
  /** Crumb simples · vira pequena tag mono acima do título */
  crumb?: string
  /** Breadcrumb hierárquico · renderiza acima do crumb simples */
  breadcrumbs?: BreadcrumbItemDef[]
  title: string
  /** Texto italianizado opcional pós-título · ex: "para Família Andrade" */
  italic?: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  crumb,
  breadcrumbs,
  title,
  italic,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-col gap-3', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
      <div
        className="flex flex-wrap items-end justify-between gap-4 border-b pb-5"
        style={{ borderColor: 'var(--line-1)' }}
      >
        <div className="min-w-0 flex-1">
          {crumb && (
            <div
              className="mono mb-1.5 text-[10.5px] font-semibold uppercase tracking-[1.4px]"
              style={{ color: 'var(--text-mute)' }}
            >
              {crumb}
            </div>
          )}
          <h1
            className="serif text-[30px] font-normal leading-[1.1]"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            {title}
            {italic && (
              <em
                className="italic font-normal"
                style={{ color: 'var(--text-soft)' }}
              >
                {' '}
                {italic}
              </em>
            )}
          </h1>
          {description && (
            <p
              className="mt-2 max-w-2xl text-[14px] leading-relaxed"
              style={{ color: 'var(--text-soft)' }}
            >
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </div>
    </div>
  )
}
