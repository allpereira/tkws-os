import { ArrowRight, ChevronDown, TrendingUp } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Etapa } from '@/modules/crm/configuracoes/etapas/schema'

export interface EtapaMoveMenuProps {
  etapas: Etapa[]
  currentEtapaId: string
  nextEtapaId?: string
  onSelect: (etapaId: string) => void
  disabled?: boolean
}

function EtapaMoveOptions({
  etapas,
  currentEtapaId,
  nextEtapaId,
  onSelect,
  disabled,
}: EtapaMoveMenuProps) {
  const targets = etapas.filter((e) => e.id !== currentEtapaId)
  const nextEtapa = nextEtapaId ? etapas.find((e) => e.id === nextEtapaId) : undefined

  return (
    <>
      {nextEtapa && (
        <>
          <DropdownMenuItem
            disabled={disabled}
            onSelect={() => onSelect(nextEtapa.id)}
            className="font-semibold"
          >
            <ArrowRight size={12} style={{ color: 'var(--brand)' }} />
            Próxima · {nextEtapa.nome}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      )}
      {targets.map((e) => (
        <DropdownMenuItem key={e.id} disabled={disabled} onSelect={() => onSelect(e.id)}>
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: e.cor }} aria-hidden />
          {e.nome}
        </DropdownMenuItem>
      ))}
    </>
  )
}

/** Botão Avançar no card do kanban · escolhe qualquer etapa. */
export function AdvanceEtapaDropdown({
  etapas,
  currentEtapaId,
  nextEtapaId,
  onSelect,
  disabled,
}: EtapaMoveMenuProps) {
  const targets = etapas.filter((e) => e.id !== currentEtapaId)

  if (targets.length === 0) {
    return (
      <span
        className="flex items-center justify-center gap-1 rounded-md py-1.5 text-[10.5px] font-bold"
        style={{ background: 'var(--surface-2)', color: 'var(--text-mute)', border: '1px solid var(--line-2)' }}
      >
        Única etapa
      </span>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex w-full items-center justify-center gap-1 rounded-md py-1.5 text-[10.5px] font-bold disabled:opacity-50"
          style={{ background: 'var(--brand)', color: 'var(--bg)' }}
        >
          Avançar <ArrowRight size={11} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[220px]"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <DropdownMenuLabel>Etapa no pipeline</DropdownMenuLabel>
        <EtapaMoveOptions
          etapas={etapas}
          currentEtapaId={currentEtapaId}
          nextEtapaId={nextEtapaId}
          onSelect={onSelect}
          disabled={disabled}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Botão compacto Avançar na linha da lista (pattern CRM Lista). */
export function AdvanceEtapaIconButton({
  etapas,
  currentEtapaId,
  nextEtapaId,
  onSelect,
  disabled,
}: EtapaMoveMenuProps) {
  const targets = etapas.filter((e) => e.id !== currentEtapaId)
  if (targets.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="flex h-7 cursor-pointer items-center gap-1 rounded-md px-2 text-[10.5px] font-bold transition-colors disabled:opacity-50"
          style={{ background: 'var(--brand)', color: 'var(--bg)' }}
        >
          <TrendingUp size={11} /> Avançar
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel>Etapa no pipeline</DropdownMenuLabel>
        <EtapaMoveOptions
          etapas={etapas}
          currentEtapaId={currentEtapaId}
          nextEtapaId={nextEtapaId}
          onSelect={onSelect}
          disabled={disabled}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Pill inline na lista · mudança de etapa na célula (pattern CRM Lista). */
export function EtapaInlineSelect({
  etapa,
  etapas,
  onSelect,
  disabled,
}: {
  etapa: Etapa
  etapas: Etapa[]
  onSelect: (etapaId: string) => void
  disabled?: boolean
}) {
  const laneIdx = etapas.findIndex((e) => e.id === etapa.id)
  const nextEtapaId = laneIdx >= 0 ? etapas[laneIdx + 1]?.id : undefined

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="group/stg inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 transition-colors hover:brightness-110 disabled:opacity-50"
          style={{
            background: `${etapa.cor}22`,
            borderColor: etapa.cor,
          }}
        >
          <span
            className="mono text-[10.5px] font-bold uppercase tracking-[1.1px]"
            style={{ color: etapa.cor }}
          >
            {etapa.nome}
          </span>
          <ChevronDown
            size={10}
            className="opacity-0 transition-opacity group-hover/stg:opacity-100"
            style={{ color: etapa.cor }}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel>Mudar etapa</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <EtapaMoveOptions
          etapas={etapas}
          currentEtapaId={etapa.id}
          nextEtapaId={nextEtapaId}
          onSelect={onSelect}
          disabled={disabled}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
