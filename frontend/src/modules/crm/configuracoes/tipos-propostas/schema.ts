import { z } from 'zod'

/**
 * Tipos de Propostas Comerciais · ex: "Decoração Completa", "Reforma + Decoração", "Apenas Projeto".
 * Fonte da verdade — UI, API e backend derivam deste schema.
 */
export const tipoPropostaSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  nome: z.string().min(1, 'Nome obrigatório').max(80, 'Máximo 80 caracteres'),
  descricao: z.string().max(280, 'Máximo 280 caracteres').optional().nullable(),
  cor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida · use #RRGGBB')
    .default('#74C7E4'),
  ativo: z.boolean().default(true),
  ordem: z.number().int().min(0).default(0),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createTipoPropostaSchema = tipoPropostaSchema.pick({
  nome: true,
  descricao: true,
  cor: true,
  ativo: true,
  ordem: true,
})

export const updateTipoPropostaSchema = createTipoPropostaSchema.partial()

export type TipoProposta = z.infer<typeof tipoPropostaSchema>
export type CreateTipoProposta = z.infer<typeof createTipoPropostaSchema>
export type UpdateTipoProposta = z.infer<typeof updateTipoPropostaSchema>
