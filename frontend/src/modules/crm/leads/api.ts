/**
 * @deprecated · Leads agora são `Pessoa` com status=LEAD.
 * Use `@/modules/crm/pessoas/api` diretamente em código novo.
 *
 * Este arquivo proxia o módulo `pessoas` filtrando por status=LEAD para
 * retro-compat com consumers antigos durante a migração. Será removido
 * quando a tela `leads-page` for finalmente migrada.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  pessoasApi,
  pessoasKeys,
  usePessoaById,
  useCreatePessoa,
  useUpdatePessoa,
} from '@/modules/crm/pessoas/api'

export const leadsApi = pessoasApi
export const leadsKeys = pessoasKeys

export function useLeads() {
  return useQuery({
    queryKey: pessoasKeys.list({ status: 'LEAD' }),
    queryFn: () => pessoasApi.list({ status: 'LEAD' }),
  })
}

export const useLeadById = usePessoaById
export const useCreateLead = useCreatePessoa
export const useUpdateLead = useUpdatePessoa

/**
 * Lead não tem mais delete dedicado · o backend não expõe esse endpoint
 * (Pessoas são preservadas para histórico). Marcamos como inativos via
 * update ou convertemos.
 */
export function useRemoveLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (_id: string): Promise<void> => {
      throw new Error('Lead não pode ser excluído. Marque como inativo ou converta para cliente.')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: pessoasKeys.all }),
  })
}
