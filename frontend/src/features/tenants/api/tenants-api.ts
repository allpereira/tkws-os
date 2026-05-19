import { api } from '@/shared/api/client';
import type { Tenant, CreateTenantInput } from '@/features/tenants/types/tenant';

export const tenantsApi = {
  async create(input: CreateTenantInput): Promise<Tenant> {
    const { data } = await api.post<Tenant>('/api/v1/tenants', input);
    return data;
  },

  async findById(id: string): Promise<Tenant> {
    const { data } = await api.get<Tenant>(`/api/v1/tenants/${id}`);
    return data;
  },

  async findBySlug(slug: string): Promise<Tenant> {
    const { data } = await api.get<Tenant>(`/api/v1/tenants/by-slug/${slug}`);
    return data;
  },
};
