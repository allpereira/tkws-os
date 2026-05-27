import * as React from 'react'
import { CheckCircle2, ChevronDown, Plus, Star } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { LeadScore } from '@/components/tkws/crm-lead-score'
import { formatBRL } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Etapa } from '@/modules/crm/configuracoes/etapas/schema'
import { usePessoas } from '@/modules/crm/pessoas/api'
import type { Pessoa } from '@/modules/crm/pessoas/schema'
import { useMoveOportunidade } from '../api'
import {
  formatCloseShort,
  pessoaLabel,
  staleDays,
  temperatureFromProbability,
  type KanbanTotals,
} from '../lib/kanban-oportunidade'
import type { Oportunidade } from '../schema'
import { AdvanceEtapaIconButton, EtapaInlineSelect } from './advance-etapa-dropdown'
import { OportunidadeRowMenu } from './oportunidade-row-menu'

type SavedViewId = 'all' | 'hot' | 'stale' | 'closing' | 'high'

const SAVED_VIEWS: { id: SavedViewId; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'hot', label: 'Quentes' },
  { id: 'stale', label: 'Esquecidos +3d' },
  { id: 'closing', label: 'Fecha em 30d' },
  { id: 'high', label: '+R$ 5M' },
]

function probTone(probability: number): 'success' | 'warning' | 'brand' | 'danger' {
  if (probability >= 70) return 'success'
  if (probability >= 40) return 'warning'
  if (probability >= 20) return 'brand'
  return 'danger'
}

function applySavedView(
  opps: Oportunidade[],
  viewId: SavedViewId,
  etapaById: Map<string, Etapa>,
): Oportunidade[] {
  const now = Date.now()
  const in30d = now + 30 * 86_400_000
  switch (viewId) {
    case 'hot':
      return opps.filter((o) => {
        const prob = etapaById.get(o.etapaId)?.probabilidade ?? 0
        return temperatureFromProbability(prob) === 'hot'
      })
    case 'stale':
      return opps.filter((o) => staleDays(o.updatedAt) !== undefined)
    case 'closing':
      return opps.filter((o) => {
        if (!o.prazoFechamento) return false
        const t = new Date(o.prazoFechamento).getTime()
        return !Number.isNaN(t) && t <= in30d
      })
    case 'high':
      return opps.filter((o) => o.valor >= 5_000_000)
    default:
      return opps
  }
}

function countForView(
  opps: Oportunidade[],
  viewId: SavedViewId,
  etapaById: Map<string, Etapa>,
): number {
  return applySavedView(opps, viewId, etapaById).length
}

export interface OportunidadeListProps {
  etapas: Etapa[]
  oportunidades: Oportunidade[]
  totals: KanbanTotals
  isLoading?: boolean
  onRowClick: (op: Oportunidade) => void
  onDelete?: (op: Oportunidade) => void
}

/**
 * Lista tabular do pipeline · pattern CRM Oportunidades Lista (design-system).
 */
