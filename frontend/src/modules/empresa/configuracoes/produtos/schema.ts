import { z } from 'zod'

/** Produtos · catálogo de itens vendidos · usados em propostas/orçamentos. */
export const produtoSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  codigo: z.string().min(1).max(40),
  nome: z.string().min(1).max(160),
  descricao: z.string().max(500).optional().nullable(),
  setorId: z.string().uuid().optional().nullable(),
  unidade: z.string().min(1).max(10).default('un'),
  precoBase: z.number().min(0).default(0),
  ativo: z.boolean().default(true),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createProdutoSchema = produtoSchema.pick({
  codigo: true,
  nome: true,
  descricao: true,
  setorId: true,
  unidade: true,
  precoBase: true,
  ativo: true,
})
export const updateProdutoSchema = createProdutoSchema.partial()

export type Produto = z.infer<typeof produtoSchema>
export type CreateProduto = z.infer<typeof createProdutoSchema>
export type UpdateProduto = z.infer<typeof updateProdutoSchema>
