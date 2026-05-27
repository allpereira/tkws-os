import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { FormDialogFooter } from '@/components/tkws/crud-page'
import { Button } from '@/components/ui/button'
import { Field, FieldHint, Input, Label, Textarea } from '@/components/ui/input'
import { MoneyInput } from '@/components/ui/masked-input'
import { centsToReais, reaisToCents, roundReais } from '@/lib/money'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SelectField, type SelectOption } from '@/components/ui/select-field'
import { DateField } from '@/components/ui/date-field'
import { useEmpreendimentos } from '@/modules/organizacao/configuracoes/empreendimentos/api'
import { useOfertas } from '@/modules/organizacao/configuracoes/ofertas/api'
import type { Etapa } from '@/modules/crm/configuracoes/etapas/schema'
import { PessoaComboboxField } from '@/modules/crm/pessoas/components/pessoa-combobox'
import { useTiposPagamento } from '@/modules/crm/configuracoes/tipos-pagamentos/api'
import { useCreateOportunidade, useUpdateOportunidade } from '../api'
import {
  createOportunidadeSchema,
  type CreateOportunidade,
  type Oportunidade,
} from '../schema'

/**
 * Hint exibido abaixo de um Select quando a lista de opções está vazia
 * porque o hook ainda está carregando ou porque não há cadastros / falta
 * permissão. Mostra mensagem clara em vez do select abrir vazio "sem
 * reação".
 */
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
  /** Dispara fluxo de exclusão · só aparece em modo edição. */
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
      valor: roundReais(data.valor),
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
      </div>

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

      <Field>
        <Label htmlFor="prazoFechamento">Prazo de fechamento</Label>
        <DateField control={control} name="prazoFechamento" placeholder="Selecione a data" />
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
