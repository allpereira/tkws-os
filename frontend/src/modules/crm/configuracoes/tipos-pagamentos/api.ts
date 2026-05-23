import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateTipoPagamento, TipoPagamento, UpdateTipoPagamento } from './schema'

export const tiposPagamentoApi = createCrudApi<TipoPagamento, CreateTipoPagamento, UpdateTipoPagamento>(
  '/api/v1/crm/tipos-pagamento',
)

export const {
  keys: tiposPagamentoKeys,
  useList: useTiposPagamento,
  useFindById: useTipoPagamentoById,
  useCreate: useCreateTipoPagamento,
  useUpdate: useUpdateTipoPagamento,
  useRemove: useRemoveTipoPagamento,
} = createCrudHooks<TipoPagamento, CreateTipoPagamento, UpdateTipoPagamento>(
  ['tipos-pagamento'],
  tiposPagamentoApi,
)
