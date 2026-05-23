import * as React from 'react'
import { Calendar, MoreHorizontal, User } from 'lucide-react'
import type { Etapa } from '@/modules/crm/configuracoes/etapas/schema'
import { formatBRLCompact, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useMoveOportunidade } from '../api'
import type { Oportunidade } from '../schema'

/**
 * Kanban simples · HTML drag-and-drop nativo.
 * Para um DnD mais robusto, considere @dnd-kit · este atende o caso 80%.
 */

interface KanbanColumnProps {
  etapa: Etapa
  cards: Oportunidade[]
  onCardClick: (op: Oportunidade) => void
  onDrop: (opId: string, toEtapaId: string) => void
}

function KanbanColumn({ etapa, cards, onCardClick, onDrop }: KanbanColumnProps) {
  const [isOver, setIsOver] = React.useState(false)
  const valorTotal = cards.reduce((sum, c) => sum + c.valor, 0)

  return (
    <div
      className={cn(
        'bg-muted/30 flex w-72 shrink-0 flex-col rounded-lg border',
        isOver && 'ring-primary ring-2',
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsOver(true)
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsOver(false)
        const opId = e.dataTransfer.getData('text/oportunidade-id')
        if (opId) onDrop(opId, etapa.id)
      }}
    >
      <div className="border-b px-3 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: etapa.cor }} aria-hidden />
            <span className="text-sm font-semibold">{etapa.nome}</span>
            <span className="bg-background text-muted-foreground rounded-full px-1.5 py-px font-mono text-[10px]">
              {cards.length}
            </span>
          </div>
          <button
            className="text-muted-foreground hover:text-foreground"
            aria-label={`Mais opções · ${etapa.nome}`}
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
        <div className="text-muted-foreground mt-1 font-mono text-[10.5px]">
          {formatBRLCompact(valorTotal)} · {etapa.probabilidade}% prob
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {cards.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-xs">
            Solte oportunidades aqui
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {cards.map((card) => (
              <article
                key={card.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/oportunidade-id', card.id)
                  e.dataTransfer.effectAllowed = 'move'
                }}
                onClick={() => onCardClick(card)}
                className="bg-card hover:border-primary/40 cursor-pointer rounded-md border p-2.5 text-left shadow-sm transition-all hover:shadow"
              >
                <div className="text-sm font-medium leading-tight">{card.titulo}</div>
                <div className="text-foreground/80 mt-1 font-mono text-[11px]">
                  {formatBRLCompact(card.valor)}
                </div>
                <div className="text-muted-foreground mt-2 flex items-center justify-between text-[10.5px]">
                  {card.prazoFechamento ? (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={10} /> {formatDate(card.prazoFechamento)}
                    </span>
                  ) : (
                    <span />
                  )}
                  {card.responsavelId && (
                    <span className="inline-flex items-center gap-1">
                      <User size={10} />
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export interface OportunidadeKanbanProps {
  etapas: Etapa[]
  oportunidades: Oportunidade[]
  onCardClick: (op: Oportunidade) => void
}

export function OportunidadeKanban({ etapas, oportunidades, onCardClick }: OportunidadeKanbanProps) {
  const moveMut = useMoveOportunidade()

  const handleDrop = (opId: string, toEtapaId: string) => {
    const op = oportunidades.find((o) => o.id === opId)
    if (!op || op.etapaId === toEtapaId) return
    moveMut.mutate({ id: opId, etapaId: toEtapaId })
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-h-[60vh] gap-3">
        {etapas.map((etapa) => (
          <KanbanColumn
            key={etapa.id}
            etapa={etapa}
            cards={oportunidades.filter((o) => o.etapaId === etapa.id)}
            onCardClick={onCardClick}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  )
}
