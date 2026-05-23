import axios, { AxiosError } from 'axios'
import { User } from 'oidc-client-ts'
import { ZITADEL_AUTHORITY, ZITADEL_CLIENT_ID } from '@/modules/plataforma/auth/api/oidc-config'

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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error),
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
export function createCrudApi<T, CreateInput, UpdateInput = Partial<CreateInput>>(basePath: string) {
  return {
    async list(params?: Record<string, string | number | boolean>): Promise<T[]> {
      const { data } = await api.get<T[]>(basePath, { params })
      return data
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
