import { CrudPage } from '@/components/tkws/crud-page'
import { ConfigCrudForm } from '@/components/tkws/config-crud-form'
import { Badge } from '@/components/ui/badge'
import { useCreateOferta, useOfertas, useRemoveOferta, useUpdateOferta } from '../api'
import type { Oferta } from '../schema'

export function OfertasPage() {
  const listQuery = useOfertas()
  const createMut = useCreateOferta()
  const updateMut = useUpdateOferta()
  const removeMut = useRemoveOferta()

  return (
    <CrudPage<Oferta>
      crumb="Configurações · Organização"
      title="Ofertas"
      description="Catálogo de ofertas que a TKWS oferece aos clientes · usadas em propostas e orçamentos."
      newButtonLabel="Nova oferta"
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
            r.ativo ? <Badge variant="success">Ativa</Badge> : <Badge variant="secondary">Inativa</Badge>,
        },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nome}
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Nova oferta')}
      renderForm={(item, close) => (
        <ConfigCrudForm<Oferta>
          initial={item}
          existingItems={listQuery.data}
          codePrefix="OFE"
          createMutation={createMut}
          updateMutation={updateMut}
          onSuccess={close}
          namePlaceholder="Marcenaria sob medida · m²"
        />
      )}
    />
  )
}
