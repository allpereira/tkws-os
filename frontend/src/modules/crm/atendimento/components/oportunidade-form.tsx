import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { FormDialogFooter } from '@/components/tkws/crud-page'
import { Button } from '@/components/ui/button'
import { Field, FieldHint, Input, Label } from '@/components/ui/input'
import { MoneyInput } from '@/components/ui/masked-input'
import { centsToReais, reaisToCents, roundReais } from '@/lib/money'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SelectField, type SelectOption } from '@/components/ui/select-field'
import { DateField } from '@/components/ui/date-field'
import { useEmpreendimentos } from '@/modules/organizacao/configuracoes/empreendimentos/api'
import { useOfertas } from '@/modules/organizacao/configuracoes/ofertas/api'
import type { Etapa } from '@/modules/crm/configuracoes/etapas/schema'
import { PessoaComboboxField } from '@/modules/crm/pessoas/components/pessoa-combobox'
import { ParceiroComboboxField } from '@/modules/crm/pessoas/components/parceiro-combobox'
import { useTiposPagamento } from '@/modules/crm/configuracoes/tipos-pagamentos/api'
import { useOrigensNegocio } from '@/modules/crm/configuracoes/origens-negocio/api'
import { useCreateOportunidade, useUpdateOportunidade } from '../api'
import {
  createOportunidadeSchema,
  type CreateOportunidade,
  type Oportunidade,
} from '../schema'

function emptyHint(
  query: { isLoading: boolean; isError: boolean; data: unknown[] | undefined },
  cadastreUrl?: string,
) {
  if (query.isLoading) return 'Carregando…'
  if (query.isError) return 'Falha ao carregar · verifique sua conexão e permissão'
  if (!query.data || query.data.length === 0) {
    return cadastreUrl
      ? `Nenhum cadastro encontrado · cadastre em ${cadastreUrl}`
      : 'Nenhum cadastro disponível'
  }
  return null
}

function toOptions<T extends { id: string }>(
  data: T[] | undefined,
  label: (item: T) => string,
): SelectOption[] {
  return (data ?? []).map((item) => ({ value: item.id, label: label(item) }))
}

export interface OportunidadeFormProps {
  initial?: Oportunidade
  pipelineId: string
  modulo: 'atendimento' | 'proposta'
  etapas: Etapa[]
  onSuccess: () => void
  onRequestDelete?: () => void
}

