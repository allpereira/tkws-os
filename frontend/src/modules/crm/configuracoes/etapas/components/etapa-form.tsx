import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SelectField } from '@/components/ui/select-field'
import { SwitchField } from '@/components/ui/switch-field'
import { FormDialogFooter } from '@/components/tkws/crud-page'
import { usePipelines } from '@/modules/crm/configuracoes/pipelines/api'
import { useCreateEtapa, useUpdateEtapa } from '../api'
import { createEtapaSchema, type CreateEtapa, type Etapa } from '../schema'

export function EtapaForm({ initial, onSuccess }: { initial?: Etapa; onSuccess: () => void }) {
  const isEdit = !!initial
  const pipelines = usePipelines()
  const createMut = useCreateEtapa()
  const updateMut = useUpdateEtapa()
  const mutation = isEdit ? updateMut : createMut

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateEtapa>({
    resolver: zodResolver(createEtapaSchema),
    defaultValues: {
      pipelineId: initial?.pipelineId ?? '',
      nome: initial?.nome ?? '',
      descricao: initial?.descricao ?? '',
      cor: initial?.cor ?? '#74C7E4',
      probabilidade: initial?.probabilidade ?? 50,
      ativo: initial?.ativo ?? true,
      ordem: initial?.ordem ?? 0,
      tipo: initial?.tipo ?? 'aberta',
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
        <Label required>Pipeline</Label>
        <SelectField
          control={control}
          name="pipelineId"
          placeholder="Selecione um pipeline…"
          state={errors.pipelineId ? 'error' : 'default'}
          options={(pipelines.data ?? []).map((p) => ({
            value: p.id,
            label: `${p.nome} · ${p.modulo}`,
          }))}
        />
        {errors.pipelineId && <FieldHint state="error">Pipeline obrigatório</FieldHint>}
      </Field>

      <Field>
        <Label htmlFor="nome" required>Nome</Label>
        <Input id="nome" state={errors.nome ? 'error' : 'default'} placeholder="Em qualificação" {...register('nome')} />
        {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
      </Field>

      <Field>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" rows={2} {...register('descricao')} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label>Tipo</Label>
          <SelectField
            control={control}
            name="tipo"
            placeholder="Selecione o tipo"
            options={[
              { value: 'aberta', label: 'Em andamento' },
              { value: 'ganha', label: 'Ganha (terminal)' },
              { value: 'perdida', label: 'Perdida (terminal)' },
            ]}
          />
        </Field>
        <Field>
          <Label htmlFor="probabilidade">Probabilidade %</Label>
          <Input id="probabilidade" type="number" min={0} max={100} {...register('probabilidade', { valueAsNumber: true })} />
        </Field>
      </div>

      <div className="grid grid-cols-3 items-end gap-3">
        <Field>
          <Label htmlFor="cor">Cor</Label>
          <Input id="cor" type="color" className="h-10 cursor-pointer p-1" {...register('cor')} />
        </Field>
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
