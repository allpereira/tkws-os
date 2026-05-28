import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateOrigemNegocio, OrigemNegocio, UpdateOrigemNegocio } from './schema'

export const origensNegocioApi = createCrudApi<OrigemNegocio, CreateOrigemNegocio, UpdateOrigemNegocio>(
  '/api/v1/crm/origens-negocio',
)

export const {
  keys: origensNegocioKeys,
  useList: useOrigensNegocio,
  useFindById: useOrigemNegocioById,
  useCreate: useCreateOrigemNegocio,
  useUpdate: useUpdateOrigemNegocio,
  useRemove: useRemoveOrigemNegocio,
} = createCrudHooks<OrigemNegocio, CreateOrigemNegocio, UpdateOrigemNegocio>(
  ['origens-negocio'],
  origensNegocioApi,
)
