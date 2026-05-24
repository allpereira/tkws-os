import { z } from 'zod'

/**
 * Tipos de Empresa · taxonomia das empresas externas com as quais a organização se relaciona.
 *
 * "Empresa" aqui é o termo genérico (Cliente, Fornecedor, Construtora, Incorporadora,
 * Parceiro etc). NÃO confundir com a própria Organização (tenant).
 */
export const tipoEmpresaSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  codigo: z.string().min(1).max(20),
  nome: z.string().min(1).max(80),
  ativo: z.boolean().default(true),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createTipoEmpresaSchema = tipoEmpresaSchema.pick({
  codigo: true,
  nome: true,
  ativo: true,
})
export const updateTipoEmpresaSchema = createTipoEmpresaSchema.partial()

export type TipoEmpresa = z.infer<typeof tipoEmpresaSchema>
export type CreateTipoEmpresa = z.infer<typeof createTipoEmpresaSchema>
export type UpdateTipoEmpresa = z.infer<typeof updateTipoEmpresaSchema>
