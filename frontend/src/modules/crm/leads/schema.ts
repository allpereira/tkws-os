/**
 * @deprecated · Use `@/modules/crm/pessoas/schema` (status='LEAD').
 *
 * Re-exports para retro-compat. Lead é apenas Pessoa com status='LEAD'.
 */
export {
  pessoaSchema as leadSchema,
  createPessoaSchema as createLeadSchema,
  updatePessoaSchema as updateLeadSchema,
} from '@/modules/crm/pessoas/schema'
export type { Pessoa as Lead, CreatePessoa as CreateLead, UpdatePessoa as UpdateLead } from '@/modules/crm/pessoas/schema'

/** Lista vazia · enum legado mantido só para evitar import errors. */
export const LEAD_ORIGEM = ['indicacao', 'site', 'instagram', 'whatsapp', 'evento', 'outro'] as const
