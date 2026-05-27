import * as React from 'react'
import { LayoutGrid, List as ListIcon, Plus, Search } from 'lucide-react'
import { Breadcrumb, type BreadcrumbItemDef } from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KpiMini } from '@/components/tkws/kpi'
import { formatCurrency } from '@/lib/utils'
import type { KanbanTotals } from '../lib/kanban-oportunidade'

export type { KanbanTotals }

function formatPipelineTotal(v: number): string {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}K`
  return formatCurrency(v)
}

export interface PipelineKanbanShellProps {
  moduloLabel: string
  title: string
  description?: string
  pipelineName?: string
  view: 'kanban' | 'list'
  onViewChange: (view: 'kanban' | 'list') => void
  search: string
  onSearchChange: (value: string) => void
  totals: KanbanTotals
  onNewOportunidade: () => void
  children: React.ReactNode
}

/**
 * Shell editorial do pattern CRM Oportunidades · Kanban.
 *
 * Layout flat tipo AppShell · breadcrumb + page header + KPI strip + toolbar
 * sticky · sem outer card. Cola direto no <main> do AppShell para não criar
 * efeito "caixa-dentro-de-caixa".
 */
export function PipelineKanbanShell({
  moduloLabel,
  title,
  description,
  pipelineName,
  view,
  onViewChange,
  search,
  onSearchChange,
  totals,
  onNewOportunidade,
  children,
}: PipelineKanbanShellProps) {
  const breadcrumbItems: BreadcrumbItemDef[] = React.useMemo(() => {
    const items: BreadcrumbItemDef[] = [
      { label: 'CRM' },
      pipelineName
        ? { label: moduloLabel }
        : { label: moduloLabel, current: true },
    ]
    if (pipelineName) items.push({ label: pipelineName, current: true })
    return items
  }, [moduloLabel, pipelineName])

  return (
    <div className="-mx-4 -my-6 flex min-h-[calc(100vh-7rem)] flex-col md:-mx-8 md:-my-8">
      {/* Breadcrumb */}
      <div
        className="border-b px-6 py-2.5"
        style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
      >
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Page Header · título + ação primária */}
      <div
        className="border-b px-6 pt-6 pb-5"
        style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1
              className="serif text-[28px] font-normal leading-[1.1] md:text-[30px]"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              {totals.count} {totals.count === 1 ? 'oportunidade' : 'oportunidades'}
              <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>
                {' '}
                · {formatPipelineTotal(totals.total)} em pipeline
              </em>
            </h1>
            <p
              className="mt-2 max-w-2xl text-[13.5px] leading-relaxed"
              style={{ color: 'var(--text-soft)' }}
            >
              {description ?? title}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button onClick={onNewOportunidade}>
              <Plus size={14} /> Nova oportunidade
            </Button>
          </div>
        </div>
      </div>

      {/* KPI strip · enxuto · 3 KPIs · total do pipeline já vive no header */}
      <div
        className="grid grid-cols-3 gap-3 border-b px-6 py-4"
        style={{ borderColor: 'var(--line-1)' }}
      >
        <KpiMini
          label="Ponderado"
          value={formatPipelineTotal(totals.weighted)}
          hint="por probabilidade"
          tone="success"
        />
        <KpiMini label="Deals quentes" value={String(totals.hot)} hint="prob. ≥ 70%" tone="danger" />
        <KpiMini
          label="Sem toque +3d"
          value={String(totals.stale)}
          hint="precisam follow-up"
          tone="warning"
        />
      </div>

      {/* Toolbar sticky · busca + view switcher + filtros */}
      <div
        className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b px-6 py-3"
        style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <Input
            icon={<Search size={13} />}
            placeholder="Buscar deal, cliente, valor…"
            className="max-w-md min-w-[14rem] flex-1 !text-[13px]"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Tabs value={view} onValueChange={(v) => onViewChange(v as 'kanban' | 'list')}>
            <TabsList variant="pill">
              <TabsTrigger value="kanban">
                <LayoutGrid size={12} /> Kanban
              </TabsTrigger>
              <TabsTrigger value="list">
                <ListIcon size={12} /> Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {totals.stale > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="warning">{totals.stale} esquecidos</Badge>
          </div>
        )}
      </div>

      {/* Content · board ou lista */}
      <div className="flex-1" style={{ background: 'var(--bg)' }}>
        {children}
      </div>
    </div>
  )
}
