import { z } from 'zod'

/** Empreendimentos · prédios/condomínios onde projetos são executados. */
export const empreendimentoSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  nome: z.string().min(1).max(160),
  construtora: z.string().max(120).optional().nullable(),
  endereco: z.string().min(1).max(200),
  cidade: z.string().min(1).max(80),
  uf: z.string().length(2, 'UF deve ter 2 letras'),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido').optional().nullable(),
  totalUnidades: z.number().int().min(0).default(0),
  ativo: z.boolean().default(true),
  notas: z.string().max(500).optional().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createEmpreendimentoSchema = empreendimentoSchema.pick({
  nome: true, construtora: true, endereco: true, cidade: true, uf: true, cep: true,
  totalUnidades: true, ativo: true, notas: true,
})
export const updateEmpreendimentoSchema = createEmpreendimentoSchema.partial()

export type Empreendimento = z.infer<typeof empreendimentoSchema>
export type CreateEmpreendimento = z.infer<typeof createEmpreendimentoSchema>
export type UpdateEmpreendimento = z.infer<typeof updateEmpreendimentoSchema>
