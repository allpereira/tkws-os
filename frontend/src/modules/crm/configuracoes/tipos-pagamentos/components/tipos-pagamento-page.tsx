import { CrudPage } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { useRemoveTipoPagamento, useTiposPagamento } from '../api'
import type { TipoPagamento } from '../schema'
import { TipoPagamentoForm } from './tipo-pagamento-form'

export function TiposPagamentoPage() {
  const listQuery = useTiposPagamento()
  const removeMut = useRemoveTipoPagamento()

  return (
    <CrudPage<TipoPagamento>
      crumb="Configurações · CRM"
      title="Tipos de Pagamento"
      description="Modalidades disponíveis nas propostas · parcelas, juros e desconto à vista."
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
        { key: 'parcelas', header: 'Parcelas', width: 'w-24', align: 'right', cell: (r) => `${r.parcelas}×` },
        { key: 'jurosMes', header: 'Juros/mês', width: 'w-24', align: 'right', cell: (r) => `${r.jurosMes}%` },
        { key: 'descontoVista', header: 'Desc. à vista', width: 'w-28', align: 'right', cell: (r) => (r.descontoVista > 0 ? `${r.descontoVista}%` : '—') },
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
      renderForm={(item, close) => <TipoPagamentoForm initial={item} onSuccess={close} />}
    />
  )
}
