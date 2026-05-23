import { CrudPage } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { useRemoveTipoProposta, useTiposProposta } from '../api'
import type { TipoProposta } from '../schema'
import { TipoPropostaForm } from './tipo-proposta-form'

export function TiposPropostaPage() {
  const listQuery = useTiposProposta()
  const removeMut = useRemoveTipoProposta()

  return (
    <CrudPage<TipoProposta>
      crumb="Configurações · CRM"
      title="Tipos de Propostas"
      description="Categorias de propostas comerciais · usadas no Pipeline de Propostas."
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        {
          key: 'cor',
          header: '',
          width: 'w-10',
          cell: (row) => (
            <span
              aria-hidden="true"
              className="inline-block h-4 w-4 rounded-sm"
              style={{ background: row.cor }}
            />
          ),
        },
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
        {
          key: 'descricao',
          header: 'Descrição',
          cell: (r) => (
            <span className="text-muted-foreground line-clamp-1">{r.descricao ?? '—'}</span>
          ),
        },
        {
          key: 'ativo',
          header: 'Status',
          width: 'w-24',
          cell: (r) =>
            r.ativo ? <Badge variant="success">Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>,
        },
        { key: 'ordem', header: 'Ordem', width: 'w-20', align: 'right' },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nome}
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo tipo de proposta')}
      formDialogDescription="Os tipos definem a primeira escolha ao criar uma proposta."
      renderForm={(item, close) => <TipoPropostaForm initial={item} onSuccess={close} />}
    />
  )
}
