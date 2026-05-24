import { z } from 'zod'

/** Funções de Pessoas · ex: "Arquiteto líder", "Designer pleno", "Gerente de obra". */
export const funcaoPessoaSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  codigo: z.string().min(1).max(40),
  nome: z.string().min(1).max(80),
  ativo: z.boolean().default(true),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createFuncaoPessoaSchema = funcaoPessoaSchema.pick({ codigo: true, nome: true, ativo: true })
export const updateFuncaoPessoaSchema = createFuncaoPessoaSchema.partial()

export type FuncaoPessoa = z.infer<typeof funcaoPessoaSchema>
export type CreateFuncaoPessoa = z.infer<typeof createFuncaoPessoaSchema>
export type UpdateFuncaoPessoa = z.infer<typeof updateFuncaoPessoaSchema>
