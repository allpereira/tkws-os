import { z } from 'zod'

/** Pipelines · CRM tem ao menos 2: Atendimento e Proposta. */
export const pipelineSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  nome: z.string().min(1).max(80),
  descricao: z.string().max(280).optional().nullable(),
  modulo: z.enum(['atendimento', 'proposta']),
  ativo: z.boolean().default(true),
  ordem: z.number().int().min(0).default(0),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createPipelineSchema = pipelineSchema.pick({
  nome: true,
  descricao: true,
  modulo: true,
  ativo: true,
  ordem: true,
})
export const updatePipelineSchema = createPipelineSchema.partial()

export type Pipeline = z.infer<typeof pipelineSchema>
export type CreatePipeline = z.infer<typeof createPipelineSchema>
export type UpdatePipeline = z.infer<typeof updatePipelineSchema>
