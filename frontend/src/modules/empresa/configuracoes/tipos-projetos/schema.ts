import { z } from 'zod'

/** Tipos de Projetos · ex: "Residencial alto padrão", "Comercial", "Reforma". */
export const tipoProjetoSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  nome: z.string().min(1).max(80),
  descricao: z.string().max(280).optional().nullable(),
  cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#74C7E4'),
  ativo: z.boolean().default(true),
  ordem: z.number().int().min(0).default(0),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createTipoProjetoSchema = tipoProjetoSchema.pick({
  nome: true, descricao: true, cor: true, ativo: true, ordem: true,
})
export const updateTipoProjetoSchema = createTipoProjetoSchema.partial()

export type TipoProjeto = z.infer<typeof tipoProjetoSchema>
export type CreateTipoProjeto = z.infer<typeof createTipoProjetoSchema>
export type UpdateTipoProjeto = z.infer<typeof updateTipoProjetoSchema>
