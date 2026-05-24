import { CrudPage } from '@/components/tkws/crud-page'
import { ConfigCrudForm } from '@/components/tkws/config-crud-form'
import { Badge } from '@/components/ui/badge'
import {
  useCreateUnidade,
  useRemoveUnidade,
  useUnidades,
  useUpdateUnidade,
} from '../api'
import type { Unidade } from '../schema'

export function UnidadesPage() {
  const listQuery = useUnidades()
  const createMut = useCreateUnidade()
  const updateMut = useUpdateUnidade()
  const removeMut = useRemoveUnidade()

  return (
    <CrudPage<Unidade>
      crumb="Configurações · Organização"
      title="Unidades"
      description="Filiais e escritórios da organização (ex.: TKWS Florianópolis, TKWS Balneário Camboriú)."
      newButtonLabel="+ Nova unidade"
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
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Nova unidade')}
      renderForm={(item, close) => (
        <ConfigCrudForm<Unidade>
          initial={item}
          existingItems={listQuery.data}
          codePrefix="UNI"
          createMutation={createMut as never}
          updateMutation={updateMut as never}
          onSuccess={close}
          namePlaceholder="TKWS Balneário Camboriú"
        />
      )}
    />
  )
}
