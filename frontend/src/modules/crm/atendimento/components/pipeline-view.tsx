import * as React from 'react'
import { KanbanSquare, List, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/tkws/data-table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/tkws/page-header'
import { Select } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { useEtapas } from '@/modules/crm/configuracoes/etapas/api'
import { usePipelines } from '@/modules/crm/configuracoes/pipelines/api'
import { formatBRL, formatDate } from '@/lib/format'
import { useOportunidadesByPipeline } from '../api'
import type { Oportunidade } from '../schema'
import { OportunidadeForm } from './oportunidade-form'
import { OportunidadeKanban } from './oportunidade-kanban'

export interface PipelineViewProps {
  /** Filtra pipelines disponíveis · 'atendimento' ou 'proposta' */
  modulo: 'atendimento' | 'proposta'
  title: string
  description?: string
}

/**
 * View completa de pipeline · seletor de pipeline + toggle Kanban/Lista + form modal.
 * Reusada em Atendimento e Proposta.
 */
export function PipelineView({ modulo, title, description }: PipelineViewProps) {
  const pipelinesQuery = usePipelines()
  const etapasQuery = useEtapas()
  const [view, setView] = React.useState<'kanban' | 'list'>('kanban')
  const [pipelineId, setPipelineId] = React.useState<string>('')
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Oportunidade | undefined>(undefined)

  // Filtra pipelines do módulo correto
  const pipelinesModulo = React.useMemo(
    () => pipelinesQuery.data?.filter((p) => p.modulo === modulo && p.ativo) ?? [],
    [pipelinesQuery.data, modulo],
  )

  // Auto-seleciona primeiro pipeline
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

  return (
    <>
      <PageHeader
        crumb="CRM"
        title={title}
        description={description}
        actions={
          <div className="flex items-center gap-2">
            <Select value={pipelineId} onChange={(e) => setPipelineId(e.target.value)} className="h-9 max-w-xs">
              {pipelinesModulo.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </Select>
            <div className="bg-muted inline-flex items-center rounded-md p-0.5">
              <Button
                variant={view === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('kanban')}
                aria-pressed={view === 'kanban'}
              >
                <KanbanSquare size={14} /> Kanban
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
              >
                <List size={14} /> Lista
              </Button>
            </div>
            <Button onClick={openNew}>
              <Plus size={14} /> Nova oportunidade
            </Button>
          </div>
        }
      />

      {oportunidadesQuery.isError && (
        <div className="bg-destructive/10 text-destructive mb-3 rounded-md border border-destructive/30 px-3 py-2 text-sm">
          Erro ao carregar · {oportunidadesQuery.error?.message}
        </div>
      )}

      {view === 'kanban' ? (
        oportunidadesQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size={20} label="Carregando oportunidades" />
          </div>
        ) : (
          <OportunidadeKanban
            etapas={etapasDoPipeline}
            oportunidades={oportunidadesQuery.data ?? []}
            onCardClick={openEdit}
          />
        )
      ) : (
        <DataTable<Oportunidade>
          data={oportunidadesQuery.data}
          isLoading={oportunidadesQuery.isLoading}
          getRowKey={(r) => r.id}
          onRowClick={openEdit}
          columns={[
            { key: 'titulo', header: 'Título', cell: (r) => <span className="font-medium">{r.titulo}</span> },
            {
              key: 'etapaId',
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
            { key: 'valor', header: 'Valor', width: 'w-32', align: 'right', cell: (r) => formatBRL(r.valor) },
            {
              key: 'prazoFechamento',
              header: 'Prazo',
              width: 'w-28',
              cell: (r) => (r.prazoFechamento ? formatDate(r.prazoFechamento) : '—'),
            },
            {
              key: 'status',
              header: 'Status',
              width: 'w-28',
              cell: (r) =>
                r.ganha ? (
                  <Badge variant="success">Ganha</Badge>
                ) : r.perdida ? (
                  <Badge variant="destructive">Perdida</Badge>
                ) : (
                  <Badge variant="secondary">Em aberto</Badge>
                ),
            },
          ]}
        />
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar · ${editing.titulo}` : `Nova ${modulo === 'proposta' ? 'proposta' : 'oportunidade'}`}
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
