import { CrudPage } from '@/components/tkws/crud-page'
import { ConfigCrudForm } from '@/components/tkws/config-crud-form'
import { Badge } from '@/components/ui/badge'
import { useCreateSetor, useRemoveSetor, useSetores, useUpdateSetor } from '../api'
import type { Setor } from '../schema'

export function SetoresPage() {
  const listQuery = useSetores()
  const createMut = useCreateSetor()
  const updateMut = useUpdateSetor()
  const removeMut = useRemoveSetor()

  return (
    <CrudPage<Setor>
      crumb="Configurações · Organização"
      title="Setores"
      description="Departamentos internos da organização."
      newButtonLabel="Novo setor"
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
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo setor')}
      renderForm={(item, close) => (
        <ConfigCrudForm<Setor>
          initial={item}
          existingItems={listQuery.data}
          codePrefix="SET"
          createMutation={createMut}
          updateMutation={updateMut}
          onSuccess={close}
          namePlaceholder="Marketing, Comercial, Operações…"
        />
      )}
    />
  )
}
