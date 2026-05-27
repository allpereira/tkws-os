import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CreateTenantInput, Tenant } from './schema'

/** Funções puras de acesso ao backend de tenants. */
export const tenantsApi = {
  async create(input: CreateTenantInput): Promise<Tenant> {
    const { data } = await api.post<Tenant>('/api/v1/tenants', input)
    return data
  },

  async findById(id: number): Promise<Tenant> {
    const { data } = await api.get<Tenant>(`/api/v1/tenants/${id}`)
    return data
  },

  async findBySlug(slug: string): Promise<Tenant> {
    const { data } = await api.get<Tenant>(`/api/v1/tenants/by-slug/${slug}`)
    return data
  },
}

export const tenantKeys = {
  all: ['tenants'] as const,
  detail: (id: number) => ['tenants', 'detail', id] as const,
  bySlug: (slug: string) => ['tenants', 'by-slug', slug] as const,
}

export function useTenantBySlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: tenantKeys.bySlug(slug),
    queryFn: () => tenantsApi.findBySlug(slug),
    enabled: enabled && slug.length > 0,
  })
}

export function useTenantById(id: number, enabled = true) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => tenantsApi.findById(id),
    enabled: enabled && id > 0,
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTenantInput) => tenantsApi.create(input),
    onSuccess: (tenant) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all })
      queryClient.setQueryData(tenantKeys.detail(tenant.id), tenant)
      queryClient.setQueryData(tenantKeys.bySlug(tenant.slug), tenant)
    },
  })
}
