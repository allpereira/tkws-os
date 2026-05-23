import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CrudPage, FormDialogFooter } from '@/components/tkws/crud-page'
import { Badge } from '@/components/ui/badge'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useEmpreendimentos } from '@/modules/empresa/configuracoes/empreendimentos/api'
import { useSetores } from '@/modules/empresa/configuracoes/setores/api'
import { useTiposProjeto } from '@/modules/empresa/configuracoes/tipos-projetos/api'
import { useCreateLead, useLeads, useRemoveLead, useUpdateLead } from '../api'
import { LEAD_ORIGEM, createLeadSchema, type CreateLead, type Lead } from '../schema'

const origemLabel: Record<typeof LEAD_ORIGEM[number], string> = {
  indicacao: 'Indicação',
  site: 'Site',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  evento: 'Evento',
  outro: 'Outro',
}

function LeadForm({ initial, onSuccess }: { initial?: Lead; onSuccess: () => void }) {
  const isEdit = !!initial
  const setores = useSetores()
  const tiposProjeto = useTiposProjeto()
  const empreendimentos = useEmpreendimentos()
  const createMut = useCreateLead()
  const updateMut = useUpdateLead()
  const mutation = isEdit ? updateMut : createMut

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateLead>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      nome: initial?.nome ?? '',
      email: initial?.email ?? '',
      telefone: initial?.telefone ?? '',
      empresa: initial?.empresa ?? '',
      cargo: initial?.cargo ?? '',
      origem: initial?.origem ?? 'outro',
      setorInteresseId: initial?.setorInteresseId ?? null,
      tipoProjetoId: initial?.tipoProjetoId ?? null,
      empreendimentoId: initial?.empreendimentoId ?? null,
      responsavelId: initial?.responsavelId ?? null,
      notas: initial?.notas ?? '',
      qualificado: initial?.qualificado ?? false,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      setorInteresseId: data.setorInteresseId || null,
      tipoProjetoId: data.tipoProjetoId || null,
      empreendimentoId: data.empreendimentoId || null,
      responsavelId: data.responsavelId || null,
    }
    if (isEdit && initial) await updateMut.mutateAsync({ id: initial.id, input: payload })
    else await createMut.mutateAsync(payload)
    onSuccess()
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field>
        <Label htmlFor="nome" required>Nome completo</Label>
        <Input id="nome" state={errors.nome ? 'error' : 'default'} {...register('nome')} />
        {errors.nome && <FieldHint state="error">{errors.nome.message}</FieldHint>}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" state={errors.email ? 'error' : 'default'} {...register('email')} />
          {errors.email && <FieldHint state="error">{errors.email.message}</FieldHint>}
        </Field>
        <Field>
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" type="tel" placeholder="(47) 98xxx-xxxx" {...register('telefone')} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="empresa">Empresa</Label>
          <Input id="empresa" {...register('empresa')} />
        </Field>
        <Field>
          <Label htmlFor="cargo">Cargo</Label>
          <Input id="cargo" {...register('cargo')} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="origem">Origem</Label>
          <Select id="origem" {...register('origem')}>
            {LEAD_ORIGEM.map((o) => <option key={o} value={o}>{origemLabel[o]}</option>)}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="empreendimentoId">Empreendimento de interesse</Label>
          <Select id="empreendimentoId" {...register('empreendimentoId')}>
            <option value="">Nenhum</option>
            {empreendimentos.data?.map((e) => <option key={e.id} value={e.id}>{e.nome} · {e.cidade}/{e.uf}</option>)}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="setorInteresseId">Setor de interesse</Label>
          <Select id="setorInteresseId" {...register('setorInteresseId')}>
            <option value="">Não definido</option>
            {setores.data?.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="tipoProjetoId">Tipo de projeto</Label>
          <Select id="tipoProjetoId" {...register('tipoProjetoId')}>
            <option value="">Não definido</option>
            {tiposProjeto.data?.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </Select>
        </Field>
      </div>

      <Field>
        <Label htmlFor="notas">Notas</Label>
        <Textarea id="notas" rows={3} {...register('notas')} placeholder="Histórico, expectativas, observações…" />
      </Field>

      <label className="text-sm flex items-center gap-2">
        <input type="checkbox" {...register('qualificado')} className="h-4 w-4" />
        Qualificado (pronto para virar oportunidade)
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

export function LeadsPage() {
  const listQuery = useLeads()
  const removeMut = useRemoveLead()

  return (
    <CrudPage<Lead>
      crumb="CRM"
      title="Leads"
      description="Contatos iniciais · ainda não viraram clientes. Qualifique antes de mover para Atendimento."
      newButtonLabel="+ Novo lead"
      listQuery={listQuery}
      removeMutation={removeMut}
      columns={[
        { key: 'nome', header: 'Nome', cell: (r) => <span className="font-medium">{r.nome}</span> },
        {
          key: 'empresa',
          header: 'Empresa · Cargo',
          cell: (r) => (
            <span className="text-muted-foreground">
              {r.empresa ?? '—'}
              {r.cargo ? ` · ${r.cargo}` : ''}
            </span>
          ),
        },
        {
          key: 'telefone',
          header: 'Contato',
          cell: (r) => (
            <span className="text-muted-foreground text-xs">
              {r.email ?? '—'}
              <br />
              {r.telefone ?? ''}
            </span>
          ),
        },
        {
          key: 'origem',
          header: 'Origem',
          width: 'w-28',
          cell: (r) => <Badge variant="outline">{origemLabel[r.origem]}</Badge>,
        },
        {
          key: 'qualificado',
          header: 'Status',
          width: 'w-32',
          cell: (r) =>
            r.clienteConvertidoId ? (
              <Badge variant="success">Convertido</Badge>
            ) : r.qualificado ? (
              <Badge variant="default">Qualificado</Badge>
            ) : (
              <Badge variant="secondary">Novo</Badge>
            ),
        },
      ]}
      getRowKey={(r) => r.id}
      getRowLabel={(r) => r.nome}
      formDialogTitle={(item) => (item ? `Editar · ${item.nome}` : 'Novo lead')}
      renderForm={(item, close) => <LeadForm initial={item} onSuccess={close} />}
    />
  )
}
