import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { FormDialogFooter } from '@/components/tkws/crud-page'
import { ErrorAlert } from '@/components/tkws/error-alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldHint, Input, Label } from '@/components/ui/input'
import { CNPJInput, CPFInput } from '@/components/ui/masked-input'
import { PhoneInput } from '@/components/ui/phone-input'
import { SelectField } from '@/components/ui/select-field'
import { useCreatePessoa, useUpdatePessoa } from '@/modules/crm/pessoas/api'
import {
  createPessoaSchema,
  type CreatePessoa,
  type Pessoa,
} from '@/modules/crm/pessoas/schema'
import { PessoaListing } from '@/modules/crm/pessoas/components/pessoa-listing'

/**
 * Tela "Leads" · view sobre `Pessoa` filtrada por status=LEAD.
 *
 * Pessoa unifica Lead e Cliente (ADR-018). Quando uma Oportunidade entra
 * em etapa que converte, o backend promove a Pessoa automaticamente.
 */

function LeadForm({ initial, onSuccess }: { initial?: Pessoa; onSuccess: () => void }) {
  const isEdit = !!initial
  const createMut = useCreatePessoa()
  const updateMut = useUpdatePessoa()
  const mutation = isEdit ? updateMut : createMut

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePessoa>({
    resolver: zodResolver(createPessoaSchema),
    defaultValues: {
      tipoPessoa: initial?.tipoPessoa ?? 'PF',
      documento: initial?.documento ?? '',
      nomeContato: initial?.nomeContato ?? '',
      emailContato: initial?.emailContato ?? '',
      celularContato: initial?.celularContato ?? '',
      nomeEmpresa: initial?.nomeEmpresa ?? '',
    },
  })

  const tipo = watch('tipoPessoa')

  const onSubmit = handleSubmit(async (data) => {
    if (isEdit && initial) await updateMut.mutateAsync({ id: initial.id, input: data })
    else await createMut.mutateAsync(data)
    onSuccess()
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(160px,200px)_1fr]">
        <Field>
          <Label required>Tipo</Label>
          <SelectField
            control={control}
            name="tipoPessoa"
            placeholder="Selecione"
            options={[
              { value: 'PF', label: 'Pessoa Física' },
              { value: 'PJ', label: 'Pessoa Jurídica' },
            ]}
          />
        </Field>
        <Field>
          <Label htmlFor="documento">{tipo === 'PJ' ? 'CNPJ' : 'CPF'}</Label>
          <Controller
            control={control}
            name="documento"
            render={({ field }) =>
              tipo === 'PJ' ? (
                <CNPJInput
                  key="documento-pj"
                  id="documento"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                />
              ) : (
                <CPFInput
                  key="documento-pf"
                  id="documento"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                />
              )
            }
          />
        </Field>
      </div>

      <Field>
        <Label htmlFor="nomeContato" required>Nome do contato</Label>
        <Input
          id="nomeContato"
          state={errors.nomeContato ? 'error' : 'default'}
          {...register('nomeContato')}
        />
        {errors.nomeContato && <FieldHint state="error">{errors.nomeContato.message}</FieldHint>}
      </Field>

      {tipo === 'PJ' && (
        <Field>
          <Label htmlFor="nomeEmpresa">Nome da empresa</Label>
          <Input id="nomeEmpresa" {...register('nomeEmpresa')} />
        </Field>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field>
          <Label htmlFor="emailContato">Email</Label>
          <Input id="emailContato" type="email" {...register('emailContato')} />
        </Field>
        <Field>
          <Label htmlFor="celularContato">Celular</Label>
          <Controller
            control={control}
            name="celularContato"
            render={({ field }) => (
              <PhoneInput
                id="celularContato"
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          />
        </Field>
      </div>

      {mutation.isError && <ErrorAlert error={mutation.error} title="Não foi possível salvar" />}
      <FormDialogFooter onCancel={onSuccess} loading={isSubmitting || mutation.isPending} />
    </form>
  )
}

export function LeadsPage() {
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Pessoa | undefined>(undefined)

  const openNew = () => {
    setEditing(undefined)
    setFormOpen(true)
  }
  const openEdit = (p: Pessoa) => {
    setEditing(p)
    setFormOpen(true)
  }

  return (
    <>
      <PessoaListing
        status="LEAD"
        crumb="CRM"
        title="Leads"
        description="Contatos iniciais · ainda não fecharam proposta. Convertem para Cliente automaticamente quando uma Oportunidade atinge etapa de fechamento."
        viewStorageKey="tkws.pessoas.view.leads"
        headerActions={
          <Button onClick={openNew}>
            <Plus size={14} /> Novo lead
          </Button>
        }
        onEdit={openEdit}
        emptyTitle="Nenhum lead ainda"
        emptyDescription="Cadastre o primeiro contato comercial."
        emptyAction={
          <Button onClick={openNew}>
            <Plus size={14} /> Novo lead
          </Button>
        }
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? `Editar · ${editing.nomeContato}` : 'Novo lead'}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <LeadForm initial={editing} onSuccess={() => setFormOpen(false)} />
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  )
}
