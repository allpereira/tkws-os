import { CrudPage } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { usePipelines, useRemovePipeline } from '../api'
import type { Pipeline } from '../schema'
import { PipelineForm } from './pipeline-form'

export function PipelinesPage() {
  const listQuery = usePipelines()
  const removeMut = useRemovePipeline()

  return (
    <CrudPage<Pipeline>
      crumb="Configurações · CRM"
      title="Pipelines"
      description="Fluxos de etapas no CRM · Atendimento e Proposta."
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
        {
          key: 'modulo',
          header: 'Módulo',
          width: 'w-32',
          cell: (r) => (
            <Badge variant={r.modulo === 'atendimento' ? 'default' : 'success'}>
              {r.modulo === 'atendimento' ? 'Atendimento' : 'Proposta'}
            </Badge>
          ),
        },
        {
          key: 'descricao',
          header: 'Descrição',
          cell: (r) => <span className="text-muted-foreground line-clamp-1">{r.descricao ?? '—'}</span>,
        },
        {
          key: 'ativo',
          header: 'Status',
          width: 'w-24',
          cell: (r) =>
            r.ativo ? <Badge variant="success">Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>,
        },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nome}
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo pipeline')}
      formDialogDescription="Cada pipeline tem uma sequência de etapas (cards no Kanban)."
      renderForm={(item, close) => <PipelineForm initial={item} onSuccess={close} />}
    />
  )
}
