import { CrudPage } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { usePipelines } from '@/modules/crm/configuracoes/pipelines/api'
import { useEtapas, useRemoveEtapa } from '../api'
import type { Etapa } from '../schema'
import { EtapaForm } from './etapa-form'

export function EtapasPage() {
  const listQuery = useEtapas()
  const pipelines = usePipelines()
  const removeMut = useRemoveEtapa()
  const pipelineName = (id: string) => pipelines.data?.find((p) => p.id === id)?.nome ?? '—'

  return (
    <CrudPage<Etapa>
      crumb="Configurações · CRM"
      title="Etapas"
      description="Colunas do Kanban · cada etapa pertence a um pipeline."
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        {
          key: 'cor',
          header: '',
          width: 'w-10',
          cell: (r) => (
            <span aria-hidden="true" className="inline-block h-4 w-4 rounded-sm" style={{ background: r.cor }} />
          ),
        },
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
        {
          key: 'pipelineId',
          header: 'Pipeline',
          cell: (r) => <span className="text-muted-foreground">{pipelineName(r.pipelineId)}</span>,
        },
        {
          key: 'tipo',
          header: 'Tipo',
          width: 'w-28',
          cell: (r) =>
            r.tipo === 'ganha' ? (
              <Badge variant="success">Ganha</Badge>
            ) : r.tipo === 'perdida' ? (
              <Badge variant="destructive">Perdida</Badge>
            ) : (
              <Badge variant="secondary">Aberta</Badge>
            ),
        },
        {
          key: 'probabilidade',
          header: '% prob.',
          width: 'w-20',
          align: 'right',
          cell: (r) => `${r.probabilidade}%`,
        },
        { key: 'ordem', header: 'Ordem', width: 'w-20', align: 'right' },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nome}
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Nova etapa')}
      formDialogDescription="Etapas viram colunas do Kanban no CRM."
      renderForm={(item, close) => <EtapaForm initial={item} onSuccess={close} />}
    />
  )
}
