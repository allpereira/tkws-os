import { z } from 'zod'

/**
 * Unidades · filiais / escritórios da própria Organização (tenant).
 *
 * Ex.: TKWS Florianópolis · TKWS Balneário Camboriú · TKWS Curitiba.
 * NÃO é unidade de empresas externas (clientes/fornecedores).
 */
export const unidadeSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.number().int().positive(),
  codigo: z.string().min(1).max(40),
  nome: z.string().min(1).max(120),
  ativo: z.boolean().default(true),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createUnidadeSchema = unidadeSchema.pick({ codigo: true, nome: true, ativo: true })
export const updateUnidadeSchema = createUnidadeSchema.partial()

export type Unidade = z.infer<typeof unidadeSchema>
export type CreateUnidade = z.infer<typeof createUnidadeSchema>
export type UpdateUnidade = z.infer<typeof updateUnidadeSchema>
