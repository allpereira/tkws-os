import * as React from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface KanbanCard {
  id: string
  title: string
  meta?: string
  badge?: { label: string; tone: BadgeTone }
  laneId: string
}

export interface KanbanLane {
  id: string
  title: string
  tone?: BadgeTone
}

export interface KanbanProps {
  lanes: KanbanLane[]
  cards: KanbanCard[]
  onChange?: (cards: KanbanCard[]) => void
}

export function Kanban({ lanes, cards: initial, onChange }: KanbanProps) {
  const [cards, setCards] = React.useState(initial)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const cardsByLane = React.useMemo(() => {
    const map = new Map<string, KanbanCard[]>()
    lanes.forEach((l) => map.set(l.id, []))
    cards.forEach((c) => {
      const arr = map.get(c.laneId) ?? []
      arr.push(c)
      map.set(c.laneId, arr)
    })
    return map
  }, [cards, lanes])

  const activeCard = activeId ? cards.find((c) => c.id === activeId) : null

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string)
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null)
    const { active, over } = e
    if (!over) return
    const activeCardId = active.id as string
    const overId = over.id as string
    const fromLane = cards.find((c) => c.id === activeCardId)?.laneId
    let toLane: string | undefined
    if (lanes.some((l) => l.id === overId)) {
      toLane = overId
    } else {
      toLane = cards.find((c) => c.id === overId)?.laneId
    }
    if (!toLane || toLane === fromLane) return
    const next = cards.map((c) => (c.id === activeCardId ? { ...c, laneId: toLane! } : c))
    setCards(next)
    onChange?.(next)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid auto-cols-[minmax(260px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2">
        {lanes.map((lane) => {
          const laneCards = cardsByLane.get(lane.id) ?? []
          return (
            <Lane key={lane.id} lane={lane} cards={laneCards} />
          )
        })}
      </div>
      <DragOverlay>{activeCard && <CardView card={activeCard} dragging />}</DragOverlay>
    </DndContext>
  )
}

function Lane({ lane, cards }: { lane: KanbanLane; cards: KanbanCard[] }) {
  return (
    <div
      className="flex flex-col gap-2 rounded-xl border p-3"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
    >
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: laneTone(lane.tone) }}
          />
          <span
            className="mono text-[10.5px] font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-soft)' }}
          >
            {lane.title}
          </span>
        </div>
        <span
          className="mono rounded px-1.5 py-0.5 text-[10px] font-bold"
          style={{ background: 'var(--surface-2)', color: 'var(--text-mute)' }}
        >
          {cards.length}
        </span>
      </div>
      <SortableContext id={lane.id} items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div id={lane.id} className="flex min-h-20 flex-col gap-2">
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

function SortableCard({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <CardView card={card} />
    </div>
  )
}

function CardView({ card, dragging }: { card: KanbanCard; dragging?: boolean }) {
  return (
    <div
      className={cn(
        'cursor-grab rounded-lg border p-3 active:cursor-grabbing',
        dragging && 'rotate-2 shadow-2xl'
      )}
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--line-2)',
      }}
    >
      <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
        {card.title}
      </div>
      {card.meta && (
        <div className="mono mt-1 text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
          {card.meta}
        </div>
      )}
      {card.badge && (
        <div className="mt-2">
          <Badge tone={card.badge.tone}>{card.badge.label}</Badge>
        </div>
      )}
    </div>
  )
}

function laneTone(t?: BadgeTone) {
  if (!t) return 'var(--brand)'
  return `var(--${t === 'neutral' ? 'text-mute' : t})`
}
