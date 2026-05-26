import * as React from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/tkws/data-table'
import { Badge } from '@/components/ui/badge'
import { SystemFrame } from '@/components/tkws/system-frame'
import { formatApiErrorInfo, parseApiError, toneForStatus } from '@/lib/api-error'
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/tkws/page-header'
import { Spinner } from '@/components/ui/spinner'
import { useEtapas } from '@/modules/crm/configuracoes/etapas/api'
import { usePipelines } from '@/modules/crm/configuracoes/pipelines/api'
import { formatBRL, formatDate } from '@/lib/format'
import { useOportunidadesByPipeline } from '../api'
import { computeKanbanTotals } from '../lib/kanban-oportunidade'
import type { Oportunidade } from '../schema'
import { OportunidadeForm } from './oportunidade-form'
import { OportunidadeKanban } from './oportunidade-kanban'
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

  const oportunidades = oportunidadesQuery.data ?? []
  const totals = React.useMemo(
    () => computeKanbanTotals(oportunidades, etapaById),
    [oportunidades, etapaById],
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

  if (pipelinesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={24} label="Carregando pipelines" />
      </div>
    )
  }

  if (pipelinesModulo.length === 0) {
    return (
      <>
        <PageHeader crumb="CRM" title={title} description={description} />
        <EmptyState
          title="Sem pipelines configurados"
          description={`Crie um pipeline em Configurações → CRM → Pipelines com módulo "${modulo}".`}
        />
      </>
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
    view === 'list' ? (
      <div className="p-4 md:p-5">
        <DataTable<Oportunidade>
          data={oportunidadesQuery.data}
          isLoading={oportunidadesQuery.isLoading}
          getRowKey={(r) => r.id}
          onRowClick={openEdit}
          columns={[
            {
              key: 'titulo',
              header: 'Título',
              cell: (r) => <span className="font-medium">{r.titulo}</span>,
            },
            {
              key: 'etapa',
              header: 'Etapa',
              width: 'w-44',
              cell: (r) => {
                const et = etapasDoPipeline.find((e) => e.id === r.etapaId)
                return et ? (
                  <Badge variant="outline" style={{ borderColor: et.cor, color: et.cor }}>
                    {et.nome}
                  </Badge>
                ) : (
                  '—'
                )
              },
            },
            {
              key: 'valor',
              header: 'Valor',
              width: 'w-32',
              align: 'right',
              cell: (r) => formatBRL(r.valor),
            },
            {
              key: 'prazoFechamento',
              header: 'Prazo',
              width: 'w-28',
              cell: (r) => (r.prazoFechamento ? formatDate(r.prazoFechamento) : '—'),
            },
          ]}
        />
      </div>
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
          oportunidades={oportunidades}
          search={search}
          onCardClick={openEdit}
          onNewOportunidade={openNew}
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
            />
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  )
}
