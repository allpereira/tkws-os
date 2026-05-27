import { CrudPage } from '@/components/tkws/crud-page'
import { ConfigCrudForm } from '@/components/tkws/config-crud-form'
import { Badge } from '@/components/ui/badge'
import {
  useCreateEmpreendimento,
  useEmpreendimentos,
  useRemoveEmpreendimento,
  useUpdateEmpreendimento,
} from '../api'
import type { Empreendimento } from '../schema'

export function EmpreendimentosPage() {
  const listQuery = useEmpreendimentos()
  const createMut = useCreateEmpreendimento()
  const updateMut = useUpdateEmpreendimento()
  const removeMut = useRemoveEmpreendimento()

  return (
    <CrudPage<Empreendimento>
      crumb="Configurações · Organização"
      title="Empreendimentos"
      description="Prédios e condomínios onde projetos são executados."
      newButtonLabel="Novo empreendimento"
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
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo empreendimento')}
      renderForm={(item, close) => (
        <ConfigCrudForm<Empreendimento>
          initial={item}
          existingItems={listQuery.data}
          codePrefix="EMP"
          createMutation={createMut}
          updateMutation={updateMut}
          onSuccess={close}
          namePlaceholder="Yachthouse Towers"
        />
      )}
    />
  )
}
