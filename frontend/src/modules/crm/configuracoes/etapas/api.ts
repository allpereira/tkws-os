import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateEtapa, Etapa, UpdateEtapa } from './schema'

export const etapasApi = createCrudApi<Etapa, CreateEtapa, UpdateEtapa>('/api/v1/crm/etapas')

export const {
  keys: etapasKeys,
  useList: useEtapas,
  useFindById: useEtapaById,
  useCreate: useCreateEtapa,
  useUpdate: useUpdateEtapa,
  useRemove: useRemoveEtapa,
} = createCrudHooks<Etapa, CreateEtapa, UpdateEtapa>(['etapas'], etapasApi)
