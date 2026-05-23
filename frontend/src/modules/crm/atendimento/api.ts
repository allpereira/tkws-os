import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateOportunidade, Oportunidade, UpdateOportunidade } from './schema'

export const oportunidadesApi = createCrudApi<Oportunidade, CreateOportunidade, UpdateOportunidade>(
  '/api/v1/crm/oportunidades',
)

export const {
  keys: oportunidadesKeys,
  useList: useOportunidadesRaw,
  useFindById: useOportunidadeById,
  useCreate: useCreateOportunidade,
  useUpdate: useUpdateOportunidade,
  useRemove: useRemoveOportunidade,
} = createCrudHooks<Oportunidade, CreateOportunidade, UpdateOportunidade>(
  ['oportunidades'],
  oportunidadesApi,
)

/**
 * Hook filtrado por pipeline · usado pelas telas de Atendimento e Proposta.
 * Backend recebe ?pipelineId=... e retorna apenas as oportunidades daquele pipeline.
 */
export function useOportunidadesByPipeline(pipelineId: string | undefined) {
  return useQuery({
    queryKey: [...oportunidadesKeys.all, 'by-pipeline', pipelineId] as const,
    queryFn: () => oportunidadesApi.list({ pipelineId: pipelineId! }),
    enabled: !!pipelineId,
  })
}

/**
 * Move uma oportunidade para outra etapa (drag-and-drop).
 * Tem mutation otimista local · invalida o cache no sucesso.
 */
export function useMoveOportunidade() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, etapaId }: { id: string; etapaId: string }) => {
      const { data } = await api.patch<Oportunidade>(`/api/v1/crm/oportunidades/${id}/etapa`, { etapaId })
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: oportunidadesKeys.all })
    },
  })
}