export function OportunidadeForm({
  initial,
  pipelineId,
  modulo,
  etapas,
  onSuccess,
  onRequestDelete,
}: OportunidadeFormProps) {
  const isEdit = !!initial
  const empreendimentos = useEmpreendimentos()
  const ofertas = useOfertas()
  const tiposPagamento = useTiposPagamento()
  const origens = useOrigensNegocio()
  const createMut = useCreateOportunidade()
  const updateMut = useUpdateOportunidade()
  const mutation = isEdit ? updateMut : createMut

  const { register, handleSubmit, control, setError, formState: { errors, isSubmitting } } = useForm<CreateOportunidade>({
    resolver: zodResolver(createOportunidadeSchema),
    defaultValues: {
      pipelineId,
      etapaId: initial?.etapaId ?? etapas[0]?.id ?? '',
      descricao: initial?.descricao ?? '',
      pessoaId: initial?.pessoaId ?? null,
      ofertaId: initial?.ofertaId ?? null,
      tipoPagamentoId: initial?.tipoPagamentoId ?? null,
      empreendimentoId: initial?.empreendimentoId ?? null,
      responsavelId: initial?.responsavelId ?? null,
      parceiroId: initial?.parceiroId ?? null,
      valor: initial?.valor ?? 0,
      previsaoFechamento: initial?.previsaoFechamento ?? null,
      origemId: initial?.origemId ?? '',
      origemOutros: initial?.origemOutros ?? '',
    },
  })

  // Só origens ativas no seletor; ao editar, mantém a origem atual mesmo se inativa.
  const origemOptions: SelectOption[] = (origens.data ?? [])
    .filter((o) => o.ativo || o.id === initial?.origemId)
    .map((o) => ({ value: o.id, label: o.nome }))

  const origemId = useWatch({ control, name: 'origemId' })
  const origemSelecionada = origens.data?.find((o) => o.id === origemId)
  const exigeParceiro = origemSelecionada?.exigeParceiro ?? false
  const exigeDetalhe = origemSelecionada?.exigeDetalhe ?? false

  const onSubmit = handleSubmit(async (data) => {
    // Regras condicionais vêm das flags da origem selecionada (ADR-025).
    if (exigeParceiro && !data.parceiroId) {
      setError('parceiroId', { message: 'Selecione o parceiro indicador' })
      return
    }
    if (exigeDetalhe && !data.origemOutros?.trim()) {
      setError('origemOutros', { message: 'Informe qual é a origem' })
      return
    }
    const payload = {
      ...data,
      pipelineId,
      pessoaId: data.pessoaId || null,
      ofertaId: data.ofertaId || null,
      tipoPagamentoId: data.tipoPagamentoId || null,
      empreendimentoId: data.empreendimentoId || null,
      responsavelId: data.responsavelId || null,
      parceiroId: exigeParceiro ? data.parceiroId || null : null,
      previsaoFechamento: data.previsaoFechamento || null,
      origemOutros: exigeDetalhe ? data.origemOutros?.trim() || null : null,
      valor: roundReais(data.valor),
    }
    if (isEdit && initial) await updateMut.mutateAsync({ id: initial.id, input: payload })
    else await createMut.mutateAsync(payload)
    onSuccess()
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field>
        <Label htmlFor="descricao" required>Descrição</Label>
        <Input
          id="descricao"
          state={errors.descricao ? 'error' : 'default'}
          placeholder="Apto Yachthouse 2104 · briefing"
          {...register('descricao')}
        />
        {errors.descricao && <FieldHint state="error">{errors.descricao.message}</FieldHint>}
      </Field>

      <Field>
        <Label>Pessoa (Lead ou Cliente)</Label>
        <PessoaComboboxField
          control={control}
          name="pessoaId"
          placeholder="Buscar lead ou cliente…"
          state={errors.pessoaId ? 'error' : 'default'}
        />
        <FieldHint>
          Não encontrou? Digite o nome e clique em “Criar lead …” pra cadastrar inline.
        </FieldHint>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label>Oferta</Label>
          <SelectField
            control={control}
            name="ofertaId"
            placeholder={ofertas.isLoading ? 'Carregando…' : 'Nenhuma'}
            options={toOptions(ofertas.data, (o) => o.nome)}
          />
          {emptyHint(ofertas, 'Configurações → Organização → Ofertas') && (
            <FieldHint>{emptyHint(ofertas, 'Configurações → Organização → Ofertas')}</FieldHint>
          )}
        </Field>
        <Field>
          <Label htmlFor="valor">Valor (R$)</Label>
          <Controller
            control={control}
            name="valor"
            render={({ field }) => (
              <MoneyInput
                id="valor"
                error={!!errors.valor}
                value={field.value > 0 ? reaisToCents(field.value) : undefined}
                onChange={(cents) => {
                  field.onChange(cents === undefined ? 0 : centsToReais(cents))
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.valor && <FieldHint state="error">{errors.valor.message}</FieldHint>}
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label>Empreendimento</Label>
          <SelectField
            control={control}
            name="empreendimentoId"
            placeholder={empreendimentos.isLoading ? 'Carregando…' : 'Nenhum'}
            options={toOptions(empreendimentos.data, (e) => e.nome)}
          />
          {emptyHint(empreendimentos, 'Configurações → Organização → Empreendimentos') && (
            <FieldHint>
              {emptyHint(empreendimentos, 'Configurações → Organização → Empreendimentos')}
            </FieldHint>
          )}
        </Field>
        <Field>
          <Label htmlFor="previsaoFechamento">Previsão fechamento</Label>
          <DateField control={control} name="previsaoFechamento" placeholder="Selecione a data" />
        </Field>
      </div>

      <Field>
        <Label required>Etapa</Label>
        <SelectField
          control={control}
          name="etapaId"
          placeholder={etapas.length === 0 ? 'Sem etapas neste pipeline' : 'Selecione a etapa'}
          options={etapas.map((e) => ({ value: e.id, label: e.nome }))}
          state={errors.etapaId ? 'error' : 'default'}
        />
        {etapas.length === 0 && (
          <FieldHint>Cadastre etapas em Configurações → CRM → Etapas para este pipeline.</FieldHint>
        )}
        {errors.etapaId && <FieldHint state="error">{errors.etapaId.message}</FieldHint>}
      </Field>

      <Field>
        <Label required>Origem</Label>
        <SelectField
          control={control}
          name="origemId"
          placeholder={origens.isLoading ? 'Carregando…' : 'Selecione a origem'}
          options={origemOptions}
          state={errors.origemId ? 'error' : 'default'}
        />
        {emptyHint(origens, 'Configurações → CRM → Origens de Negócio') && (
          <FieldHint>{emptyHint(origens, 'Configurações → CRM → Origens de Negócio')}</FieldHint>
        )}
        {errors.origemId && <FieldHint state="error">{errors.origemId.message}</FieldHint>}
      </Field>

      {exigeParceiro && (
        <Field>
          <Label>Parceiro</Label>
          <ParceiroComboboxField
            control={control}
            name="parceiroId"
            state={errors.parceiroId ? 'error' : 'default'}
          />
          <FieldHint>
            Não encontrou? Digite o nome e clique em “Criar parceiro …” pra cadastrar inline.
          </FieldHint>
          {errors.parceiroId && <FieldHint state="error">{errors.parceiroId.message}</FieldHint>}
        </Field>
      )}

      {exigeDetalhe && (
        <Field>
          <Label htmlFor="origemOutros" required>Qual origem?</Label>
          <Input
            id="origemOutros"
            state={errors.origemOutros ? 'error' : 'default'}
            placeholder="Ex.: indicação de vizinho, outdoor…"
            {...register('origemOutros')}
          />
          {errors.origemOutros && (
            <FieldHint state="error">{errors.origemOutros.message}</FieldHint>
          )}
        </Field>
      )}

      {modulo === 'proposta' && (
        <Field>
          <Label>Tipo de pagamento</Label>
          <SelectField
            control={control}
            name="tipoPagamentoId"
            placeholder={tiposPagamento.isLoading ? 'Carregando…' : 'Não definido'}
            options={toOptions(tiposPagamento.data, (t) => t.nome)}
          />
          {emptyHint(tiposPagamento, 'Configurações → CRM → Tipos de Pagamento') && (
            <FieldHint>
              {emptyHint(tiposPagamento, 'Configurações → CRM → Tipos de Pagamento')}
            </FieldHint>
          )}
        </Field>
      )}

      {mutation.isError && (
        <Alert tone="danger">
          <AlertTitle>Não foi possível salvar</AlertTitle>
          <AlertDescription>{mutation.error?.message ?? 'Erro inesperado.'}</AlertDescription>
        </Alert>
      )}
      <FormDialogFooter
        onCancel={onSuccess}
        loading={isSubmitting || mutation.isPending}
        leftSlot={
          isEdit && onRequestDelete ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onRequestDelete}
              disabled={isSubmitting || mutation.isPending}
              style={{ color: 'var(--danger)' }}
            >
              <Trash2 size={13} /> Excluir
            </Button>
          ) : null
        }
      />
    </form>
  )
}
