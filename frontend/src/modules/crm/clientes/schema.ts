import { z } from 'zod'

export const TIPO_PESSOA = ['fisica', 'juridica'] as const

/** Clientes · pessoas físicas ou jurídicas com quem temos relação comercial. */
export const clienteSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  tipoPessoa: z.enum(TIPO_PESSOA).default('fisica'),
  nome: z.string().min(1, 'Nome obrigatório').max(160),
  documento: z.string().min(1).max(20).regex(/^[\d\.\-\/]+$/, 'Apenas dígitos, pontos, traços e barras'),
  email: z.string().email().optional().nullable(),
  telefone: z.string().max(20).optional().nullable(),
  endereco: z.string().max(200).optional().nullable(),
  cidade: z.string().max(80).optional().nullable(),
  uf: z.string().length(2).optional().nullable(),
  cep: z.string().max(10).optional().nullable(),
  empreendimentoId: z.string().uuid().optional().nullable(),
  /** Lead que originou este cliente (histórico) */
  leadOrigemId: z.string().uuid().optional().nullable(),
  responsavelId: z.string().uuid().optional().nullable(),
  vipScore: z.number().int().min(0).max(5).default(0),
  ativo: z.boolean().default(true),
  notas: z.string().max(1000).optional().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createClienteSchema = clienteSchema.pick({
  tipoPessoa: true, nome: true, documento: true, email: true, telefone: true,
  endereco: true, cidade: true, uf: true, cep: true,
  empreendimentoId: true, leadOrigemId: true, responsavelId: true,
  vipScore: true, ativo: true, notas: true,
})
export const updateClienteSchema = createClienteSchema.partial()

export type Cliente = z.infer<typeof clienteSchema>
export type CreateCliente = z.infer<typeof createClienteSchema>
export type UpdateCliente = z.infer<typeof updateClienteSchema>
