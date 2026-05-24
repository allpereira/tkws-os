import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CrudPage, FormDialogFooter } from '@/components/tkws/crud-page'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Field, FieldHint, Input, Label } from '@/components/ui/input'
import { SelectField } from '@/components/ui/select-field'
import { useCreatePessoa, usePessoas, useUpdatePessoa } from '@/modules/crm/pessoas/api'
import {
  createPessoaSchema,
  type CreatePessoa,
  type Pessoa,
} from '@/modules/crm/pessoas/schema'

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
      <div className="grid grid-cols-[140px_1fr] gap-3">
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
          <Input
            id="documento"
            placeholder={tipo === 'PJ' ? '00.000.000/0000-00' : '000.000.000-00'}
            {...register('documento')}
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

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="emailContato">Email</Label>
          <Input id="emailContato" type="email" {...register('emailContato')} />
        </Field>
        <Field>
          <Label htmlFor="celularContato">Celular</Label>
          <Input id="celularContato" placeholder="(47) 98xxx-xxxx" {...register('celularContato')} />
        </Field>
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

export function LeadsPage() {
  const listQuery = usePessoas('LEAD')

  return (
    <CrudPage<Pessoa>
      crumb="CRM"
      title="Leads"
      description="Contatos iniciais · ainda não fecharam proposta. Convertem para Cliente automaticamente quando uma Oportunidade atinge etapa de fechamento."
      newButtonLabel="+ Novo lead"
      listQuery={listQuery}
      removeMutation={{ mutateAsync: async () => undefined, isPending: false, error: null } as never}
      columns={[
        {
          key: 'tipoPessoa',
          header: '',
          width: 'w-12',
          cell: (r) => <Badge variant="outline">{r.tipoPessoa}</Badge>,
        },
        {
          key: 'nomeContato',
          header: 'Nome',
          cell: (r) => <span className="font-medium">{r.nomeContato}</span>,
        },
        {
          key: 'nomeEmpresa',
          header: 'Empresa',
          cell: (r) => <span className="text-muted-foreground">{r.nomeEmpresa ?? '—'}</span>,
        },
        {
          key: 'celularContato',
          header: 'Contato',
          cell: (r) => (
            <span className="text-muted-foreground text-xs">
              {r.emailContato ?? '—'}
              <br />
              {r.celularContato ?? ''}
            </span>
          ),
        },
        {
          key: 'documento',
          header: 'Documento',
          width: 'w-44',
          cell: (r) => <span className="font-mono text-xs">{r.documento ?? '—'}</span>,
        },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nomeContato}
      formDialogTitle={(item) => (item ? `Editar · ${item.nomeContato}` : 'Novo lead')}
      renderForm={(item, close) => <LeadForm initial={item} onSuccess={close} />}
    />
  )
}