export function OportunidadeList({
  etapas,
  oportunidades,
  totals,
  isLoading,
  onRowClick,
  onDelete,
}: OportunidadeListProps) {
  const moveMut = useMoveOportunidade()
  const pessoasQuery = usePessoas()
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [activeView, setActiveView] = React.useState<SavedViewId>('all')
  const [starred, setStarred] = React.useState<Set<string>>(new Set())

  const pessoaById = React.useMemo(() => {
    const map = new Map<string, Pessoa>()
    for (const p of pessoasQuery.data ?? []) map.set(p.id, p)
    return map
  }, [pessoasQuery.data])

  const etapaById = React.useMemo(() => {
    const map = new Map<string, Etapa>()
    for (const e of etapas) map.set(e.id, e)
    return map
  }, [etapas])

  const rows = React.useMemo(
    () => applySavedView(oportunidades, activeView, etapaById),
    [oportunidades, activeView, etapaById],
  )

  const toggleAll = () => {
    if (selected.size === rows.length) setSelected(new Set())
    else setSelected(new Set(rows.map((o) => o.id)))
  }

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleStar = (id: string) => {
    setStarred((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const moveToEtapa = (opId: string, toEtapaId: string) => {
    const op = oportunidades.find((o) => o.id === opId)
    if (!op || op.etapaId === toEtapaId || moveMut.isPending) return
    moveMut.mutate({ id: opId, etapaId: toEtapaId })
  }

  const moveBulkToEtapa = async (toEtapaId: string) => {
    const ids = [...selected]
    await Promise.all(ids.map((id) => moveMut.mutateAsync({ id, etapaId: toEtapaId })))
    setSelected(new Set())
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={24} label="Carregando oportunidades" />
      </div>
    )
  }

  return (
    <>
      {/* Saved views */}
      <div
        className="border-b p-4"
        style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]"
            style={{ color: 'var(--text-mute)' }}
          >
            Visões salvas
          </span>
          {SAVED_VIEWS.map((v) => {
            const active = v.id === activeView
            const count = countForView(oportunidades, v.id, etapaById)
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveView(v.id)}
                className={cn(
                  'mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors',
                  active ? 'cursor-default' : 'cursor-pointer hover:brightness-110',
                )}
                style={{
                  background: active ? 'var(--brand-soft)' : 'var(--surface-2)',
                  borderColor: active ? 'var(--brand)' : 'var(--line-2)',
                  color: active ? 'var(--brand)' : 'var(--text-soft)',
                }}
              >
                {v.label}
                <span
                  className="rounded-full px-1.5 text-[9.5px]"
                  style={{
                    background: active ? 'var(--brand)' : 'var(--surface-3)',
                    color: active ? 'var(--bg)' : 'var(--text-mute)',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
          <button
            type="button"
            disabled
            className="mono inline-flex cursor-not-allowed items-center gap-1 rounded-full border border-dashed px-2.5 py-1 text-[11px] font-semibold opacity-50"
            style={{ borderColor: 'var(--line-2)', color: 'var(--text-mute)' }}
          >
            <Plus size={11} /> Salvar visão
          </button>
        </div>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div
          className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b px-6 py-3"
          style={{ background: 'var(--brand)', color: 'var(--bg)' }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={16} />
            <span className="text-[13px] font-bold">
              {selected.size} oportunidade{selected.size > 1 ? 's' : ''} selecionada
              {selected.size > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="mono inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[1.2px]"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--bg)' }}
                >
                  Mover para etapa <ChevronDown size={12} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mover selecionados</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {etapas.map((e) => (
                  <DropdownMenuItem
                    key={e.id}
                    disabled={moveMut.isPending}
                    onSelect={() => void moveBulkToEtapa(e.id)}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: e.cor }} />
                    {e.nome}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="mono text-[11px] font-bold uppercase tracking-[1.2px] underline-offset-2 hover:underline"
              style={{ color: 'var(--bg)' }}
            >
              Limpar
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]" style={{ color: 'var(--text)' }}>
          <thead>
            <tr
              className="border-b"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
            >
              <th className="w-[40px] px-4 py-2.5 text-left">
                <Checkbox
                  checked={rows.length > 0 && selected.size === rows.length}
                  onCheckedChange={toggleAll}
                  aria-label="Selecionar todos"
                />
              </th>
              <th className="w-[28px] px-1 py-2.5" />
              <th
                className="mono px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Oportunidade
              </th>
              <th
                className="mono px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Etapa
              </th>
              <th
                className="mono px-3 py-2.5 text-right text-[9.5px] font-bold uppercase tracking-[1.3px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Valor
              </th>
              <th
                className="mono w-[160px] px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Probab.
              </th>
              <th
                className="mono px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Fecha em
              </th>
              <th
                className="mono px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Último toque
              </th>
              <th className="w-[140px] px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-[13px]"
                  style={{ color: 'var(--text-soft)' }}
                >
                  Nenhuma oportunidade nesta visão.
                </td>
              </tr>
            ) : (
              rows.map((op) => {
                const etapa = etapaById.get(op.etapaId)
                const account = pessoaLabel(
                  op.pessoaId ? pessoaById.get(op.pessoaId) : undefined,
                )
                const probability = etapa?.probabilidade ?? 0
                const temperature = temperatureFromProbability(probability)
                const isSelected = selected.has(op.id)
                const stale = staleDays(op.updatedAt)
                const laneIdx = etapas.findIndex((e) => e.id === op.etapaId)
                const nextEtapaId = laneIdx >= 0 ? etapas[laneIdx + 1]?.id : undefined

                return (
                  <tr
                    key={op.id}
                    onClick={() => onRowClick(op)}
                    className={cn(
                      'group cursor-pointer border-b transition-colors',
                      isSelected ? 'bg-[var(--brand-soft)]' : 'hover:bg-white/[0.025]',
                    )}
                    style={{ borderColor: 'var(--line-1)' }}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleOne(op.id)} />
                    </td>
                    <td className="px-1 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        aria-label={starred.has(op.id) ? 'Desfavoritar' : 'Favoritar'}
                        onClick={() => toggleStar(op.id)}
                        className="cursor-pointer transition-colors"
                        style={{
                          color: starred.has(op.id) ? 'var(--warning)' : 'var(--text-mute)',
                        }}
                      >
                        <Star size={14} fill={starred.has(op.id) ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {temperature !== 'cold' && (
                          <LeadScore temperature={temperature} size="sm" showLabel={false} />
                        )}
                        <div className="min-w-0">
                          <div
                            className="mono text-[9.5px] font-semibold uppercase tracking-[1.1px]"
                            style={{ color: 'var(--text-mute)' }}
                          >
                            {account}
                          </div>
                          <div
                            className="serif mt-0.5 truncate text-[14px] font-normal leading-tight"
                            style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
                          >
                            {op.titulo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      {etapa ? (
                        <EtapaInlineSelect
                          etapa={etapa}
                          etapas={etapas}
                          disabled={moveMut.isPending}
                          onSelect={(id) => moveToEtapa(op.id, id)}
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td
                      className="num-tabular serif px-3 py-3 text-right text-[16px] font-normal"
                      style={{ color: 'var(--text)' }}
                    >
                      {formatBRL(op.valor)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={probability}
                          tone={probTone(probability) === 'brand' ? 'brand' : probTone(probability)}
                          className="flex-1"
                        />
                        <span
                          className="mono w-9 text-right text-[11.5px] font-bold"
                          style={{ color: 'var(--text)' }}
                        >
                          {probability}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="mono text-[11.5px]" style={{ color: 'var(--text-soft)' }}>
                        {formatCloseShort(op.prazoFechamento)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <Avatar
                          size="sm"
                          style={{
                            background: 'var(--brand)',
                            height: 22,
                            width: 22,
                            fontSize: 9,
                          }}
                        >
                          <AvatarFallback>TK</AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            'mono text-[11.5px]',
                            stale !== undefined ? 'font-bold' : '',
                          )}
                          style={{
                            color: stale !== undefined ? 'var(--danger)' : 'var(--text-soft)',
                          }}
                        >
                          {formatRelativeTouch(op.updatedAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {etapa && (
                          <AdvanceEtapaIconButton
                            etapas={etapas}
                            currentEtapaId={etapa.id}
                            nextEtapaId={nextEtapaId}
                            disabled={moveMut.isPending}
                            onSelect={(id) => moveToEtapa(op.id, id)}
                          />
                        )}
                        {onDelete && (
                          <OportunidadeRowMenu
                            variant="icon"
                            onEdit={() => onRowClick(op)}
                            onDelete={() => onDelete(op)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--surface-2)' }}>
              <td
                colSpan={4}
                className="mono px-4 py-3 text-[10.5px] font-bold uppercase tracking-[1.3px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Total · {rows.length} nesta visão
              </td>
              <td
                className="num-tabular serif px-3 py-3 text-right text-[18px] font-normal"
                style={{ color: 'var(--text)' }}
              >
                {formatBRL(totals.total)}
              </td>
              <td
                colSpan={4}
                className="mono px-3 py-3 text-[10.5px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Ponderado · {formatBRL(totals.weighted)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-3 border-t p-4"
        style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
      >
        <div
          className="mono text-[10.5px] font-semibold uppercase tracking-[1.3px]"
          style={{ color: 'var(--text-mute)' }}
        >
          Mostrando 1–{rows.length} de {oportunidades.length} oportunidades
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled>
            Próximo
          </Button>
        </div>
      </div>
    </>
  )
}

function formatRelativeTouch(updatedAt: string): string {
  const diff = Date.now() - new Date(updatedAt).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes} min`
  if (hours < 24) return `${hours}h`
  if (days === 1) return 'ontem'
  if (days < 30) return `há ${days} dias`
  return `há ${days}d`
}
