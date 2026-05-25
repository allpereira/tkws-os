import { z } from 'zod'

/**
 * Tipos de Pagamento · ex: "À vista 10% desconto", "8× sem juros", "Cartão BNDES",
 * "Boleto 30 dias". Usados nas propostas comerciais.
 */
export const tipoPagamentoSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.number().int().positive(),
  codigo: z.string().min(1).max(40),
  nome: z.string().min(1, 'Nome obrigatório').max(80),
  ativo: z.boolean().default(true),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createTipoPagamentoSchema = tipoPagamentoSchema.pick({ codigo: true, nome: true, ativo: true })
export const updateTipoPagamentoSchema = createTipoPagamentoSchema.partial()

export type TipoPagamento = z.infer<typeof tipoPagamentoSchema>
export type CreateTipoPagamento = z.infer<typeof createTipoPagamentoSchema>
export type UpdateTipoPagamento = z.infer<typeof updateTipoPagamentoSchema>
