import { Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CrudPage, FormDialogFooter } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useEmpreendimentos } from '@/modules/empresa/configuracoes/empreendimentos/api'
import { formatCNPJ, formatCPF } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useClientes, useCreateCliente, useRemoveCliente, useUpdateCliente } from '../api'
import { createClienteSchema, type Cliente, type CreateCliente } from '../schema'

function ClienteForm({ initial, onSuccess }: { initial?: Cliente; onSuccess: () => void }) {
  const isEdit = !!initial
  const empreendimentos = useEmpreendimentos()
  const createMut = useCreateCliente()
  const updateMut = useUpdateCliente()
  const mutation = isEdit ? updateMut : createMut

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CreateCliente>({
    resolver: zodResolver(createClienteSchema),
    defaultValues: {
      tipoPessoa: initial?.tipoPessoa ?? 'fisica',
      nome: initial?.nome ?? '',
      documento: initial?.documento ?? '',
      email: initial?.email ?? '',
      telefone: initial?.telefone ?? '',
      endereco: initial?.endereco ?? '',
      cidade: initial?.cidade ?? '',
      uf: initial?.uf ?? 'SC',
      cep: initial?.cep ?? '',
      empreendimentoId: initial?.empreendimentoId ?? null,
      leadOrigemId: initial?.leadOrigemId ?? null,
      responsavelId: initial?.responsavelId ?? null,
      vipScore: initial?.vipScore ?? 0,
      ativo: initial?.ativo ?? true,
      notas: initial?.notas ?? '',
    },
  })

  const tipo = watch('tipoPessoa')

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      empreendimentoId: data.empreendimentoId || null,
      leadOrigemId: data.leadOrigemId || null,
      responsavelId: data.responsavelId || null,
    }
    if (isEdit && initial) await updateMut.mutateAsync({ id: initial.id, input: payload })
    else await createMut.mutateAsync(payload)
    onSuccess()
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="tipoPessoa">Tipo</Label>
          <Select id="tipoPessoa" {...register('tipoPessoa')}>
            <option value="fisica">Pessoa Física</option>
            <option value="juridica">Pessoa Jurídica</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="documento" required>{tipo === 'juridica' ? 'CNPJ' : 'CPF'}</Label>
          <Input id="documento" state={errors.documento ? 'error' : 'default'} {...register('documento')} placeholder={tipo === 'juridica' ? '00.000.000/0000-00' : '000.000.000-00'} />
          {errors.documento && <FieldHint state="error">{errors.documento.message}</FieldHint>}
        </Field>
      </div>

      <Field>
        <Label htmlFor="nome" required>{tipo === 'juridica' ? 'Razão social' : 'Nome'}</Label>
        <Input id="nome" state={errors.nome ? 'error' : 'default'} {...register('nome')} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
        </Field>
        <Field>
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" type="tel" placeholder="(47) 98xxx-xxxx" {...register('telefone')} />
        </Field>
      </div>

      <Field>
        <Label htmlFor="endereco">Endereço</Label>
        <Input id="endereco" {...register('endereco')} />
      </Field>
      <div className="grid grid-cols-[1fr_80px_140px] gap-3">
        <Field>
          <Label htmlFor="cidade">Cidade</Label>
          <Input id="cidade" {...register('cidade')} />
        </Field>
        <Field>
          <Label htmlFor="uf">UF</Label>
          <Input id="uf" maxLength={2} className="uppercase" {...register('uf')} />
        </Field>
        <Field>
          <Label htmlFor="cep">CEP</Label>
          <Input id="cep" placeholder="00000-000" {...register('cep')} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="empreendimentoId">Empreendimento</Label>
          <Select id="empreendimentoId" {...register('empreendimentoId')}>
            <option value="">Nenhum</option>
            {empreendimentos.data?.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="vipScore">VIP score (0-5)</Label>
          <Input id="vipScore" type="number" min={0} max={5} {...register('vipScore', { valueAsNumber: true })} />
        </Field>
      </div>

      <Field>
        <Label htmlFor="notas">Notas</Label>
        <Textarea id="notas" rows={3} {...register('notas')} />
      </Field>

      <label className="text-sm flex items-center gap-2">
        <input type="checkbox" {...register('ativo')} className="h-4 w-4" />
        Ativo
      </label>

      {mutation.isError && (
        <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/30 px-3 py-2 text-xs">
          Erro · {mutation.error?.message}
        </div>
      )}
      <FormDialogFooter onCancel={onSuccess} loading={isSubmitting || mutation.isPending} />
    </form>
  )
}

export function ClientesPage() {
  const listQuery = useClientes()
  const removeMut = useRemoveCliente()

  return (
    <CrudPage<Cliente>
      crumb="CRM"
      title="Clientes"
      description="Pessoas físicas e jurídicas · ativos no portfólio."
      newButtonLabel="+ Novo cliente"
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        {
          key: 'tipoPessoa',
          header: '',
          width: 'w-12',
          cell: (r) => <Badge variant="outline">{r.tipoPessoa === 'juridica' ? 'PJ' : 'PF'}</Badge>,
        },
        { key: 'nome', header: 'Nome / Razão social', cell: (r) => <span className="font-medium">{r.nome}</span> },
        {
          key: 'documento',
          header: 'Documento',
          width: 'w-44',
          cell: (r) => (
            <span className="font-mono text-xs">
              {r.tipoPessoa === 'juridica' ? formatCNPJ(r.documento) : formatCPF(r.documento)}
            </span>
          ),
        },
        {
          key: 'cidade',
          header: 'Local',
          cell: (r) => (
            <span className="text-muted-foreground">
              {r.cidade ? `${r.cidade} · ${r.uf}` : '—'}
            </span>
          ),
        },
        {
          key: 'vipScore',
          header: 'VIP',
          width: 'w-24',
          align: 'right',
          cell: (r) => (
            <span className="inline-flex items-center gap-0.5" aria-label={`${r.vipScore} de 5 estrelas`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={cn(i < r.vipScore ? 'fill-amber-500 text-amber-500' : 'text-muted')}
                />
              ))}
            </span>
          ),
        },
        {
          key: 'ativo',
          header: 'Status',
          width: 'w-24',
          cell: (r) => (r.ativo ? <Badge variant="success">Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>),
        },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nome}
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo cliente')}
      renderForm={(item, close) => <ClienteForm initial={item} onSuccess={close} />}
    />
  )
}
