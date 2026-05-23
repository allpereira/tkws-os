import { CrudPage } from '@/components/tkws/crud-page'
import { SimpleNomeForm } from '@/components/tkws/simple-name-form'
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
      crumb="Configurações · Empresa"
      title="Setores"
      description="Departamentos internos · usados em projetos e equipes."
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
        {
          key: 'descricao',
          header: 'Descrição',
          cell: (r) => <span className="text-muted-foreground line-clamp-1">{r.descricao ?? '—'}</span>,
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
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo setor')}
      renderForm={(item, close) => (
        <SimpleNomeForm<Setor>
          initial={item}
          createMutation={createMut as any}
          updateMutation={updateMut as any}
          onSuccess={close}
          namePlaceholder="Marketing, Comercial, Operações…"
        />
      )}
    />
  )
}
