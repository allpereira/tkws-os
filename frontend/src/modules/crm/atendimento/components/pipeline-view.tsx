import * as React from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/tkws/confirm-dialog'
import { SystemFrame } from '@/components/tkws/system-frame'
import { formatApiErrorInfo, parseApiError, toneForStatus } from '@/lib/api-error'
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { PageShell } from '@/components/tkws/page-shell'
import { Spinner } from '@/components/ui/spinner'
import { useEtapas } from '@/modules/crm/configuracoes/etapas/api'
import { usePipelines } from '@/modules/crm/configuracoes/pipelines/api'
import { usePessoas } from '@/modules/crm/pessoas/api'
import type { Pessoa } from '@/modules/crm/pessoas/schema'
import { useOportunidadesByPipeline, useRemoveOportunidade } from '../api'
import { computeKanbanTotals, filterOportunidades } from '../lib/kanban-oportunidade'
import type { Oportunidade } from '../schema'
import { OportunidadeForm } from './oportunidade-form'
import { OportunidadeKanban } from './oportunidade-kanban'
import { OportunidadeList } from './oportunidade-list'
import { PipelineKanbanShell } from './pipeline-kanban-shell'

export interface PipelineViewProps {
  /** Filtra pipelines disponíveis · 'atendimento' ou 'proposta' */
  modulo: 'atendimento' | 'proposta'
  title: string
  description?: string
}

const MODULO_LABEL: Record<PipelineViewProps['modulo'], string> = {
  atendimento: 'Atendimento',
  proposta: 'Proposta',
}

/**
 * View completa de pipeline · shell editorial (pattern CRM Kanban) + board/lista.
 * Reusada em Atendimento e Proposta.
 */
