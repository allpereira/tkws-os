import * as React from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import type { BadgeTone } from '@/components/ui/badge'
import { DealCard, DealLaneHeader } from '@/components/tkws/crm-deal-card'
import { AdvanceEtapaDropdown } from './advance-etapa-dropdown'
import { OportunidadeRowMenu } from './oportunidade-row-menu'
import type { Etapa } from '@/modules/crm/configuracoes/etapas/schema'
import { usePessoas } from '@/modules/crm/pessoas/api'
import type { Pessoa } from '@/modules/crm/pessoas/schema'
import { useOfertas } from '@/modules/organizacao/configuracoes/ofertas/api'
import type { Oferta } from '@/modules/organizacao/configuracoes/ofertas/schema'
import { cn } from '@/lib/utils'
import { useMoveOportunidade } from '../api'
import {
  filterOportunidades,
  mapOportunidadeToDeal,
  ofertaTag,
  pessoaLabel,
  staleDays,
} from '../lib/kanban-oportunidade'
import type { Oportunidade } from '../schema'

export interface OportunidadeKanbanProps {
  etapas: Etapa[]
  oportunidades: Oportunidade[]
  search?: string
  onCardClick: (op: Oportunidade) => void
  onNewOportunidade?: () => void
  onDelete?: (op: Oportunidade) => void
}

export function OportunidadeKanban({
  etapas,
  oportunidades,
  search = '',
  onCardClick,
  onNewOportunidade,
  onDelete,
}: OportunidadeKanbanProps) {
  const moveMut = useMoveOportunidade()
  const pessoasQuery = usePessoas()
  const ofertasQuery = useOfertas()
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const pessoaById = React.useMemo(() => {
    const map = new Map<string, Pessoa>()
    for (const p of pessoasQuery.data ?? []) map.set(p.id, p)
    return map
  }, [pessoasQuery.data])

  const ofertaById = React.useMemo(() => {
    const map = new Map<string, Oferta>()
    for (const o of ofertasQuery.data ?? []) map.set(o.id, o)
    return map
  }, [ofertasQuery.data])

  const etapaById = React.useMemo(() => {
    const map = new Map<string, Etapa>()
    for (const e of etapas) map.set(e.id, e)
    return map
  }, [etapas])

  const filtered = React.useMemo(
    () => filterOportunidades(oportunidades, search, pessoaById),
    [oportunidades, search, pessoaById],
  )

  const moveToEtapa = (opId: string, toEtapaId: string) => {
    const op = oportunidades.find((o) => o.id === opId)
    if (!op || op.etapaId === toEtapaId || moveMut.isPending) return
    moveMut.mutate({ id: opId, etapaId: toEtapaId })
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return
    const opId = active.id as string
    const overId = over.id as string
    let toEtapaId: string | undefined
    if (etapaById.has(overId)) {
      toEtapaId = overId
    } else {
      toEtapaId = filtered.find((o) => o.id === overId)?.etapaId
    }
    if (toEtapaId) moveToEtapa(opId, toEtapaId)
  }

  const activeOp = activeId ? filtered.find((o) => o.id === activeId) : undefined
  const activeEtapa = activeOp ? etapaById.get(activeOp.etapaId) : undefined

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto p-4 md:p-5">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${etapas.length}, minmax(260px, 1fr))`,
            minWidth: etapas.length * 260,
          }}
        >
          {etapas.map((etapa, laneIdx) => {
            const cards = filtered.filter((o) => o.etapaId === etapa.id)
            const laneTotal = cards.reduce((sum, c) => sum + c.valor, 0)
            const nextEtapa = etapas[laneIdx + 1]

            return (
              <KanbanLane key={etapa.id} onQuickAdd={onNewOportunidade}>
                <DealLaneHeader
                  label={etapa.nome}
                  count={cards.length}
                  totalReais={laneTotal}
                  color={etapa.cor}
                  probabilityHint={`${etapa.probabilidade}% prob`}
                />
                <KanbanLaneCards etapaId={etapa.id}>
                  {cards.map((op) => (
                    <DraggableDealCard
                      key={op.id}
                      oportunidade={op}
                      etapa={etapa}
                      account={pessoaLabel(op.pessoaId ? pessoaById.get(op.pessoaId) : undefined)}
                      tag={op.ofertaId ? ofertaTag(ofertaById.get(op.ofertaId)) : undefined}
                      selected={selectedId === op.id}
                      isDragging={activeId === op.id}
                      onSelect={() => setSelectedId(op.id)}
                      onOpen={() => onCardClick(op)}
                      etapas={etapas}
                      onMoveToEtapa={(toEtapaId) => moveToEtapa(op.id, toEtapaId)}
                      nextEtapaId={nextEtapa?.id}
                      moveDisabled={moveMut.isPending}
                      onDelete={onDelete ? () => onDelete(op) : undefined}
                    />
                  ))}
                  {cards.length === 0 && (
                    <div
                      className="rounded-[10px] border border-dashed py-8 text-center"
                      style={{ borderColor: 'var(--line-2)' }}
                    >
                      <span
                        className="mono text-[10px] font-bold uppercase tracking-[1.4px]"
                        style={{ color: 'var(--text-mute)' }}
                      >
                        Arraste cards para cá
                      </span>
                    </div>
                  )}
                </KanbanLaneCards>
              </KanbanLane>
            )
          })}
        </div>
      </div>

      <DragOverlay>
        {activeOp && activeEtapa ? (
          <DealCard
            deal={mapOportunidadeToDeal(
              activeOp,
              activeEtapa,
              pessoaLabel(activeOp.pessoaId ? pessoaById.get(activeOp.pessoaId) : undefined),
              activeOp.ofertaId ? ofertaTag(ofertaById.get(activeOp.ofertaId)) : undefined,
            )}
            overlay
            showProbability={false}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanLane({
  children,
  onQuickAdd,
}: {
  children: React.ReactNode
  onQuickAdd?: () => void
}) {
  return (
    <section className="flex flex-col gap-2.5">
      {children}
      <button
        type="button"
        onClick={onQuickAdd}
        className="group/qa flex items-center justify-center gap-2 rounded-[10px] border border-dashed py-3 text-[12px] font-medium transition-all hover:bg-white/[0.03]"
        style={{ borderColor: 'var(--line-2)', color: 'var(--text-mute)' }}
      >
        <Plus size={13} />
        <span className="group-hover/qa:text-[var(--text-soft)]">Nova oportunidade</span>
      </button>
    </section>
  )
}

/** Área de drop da coluna · id = etapaId para o @dnd-kit resolver o destino. */
function KanbanLaneCards({
  etapaId,
  children,
}: {
  etapaId: string
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: etapaId })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-[120px] flex-col gap-2 rounded-[10px] p-0.5 transition-shadow',
        isOver && 'ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-[var(--bg)]',
      )}
    >
      {children}
    </div>
  )
}

