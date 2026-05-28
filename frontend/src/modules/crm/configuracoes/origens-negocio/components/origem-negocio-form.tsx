import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Field, FieldHint, Input, Label } from '@/components/ui/input'
import { SwitchField } from '@/components/ui/switch-field'
import { FormDialogFooter } from '@/components/tkws/crud-page'
import { nextCodigo } from '@/lib/codigo'
import { useCreateOrigemNegocio, useUpdateOrigemNegocio } from '../api'
import { createOrigemNegocioSchema, type CreateOrigemNegocio, type OrigemNegocio } from '../schema'

export interface OrigemNegocioFormProps {
  initial?: OrigemNegocio
  existingItems: ReadonlyArray<OrigemNegocio> | undefined
  onSuccess: () => void
}

export function OrigemNegocioForm({ initial, existingItems, onSuccess }: OrigemNegocioFormProps) {
  const isEdit = !!initial
  const createMut = useCreateOrigemNegocio()
  const updateMut = useUpdateOrigemNegocio()
  const mutation = isEdit ? updateMut : createMut

  const defaultCodigo = React.useMemo(() => {
    if (initial?.codigo) return initial.codigo
    return nextCodigo('ORI', (existingItems ?? []).map((x) => x.codigo))
  }, [initial?.codigo, existingItems])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrigemNegocio>({
    resolver: zodResolver(createOrigemNegocioSchema),
    defaultValues: {
      codigo: defaultCodigo,
      nome: initial?.nome ?? '',
      exigeParceiro: initial?.exigeParceiro ?? false,
      exigeDetalhe: initial?.exigeDetalhe ?? false,
      ativo: initial?.ativo ?? true,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    if (isEdit && initial) await updateMut.mutateAsync({ id: initial.id, input: data })
    else await createMut.mutateAsync(data)
    onSuccess()
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-[160px_1fr] gap-3">
        <Field>
          <Label htmlFor="codigo" required>Código</Label>
          <Input
            id="codigo"
            state={errors.codigo ? 'error' : 'default'}
            className="font-mono"
            {...register('codigo')}
          />
          {errors.codigo && <FieldHint state="error">{errors.codigo.message}</FieldHint>}
        </Field>
        <Field>
          <Label htmlFor="nome" required>Nome</Label>
          <Input
            id="nome"
            state={errors.nome ? 'error' : 'default'}
            placeholder="Indicação de Parceiro, Google, Eventos…"
            {...register('nome')}
          />
          {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
        </Field>
      </div>

      <Field>
        <SwitchField
          control={control}
          name="exigeParceiro"
          activeLabel="Exige parceiro indicador"
          inactiveLabel="Exige parceiro indicador"
          activeDescription="A oportunidade com esta origem exige selecionar um parceiro."
          inactiveDescription="A oportunidade não pede parceiro indicador."
        />
      </Field>

      <Field>
        <SwitchField
          control={control}
          name="exigeDetalhe"
          activeLabel="Exige detalhe (texto livre)"
          inactiveLabel="Exige detalhe (texto livre)"
          activeDescription="A oportunidade com esta origem exige preencher 'qual origem?'."
          inactiveDescription="A oportunidade não pede texto livre de origem."
        />
      </Field>

      <SwitchField control={control} name="ativo" activeLabel="Ativa" inactiveLabel="Inativa" />

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
