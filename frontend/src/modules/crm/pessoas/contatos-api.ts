import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Contato, CreateContato } from './schema'

/**
 * API dos Contatos de uma Pessoa (sócios/representante · parentes/cônjuge).
 * Aninhada sob a Pessoa dona. Multi-tenancy resolvido no backend (ADR-019).
 * Ver ADR-023.
 */

const base = (pessoaId: string) => `/api/v1/pessoas/${pessoaId}/contatos`

export const contatosApi = {
  async list(pessoaId: string): Promise<Contato[]> {
    const { data } = await api.get<Contato[]>(base(pessoaId))
    return data
  },
  async add(pessoaId: string, input: CreateContato): Promise<Contato> {
    const { data } = await api.post<Contato>(base(pessoaId), input)
    return data
  },
  async update(pessoaId: string, contatoId: string, input: CreateContato): Promise<Contato> {
    const { data } = await api.patch<Contato>(`${base(pessoaId)}/${contatoId}`, input)
    return data
  },
  async remove(pessoaId: string, contatoId: string): Promise<void> {
    await api.delete(`${base(pessoaId)}/${contatoId}`)
  },
}

export const contatosKeys = {
  all: ['contatos'] as const,
  list: (pessoaId: string) => [...contatosKeys.all, pessoaId] as const,
}

export function useContatos(pessoaId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: contatosKeys.list(pessoaId ?? ''),
    queryFn: () => contatosApi.list(pessoaId as string),
    enabled: enabled && !!pessoaId,
  })
}

export function useAddContato(pessoaId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateContato) => contatosApi.add(pessoaId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: contatosKeys.list(pessoaId) }),
  })
}

export function useUpdateContato(pessoaId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ contatoId, input }: { contatoId: string; input: CreateContato }) =>
      contatosApi.update(pessoaId, contatoId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: contatosKeys.list(pessoaId) }),
  })
}

export function useRemoveContato(pessoaId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (contatoId: string) => contatosApi.remove(pessoaId, contatoId),
    onSuccess: () => qc.invalidateQueries({ queryKey: contatosKeys.list(pessoaId) }),
  })
}
