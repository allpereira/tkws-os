import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormDialogFooter } from '@/components/tkws/crud-page'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SelectField } from '@/components/ui/select-field'
import { useEmpreendimentos } from '@/modules/organizacao/configuracoes/empreendimentos/api'
import { useOfertas } from '@/modules/organizacao/configuracoes/ofertas/api'
import type { Etapa } from '@/modules/crm/configuracoes/etapas/schema'
import { usePessoas } from '@/modules/crm/pessoas/api'
import { useTiposPagamento } from '@/modules/crm/configuracoes/tipos-pagamentos/api'
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
  const pessoas = usePessoas()
  const empreendimentos = useEmpreendimentos()
  const ofertas = useOfertas()
  const tiposPagamento = useTiposPagamento()
  const createMut = useCreateOportunidade()
  const updateMut = useUpdateOportunidade()
  const mutation = isEdit ? updateMut : createMut

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<CreateOportunidade>({
    resolver: zodResolver(createOportunidadeSchema),
    defaultValues: {
      pipelineId,
      etapaId: initial?.etapaId ?? etapas[0]?.id ?? '',
      titulo: initial?.titulo ?? '',
      descricao: initial?.descricao ?? '',
      pessoaId: initial?.pessoaId ?? null,
      ofertaId: initial?.ofertaId ?? null,
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
      pessoaId: data.pessoaId || null,
      ofertaId: data.ofertaId || null,
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
          <Label required>Etapa</Label>
          <SelectField
            control={control}
            name="etapaId"
            placeholder="Selecione a etapa"
            options={etapas.map((e) => ({ value: e.id, label: e.nome }))}
          />
        </Field>
        <Field>
          <Label htmlFor="valor">Valor (R$)</Label>
          <Input id="valor" type="number" min={0} step={0.01} {...register('valor', { valueAsNumber: true })} />
        </Field>
      </div>

      <Field>
        <Label>Pessoa (Lead ou Cliente)</Label>
        <SelectField
          control={control}
          name="pessoaId"
          placeholder="Selecione o contato"
          options={(pessoas.data ?? []).map((p) => ({
            value: p.id,
            label: `${p.nomeContato}${p.nomeEmpresa ? ' · ' + p.nomeEmpresa : ''} (${p.status})`,
          }))}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label>Oferta</Label>
          <SelectField
            control={control}
            name="ofertaId"
            placeholder="Nenhuma"
            options={(ofertas.data ?? []).map((o) => ({ value: o.id, label: o.nome }))}
          />
        </Field>
        <Field>
          <Label>Empreendimento</Label>
          <SelectField
            control={control}
            name="empreendimentoId"
            placeholder="Nenhum"
            options={(empreendimentos.data ?? []).map((e) => ({
              value: e.id,
              label: e.nome,
            }))}
          />
        </Field>
      </div>

      {modulo === 'proposta' && (
        <Field>
          <Label>Tipo de pagamento</Label>
          <SelectField
            control={control}
            name="tipoPagamentoId"
            placeholder="Não definido"
            options={(tiposPagamento.data ?? []).map((t) => ({ value: t.id, label: t.nome }))}
          />
        </Field>
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
        <Alert tone="danger">
          <AlertTitle>Não foi possível salvar</AlertTitle>
          <AlertDescription>{mutation.error?.message ?? 'Erro inesperado.'}</AlertDescription>
        </Alert>
      )}
      <FormDialogFooter onCancel={onSuccess} loading={isSubmitting || mutation.isPending} />
    </form>
  )
}
