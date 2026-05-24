/**
 * @deprecated · Use `@/modules/crm/pessoas/schema` (status='CLIENTE').
 *
 * Re-exports para retro-compat. Cliente é apenas Pessoa com status='CLIENTE'.
 */
export {
  pessoaSchema as clienteSchema,
  createPessoaSchema as createClienteSchema,
  updatePessoaSchema as updateClienteSchema,
} from '@/modules/crm/pessoas/schema'
export type { Pessoa as Cliente, CreatePessoa as CreateCliente, UpdatePessoa as UpdateCliente } from '@/modules/crm/pessoas/schema'

/** Aliases enum legado. */
export const TIPO_PESSOA = ['PF', 'PJ'] as const
