import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateTipoEmpresa, TipoEmpresa, UpdateTipoEmpresa } from './schema'

export const tiposEmpresaApi = createCrudApi<TipoEmpresa, CreateTipoEmpresa, UpdateTipoEmpresa>(
  '/api/v1/organizacao/tipos-empresa',
)

export const {
  keys: tiposEmpresaKeys,
  useList: useTiposEmpresa,
  useFindById: useTipoEmpresaById,
  useCreate: useCreateTipoEmpresa,
  useUpdate: useUpdateTipoEmpresa,
  useRemove: useRemoveTipoEmpresa,
} = createCrudHooks<TipoEmpresa, CreateTipoEmpresa, UpdateTipoEmpresa>(
  ['tipos-empresa'],
  tiposEmpresaApi,
)
