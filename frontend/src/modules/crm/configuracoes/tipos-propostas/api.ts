import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateTipoProposta, TipoProposta, UpdateTipoProposta } from './schema'

export const tiposPropostaApi = createCrudApi<TipoProposta, CreateTipoProposta, UpdateTipoProposta>(
  '/api/v1/crm/tipos-proposta',
)

export const {
  keys: tiposPropostaKeys,
  useList: useTiposProposta,
  useFindById: useTipoPropostaById,
  useCreate: useCreateTipoProposta,
  useUpdate: useUpdateTipoProposta,
  useRemove: useRemoveTipoProposta,
} = createCrudHooks<TipoProposta, CreateTipoProposta, UpdateTipoProposta>(
  ['tipos-proposta'],
  tiposPropostaApi,
)
