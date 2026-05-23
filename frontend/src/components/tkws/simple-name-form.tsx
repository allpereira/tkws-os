import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { UseMutationResult } from '@tanstack/react-query'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { FormDialogFooter } from './crud-page'

/**
 * SimpleNomeForm · form genérico para entidades simples (nome + descrição + ativo + ordem).
 *
 * Para campos extras (cor, parcelas, etc) use um form dedicado.
 * Aceita um "extras" slot opcional para customização leve.
 */

export const simpleNomeSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório').max(120, 'Máximo 120 caracteres'),
  descricao: z.string().max(280).optional().nullable(),
  ativo: z.boolean().default(true),
  ordem: z.number().int().min(0).default(0),
})

export type SimpleNomeData = z.infer<typeof simpleNomeSchema>

export interface SimpleNomeFormProps<T extends { id: string } & SimpleNomeData> {
  initial?: T
  createMutation: UseMutationResult<T, Error, SimpleNomeData>
  updateMutation: UseMutationResult<T, Error, { id: string; input: Partial<SimpleNomeData> }>
  onSuccess: () => void
  /** Render extras inline antes do checkbox · grid 2 cols cabe bem */
  renderExtras?: (form: ReturnType<typeof useForm<SimpleNomeData>>) => React.ReactNode
  /** Placeholder do nome */
  namePlaceholder?: string
}

export function SimpleNomeForm<T extends { id: string } & SimpleNomeData>({
  initial,
  createMutation,
  updateMutation,
  onSuccess,
  renderExtras,
  namePlaceholder = 'Nome…',
}: SimpleNomeFormProps<T>) {
  const isEdit = !!initial
  const mutation = isEdit ? updateMutation : createMutation

  const form = useForm<SimpleNomeData>({
    resolver: zodResolver(simpleNomeSchema),
    defaultValues: {
      nome: initial?.nome ?? '',
      descricao: initial?.descricao ?? '',
      ativo: initial?.ativo ?? true,
      ordem: initial?.ordem ?? 0,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

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
      <Field>
        <Label htmlFor="nome" required>Nome</Label>
        <Input id="nome" state={errors.nome ? 'error' : 'default'} placeholder={namePlaceholder} {...register('nome')} />
        {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
      </Field>

      <Field>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" rows={2} {...register('descricao')} />
      </Field>

      {renderExtras?.(form)}

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