function DraggableDealCard({
  oportunidade: op,
  etapa,
  account,
  tag,
  selected,
  isDragging,
  onSelect,
  onOpen,
  etapas,
  onMoveToEtapa,
  nextEtapaId,
  moveDisabled,
  onDelete,
}: {
  oportunidade: Oportunidade
  etapa: Etapa
  account: string
  tag?: { label: string; tone: BadgeTone }
  selected?: boolean
  isDragging?: boolean
  onSelect?: () => void
  onOpen?: () => void
  etapas: Etapa[]
  onMoveToEtapa: (etapaId: string) => void
  nextEtapaId?: string
  moveDisabled?: boolean
  onDelete?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: op.id })

  const deal = mapOportunidadeToDeal(op, etapa, account, tag)

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div ref={setNodeRef} style={style}>
      <DealCard
        deal={deal}
        selected={selected}
        staleDays={staleDays(op.updatedAt)}
        isDragging={isDragging}
        showProbability={false}
        dragHandleProps={{ ...listeners, ...attributes }}
        onClick={() => {
          onSelect?.()
          onOpen?.()
        }}
        kebabSlot={
          onDelete && onOpen ? (
            <OportunidadeRowMenu onEdit={onOpen} onDelete={onDelete} />
          ) : undefined
        }
        actionRow={
          <AdvanceEtapaDropdown
            etapas={etapas}
            currentEtapaId={etapa.id}
            nextEtapaId={nextEtapaId}
            disabled={moveDisabled}
            onSelect={onMoveToEtapa}
          />
        }
      />
    </div>
  )
}