export function PipelineView({ modulo, title, description }: PipelineViewProps) {
  const pipelinesQuery = usePipelines()
  const etapasQuery = useEtapas()
  const [view, setView] = React.useState<'kanban' | 'list'>('kanban')
  const [pipelineId, setPipelineId] = React.useState<string>('')
  const [search, setSearch] = React.useState('')
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Oportunidade | undefined>(undefined)
  const [toDelete, setToDelete] = React.useState<Oportunidade | undefined>(undefined)
  const removeMut = useRemoveOportunidade()

  const pipelinesModulo = React.useMemo(
    () => pipelinesQuery.data?.filter((p) => p.modulo === modulo && p.ativo) ?? [],
    [pipelinesQuery.data, modulo],
  )

  React.useEffect(() => {
    if (!pipelineId && pipelinesModulo.length > 0) {
      setPipelineId(pipelinesModulo[0]!.id)
    }
  }, [pipelinesModulo, pipelineId])

  const oportunidadesQuery = useOportunidadesByPipeline(pipelineId)
  const pessoasQuery = usePessoas()
  const etapasDoPipeline = React.useMemo(
    () =>
      (etapasQuery.data ?? [])
        .filter((e) => e.pipelineId === pipelineId && e.ativo)
        .sort((a, b) => a.ordem - b.ordem),
    [etapasQuery.data, pipelineId],
  )

  const etapaById = React.useMemo(() => {
    const map = new Map<string, (typeof etapasDoPipeline)[number]>()
    for (const e of etapasDoPipeline) map.set(e.id, e)
    return map
  }, [etapasDoPipeline])

  const oportunidades = React.useMemo(() => oportunidadesQuery.data ?? [], [oportunidadesQuery.data])

  const pessoaById = React.useMemo(() => {
    const map = new Map<string, Pessoa>()
    for (const p of pessoasQuery.data ?? []) map.set(p.id, p)
    return map
  }, [pessoasQuery.data])

  const oportunidadesFiltradas = React.useMemo(
    () => filterOportunidades(oportunidades, search, pessoaById),
    [oportunidades, search, pessoaById],
  )

  const totals = React.useMemo(
    () => computeKanbanTotals(oportunidadesFiltradas, etapaById),
    [oportunidadesFiltradas, etapaById],
  )

  const pipelineAtivo = pipelinesModulo.find((p) => p.id === pipelineId)

  const openNew = () => {
    setEditing(undefined)
    setFormOpen(true)
  }
  const openEdit = (op: Oportunidade) => {
    setEditing(op)
    setFormOpen(true)
  }
  const requestDelete = (op: Oportunidade) => {
    setToDelete(op)
  }
  const confirmDelete = async () => {
    if (!toDelete) return
    try {
      await removeMut.mutateAsync(toDelete.id)
      setToDelete(undefined)
      // Se o item excluído estava aberto pra edição, fecha o form
      if (editing?.id === toDelete.id) {
        setFormOpen(false)
        setEditing(undefined)
      }
    } catch {
      // Erro fica visível via removeMut.error · usuário pode tentar de novo
    }
  }

  if (pipelinesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={24} label="Carregando pipelines" />
      </div>
    )
  }

  if (pipelinesModulo.length === 0) {
    return (
      <PageShell crumb="CRM" title={title} description={description}>
        <EmptyState
          title="Sem pipelines configurados"
          description={`Crie um pipeline em Configurações → CRM → Pipelines com módulo "${modulo}".`}
        />
      </PageShell>
    )
  }

  const errorFrame = oportunidadesQuery.isError
    ? (() => {
        const err = parseApiError(oportunidadesQuery.error)
        return (
          <SystemFrame
            bigNum={err.status ? String(err.status) : err.isNetworkError ? '⚡' : '!'}
            bigEmTone={toneForStatus(err)}
            label={`${err.statusText ?? 'Erro'} · Oportunidades`}
            title="Não conseguimos carregar"
            italic="as oportunidades."
            description={err.message}
            info={formatApiErrorInfo(err)}
            actions={
              <Button onClick={() => oportunidadesQuery.refetch()}>
                <RefreshCw size={14} /> Tentar novamente
              </Button>
            }
          />
        )
      })()
    : null

  const listContent =
    view === 'list' && !errorFrame ? (
      <OportunidadeList
        etapas={etapasDoPipeline}
        oportunidades={oportunidadesFiltradas}
        totals={totals}
        isLoading={oportunidadesQuery.isLoading}
        onRowClick={openEdit}
        onDelete={requestDelete}
      />
    ) : null

  const kanbanContent =
    view === 'kanban' && !errorFrame ? (
      oportunidadesQuery.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size={20} label="Carregando oportunidades" />
        </div>
      ) : (
        <OportunidadeKanban
          etapas={etapasDoPipeline}
          oportunidades={oportunidadesFiltradas}
          search={search}
          onCardClick={openEdit}
          onNewOportunidade={openNew}
          onDelete={requestDelete}
        />
      )
    ) : null

  return (
    <>
      <PipelineKanbanShell
        moduloLabel={MODULO_LABEL[modulo]}
        title={title}
        description={description}
        pipelineName={pipelineAtivo?.nome}
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
        totals={totals}
        onNewOportunidade={openNew}
      >
        {errorFrame ?? kanbanContent ?? listContent}
      </PipelineKanbanShell>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? `Editar · ${editing.titulo}`
                : `Nova ${modulo === 'proposta' ? 'proposta' : 'oportunidade'}`}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <OportunidadeForm
              initial={editing}
              pipelineId={pipelineId}
              modulo={modulo}
              etapas={etapasDoPipeline}
              onSuccess={() => setFormOpen(false)}
              onRequestDelete={editing ? () => requestDelete(editing) : undefined}
            />
          </DialogBody>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(undefined)}
        title={toDelete ? `Excluir “${toDelete.titulo}”?` : 'Excluir oportunidade'}
        description={
          modulo === 'proposta'
            ? 'A proposta será removida permanentemente do pipeline.'
            : 'A oportunidade será removida permanentemente do pipeline.'
        }
        variant="danger"
        confirmLabel="Sim, excluir"
        loading={removeMut.isPending}
        onConfirm={confirmDelete}
      />
    </>
  )
}
