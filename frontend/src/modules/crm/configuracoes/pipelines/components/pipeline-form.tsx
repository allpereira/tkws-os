import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FormDialogFooter } from '@/components/tkws/crud-page'
import { useCreatePipeline, useUpdatePipeline } from '../api'
import { createPipelineSchema, type CreatePipeline, type Pipeline } from '../schema'

export function PipelineForm({ initial, onSuccess }: { initial?: Pipeline; onSuccess: () => void }) {
  const isEdit = !!initial
  const createMut = useCreatePipeline()
  const updateMut = useUpdatePipeline()
  const mutation = isEdit ? updateMut : createMut

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePipeline>({
    resolver: zodResolver(createPipelineSchema),
    defaultValues: {
      nome: initial?.nome ?? '',
      descricao: initial?.descricao ?? '',
      modulo: initial?.modulo ?? 'atendimento',
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
        <Input id="nome" state={errors.nome ? 'error' : 'default'} {...register('nome')} placeholder="Pipeline · Atendimento Comercial" />
        {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
      </Field>
      <Field>
        <Label htmlFor="modulo" required>Módulo</Label>
        <Select id="modulo" {...register('modulo')}>
          <option value="atendimento">Atendimento</option>
          <option value="proposta">Proposta</option>
        </Select>
        <FieldHint>Determina onde o pipeline aparece no CRM.</FieldHint>
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
