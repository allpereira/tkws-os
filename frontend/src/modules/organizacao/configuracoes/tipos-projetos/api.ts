import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateTipoProjeto, TipoProjeto, UpdateTipoProjeto } from './schema'

export const tiposProjetoApi = createCrudApi<TipoProjeto, CreateTipoProjeto, UpdateTipoProjeto>(
  '/api/v1/organizacao/tipos-projeto',
)

export const {
  keys: tiposProjetoKeys,
  useList: useTiposProjeto,
  useFindById: useTipoProjetoById,
  useCreate: useCreateTipoProjeto,
  useUpdate: useUpdateTipoProjeto,
  useRemove: useRemoveTipoProjeto,
} = createCrudHooks<TipoProjeto, CreateTipoProjeto, UpdateTipoProjeto>(['tipos-projeto'], tiposProjetoApi)
