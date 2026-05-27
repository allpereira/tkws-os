import { CrudPage } from '@/components/tkws/crud-page'
import { ConfigCrudForm } from '@/components/tkws/config-crud-form'
import { Badge } from '@/components/ui/badge'
import {
  useCreateFuncaoPessoa,
  useFuncoesPessoas,
  useRemoveFuncaoPessoa,
  useUpdateFuncaoPessoa,
} from '../api'
import type { FuncaoPessoa } from '../schema'

export function FuncoesPessoasPage() {
  const listQuery = useFuncoesPessoas()
  const createMut = useCreateFuncaoPessoa()
  const updateMut = useUpdateFuncaoPessoa()
  const removeMut = useRemoveFuncaoPessoa()

  return (
    <CrudPage<FuncaoPessoa>
      crumb="Configurações · Organização"
      title="Funções de Pessoas"
      description="Cargos e papéis · usados em equipes e organograma."
      newButtonLabel="Nova função"
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
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Nova função')}
      renderForm={(item, close) => (
        <ConfigCrudForm<FuncaoPessoa>
          initial={item}
          existingItems={listQuery.data}
          codePrefix="FUN"
          createMutation={createMut}
          updateMutation={updateMut}
          onSuccess={close}
          namePlaceholder="Arquiteto líder, Designer pleno, Gerente de obra…"
        />
      )}
    />
  )
}
