import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormDialogFooter } from '@/components/tkws/crud-page'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useClientes } from '@/modules/crm/clientes/api'
import { useEmpreendimentos } from '@/modules/empresa/configuracoes/empreendimentos/api'
import type { Etapa } from '@/modules/crm/configuracoes/etapas/schema'
import { useLeads } from '@/modules/crm/leads/api'
import { useTiposPagamento } from '@/modules/crm/configuracoes/tipos-pagamentos/api'
import { useTiposProposta } from '@/modules/crm/configuracoes/tipos-propostas/api'
import { useCreateOportunidade, useUpdateOportunidade } from '../api'
import {
  createOportunidadeSchema,
  type CreateOportunidade,
  type Oportunidade,
} from '../schema'

export interface OportunidadeFormProps {
  initial?: Oportunidade
  pipelineId: string
  modulo: 'atendimento' | 'proposta'
  etapas: Etapa[]
  onSuccess: () => void
}

export function OportunidadeForm({
  initial,
  pipelineId,
  modulo,
  etapas,
  onSuccess,
}: OportunidadeFormProps) {
  const isEdit = !!initial
  const leads = useLeads()
  const clientes = useClientes()
  const empreendimentos = useEmpreendimentos()
  const tiposProposta = useTiposProposta()
  const tiposPagamento = useTiposPagamento()
  const createMut = useCreateOportunidade()
  const updateMut = useUpdateOportunidade()
  const mutation = isEdit ? updateMut : createMut

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateOportunidade>({
    resolver: zodResolver(createOportunidadeSchema),
    defaultValues: {
      pipelineId,
      etapaId: initial?.etapaId ?? etapas[0]?.id ?? '',
      titulo: initial?.titulo ?? '',
      descricao: initial?.descricao ?? '',
      leadId: initial?.leadId ?? null,
      clienteId: initial?.clienteId ?? null,
      tipoPropostaId: initial?.tipoPropostaId ?? null,
      tipoPagamentoId: initial?.tipoPagamentoId ?? null,
      empreendimentoId: initial?.empreendimentoId ?? null,
      responsavelId: initial?.responsavelId ?? null,
      valor: initial?.valor ?? 0,
      prazoFechamento: initial?.prazoFechamento ?? null,
      notas: initial?.notas ?? '',
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      pipelineId,
      leadId: data.leadId || null,
      clienteId: data.clienteId || null,
      tipoPropostaId: data.tipoPropostaId || null,
      tipoPagamentoId: data.tipoPagamentoId || null,
      empreendimentoId: data.empreendimentoId || null,
      responsavelId: data.responsavelId || null,
      prazoFechamento: data.prazoFechamento || null,
    }
    if (isEdit && initial) await updateMut.mutateAsync({ id: initial.id, input: payload })
    else await createMut.mutateAsync(payload)
    onSuccess()
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field>
        <Label htmlFor="titulo" required>Título</Label>
        <Input id="titulo" state={errors.titulo ? 'error' : 'default'} placeholder="Apto Yachthouse 2104 · briefing" {...register('titulo')} />
        {errors.titulo && <FieldHint state="error">{errors.titulo.message}</FieldHint>}
      </Field>

      <Field>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" rows={3} {...register('descricao')} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="etapaId" required>Etapa</Label>
          <Select id="etapaId" {...register('etapaId')}>
            {etapas.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="valor">Valor (R$)</Label>
          <Input id="valor" type="number" min={0} step={0.01} {...register('valor', { valueAsNumber: true })} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="leadId">Lead (origem)</Label>
          <Select id="leadId" {...register('leadId')}>
            <option value="">Nenhum</option>
            {leads.data?.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="clienteId">Cliente</Label>
          <Select id="clienteId" {...register('clienteId')}>
            <option value="">Nenhum</option>
            {clientes.data?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </Select>
        </Field>
      </div>

      <Field>
        <Label htmlFor="empreendimentoId">Empreendimento</Label>
        <Select id="empreendimentoId" {...register('empreendimentoId')}>
          <option value="">Nenhum</option>
          {empreendimentos.data?.map((e) => <option key={e.id} value={e.id}>{e.nome} · {e.cidade}/{e.uf}</option>)}
        </Select>
      </Field>

      {modulo === 'proposta' && (
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label htmlFor="tipoPropostaId">Tipo de proposta</Label>
            <Select id="tipoPropostaId" {...register('tipoPropostaId')}>
              <option value="">Não definido</option>
              {tiposProposta.data?.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="tipoPagamentoId">Tipo de pagamento</Label>
            <Select id="tipoPagamentoId" {...register('tipoPagamentoId')}>
              <option value="">Não definido</option>
              {tiposPagamento.data?.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </Select>
          </Field>
        </div>
      )}

      <Field>
        <Label htmlFor="prazoFechamento">Prazo de fechamento</Label>
        <Input id="prazoFechamento" type="date" {...register('prazoFechamento')} />
      </Field>

      <Field>
        <Label htmlFor="notas">Notas internas</Label>
        <Textarea id="notas" rows={2} {...register('notas')} />
      </Field>

      {mutation.isError && (
        <div className="bg-destructive/10 text-destructive rounded-md border border-destructive/30 px-3 py-2 text-xs">
          Erro · {mutation.error?.message}
        </div>
      )}
      <FormDialogFooter onCancel={onSuccess} loading={isSubmitting || mutation.isPending} />
    </form>
  )
}
