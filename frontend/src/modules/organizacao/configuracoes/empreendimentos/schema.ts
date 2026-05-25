import { z } from 'zod'

/** Empreendimentos · prédios e condomínios onde projetos são executados. */
export const empreendimentoSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.number().int().positive(),
  codigo: z.string().min(1).max(40),
  nome: z.string().min(1).max(160),
  ativo: z.boolean().default(true),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createEmpreendimentoSchema = empreendimentoSchema.pick({
  codigo: true,
  nome: true,
  ativo: true,
})
export const updateEmpreendimentoSchema = createEmpreendimentoSchema.partial()

export type Empreendimento = z.infer<typeof empreendimentoSchema>
export type CreateEmpreendimento = z.infer<typeof createEmpreendimentoSchema>
export type UpdateEmpreendimento = z.infer<typeof updateEmpreendimentoSchema>
