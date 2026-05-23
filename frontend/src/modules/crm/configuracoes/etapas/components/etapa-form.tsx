import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
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
        <Label htmlFor="pipelineId" required>Pipeline</Label>
        <Select id="pipelineId" state={errors.pipelineId ? 'error' : 'default'} {...register('pipelineId')}>
          <option value="">Selecione um pipeline…</option>
          {pipelines.data?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} · {p.modulo}
            </option>
          ))}
        </Select>
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
          <Label htmlFor="tipo">Tipo</Label>
          <Select id="tipo" {...register('tipo')}>
            <option value="aberta">Em andamento</option>
            <option value="ganha">Ganha (terminal)</option>
            <option value="perdida">Perdida (terminal)</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="probabilidade">Probabilidade %</Label>
          <Input id="probabilidade" type="number" min={0} max={100} {...register('probabilidade', { valueAsNumber: true })} />
        </Field>
      </div>

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
