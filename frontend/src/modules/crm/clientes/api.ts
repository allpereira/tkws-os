/**
 * @deprecated · Clientes agora são `Pessoa` com status=CLIENTE.
 * Use `@/modules/crm/pessoas/api` diretamente em código novo.
 *
 * Proxia para `pessoas` filtrando por status=CLIENTE durante a migração.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  pessoasApi,
  pessoasKeys,
  usePessoaById,
  useCreatePessoa,
  useUpdatePessoa,
} from '@/modules/crm/pessoas/api'

export const clientesApi = pessoasApi
export const clientesKeys = pessoasKeys

export function useClientes() {
  return useQuery({
    queryKey: pessoasKeys.list({ status: 'CLIENTE' }),
    queryFn: () => pessoasApi.list({ status: 'CLIENTE' }),
  })
}

export const useClienteById = usePessoaById
export const useCreateCliente = useCreatePessoa
export const useUpdateCliente = useUpdatePessoa

export function useRemoveCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (_id: string): Promise<void> => {
      throw new Error('Cliente não pode ser excluído. Marque como inativo se necessário.')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: pessoasKeys.all }),
  })
}
