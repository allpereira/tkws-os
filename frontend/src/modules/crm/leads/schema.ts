import { z } from 'zod'

export const LEAD_ORIGEM = ['indicacao', 'site', 'instagram', 'whatsapp', 'evento', 'outro'] as const

/** Lead · contato inicial · ainda não virou cliente. */
export const leadSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  nome: z.string().min(1).max(160),
  email: z.string().email('Email inválido').optional().nullable(),
  telefone: z.string().max(20).optional().nullable(),
  empresa: z.string().max(120).optional().nullable(),
  cargo: z.string().max(80).optional().nullable(),
  origem: z.enum(LEAD_ORIGEM).default('outro'),
  setorInteresseId: z.string().uuid().optional().nullable(),
  tipoProjetoId: z.string().uuid().optional().nullable(),
  empreendimentoId: z.string().uuid().optional().nullable(),
  responsavelId: z.string().uuid().optional().nullable(),
  notas: z.string().max(1000).optional().nullable(),
  qualificado: z.boolean().default(false),
  /** Quando vira cliente, link para cliente.id (e o lead permanece histórico) */
  clienteConvertidoId: z.string().uuid().optional().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createLeadSchema = leadSchema.pick({
  nome: true, email: true, telefone: true, empresa: true, cargo: true,
  origem: true, setorInteresseId: true, tipoProjetoId: true, empreendimentoId: true,
  responsavelId: true, notas: true, qualificado: true,
})
export const updateLeadSchema = createLeadSchema.partial()

export type Lead = z.infer<typeof leadSchema>
export type CreateLead = z.infer<typeof createLeadSchema>
export type UpdateLead = z.infer<typeof updateLeadSchema>
