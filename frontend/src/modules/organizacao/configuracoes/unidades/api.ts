import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateUnidade, Unidade, UpdateUnidade } from './schema'

export const unidadesApi = createCrudApi<Unidade, CreateUnidade, UpdateUnidade>(
  '/api/v1/organizacao/unidades',
)

export const {
  keys: unidadesKeys,
  useList: useUnidades,
  useFindById: useUnidadeById,
  useCreate: useCreateUnidade,
  useUpdate: useUpdateUnidade,
  useRemove: useRemoveUnidade,
} = createCrudHooks<Unidade, CreateUnidade, UpdateUnidade>(['unidades'], unidadesApi)
