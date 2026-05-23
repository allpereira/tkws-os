import { z } from 'zod'

/**
 * Oportunidade · entidade canônica que percorre os pipelines de CRM.
 * Sub-tipos por `modulo`:
 *   - 'atendimento' → pipeline de pré-venda
 *   - 'proposta' → pipeline de proposta comercial enviada
 *
 * Mesma tabela no backend · diferenciada pelo módulo do pipeline.
 */
export const oportunidadeSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  pipelineId: z.string().uuid(),
  etapaId: z.string().uuid(),
  titulo: z.string().min(1).max(160),
  descricao: z.string().max(1000).optional().nullable(),
  /** Vínculo · pode ser Lead OU Cliente */
  leadId: z.string().uuid().optional().nullable(),
  clienteId: z.string().uuid().optional().nullable(),
  /** Tipo de proposta · só relevante quando pipeline.modulo === 'proposta' */
  tipoPropostaId: z.string().uuid().optional().nullable(),
  /** Tipo de pagamento · só relevante quando pipeline.modulo === 'proposta' */
  tipoPagamentoId: z.string().uuid().optional().nullable(),
  empreendimentoId: z.string().uuid().optional().nullable(),
  responsavelId: z.string().uuid().optional().nullable(),
  valor: z.number().min(0).default(0),
  prazoFechamento: z.string().date().optional().nullable(),
  notas: z.string().max(2000).optional().nullable(),
  ganha: z.boolean().default(false),
  perdida: z.boolean().default(false),
  motivoPerda: z.string().max(280).optional().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createOportunidadeSchema = oportunidadeSchema.pick({
  pipelineId: true, etapaId: true, titulo: true, descricao: true,
  leadId: true, clienteId: true, tipoPropostaId: true, tipoPagamentoId: true,
  empreendimentoId: true, responsavelId: true, valor: true, prazoFechamento: true,
  notas: true,
})
export const updateOportunidadeSchema = createOportunidadeSchema.partial().extend({
  ganha: z.boolean().optional(),
  perdida: z.boolean().optional(),
  motivoPerda: z.string().max(280).optional().nullable(),
})

export type Oportunidade = z.infer<typeof oportunidadeSchema>
export type CreateOportunidade = z.infer<typeof createOportunidadeSchema>
export type UpdateOportunidade = z.infer<typeof updateOportunidadeSchema>
