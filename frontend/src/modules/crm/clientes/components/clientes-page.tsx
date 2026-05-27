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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCreatePessoa, useUpdatePessoa } from '@/modules/crm/pessoas/api'
import {
  createPessoaSchema,
  type CreatePessoa,
  type Pessoa,
} from '@/modules/crm/pessoas/schema'
import { PessoaListing } from '@/modules/crm/pessoas/components/pessoa-listing'
import { ContatosTab } from './contatos-tab'

/**
 * Tela "Clientes" · view sobre `Pessoa` filtrada por status=CLIENTE.
 *
 * Diferente de Leads, Clientes podem ser criados direto aqui (ADR-023) — não
 * só por conversão automática de Lead. O cadastro é completo, com abas:
 *   • Dados    — campos PF (nome, CPF, …) ou PJ (razão social, CNPJ, …)
 *   • Contatos — sócios/representante (PJ) ou parentes/cônjuge (PF)
 */

function formatData(iso?: string | null): string {
  return iso ? new Date(iso).toLocaleDateString('pt-BR') : '—'
}

function ClienteForm({
  initial,
  onSaved,
  onClose,
}: {
  initial?: Pessoa
  /** Chamado quando a Pessoa é criada/atualizada · atualiza listagem + título. */
  onSaved: (p: Pessoa) => void
  onClose: () => void
}) {
  // `saved` segura a Pessoa após o primeiro save em modo criação, habilitando
  // a aba Contatos (que precisa de um id para pendurar os contatos).
  const [saved, setSaved] = React.useState<Pessoa | undefined>(initial)
  const [tab, setTab] = React.useState<'dados' | 'contatos'>('dados')

  const isEdit = !!saved
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
      status: 'CLIENTE',
    },
  })

  const tipo = watch('tipoPessoa')
  const isPJ = tipo === 'PJ'

  const onSubmit = handleSubmit(async (data) => {
    if (saved) {
      const { status: _status, forceCreate: _fc, ...patch } = data
      const updated = await updateMut.mutateAsync({ id: saved.id, input: patch })
      onSaved(updated)
    } else {
      const created = await createMut.mutateAsync({ ...data, status: 'CLIENTE' })
      setSaved(created)
      onSaved(created)
      setTab('contatos') // recém-criado · convida a preencher os contatos
    }
  })

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as 'dados' | 'contatos')}>
      <TabsList variant="underline" className="mb-1">
        <TabsTrigger value="dados" underline>
          Dados
        </TabsTrigger>
        <TabsTrigger value="contatos" underline disabled={!saved}>
          Contatos
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dados">
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
              <Label htmlFor="documento">{isPJ ? 'CNPJ' : 'CPF'}</Label>
              <Controller
                control={control}
                name="documento"
                render={({ field }) =>
                  isPJ ? (
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

          {isPJ && (
            <Field>
              <Label htmlFor="nomeEmpresa">Razão social</Label>
              <Input id="nomeEmpresa" {...register('nomeEmpresa')} />
            </Field>
          )}

          <Field>
            <Label htmlFor="nomeContato" required>
              {isPJ ? 'Nome do contato' : 'Nome completo'}
            </Label>
            <Input
              id="nomeContato"
              state={errors.nomeContato ? 'error' : 'default'}
              {...register('nomeContato')}
            />
            {errors.nomeContato && <FieldHint state="error">{errors.nomeContato.message}</FieldHint>}
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field>
              <Label htmlFor="emailContato">Email</Label>
              <Input id="emailContato" type="email" {...register('emailContato')} />
              {errors.emailContato && (
                <FieldHint state="error">{errors.emailContato.message}</FieldHint>
              )}
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

          {!saved && (
            <p className="text-[12.5px]" style={{ color: 'var(--text-mute)' }}>
              Salve os dados para liberar a aba <strong>Contatos</strong>.
            </p>
          )}

          <FormDialogFooter
            onCancel={onClose}
            loading={isSubmitting || mutation.isPending}
            submitLabel={saved ? 'Salvar' : 'Criar cliente'}
          />
        </form>
      </TabsContent>

      <TabsContent value="contatos">
        {saved ? (
          <ContatosTab pessoaId={saved.id} tipoPessoa={saved.tipoPessoa} />
        ) : (
          <p className="py-6 text-center text-[13px]" style={{ color: 'var(--text-soft)' }}>
            Salve o cliente na aba <strong>Dados</strong> para adicionar contatos.
          </p>
        )}
      </TabsContent>
    </Tabs>
  )
}

export function ClientesPage() {
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
        status="CLIENTE"
        crumb="CRM"
        title="Clientes"
        description="Pessoas e empresas que já fecharam negócio. Cadastre direto aqui ou deixe a conversão automática promover um Lead."
        viewStorageKey="tkws.pessoas.view.clientes"
        showConversaoSort
        headerActions={
          <Button onClick={openNew}>
            <Plus size={14} /> Novo cliente
          </Button>
        }
        onEdit={openEdit}
        cardMeta={(r) => <>Cliente desde {formatData(r.convertidoEm)}</>}
        emptyTitle="Nenhum cliente ainda"
        emptyDescription="Cadastre o primeiro cliente ou converta um Lead."
        emptyAction={
          <Button onClick={openNew}>
            <Plus size={14} /> Novo cliente
          </Button>
        }
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar · ${editing.nomeContato}` : 'Novo cliente'}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <ClienteForm
              key={editing?.id ?? 'novo'}
              initial={editing}
              onSaved={setEditing}
              onClose={() => setFormOpen(false)}
            />
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  )
}
