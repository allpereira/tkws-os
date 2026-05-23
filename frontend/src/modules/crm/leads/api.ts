import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateLead, Lead, UpdateLead } from './schema'

export const leadsApi = createCrudApi<Lead, CreateLead, UpdateLead>('/api/v1/crm/leads')

export const {
  keys: leadsKeys,
  useList: useLeads,
  useFindById: useLeadById,
  useCreate: useCreateLead,
  useUpdate: useUpdateLead,
  useRemove: useRemoveLead,
} = createCrudHooks<Lead, CreateLead, UpdateLead>(['leads'], leadsApi)
