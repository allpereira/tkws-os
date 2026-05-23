import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CrudPage, FormDialogFooter } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import {
  useCreateEmpreendimento,
  useEmpreendimentos,
  useRemoveEmpreendimento,
  useUpdateEmpreendimento,
} from '../api'
import {
  createEmpreendimentoSchema,
  type CreateEmpreendimento,
  type Empreendimento,
} from '../schema'

function EmpreendimentoForm({ initial, onSuccess }: { initial?: Empreendimento; onSuccess: () => void }) {
  const isEdit = !!initial
  const createMut = useCreateEmpreendimento()
  const updateMut = useUpdateEmpreendimento()
  const mutation = isEdit ? updateMut : createMut

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateEmpreendimento>({
    resolver: zodResolver(createEmpreendimentoSchema),
    defaultValues: {
      nome: initial?.nome ?? '',
      construtora: initial?.construtora ?? '',
      endereco: initial?.endereco ?? '',
      cidade: initial?.cidade ?? '',
      uf: initial?.uf ?? 'SC',
      cep: initial?.cep ?? '',
      totalUnidades: initial?.totalUnidades ?? 0,
      ativo: initial?.ativo ?? true,
      notas: initial?.notas ?? '',
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
        <Input id="nome" state={errors.nome ? 'error' : 'default'} placeholder="Yachthouse Towers" {...register('nome')} />
        {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
      </Field>
      <Field>
        <Label htmlFor="construtora">Construtora</Label>
        <Input id="construtora" placeholder="WS Group" {...register('construtora')} />
      </Field>
      <Field>
        <Label htmlFor="endereco" required>Endereço</Label>
        <Input id="endereco" state={errors.endereco ? 'error' : 'default'} placeholder="Av. Brasil, 100" {...register('endereco')} />
      </Field>
      <div className="grid grid-cols-[1fr_80px_140px] gap-3">
        <Field>
          <Label htmlFor="cidade" required>Cidade</Label>
          <Input id="cidade" state={errors.cidade ? 'error' : 'default'} placeholder="Balneário Camboriú" {...register('cidade')} />
        </Field>
        <Field>
          <Label htmlFor="uf" required>UF</Label>
          <Input id="uf" maxLength={2} state={errors.uf ? 'error' : 'default'} placeholder="SC" className="uppercase" {...register('uf')} />
        </Field>
        <Field>
          <Label htmlFor="cep">CEP</Label>
          <Input id="cep" placeholder="88330-000" state={errors.cep ? 'error' : 'default'} {...register('cep')} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="totalUnidades">Unidades</Label>
          <Input id="totalUnidades" type="number" min={0} {...register('totalUnidades', { valueAsNumber: true })} />
        </Field>
        <label className="text-sm mt-7 flex items-center gap-2">
          <input type="checkbox" {...register('ativo')} className="h-4 w-4" />
          Ativo
        </label>
      </div>
      <Field>
        <Label htmlFor="notas">Notas</Label>
        <Textarea id="notas" rows={2} {...register('notas')} />
      </Field>
      {mutation.isError && (
        <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/30 px-3 py-2 text-xs">
          Erro · {mutation.error?.message}
        </div>
      )}
      <FormDialogFooter onCancel={onSuccess} loading={isSubmitting || mutation.isPending} />
    </form>
  )
}

export function EmpreendimentosPage() {
  const listQuery = useEmpreendimentos()
  const removeMut = useRemoveEmpreendimento()

  return (
    <CrudPage<Empreendimento>
      crumb="Configurações · Empresa"
      title="Empreendimentos"
      description="Prédios e condomínios onde projetos são executados."
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
        { key: 'construtora', header: 'Construtora', cell: (r) => <span className="text-muted-foreground">{r.construtora ?? '—'}</span> },
        {
          key: 'cidade',
          header: 'Cidade / UF',
          cell: (r) => <span className="text-muted-foreground">{r.cidade} · {r.uf}</span>,
        },
        { key: 'totalUnidades', header: 'Unidades', width: 'w-24', align: 'right' },
        {
          key: 'ativo',
          header: 'Status',
          width: 'w-24',
          cell: (r) => (r.ativo ? <Badge variant="success">Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>),
        },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nome}
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo empreendimento')}
      renderForm={(item, close) => <EmpreendimentoForm initial={item} onSuccess={close} />}
    />
  )
}
