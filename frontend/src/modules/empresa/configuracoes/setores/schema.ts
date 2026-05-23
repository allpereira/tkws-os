import { z } from 'zod'

/** Setores · departamentos internos da empresa. */
export const setorSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  nome: z.string().min(1).max(80),
  descricao: z.string().max(280).optional().nullable(),
  ativo: z.boolean().default(true),
  ordem: z.number().int().min(0).default(0),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createSetorSchema = setorSchema.pick({ nome: true, descricao: true, ativo: true, ordem: true })
export const updateSetorSchema = createSetorSchema.partial()

export type Setor = z.infer<typeof setorSchema>
export type CreateSetor = z.infer<typeof createSetorSchema>
export type UpdateSetor = z.infer<typeof updateSetorSchema>
