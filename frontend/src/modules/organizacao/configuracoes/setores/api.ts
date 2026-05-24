import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateSetor, Setor, UpdateSetor } from './schema'

export const setoresApi = createCrudApi<Setor, CreateSetor, UpdateSetor>('/api/v1/organizacao/setores')

export const {
  keys: setoresKeys,
  useList: useSetores,
  useFindById: useSetorById,
  useCreate: useCreateSetor,
  useUpdate: useUpdateSetor,
  useRemove: useRemoveSetor,
} = createCrudHooks<Setor, CreateSetor, UpdateSetor>(['setores'], setoresApi)
