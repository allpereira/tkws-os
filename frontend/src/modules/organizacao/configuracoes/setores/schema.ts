import { z } from 'zod'

/** Setores · departamentos internos da organização. */
export const setorSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.number().int().positive(),
  codigo: z.string().min(1).max(40),
  nome: z.string().min(1).max(80),
  ativo: z.boolean().default(true),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createSetorSchema = setorSchema.pick({ codigo: true, nome: true, ativo: true })
export const updateSetorSchema = createSetorSchema.partial()

export type Setor = z.infer<typeof setorSchema>
export type CreateSetor = z.infer<typeof createSetorSchema>
export type UpdateSetor = z.infer<typeof updateSetorSchema>
