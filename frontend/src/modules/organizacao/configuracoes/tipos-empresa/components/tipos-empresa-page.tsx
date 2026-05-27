import { CrudPage } from '@/components/tkws/crud-page'
import { ConfigCrudForm } from '@/components/tkws/config-crud-form'
import { Badge } from '@/components/ui/badge'
import {
  useCreateTipoEmpresa,
  useRemoveTipoEmpresa,
  useTiposEmpresa,
  useUpdateTipoEmpresa,
} from '../api'
import type { TipoEmpresa } from '../schema'

export function TiposEmpresaPage() {
  const listQuery = useTiposEmpresa()
  const createMut = useCreateTipoEmpresa()
  const updateMut = useUpdateTipoEmpresa()
  const removeMut = useRemoveTipoEmpresa()

  return (
    <CrudPage<TipoEmpresa>
      crumb="Configurações · Organização"
      title="Tipos de Empresa"
      description="Taxonomia das empresas externas (Clientes, Fornecedores, Construtoras / Incorporadoras, Parceiros…)."
      newButtonLabel="Novo tipo"
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
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo tipo de empresa')}
      renderForm={(item, close) => (
        <ConfigCrudForm<TipoEmpresa>
          initial={item}
          existingItems={listQuery.data}
          codePrefix="TEM"
          createMutation={createMut}
          updateMutation={updateMut}
          onSuccess={close}
          namePlaceholder="Cliente, Fornecedor, Construtora, Parceiro…"
        />
      )}
    />
  )
}
