import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  CreatePessoa,
  DedupResult,
  Pessoa,
  PessoaListParams,
  PessoaPage,
  PessoaSearchResult,
  StatusPessoa,
  UpdatePessoa,
} from './schema'

/**
 * API de Pessoas · cadastro único Lead/Cliente.
 *
 * Multi-tenancy é resolvido no backend via JWT (ver ADR-019). O frontend
 * não envia `tenantId` em query/body.
 */

const BASE = '/api/v1/pessoas'

export const pessoasApi = {
  /**
   * Listagem paginada (envelope `{ content, limit, offset, total, hasNext }`).
   * Filtros opcionais: status, q (busca textual), tipoPessoa, cidade, uf, sort.
   * O backend limita `limit` a 100 (ver ADR-022).
   */
  async list(params?: PessoaListParams): Promise<PessoaPage> {
    const { data } = await api.get<PessoaPage>(BASE, { params })
    return data
  },
  async findById(id: string): Promise<Pessoa> {
    const { data } = await api.get<Pessoa>(`${BASE}/${id}`)
    return data
  },
  async buscar(params: {
    tipoPessoa?: 'PF' | 'PJ'
    documento?: string
    email?: string
    celular?: string
  }): Promise<DedupResult> {
    const { data } = await api.get<DedupResult>(`${BASE}/buscar`, { params })
    return data
  },
  /**
   * Autocomplete usado pelo Combobox async. Aceita `signal` do AbortController
   * pra cancelar request obsoleto quando o termo muda.
   */
  async search(
    query: string,
    limit = 10,
    signal?: AbortSignal,
    status?: StatusPessoa,
  ): Promise<PessoaSearchResult[]> {
    const { data } = await api.get<PessoaSearchResult[]>(`${BASE}/search`, {
      params: { q: query, limit, ...(status ? { status } : {}) },
      signal,
    })
    return data
  },
  async create(input: CreatePessoa): Promise<Pessoa> {
    const { data } = await api.post<Pessoa>(BASE, input)
    return data
  },
  async update(id: string, input: UpdatePessoa): Promise<Pessoa> {
    const { data } = await api.patch<Pessoa>(`${BASE}/${id}`, input)
    return data
  },
  async converter(id: string): Promise<Pessoa> {
    const { data } = await api.post<Pessoa>(`${BASE}/${id}/converter`)
    return data
  },
}

// ============ Hooks TanStack Query ============

export const pessoasKeys = {
  all: ['pessoas'] as const,
  list: (params?: object) => [...pessoasKeys.all, 'list', params ?? {}] as const,
  detail: (id: string) => [...pessoasKeys.all, 'detail', id] as const,
  search: (q: string, status?: StatusPessoa) =>
    [...pessoasKeys.all, 'search', q, status ?? 'all'] as const,
}

/**
 * Autocomplete · usado pelo Combobox async. TanStack Query já cuida de:
 *  - cancelar request obsoleto via AbortSignal (passamos pro axios)
 *  - cachear por queryKey (incluindo o termo) — 30s stale
 *  - deduplicar requests concorrentes pra mesma key
 *
 * O caller já debouncia o termo · este hook só dispara quando `enabled` for
 * verdadeiro (= termo com no mínimo 2 chars).
 */
export function usePessoaSearch(query: string, enabled: boolean, status?: StatusPessoa) {
  return useQuery({
    queryKey: pessoasKeys.search(query, status),
    queryFn: ({ signal }) => pessoasApi.search(query, 10, signal, status),
    enabled: enabled && query.length >= 2,
    staleTime: 30_000,
  })
}

/**
 * Listagem "achatada" · retorna `Pessoa[]` (a primeira página). Mantida para
 * os consumidores que só precisam de um lookup de pessoas (combobox/kanban de
 * Atendimento). Para a listagem com filtros/paginação, use {@link usePessoasPage}.
 */
export function usePessoas(status?: StatusPessoa) {
  return useQuery({
    queryKey: pessoasKeys.list({ status }),
    queryFn: () => pessoasApi.list({ status }),
    select: (page) => page.content,
  })
}

/**
 * Listagem paginada com filtros · usada pelas telas Leads e Clientes.
 * Mantém a página anterior visível enquanto a próxima carrega
 * (`keepPreviousData`) para não "piscar" ao paginar/filtrar.
 */
export function usePessoasPage(params: PessoaListParams) {
  return useQuery({
    queryKey: pessoasKeys.list(params),
    queryFn: () => pessoasApi.list(params),
    placeholderData: keepPreviousData,
  })
}

export function usePessoaById(id: string, enabled = true) {
  return useQuery({
    queryKey: pessoasKeys.detail(id),
    queryFn: () => pessoasApi.findById(id),
    enabled: enabled && !!id,
  })
}

export function useCreatePessoa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatePessoa) => pessoasApi.create(input),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: pessoasKeys.all })
      qc.setQueryData(pessoasKeys.detail(created.id), created)
    },
  })
}

export function useUpdatePessoa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePessoa }) => pessoasApi.update(id, input),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: pessoasKeys.all })
      qc.setQueryData(pessoasKeys.detail(updated.id), updated)
    },
  })
}

export function useConverterPessoa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => pessoasApi.converter(id),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: pessoasKeys.all })
      qc.setQueryData(pessoasKeys.detail(updated.id), updated)
    },
  })
}
