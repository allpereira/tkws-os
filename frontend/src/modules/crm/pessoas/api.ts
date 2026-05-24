import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CreatePessoa, DedupResult, Pessoa, StatusPessoa, UpdatePessoa } from './schema'

/**
 * API de Pessoas · cadastro único Lead/Cliente.
 *
 * Multi-tenancy é resolvido no backend via JWT (ver ADR-019). O frontend
 * não envia `tenantId` em query/body.
 */

const BASE = '/api/v1/pessoas'

export const pessoasApi = {
  async list(params?: { status?: StatusPessoa; limit?: number; offset?: number }): Promise<Pessoa[]> {
    const { data } = await api.get<Pessoa[]>(BASE, { params })
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
}

export function usePessoas(status?: StatusPessoa) {
  return useQuery({
    queryKey: pessoasKeys.list({ status }),
    queryFn: () => pessoasApi.list({ status }),
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
