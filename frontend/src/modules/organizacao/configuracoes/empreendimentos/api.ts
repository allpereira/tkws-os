import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateEmpreendimento, Empreendimento, UpdateEmpreendimento } from './schema'

export const empreendimentosApi = createCrudApi<Empreendimento, CreateEmpreendimento, UpdateEmpreendimento>(
  '/api/v1/organizacao/empreendimentos',
)

export const {
  keys: empreendimentosKeys,
  useList: useEmpreendimentos,
  useFindById: useEmpreendimentoById,
  useCreate: useCreateEmpreendimento,
  useUpdate: useUpdateEmpreendimento,
  useRemove: useRemoveEmpreendimento,
} = createCrudHooks<Empreendimento, CreateEmpreendimento, UpdateEmpreendimento>(
  ['empreendimentos'],
  empreendimentosApi,
)
