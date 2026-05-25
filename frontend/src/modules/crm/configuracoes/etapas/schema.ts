import { z } from 'zod'

/** Etapas · cada pipeline tem N etapas · representam colunas no Kanban. */
export const etapaSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.number().int().positive(),
  pipelineId: z.string().uuid(),
  nome: z.string().min(1).max(80),
  descricao: z.string().max(280).optional().nullable(),
  cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#74C7E4'),
  probabilidade: z.number().int().min(0).max(100).default(50),
  ativo: z.boolean().default(true),
  ordem: z.number().int().min(0).default(0),
  /** Marca a etapa como terminal · ganhou / perdeu */
  tipo: z.enum(['aberta', 'ganha', 'perdida']).default('aberta'),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createEtapaSchema = etapaSchema.pick({
  pipelineId: true,
  nome: true,
  descricao: true,
  cor: true,
  probabilidade: true,
  ativo: true,
  ordem: true,
  tipo: true,
})
export const updateEtapaSchema = createEtapaSchema.partial()

export type Etapa = z.infer<typeof etapaSchema>
export type CreateEtapa = z.infer<typeof createEtapaSchema>
export type UpdateEtapa = z.infer<typeof updateEtapaSchema>
