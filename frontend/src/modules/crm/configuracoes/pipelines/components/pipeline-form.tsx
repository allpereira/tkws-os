import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SelectField } from '@/components/ui/select-field'
import { SwitchField } from '@/components/ui/switch-field'
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
    control,
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
        <Label required>Módulo</Label>
        <SelectField
          control={control}
          name="modulo"
          placeholder="Selecione o módulo"
          options={[
            { value: 'atendimento', label: 'Atendimento' },
            { value: 'proposta', label: 'Proposta' },
          ]}
        />
        <FieldHint>Determina onde o pipeline aparece no CRM.</FieldHint>
      </Field>
      <Field>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" rows={2} {...register('descricao')} />
      </Field>
      <div className="grid grid-cols-2 items-end gap-3">
        <Field>
          <Label htmlFor="ordem">Ordem</Label>
          <Input id="ordem" type="number" min={0} {...register('ordem', { valueAsNumber: true })} />
        </Field>
        <div className="pb-2">
          <SwitchField control={control} name="ativo" />
        </div>
      </div>
      {mutation.isError && (
        <Alert tone="danger">
          <AlertTitle>Não foi possível salvar</AlertTitle>
          <AlertDescription>{mutation.error?.message ?? 'Erro inesperado.'}</AlertDescription>
        </Alert>
      )}
      <FormDialogFooter onCancel={onSuccess} loading={isSubmitting || mutation.isPending} />
    </form>
  )
}
