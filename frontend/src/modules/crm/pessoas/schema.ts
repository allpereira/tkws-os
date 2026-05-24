import { z } from 'zod'

/**
 * Pessoa · cadastro único PF/PJ no funil comercial.
 *
 * Status:
 *   LEAD     · ainda não fechou proposta (estado inicial)
 *   CLIENTE  · fechou ao menos uma proposta (promovido automaticamente
 *              quando uma Oportunidade entra em etapa com
 *              `converteLeadEmCliente=true`)
 *
 * As páginas "Leads" e "Clientes" do CRM são VIEWS sobre essa mesma
 * tabela, filtradas por `?status=LEAD` ou `?status=CLIENTE`.
 *
 * Ver ADR-018 (backend).
 */

export const TIPO_PESSOA = ['PF', 'PJ'] as const
export const STATUS_PESSOA = ['LEAD', 'CLIENTE'] as const

export const pessoaSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  tipoPessoa: z.enum(TIPO_PESSOA),
  documento: z.string().nullable().optional(),
  nomeContato: z.string().min(1).max(160),
  emailContato: z.string().email().nullable().optional(),
  celularContato: z.string().nullable().optional(),
  nomeEmpresa: z.string().nullable().optional(),
  status: z.enum(STATUS_PESSOA),
  convertidoEm: z.string().datetime({ offset: true }).nullable().optional(),
  endereco: z.string().nullable().optional(),
  cidade: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createPessoaSchema = z.object({
  tipoPessoa: z.enum(TIPO_PESSOA),
  documento: z.string().max(20).optional().nullable(),
  nomeContato: z.string().min(1, 'Nome obrigatório').max(160),
  emailContato: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
  celularContato: z.string().max(20).optional().nullable(),
  nomeEmpresa: z.string().max(160).optional().nullable(),
  forceCreate: z.boolean().optional(),
})

export const updatePessoaSchema = createPessoaSchema.partial()

export type Pessoa = z.infer<typeof pessoaSchema>
export type CreatePessoa = z.infer<typeof createPessoaSchema>
export type UpdatePessoa = z.infer<typeof updatePessoaSchema>
export type TipoPessoa = (typeof TIPO_PESSOA)[number]
export type StatusPessoa = (typeof STATUS_PESSOA)[number]

/** Resposta do endpoint de dedup. */
export interface DedupResult {
  matchedByDocumento: Pessoa | null
  matchedSoft: Pessoa[]
}
