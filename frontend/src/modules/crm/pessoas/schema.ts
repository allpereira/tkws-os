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

/** Ordenações suportadas pela listagem (espelha PessoaSort do backend). */
export const SORT_PESSOA = ['RECENTE', 'NOME', 'CONVERSAO'] as const

export const pessoaSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.number().int().positive(),
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
  /**
   * Estado inicial (ADR-023). Ausente/`LEAD` cria Lead; `CLIENTE` cria Cliente
   * direto (tela de Clientes). O backend rejeita outros valores.
   */
  status: z.enum(STATUS_PESSOA).optional(),
})

export const updatePessoaSchema = createPessoaSchema.partial()

export type Pessoa = z.infer<typeof pessoaSchema>
export type CreatePessoa = z.infer<typeof createPessoaSchema>
export type UpdatePessoa = z.infer<typeof updatePessoaSchema>
export type TipoPessoa = (typeof TIPO_PESSOA)[number]
export type StatusPessoa = (typeof STATUS_PESSOA)[number]
export type SortPessoa = (typeof SORT_PESSOA)[number]

/**
 * Envelope de paginação padrão da API (ver ADR-022 no backend):
 * `{ content, limit, offset, total, hasNext }`.
 */
export const pessoaPageSchema = z.object({
  content: z.array(pessoaSchema),
  limit: z.number().int(),
  offset: z.number().int(),
  total: z.number().int(),
  hasNext: z.boolean(),
})

export type PessoaPage = z.infer<typeof pessoaPageSchema>

/** Parâmetros aceitos por `GET /api/v1/pessoas`. */
export interface PessoaListParams {
  status?: StatusPessoa
  q?: string
  tipoPessoa?: TipoPessoa
  cidade?: string
  uf?: string
  sort?: SortPessoa
  limit?: number
  offset?: number
}

/** Resposta do endpoint de dedup. */
export interface DedupResult {
  matchedByDocumento: Pessoa | null
  matchedSoft: Pessoa[]
}

/**
 * View "leve" retornada pelo endpoint /search · usada no Combobox async.
 * Não traz timestamps/endereco completo/notas — só o suficiente pra exibir
 * uma linha no autocomplete.
 */
export const pessoaSearchResultSchema = z.object({
  id: z.string().uuid(),
  nomeContato: z.string(),
  nomeEmpresa: z.string().nullable().optional(),
  tipoPessoa: z.enum(TIPO_PESSOA),
  documento: z.string().nullable().optional(),
  cidade: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
  status: z.enum(STATUS_PESSOA),
})

export type PessoaSearchResult = z.infer<typeof pessoaSearchResultSchema>

// ============================================================================
// Contatos da Pessoa (sócios/representante para PJ; parentes/cônjuge para PF).
// Ver ADR-023.
// ============================================================================

/** Relacionamentos válidos para Pessoa Jurídica. */
export const TIPO_RELACIONAMENTO_PJ = ['SOCIO', 'REPRESENTANTE_LEGAL'] as const
/** Relacionamentos válidos para Pessoa Física. */
export const TIPO_RELACIONAMENTO_PF = [
  'PARENTE',
  'PAI',
  'MAE',
  'FILHO',
  'FILHA',
  'CONJUGE',
  'OUTROS',
] as const

export const TIPO_RELACIONAMENTO = [
  ...TIPO_RELACIONAMENTO_PJ,
  ...TIPO_RELACIONAMENTO_PF,
] as const

export type TipoRelacionamento = (typeof TIPO_RELACIONAMENTO)[number]

/** Rótulos PT-BR para exibição. */
export const RELACIONAMENTO_LABEL: Record<TipoRelacionamento, string> = {
  SOCIO: 'Sócio',
  REPRESENTANTE_LEGAL: 'Representante Legal',
  PARENTE: 'Parente',
  PAI: 'Pai',
  MAE: 'Mãe',
  FILHO: 'Filho',
  FILHA: 'Filha',
  CONJUGE: 'Cônjuge',
  OUTROS: 'Outros',
}

/** Opções de relacionamento aplicáveis ao tipo da Pessoa dona. */
export function relacionamentosParaTipo(
  tipo: TipoPessoa,
): ReadonlyArray<TipoRelacionamento> {
  return tipo === 'PJ' ? TIPO_RELACIONAMENTO_PJ : TIPO_RELACIONAMENTO_PF
}

export const contatoSchema = z.object({
  id: z.string().uuid(),
  pessoaId: z.string().uuid(),
  nome: z.string().min(1).max(160),
  email: z.string().email().nullable().optional(),
  telefone: z.string().nullable().optional(),
  tipoRelacionamento: z.enum(TIPO_RELACIONAMENTO),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
})

export const createContatoSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório').max(160),
  email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
  telefone: z.string().max(20).optional().nullable(),
  tipoRelacionamento: z.enum(TIPO_RELACIONAMENTO, {
    errorMap: () => ({ message: 'Selecione o relacionamento' }),
  }),
})

export type Contato = z.infer<typeof contatoSchema>
export type CreateContato = z.infer<typeof createContatoSchema>
