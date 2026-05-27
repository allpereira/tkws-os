import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Trash2, Users, X } from 'lucide-react'
import { ErrorAlert } from '@/components/tkws/error-alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Field, FieldHint, Input, Label } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { SelectField } from '@/components/ui/select-field'
import { Spinner } from '@/components/ui/spinner'
import {
  useAddContato,
  useContatos,
  useRemoveContato,
  useUpdateContato,
} from '@/modules/crm/pessoas/contatos-api'
import {
  RELACIONAMENTO_LABEL,
  createContatoSchema,
  relacionamentosParaTipo,
  type Contato,
  type CreateContato,
  type TipoPessoa,
} from '@/modules/crm/pessoas/schema'

/**
 * Aba "Contatos" do cadastro de Cliente (ADR-023). Lista e gerencia os contatos
 * (sócios/representante para PJ; parentes/cônjuge para PF) de uma Pessoa já salva.
 *
 * As opções de relacionamento são filtradas pelo tipo da Pessoa dona.
 */
export function ContatosTab({ pessoaId, tipoPessoa }: { pessoaId: string; tipoPessoa: TipoPessoa }) {
  const listQuery = useContatos(pessoaId)
  const addMut = useAddContato(pessoaId)
  const removeMut = useRemoveContato(pessoaId)
  const [editing, setEditing] = React.useState<Contato | null>(null)

  const relOptions = relacionamentosParaTipo(tipoPessoa).map((value) => ({
    value,
    label: RELACIONAMENTO_LABEL[value],
  }))

  const contatos = listQuery.data ?? []

  return (
    <div className="flex flex-col gap-4">
      <ContatoEditor
        key={editing?.id ?? 'novo'}
        pessoaId={pessoaId}
        relOptions={relOptions}
        editing={editing}
        addMut={addMut}
        onDone={() => setEditing(null)}
      />

      {listQuery.isPending ? (
        <div className="flex justify-center py-8">
          <Spinner size={18} label="Carregando contatos" />
        </div>
      ) : contatos.length === 0 ? (
        <EmptyState
          icon={<Users size={20} strokeWidth={1.6} />}
          title="Nenhum contato ainda"
          description="Adicione sócios, representante legal, parentes ou cônjuge acima."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {contatos.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-[10px] border p-3"
              style={{ borderColor: 'var(--line-2)', background: 'var(--surface-2)' }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-medium" style={{ color: 'var(--text)' }}>
                    {c.nome}
                  </span>
                  <Badge tone="brand">{RELACIONAMENTO_LABEL[c.tipoRelacionamento]}</Badge>
                </div>
                <div className="text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                  {[c.email, c.telefone].filter(Boolean).join(' · ') || '—'}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Editar ${c.nome}`}
                onClick={() => setEditing(c)}
              >
                <Pencil size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remover ${c.nome}`}
                disabled={removeMut.isPending}
                onClick={() => removeMut.mutate(c.id)}
              >
                <Trash2 size={14} style={{ color: 'var(--danger)' }} />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {(addMut.isError || removeMut.isError) && (
        <ErrorAlert error={addMut.error ?? removeMut.error} />
      )}
    </div>
  )
}

interface RelOption {
  value: string
  label: string
}

/**
 * Formulário inline de adicionar/editar contato. Quando `editing` é passado,
 * funciona em modo edição (preenche e usa PATCH); senão adiciona (POST).
 */
function ContatoEditor({
  pessoaId,
  relOptions,
  editing,
  addMut,
  onDone,
}: {
  pessoaId: string
  relOptions: RelOption[]
  editing: Contato | null
  addMut: ReturnType<typeof useAddContato>
  onDone: () => void
}) {
  const updateMut = useUpdateContato(pessoaId)
  const isEdit = !!editing

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateContato>({
    resolver: zodResolver(createContatoSchema),
    defaultValues: {
      nome: editing?.nome ?? '',
      email: editing?.email ?? '',
      telefone: editing?.telefone ?? '',
      tipoRelacionamento: editing?.tipoRelacionamento ?? undefined,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    if (isEdit && editing) {
      await updateMut.mutateAsync({ contatoId: editing.id, input: data })
    } else {
      await addMut.mutateAsync(data)
    }
    reset({ nome: '', email: '', telefone: '', tipoRelacionamento: undefined })
    onDone()
  })

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-[10px] border p-3"
      style={{ borderColor: 'var(--line-2)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
          {isEdit ? 'Editar contato' : 'Adicionar contato'}
        </span>
        {isEdit && (
          <Button type="button" variant="ghost" size="icon" aria-label="Cancelar edição" onClick={onDone}>
            <X size={14} />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field>
          <Label htmlFor="contato-nome" required>Nome</Label>
          <Input
            id="contato-nome"
            state={errors.nome ? 'error' : 'default'}
            {...register('nome')}
          />
          {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
        </Field>
        <Field>
          <Label required>Relacionamento</Label>
          <SelectField
            control={control}
            name="tipoRelacionamento"
            placeholder="Selecione"
            options={relOptions}
            state={errors.tipoRelacionamento ? 'error' : 'default'}
          />
          {errors.tipoRelacionamento && (
            <FieldHint state="error">{errors.tipoRelacionamento.message}</FieldHint>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field>
          <Label htmlFor="contato-email">Email</Label>
          <Input id="contato-email" type="email" {...register('email')} />
        </Field>
        <Field>
          <Label htmlFor="contato-telefone">Telefone</Label>
          <Controller
            control={control}
            name="telefone"
            render={({ field }) => (
              <PhoneInput
                id="contato-telefone"
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? <Spinner size={12} /> : <Plus size={14} />}
          {isEdit ? 'Salvar contato' : 'Adicionar'}
        </Button>
      </div>
    </form>
  )
}
