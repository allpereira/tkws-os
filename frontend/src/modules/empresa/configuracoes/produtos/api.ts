import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateProduto, Produto, UpdateProduto } from './schema'

export const produtosApi = createCrudApi<Produto, CreateProduto, UpdateProduto>('/api/v1/empresa/produtos')

export const {
  keys: produtosKeys,
  useList: useProdutos,
  useFindById: useProdutoById,
  useCreate: useCreateProduto,
  useUpdate: useUpdateProduto,
  useRemove: useRemoveProduto,
} = createCrudHooks<Produto, CreateProduto, UpdateProduto>(['produtos'], produtosApi)
