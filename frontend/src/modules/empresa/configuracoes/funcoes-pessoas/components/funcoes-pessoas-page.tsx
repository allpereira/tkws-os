import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CrudPage, FormDialogFooter } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useSetores } from '@/modules/empresa/configuracoes/setores/api'
import {
  useCreateFuncaoPessoa,
  useFuncoesPessoas,
  useRemoveFuncaoPessoa,
  useUpdateFuncaoPessoa,
} from '../api'
import { createFuncaoPessoaSchema, type CreateFuncaoPessoa, type FuncaoPessoa } from '../schema'

function FuncaoPessoaForm({ initial, onSuccess }: { initial?: FuncaoPessoa; onSuccess: () => void }) {
  const isEdit = !!initial
  const setores = useSetores()
  const createMut = useCreateFuncaoPessoa()
  const updateMut = useUpdateFuncaoPessoa()
  const mutation = isEdit ? updateMut : createMut
  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<CreateFuncaoPessoa>({
    resolver: zodResolver(createFuncaoPessoaSchema),
    defaultValues: {
      nome: initial?.nome ?? '',
      descricao: initial?.descricao ?? '',
      setorId: initial?.setorId ?? null,
      ativo: initial?.ativo ?? true,
      ordem: initial?.ordem ?? 0,
    },
  })
  const onSubmit = handleSubmit(async (data) => {
    const payload = { ...data, setorId: data.setorId || null }
    if (isEdit && initial) await updateMut.mutateAsync({ id: initial.id, input: payload })
    else await createMut.mutateAsync(payload)
    onSuccess()
  })
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field>
        <Label htmlFor="nome" required>Nome</Label>
        <Input id="nome" state={errors.nome ? 'error' : 'default'} placeholder="Arquiteto líder" {...register('nome')} />
        {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
      </Field>
      <Field>
        <Label htmlFor="setorId">Setor</Label>
        <Select id="setorId" {...register('setorId')}>
          <option value="">Sem setor</option>
          {setores.data?.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
        </Select>
      </Field>
      <Field>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" rows={2} {...register('descricao')} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
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

export function FuncoesPessoasPage() {
  const listQuery = useFuncoesPessoas()
  const setores = useSetores()
  const removeMut = useRemoveFuncaoPessoa()
  const setorNome = (id: string | null | undefined) => setores.data?.find((s) => s.id === id)?.nome ?? '—'

  return (
    <CrudPage<FuncaoPessoa>
      crumb="Configurações · Empresa"
      title="Funções de Pessoas"
      description="Cargos e papéis · usados em equipes e organograma."
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
        { key: 'setorId', header: 'Setor', cell: (r) => <span className="text-muted-foreground">{setorNome(r.setorId)}</span> },
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
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Nova função')}
      renderForm={(item, close) => <FuncaoPessoaForm initial={item} onSuccess={close} />}
    />
  )
}
