import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { Cliente, CreateCliente, UpdateCliente } from './schema'

export const clientesApi = createCrudApi<Cliente, CreateCliente, UpdateCliente>('/api/v1/crm/clientes')

export const {
  keys: clientesKeys,
  useList: useClientes,
  useFindById: useClienteById,
  useCreate: useCreateCliente,
  useUpdate: useUpdateCliente,
  useRemove: useRemoveCliente,
} = createCrudHooks<Cliente, CreateCliente, UpdateCliente>(['clientes'], clientesApi)
