import { z } from 'zod'

/**
 * Tipos de Pagamento · ex: "À vista 10% desconto", "8× sem juros", "Cartão BNDES",
 * "Boleto 30 dias". Usados nas propostas comerciais.
 */
export const tipoPagamentoSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  nome: z.string().min(1, 'Nome obrigatório').max(80),
  descricao: z.string().max(280).optional().nullable(),
  parcelas: z.number().int().min(1, 'Mínimo 1 parcela').max(48, 'Máximo 48').default(1),
  jurosMes: z.number().min(0).max(20).default(0),
  descontoVista: z.number().min(0).max(50).default(0),
  ativo: z.boolean().default(true),
  ordem: z.number().int().min(0).default(0),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createTipoPagamentoSchema = tipoPagamentoSchema.pick({
  nome: true,
  descricao: true,
  parcelas: true,
  jurosMes: true,
  descontoVista: true,
  ativo: true,
  ordem: true,
})

export const updateTipoPagamentoSchema = createTipoPagamentoSchema.partial()

export type TipoPagamento = z.infer<typeof tipoPagamentoSchema>
export type CreateTipoPagamento = z.infer<typeof createTipoPagamentoSchema>
export type UpdateTipoPagamento = z.infer<typeof updateTipoPagamentoSchema>
