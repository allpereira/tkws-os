import * as React from 'react'
import { cn } from '@/lib/utils'
import { Breadcrumb, type BreadcrumbItemDef } from '@/components/ui/breadcrumb'

/**
 * PageShell · chrome editorial padrão TKWS OS (pattern AppShell do design system).
 *
 * Layout flat full-bleed · breadcrumb hierárquico em barra própria + page header
 * + toolbar sticky opcional + conteúdo. Cola direto no `<main>` do AppShell
 * (cancela o padding com margens negativas) para alinhar todas as telas ao
 * mesmo padrão de `/crm/atendimento` — margem, alinhamento e organização.
 *
 * Mesma estrutura usada pelo `PipelineKanbanShell`; este é o caso genérico
 * (sem KPI strip nem view switcher fixos).
 */

export interface PageShellProps {
  /** Breadcrumb hierárquico explícito · tem prioridade sobre `crumb`. */
  breadcrumbs?: BreadcrumbItemDef[]
  /**
   * Crumb legado (string única com `·`, `›` ou `/` como separador). Derivado
   * para um breadcrumb hierárquico: cada segmento vira um item e o `title` fecha
   * como página atual. Ex.: `"Configurações · CRM"` + `"Pipelines"` →
   * `Configurações › CRM › Pipelines`.
   */
  crumb?: string
  title: string
  /** Frase italianizada opcional pós-título · ex.: "para Família Andrade". */
  italic?: string
  description?: string
  actions?: React.ReactNode
  /** Toolbar sticky opcional (busca, filtros, view switcher). */
  toolbar?: React.ReactNode
  children: React.ReactNode
  /**
   * Aplica padding interno ao conteúdo (`px-6 py-6`). Default `true`.
   * Use `false` quando o conteúdo controla o próprio padding (ex.: Kanban).
   */
  contentPadding?: boolean
  className?: string
}

const SURFACE = { borderColor: 'var(--line-1)', background: 'var(--surface-1)' } as const

/** Deriva breadcrumb hierárquico a partir do `crumb` legado + `title`. */
function deriveBreadcrumbs(crumb: string | undefined, title: string): BreadcrumbItemDef[] {
  const parents = (crumb ?? '')
    .split(/[·›/]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((label) => ({ label }))
  return [...parents, { label: title, current: true }]
}

export function PageShell({
  breadcrumbs,
  crumb,
  title,
  italic,
  description,
  actions,
  toolbar,
  children,
  contentPadding = true,
  className,
}: PageShellProps) {
  const items =
    breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : deriveBreadcrumbs(crumb, title)

  return (
    <div
      className={cn(
        '-mx-4 -my-6 flex min-h-[calc(100vh-7rem)] flex-col md:-mx-8 md:-my-8',
        className,
      )}
    >
      {/* Breadcrumb · hierarquia clicável */}
      <div className="border-b px-6 py-2.5" style={SURFACE}>
        <Breadcrumb items={items} />
      </div>

      {/* Page header · título + ações */}
      <div className="border-b px-6 pt-6 pb-5" style={SURFACE}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1
              className="serif text-[28px] font-normal leading-[1.1] md:text-[30px]"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              {title}
              {italic && (
                <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>
                  {' '}
                  {italic}
                </em>
              )}
            </h1>
            {description && (
              <p
                className="mt-2 max-w-2xl text-[13.5px] leading-relaxed"
                style={{ color: 'var(--text-soft)' }}
              >
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>

      {/* Toolbar sticky · busca / filtros / view switcher */}
      {toolbar && (
        <div
          className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b px-6 py-3"
          style={SURFACE}
        >
          {toolbar}
        </div>
      )}

      {/* Conteúdo */}
      <div
        className={cn('flex-1', contentPadding && 'px-6 py-6')}
        style={{ background: 'var(--bg)' }}
      >
        {children}
      </div>
    </div>
  )
}
