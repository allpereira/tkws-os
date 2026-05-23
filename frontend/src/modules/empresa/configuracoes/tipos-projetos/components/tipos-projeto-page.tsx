import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CrudPage, FormDialogFooter } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import {
  useCreateTipoProjeto,
  useRemoveTipoProjeto,
  useTiposProjeto,
  useUpdateTipoProjeto,
} from '../api'
import {
  createTipoProjetoSchema,
  type CreateTipoProjeto,
  type TipoProjeto,
} from '../schema'

function TipoProjetoForm({ initial, onSuccess }: { initial?: TipoProjeto; onSuccess: () => void }) {
  const isEdit = !!initial
  const createMut = useCreateTipoProjeto()
  const updateMut = useUpdateTipoProjeto()
  const mutation = isEdit ? updateMut : createMut
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTipoProjeto>({
    resolver: zodResolver(createTipoProjetoSchema),
    defaultValues: {
      nome: initial?.nome ?? '',
      descricao: initial?.descricao ?? '',
      cor: initial?.cor ?? '#74C7E4',
      ativo: initial?.ativo ?? true,
      ordem: initial?.ordem ?? 0,
    },
  })
  const onSubmit = handleSubmit(async (data) => {
    if (isEdit && initial) await updateMut.mutateAsync({ id: initial.id, input: data })
    else await createMut.mutateAsync(data)
    onSuccess()
  })
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field>
        <Label htmlFor="nome" required>Nome</Label>
        <Input id="nome" state={errors.nome ? 'error' : 'default'} placeholder="Residencial alto padrão" {...register('nome')} />
        {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
      </Field>
      <Field>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" rows={2} {...register('descricao')} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field>
          <Label htmlFor="cor">Cor</Label>
          <Input id="cor" type="color" className="h-10 cursor-pointer p-1" {...register('cor')} />
        </Field>
        <Field>
          <Label htmlFor="ordem">Ordem</Label>
          <Input id="ordem" type="number" min={0} {...register('ordem', { valueAsNumber: true })} />
        </Field>
        <label className="text-sm mt-7 flex items-center gap-2">
          <input type="checkbox" {...register('ativo')} className="h-4 w-4" />
          Ativo
        </label>
      </div>
      {mutation.isError && (
        <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/30 px-3 py-2 text-xs">
          Erro · {mutation.error?.message}
        </div>
      )}
      <FormDialogFooter onCancel={onSuccess} loading={isSubmitting || mutation.isPending} />
    </form>
  )
}

export function TiposProjetoPage() {
  const listQuery = useTiposProjeto()
  const removeMut = useRemoveTipoProjeto()

  return (
    <CrudPage<TipoProjeto>
      crumb="Configurações · Empresa"
      title="Tipos de Projetos"
      description="Categorias de projetos · aparecem como filtro no portfólio."
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        {
          key: 'cor',
          header: '',
          width: 'w-10',
          cell: (r) => <span className="inline-block h-4 w-4 rounded-sm" style={{ background: r.cor }} aria-hidden />,
        },
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
        { key: 'descricao', header: 'Descrição', cell: (r) => <span className="text-muted-foreground line-clamp-1">{r.descricao ?? '—'}</span> },
        {
          key: 'ativo',
          header: 'Status',
          width: 'w-24',
          cell: (r) => (r.ativo ? <Badge variant="success">Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>),
        },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nome}
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo tipo de projeto')}
      renderForm={(item, close) => <TipoProjetoForm initial={item} onSuccess={close} />}
    />
  )
}
