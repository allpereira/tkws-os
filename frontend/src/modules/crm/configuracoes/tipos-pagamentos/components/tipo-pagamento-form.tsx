import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { FormDialogFooter } from '@/components/tkws/crud-page'
import { useCreateTipoPagamento, useUpdateTipoPagamento } from '../api'
import {
  createTipoPagamentoSchema,
  type CreateTipoPagamento,
  type TipoPagamento,
} from '../schema'

export function TipoPagamentoForm({
  initial,
  onSuccess,
}: {
  initial?: TipoPagamento
  onSuccess: () => void
}) {
  const isEdit = !!initial
  const createMut = useCreateTipoPagamento()
  const updateMut = useUpdateTipoPagamento()
  const mutation = isEdit ? updateMut : createMut

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTipoPagamento>({
    resolver: zodResolver(createTipoPagamentoSchema),
    defaultValues: {
      nome: initial?.nome ?? '',
      descricao: initial?.descricao ?? '',
      parcelas: initial?.parcelas ?? 1,
      jurosMes: initial?.jurosMes ?? 0,
      descontoVista: initial?.descontoVista ?? 0,
      ativo: initial?.ativo ?? true,
      ordem: initial?.ordem ?? 0,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    if (isEdit && initial) {
      await updateMut.mutateAsync({ id: initial.id, input: data })
    } else {
      await createMut.mutateAsync(data)
    }
    onSuccess()
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field>
        <Label htmlFor="nome" required>Nome</Label>
        <Input id="nome" state={errors.nome ? 'error' : 'default'} placeholder="8× sem juros · cartão" {...register('nome')} />
        {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
      </Field>
      <Field>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" rows={2} {...register('descricao')} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field>
          <Label htmlFor="parcelas">Parcelas</Label>
          <Input id="parcelas" type="number" min={1} max={48} {...register('parcelas', { valueAsNumber: true })} />
        </Field>
        <Field>
          <Label htmlFor="jurosMes">Juros/mês %</Label>
          <Input id="jurosMes" type="number" min={0} step={0.1} {...register('jurosMes', { valueAsNumber: true })} />
        </Field>
        <Field>
          <Label htmlFor="descontoVista">Desc. à vista %</Label>
          <Input id="descontoVista" type="number" min={0} step={0.1} {...register('descontoVista', { valueAsNumber: true })} />
        </Field>
      </div>
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
