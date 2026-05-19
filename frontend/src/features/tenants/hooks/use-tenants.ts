import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tenantsApi } from '@/features/tenants/api/tenants-api';
import type { CreateTenantInput } from '@/features/tenants/types/tenant';

export const tenantKeys = {
  all: ['tenants'] as const,
  detail: (id: string) => ['tenants', 'detail', id] as const,
  bySlug: (slug: string) => ['tenants', 'by-slug', slug] as const,
};

export function useTenantBySlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: tenantKeys.bySlug(slug),
    queryFn: () => tenantsApi.findBySlug(slug),
    enabled: enabled && slug.length > 0,
  });
}

export function useTenantById(id: string, enabled = true) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => tenantsApi.findById(id),
    enabled: enabled && id.length > 0,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTenantInput) => tenantsApi.create(input),
    onSuccess: (tenant) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      queryClient.setQueryData(tenantKeys.detail(tenant.id), tenant);
      queryClient.setQueryData(tenantKeys.bySlug(tenant.slug), tenant);
    },
  });
}
