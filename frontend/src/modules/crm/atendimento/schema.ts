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
export const ORIGEM_NEGOCIO = [
  'INDICACAO_PARCEIRO',
  'GOOGLE',
  'REDES_SOCIAIS',
  'EVENTOS',
  'FEIRAS',
  'OUTROS',
] as const

export type OrigemNegocio = (typeof ORIGEM_NEGOCIO)[number]

export const ORIGEM_NEGOCIO_LABELS: Record<OrigemNegocio, string> = {
  INDICACAO_PARCEIRO: 'Indicação de Parceiro',
  GOOGLE: 'Google',
  REDES_SOCIAIS: 'Redes Sociais',
  EVENTOS: 'Eventos',
  FEIRAS: 'Feiras',
  OUTROS: 'Outros',
}

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
  origem: z.enum(ORIGEM_NEGOCIO),
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
  origem: true,
  origemOutros: true,
  notas: true,
})

function validateOrigemNegocio<T extends { origem: OrigemNegocio; origemOutros?: string | null; parceiroId?: string | null }>(
  data: T,
  ctx: z.RefinementCtx,
) {
  if (data.origem === 'INDICACAO_PARCEIRO' && !data.parceiroId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Selecione o parceiro indicador',
      path: ['parceiroId'],
    })
  }
  if (data.origem === 'OUTROS' && !(data.origemOutros?.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Informe qual é a origem',
      path: ['origemOutros'],
    })
  }
}

export const createOportunidadeSchema = oportunidadeFormBaseSchema.superRefine(validateOrigemNegocio)

export const updateOportunidadeSchema = oportunidadeFormBaseSchema.partial().superRefine((data, ctx) => {
  if (data.origem !== undefined) {
    validateOrigemNegocio(
      {
        origem: data.origem,
        origemOutros: data.origemOutros ?? null,
        parceiroId: data.parceiroId ?? null,
      },
      ctx,
    )
  }
})

export type Oportunidade = z.infer<typeof oportunidadeSchema>
export type CreateOportunidade = z.infer<typeof createOportunidadeSchema>
export type UpdateOportunidade = z.infer<typeof updateOportunidadeSchema>
