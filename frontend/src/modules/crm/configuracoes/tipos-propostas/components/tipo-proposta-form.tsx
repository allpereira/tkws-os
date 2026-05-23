import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { FormDialogFooter } from '@/components/tkws/crud-page'
import { useCreateTipoProposta, useUpdateTipoProposta } from '../api'
import {
  createTipoPropostaSchema,
  type CreateTipoProposta,
  type TipoProposta,
} from '../schema'

export interface TipoPropostaFormProps {
  initial?: TipoProposta
  onSuccess: () => void
}

export function TipoPropostaForm({ initial, onSuccess }: TipoPropostaFormProps) {
  const isEdit = !!initial
  const createMut = useCreateTipoProposta()
  const updateMut = useUpdateTipoProposta()
  const mutation = isEdit ? updateMut : createMut

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTipoProposta>({
    resolver: zodResolver(createTipoPropostaSchema),
    defaultValues: {
      nome: initial?.nome ?? '',
      descricao: initial?.descricao ?? '',
      cor: initial?.cor ?? '#74C7E4',
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
        <Label htmlFor="nome" required>
          Nome
        </Label>
        <Input
          id="nome"
          state={errors.nome ? 'error' : 'default'}
          placeholder="Decoração completa"
          autoComplete="off"
          {...register('nome')}
        />
        {errors.nome ? (
          <FieldHint state="error">{errors.nome.message}</FieldHint>
        ) : (
          <FieldHint>Aparece nas listas e nas propostas.</FieldHint>
        )}
      </Field>

      <Field>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          rows={3}
          placeholder="Quando usar este tipo de proposta…"
          {...register('descricao')}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <Label htmlFor="cor">Cor</Label>
          <Input id="cor" type="color" className="h-10 cursor-pointer p-1" {...register('cor')} />
        </Field>
        <Field>
          <Label htmlFor="ordem">Ordem</Label>
          <Input
            id="ordem"
            type="number"
            min={0}
            step={1}
            {...register('ordem', { valueAsNumber: true })}
          />
        </Field>
      </div>

      <label className="text-sm flex items-center gap-2">
        <input type="checkbox" {...register('ativo')} className="h-4 w-4" />
        Ativo
      </label>

      {mutation.isError && (
        <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/30 px-3 py-2 text-xs">
          Erro ao salvar · {mutation.error?.message}
        </div>
      )}

      <FormDialogFooter onCancel={onSuccess} loading={isSubmitting || mutation.isPending} />
    </form>
  )
}
