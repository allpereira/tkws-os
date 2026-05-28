import { z } from 'zod'

/**
 * Origem de Negócio · canal de origem de uma Oportunidade (ADR-025).
 *
 * Antes era um enum fixo no código; virou configuração editável por tenant.
 * Duas flags carregam regra de negócio aplicada no formulário de Oportunidade:
 *  - `exigeParceiro`: exige selecionar um parceiro indicador.
 *  - `exigeDetalhe`: exige preencher um texto livre detalhando a origem.
 */
export const origemNegocioSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.number().int().positive(),
  codigo: z.string().min(1).max(40),
  nome: z.string().min(1).max(80),
  exigeParceiro: z.boolean().default(false),
  exigeDetalhe: z.boolean().default(false),
  ativo: z.boolean().default(true),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createOrigemNegocioSchema = origemNegocioSchema.pick({
  codigo: true,
  nome: true,
  exigeParceiro: true,
  exigeDetalhe: true,
  ativo: true,
})
export const updateOrigemNegocioSchema = createOrigemNegocioSchema.partial()

export type OrigemNegocio = z.infer<typeof origemNegocioSchema>
export type CreateOrigemNegocio = z.infer<typeof createOrigemNegocioSchema>
export type UpdateOrigemNegocio = z.infer<typeof updateOrigemNegocioSchema>
