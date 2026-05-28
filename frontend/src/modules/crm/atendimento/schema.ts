import { z } from 'zod'

/**
 * Oportunidade (= Negócio) · vive em um Pipeline + Etapa.
 *
 * - `pessoaId` substitui `leadId`/`clienteId`: cadastro unificado (ADR-018).
 * - `ofertaId` substitui `tipoPropostaId`: o catálogo de Ofertas representa
 *   o que a organização vende.
 * - Quando entra em etapa com `converteLeadEmCliente=true`, o backend
 *   promove a Pessoa para CLIENTE automaticamente.
 * - `origemId` referencia a configuração Origens de Negócio (ADR-025). As
 *   regras condicionais (exige parceiro / exige detalhe) vêm das flags da
 *   origem selecionada e são validadas no formulário, não aqui no schema.
 */
export const oportunidadeSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.number().int().positive(),
  pipelineId: z.string().uuid(),
  etapaId: z.string().uuid(),
  pessoaId: z.string().uuid().optional().nullable(),
  ofertaId: z.string().uuid().optional().nullable(),
  tipoPagamentoId: z.string().uuid().optional().nullable(),
  empreendimentoId: z.string().uuid().optional().nullable(),
  tipoProjetoId: z.string().uuid().optional().nullable(),
  responsavelId: z.string().uuid().optional().nullable(),
  parceiroId: z.string().uuid().optional().nullable(),
  descricao: z.string().min(1).max(200),
  valor: z.number().min(0).default(0),
  metragemM2: z.number().min(0).optional().nullable(),
  previsaoFechamento: z.string().date().optional().nullable(),
  origemId: z.string().uuid(),
  origemOutros: z.string().max(160).optional().nullable(),
  notas: z.string().optional().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

const oportunidadeFormBaseSchema = oportunidadeSchema.pick({
  pipelineId: true,
  etapaId: true,
  pessoaId: true,
  ofertaId: true,
  tipoPagamentoId: true,
  empreendimentoId: true,
  tipoProjetoId: true,
  responsavelId: true,
  parceiroId: true,
  descricao: true,
  valor: true,
  metragemM2: true,
  previsaoFechamento: true,
  origemId: true,
  origemOutros: true,
  notas: true,
})

// As regras condicionais de origem (exige parceiro / exige detalhe) dependem das
// flags da origem selecionada — carregadas em runtime via API. Por isso ficam no
// formulário (ver oportunidade-form.tsx), não no schema Zod.
export const createOportunidadeSchema = oportunidadeFormBaseSchema

export const updateOportunidadeSchema = oportunidadeFormBaseSchema.partial()

export type Oportunidade = z.infer<typeof oportunidadeSchema>
export type CreateOportunidade = z.infer<typeof createOportunidadeSchema>
export type UpdateOportunidade = z.infer<typeof updateOportunidadeSchema>
