import { CrudPage } from '@/components/tkws/crud-page'
import { ConfigCrudForm } from '@/components/tkws/config-crud-form'
import { Badge } from '@/components/ui/badge'
import {
  useCreateTipoPagamento,
  useRemoveTipoPagamento,
  useTiposPagamento,
  useUpdateTipoPagamento,
} from '../api'
import type { TipoPagamento } from '../schema'

export function TiposPagamentoPage() {
  const listQuery = useTiposPagamento()
  const createMut = useCreateTipoPagamento()
  const updateMut = useUpdateTipoPagamento()
  const removeMut = useRemoveTipoPagamento()

  return (
    <CrudPage<TipoPagamento>
      crumb="Configurações · CRM"
      title="Tipos de Pagamento"
      description="Modalidades disponíveis nas propostas."
      newButtonLabel="+ Novo tipo"
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        {
          key: 'codigo',
          header: 'Código',
          width: 'w-28',
          cell: (r) => <span className="font-mono text-xs">{r.codigo}</span>,
        },
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
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
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo tipo de pagamento')}
      renderForm={(item, close) => (
        <ConfigCrudForm<TipoPagamento>
          initial={item}
          existingItems={listQuery.data}
          codePrefix="TPG"
          createMutation={createMut as never}
          updateMutation={updateMut as never}
          onSuccess={close}
          namePlaceholder="À vista 10% desconto, 8× sem juros, Boleto 30 dias…"
        />
      )}
    />
  )
}
