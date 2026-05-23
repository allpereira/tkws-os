import { z } from 'zod'

/** Funções de Pessoas · ex: "Arquiteto líder", "Designer pleno", "Gerente de obra". */
export const funcaoPessoaSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  nome: z.string().min(1).max(80),
  descricao: z.string().max(280).optional().nullable(),
  setorId: z.string().uuid().optional().nullable(),
  ativo: z.boolean().default(true),
  ordem: z.number().int().min(0).default(0),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createFuncaoPessoaSchema = funcaoPessoaSchema.pick({
  nome: true, descricao: true, setorId: true, ativo: true, ordem: true,
})
export const updateFuncaoPessoaSchema = createFuncaoPessoaSchema.partial()

export type FuncaoPessoa = z.infer<typeof funcaoPessoaSchema>
export type CreateFuncaoPessoa = z.infer<typeof createFuncaoPessoaSchema>
export type UpdateFuncaoPessoa = z.infer<typeof updateFuncaoPessoaSchema>
