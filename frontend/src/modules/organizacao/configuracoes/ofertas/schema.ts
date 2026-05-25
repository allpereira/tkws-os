import { z } from 'zod'

/** Ofertas · catálogo de serviços/itens que a TKWS oferece aos clientes · usados em propostas e orçamentos. */
export const ofertaSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.number().int().positive(),
  codigo: z.string().min(1).max(40),
  nome: z.string().min(1).max(160),
  ativo: z.boolean().default(true),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createOfertaSchema = ofertaSchema.pick({ codigo: true, nome: true, ativo: true })
export const updateOfertaSchema = createOfertaSchema.partial()

export type Oferta = z.infer<typeof ofertaSchema>
export type CreateOferta = z.infer<typeof createOfertaSchema>
export type UpdateOferta = z.infer<typeof updateOfertaSchema>
