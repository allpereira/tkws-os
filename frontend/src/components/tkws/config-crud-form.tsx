import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { UseMutationResult } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Field, FieldHint, Input, Label } from '@/components/ui/input'
import { SwitchField } from '@/components/ui/switch-field'
import { FormDialogFooter } from './crud-page'
import { nextCodigo } from '@/lib/codigo'

/**
 * ConfigCrudForm · form padrão de cadastros de Configurações.
 *
 * Sempre 3 campos: **código + nome + ativo**. O código é auto-gerado a partir
 * do prefixo da feature (ex: SET-001, OFE-042) mas pode ser editado pelo
 * usuário. Schema embutido — features de Configurações que precisarem
 * só desse padrão devem usar este form em vez de criar o próprio.
 */

export const configFormSchema = z.object({
  codigo: z.string().min(1, 'Código obrigatório').max(40, 'Máximo 40 caracteres'),
  nome: z.string().min(1, 'Nome obrigatório').max(160, 'Máximo 160 caracteres'),
  ativo: z.boolean().default(true),
})

export type ConfigFormData = z.infer<typeof configFormSchema>

/** Entidade vinda do servidor · qualquer registro de Configuração tem ao menos esses campos. */
export interface ConfigEntity {
  id: string
  codigo: string
  nome: string
  ativo: boolean
}

export interface ConfigCrudFormProps<T extends ConfigEntity> {
  initial?: T
  /** Lista atual usada para gerar o próximo código sequencial automaticamente. */
  existingItems: ReadonlyArray<T> | undefined
  /** Prefixo de 3 letras (ex: 'SET', 'OFE'). */
  codePrefix: string
  createMutation: UseMutationResult<T, Error, ConfigFormData>
  updateMutation: UseMutationResult<T, Error, { id: string; input: Partial<ConfigFormData> }>
  onSuccess: () => void
  /** Placeholder do campo Nome. */
  namePlaceholder?: string
}

export function ConfigCrudForm<T extends ConfigEntity>({
  initial,
  existingItems,
  codePrefix,
  createMutation,
  updateMutation,
  onSuccess,
  namePlaceholder = 'Nome…',
}: ConfigCrudFormProps<T>) {
  const isEdit = !!initial
  const mutation = isEdit ? updateMutation : createMutation

  const defaultCodigo = React.useMemo(() => {
    if (initial?.codigo) return initial.codigo
    return nextCodigo(
      codePrefix,
      (existingItems ?? []).map((x) => x.codigo),
    )
  }, [initial?.codigo, codePrefix, existingItems])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      codigo: defaultCodigo,
      nome: initial?.nome ?? '',
      ativo: initial?.ativo ?? true,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    if (isEdit && initial) {
      await updateMutation.mutateAsync({ id: initial.id, input: data })
    } else {
      await createMutation.mutateAsync(data)
    }
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
            placeholder={namePlaceholder}
            {...register('nome')}
          />
          {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
        </Field>
      </div>

      <SwitchField control={control} name="ativo" />

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
