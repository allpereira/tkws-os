import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CrudPage, FormDialogFooter } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useSetores } from '@/modules/empresa/configuracoes/setores/api'
import { formatBRL } from '@/lib/format'
import { useCreateProduto, useProdutos, useRemoveProduto, useUpdateProduto } from '../api'
import { createProdutoSchema, type CreateProduto, type Produto } from '../schema'

function ProdutoForm({ initial, onSuccess }: { initial?: Produto; onSuccess: () => void }) {
  const isEdit = !!initial
  const setores = useSetores()
  const createMut = useCreateProduto()
  const updateMut = useUpdateProduto()
  const mutation = isEdit ? updateMut : createMut

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateProduto>({
    resolver: zodResolver(createProdutoSchema),
    defaultValues: {
      codigo: initial?.codigo ?? '',
      nome: initial?.nome ?? '',
      descricao: initial?.descricao ?? '',
      setorId: initial?.setorId ?? null,
      unidade: initial?.unidade ?? 'un',
      precoBase: initial?.precoBase ?? 0,
      ativo: initial?.ativo ?? true,
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
      <div className="grid grid-cols-[140px_1fr] gap-3">
        <Field>
          <Label htmlFor="codigo" required>Código</Label>
          <Input id="codigo" state={errors.codigo ? 'error' : 'default'} placeholder="PRD-001" {...register('codigo')} />
          {errors.codigo && <FieldHint state="error">{errors.codigo.message}</FieldHint>}
        </Field>
        <Field>
          <Label htmlFor="nome" required>Nome</Label>
          <Input id="nome" state={errors.nome ? 'error' : 'default'} placeholder="Marcenaria sob medida · m²" {...register('nome')} />
          {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
        </Field>
      </div>

      <Field>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" rows={2} {...register('descricao')} />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field>
          <Label htmlFor="setorId">Setor</Label>
          <Select id="setorId" {...register('setorId')}>
            <option value="">Sem setor</option>
            {setores.data?.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="unidade" required>Unidade</Label>
          <Input id="unidade" placeholder="un · m² · h" {...register('unidade')} />
        </Field>
        <Field>
          <Label htmlFor="precoBase">Preço base (R$)</Label>
          <Input id="precoBase" type="number" min={0} step={0.01} {...register('precoBase', { valueAsNumber: true })} />
        </Field>
      </div>

      <label className="text-sm flex items-center gap-2">
        <input type="checkbox" {...register('ativo')} className="h-4 w-4" />
        Ativo
      </label>

      {mutation.isError && (
        <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/30 px-3 py-2 text-xs">
          Erro · {mutation.error?.message}
        </div>
      )}
      <FormDialogFooter onCancel={onSuccess} loading={isSubmitting || mutation.isPending} />
    </form>
  )
}

export function ProdutosPage() {
  const listQuery = useProdutos()
  const setores = useSetores()
  const removeMut = useRemoveProduto()
  const setorNome = (id: string | null | undefined) => setores.data?.find((s) => s.id === id)?.nome ?? '—'

  return (
    <CrudPage<Produto>
      crumb="Configurações · Empresa"
      title="Produtos"
      description="Catálogo de produtos vendidos · usados em propostas e orçamentos."
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        { key: 'codigo', header: 'Código', width: 'w-32', cell: (r) => <span className="font-mono text-xs">{r.codigo}</span> },
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
        { key: 'setorId', header: 'Setor', cell: (r) => <span className="text-muted-foreground">{setorNome(r.setorId)}</span> },
        { key: 'unidade', header: 'Un.', width: 'w-16', align: 'center' },
        { key: 'precoBase', header: 'Preço base', width: 'w-32', align: 'right', cell: (r) => formatBRL(r.precoBase) },
        {
          key: 'ativo',
          header: 'Status',
          width: 'w-24',
          cell: (r) => (r.ativo ? <Badge variant="success">Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>),
        },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nome}
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo produto')}
      renderForm={(item, close) => <ProdutoForm initial={item} onSuccess={close} />}
    />
  )
}
