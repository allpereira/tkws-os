import { CrudPage } from '@/components/tkws/crud-page'
import { ConfigCrudForm } from '@/components/tkws/config-crud-form'
import { Badge } from '@/components/ui/badge'
import {
  useCreateTipoProjeto,
  useRemoveTipoProjeto,
  useTiposProjeto,
  useUpdateTipoProjeto,
} from '../api'
import type { TipoProjeto } from '../schema'

export function TiposProjetoPage() {
  const listQuery = useTiposProjeto()
  const createMut = useCreateTipoProjeto()
  const updateMut = useUpdateTipoProjeto()
  const removeMut = useRemoveTipoProjeto()

  return (
    <CrudPage<TipoProjeto>
      crumb="Configurações · Organização"
      title="Tipos de Projetos"
      description="Categorias de projetos (ex.: Residencial alto padrão, Comercial, Reforma)."
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
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo tipo de projeto')}
      renderForm={(item, close) => (
        <ConfigCrudForm<TipoProjeto>
          initial={item}
          existingItems={listQuery.data}
          codePrefix="TPR"
          createMutation={createMut}
          updateMutation={updateMut}
          onSuccess={close}
          namePlaceholder="Residencial alto padrão, Comercial, Reforma…"
        />
      )}
    />
  )
}
