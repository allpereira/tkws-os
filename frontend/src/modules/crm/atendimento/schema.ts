import { z } from 'zod'

/**
 * Oportunidade (= Negócio) · vive em um Pipeline + Etapa.
 *
 * - `pessoaId` substitui `leadId`/`clienteId`: cadastro unificado (ADR-018).
 * - `ofertaId` substitui `tipoPropostaId`: o catálogo de Ofertas representa
 *   o que a organização vende.
 * - Quando entra em etapa com `converteLeadEmCliente=true`, o backend
 *   promove a Pessoa para CLIENTE automaticamente.
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
  titulo: z.string().min(1).max(200),
  descricao: z.string().optional().nullable(),
  valor: z.number().min(0).default(0),
  metragemM2: z.number().min(0).optional().nullable(),
  prazoFechamento: z.string().date().optional().nullable(),
  notas: z.string().optional().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createOportunidadeSchema = oportunidadeSchema.pick({
  pipelineId: true,
  etapaId: true,
  pessoaId: true,
  ofertaId: true,
  tipoPagamentoId: true,
  empreendimentoId: true,
  tipoProjetoId: true,
  responsavelId: true,
  titulo: true,
  descricao: true,
  valor: true,
  metragemM2: true,
  prazoFechamento: true,
  notas: true,
})

export const updateOportunidadeSchema = createOportunidadeSchema.partial()

export type Oportunidade = z.infer<typeof oportunidadeSchema>
export type CreateOportunidade = z.infer<typeof createOportunidadeSchema>
export type UpdateOportunidade = z.infer<typeof updateOportunidadeSchema>
