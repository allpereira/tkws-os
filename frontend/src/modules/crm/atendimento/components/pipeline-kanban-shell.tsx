import * as React from 'react'
import {
  Filter,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Search,
} from 'lucide-react'
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
 * Header + KPI strip + toolbar · board/lista como children.
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
  return (
    <div
      className="overflow-hidden rounded-[10px] border"
      style={{ borderColor: 'var(--line-1)', background: 'var(--bg)' }}
    >
      <div
        className="border-b p-6 max-[760px]:p-4"
        style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div
              className="mono text-[10.5px] font-semibold uppercase tracking-[1.3px]"
              style={{ color: 'var(--text-mute)' }}
            >
              CRM · {moduloLabel}
            </div>
            <h1
              className="serif mt-1.5 text-[28px] font-normal leading-[1.1] md:text-[30px]"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              {totals.count} {totals.count === 1 ? 'oportunidade' : 'oportunidades'}
              <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>
                {' '}
                · {formatPipelineTotal(totals.total)} em pipeline
              </em>
            </h1>
            <div className="mt-1.5 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              {pipelineName ? `${pipelineName} · ` : ''}
              {description ?? title}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onNewOportunidade}>
              <Plus size={14} /> Nova oportunidade
            </Button>
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-3 border-b p-4 sm:grid-cols-4 md:p-6"
        style={{ borderColor: 'var(--line-1)' }}
      >
        <KpiMini
          label="Pipeline"
          value={formatPipelineTotal(totals.total)}
          hint={`${totals.count} deals ativos`}
          tone="brand"
        />
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

      <div
        className="flex flex-wrap items-center gap-3 border-b p-4"
        style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <Input
            icon={<Search size={13} />}
            placeholder="Buscar deal, cliente, valor…"
            className="max-w-md min-w-[12rem] flex-1 !text-[13px]"
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
        <div className="flex flex-wrap items-center gap-1.5">
          <Button variant="outline" size="sm" type="button" disabled>
            <Filter size={12} /> Filtros
          </Button>
          {totals.stale > 0 && <Badge tone="warning">{totals.stale} esquecidos</Badge>}
        </div>
      </div>

      {children}
    </div>
  )
}
