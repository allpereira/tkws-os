import axios, { AxiosError } from 'axios'
import { User } from 'oidc-client-ts'
import { ZITADEL_AUTHORITY, ZITADEL_CLIENT_ID } from '@/modules/plataforma/auth/oidc-config'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function getStoredUser(): User | null {
  try {
    const key = `oidc.user:${ZITADEL_AUTHORITY}:${ZITADEL_CLIENT_ID}`
    const stored = typeof window !== 'undefined' ? window.localStorage?.getItem(key) : null
    return stored ? User.fromStorageString(stored) : null
  } catch {
    return null
  }
}

/**
 * Cliente HTTP centralizado · axios + interceptor de Bearer token.
 *
 * Não redireciona em 401 · isso causa loop infinito quando o token está expirado.
 * Route components tratam 401 mostrando erro + retry/re-auth manual.
 */
export const api = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
})

api.interceptors.request.use((config) => {
  const user = getStoredUser()
  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`
  }
  return config
})

/**
 * Erros do backend chegam como RFC 7807 problem+json (`{ detail, title, … }`)
 * ou erro padrão do Spring (`{ message }`). Por padrão o Axios só expõe o
 * genérico "Request failed with status code 4xx" em `error.message`. Aqui
 * promovemos a mensagem legível do backend para `error.message`, de modo que
 * qualquer consumidor (mutations, `parseApiError`, Alerts) exiba algo claro
 * ao usuário — não o texto técnico do Axios.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const data = error.response?.data as Record<string, unknown> | undefined
    const backendMessage = (['detail', 'message', 'error'] as const)
      .map((k) => (typeof data?.[k] === 'string' ? (data[k] as string).trim() : ''))
      .find((s) => s.length > 0)
    if (backendMessage) error.message = backendMessage
    return Promise.reject(error)
  },
)

// ============================================================================
// HELPER · CRUD pattern reusable por feature
// ============================================================================

/**
 * Cria um conjunto de hooks CRUD baseado em uma URL · usado nas features simples.
 *
 * Uso:
 *   const tiposPropostaApi = createCrudApi<TipoProposta, CreateTipoProposta>('/api/v1/crm/tipos-proposta')
 */
/**
 * Resposta de listagem do backend · pode vir como array cru (legado) ou como
 * envelope paginado `PageResponse<T>` (ADR-022). `unwrapList` normaliza para `T[]`,
 * mantendo os consumidores simples — a maioria das telas de CRUD/config não pagina
 * de fato: pede um `limit` alto e usa todos os itens.
 */
function unwrapList<T>(data: T[] | { content: T[] }): T[] {
  return Array.isArray(data) ? data : (data?.content ?? [])
}

export function createCrudApi<T, CreateInput, UpdateInput = Partial<CreateInput>>(basePath: string) {
  return {
    async list(params?: Record<string, string | number | boolean>): Promise<T[]> {
      const { data } = await api.get<T[] | { content: T[] }>(basePath, {
        params: { limit: 100, ...params },
      })
      return unwrapList(data)
    },
    async findById(id: string): Promise<T> {
      const { data } = await api.get<T>(`${basePath}/${id}`)
      return data
    },
    async create(input: CreateInput): Promise<T> {
      const { data } = await api.post<T>(basePath, input)
      return data
    },
    async update(id: string, input: UpdateInput): Promise<T> {
      const { data } = await api.patch<T>(`${basePath}/${id}`, input)
      return data
    },
    async remove(id: string): Promise<void> {
      await api.delete(`${basePath}/${id}`)
    },
  }
}
