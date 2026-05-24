import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateOferta, Oferta, UpdateOferta } from './schema'

export const ofertasApi = createCrudApi<Oferta, CreateOferta, UpdateOferta>('/api/v1/organizacao/ofertas')

export const {
  keys: ofertasKeys,
  useList: useOfertas,
  useFindById: useOfertaById,
  useCreate: useCreateOferta,
  useUpdate: useUpdateOferta,
  useRemove: useRemoveOferta,
} = createCrudHooks<Oferta, CreateOferta, UpdateOferta>(['ofertas'], ofertasApi)
