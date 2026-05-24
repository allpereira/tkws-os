import { z } from 'zod'

/** Tipos de Projetos · ex: "Residencial alto padrão", "Comercial", "Reforma". */
export const tipoProjetoSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  codigo: z.string().min(1).max(40),
  nome: z.string().min(1).max(80),
  ativo: z.boolean().default(true),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createTipoProjetoSchema = tipoProjetoSchema.pick({ codigo: true, nome: true, ativo: true })
export const updateTipoProjetoSchema = createTipoProjetoSchema.partial()

export type TipoProjeto = z.infer<typeof tipoProjetoSchema>
export type CreateTipoProjeto = z.infer<typeof createTipoProjetoSchema>
export type UpdateTipoProjeto = z.infer<typeof updateTipoProjetoSchema>
