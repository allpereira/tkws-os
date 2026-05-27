import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw-server';
import { useCreateTenant, useTenantBySlug } from '@/modules/plataforma/tenants/api';
import { ReactNode } from 'react';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useTenants — hooks (integration via MSW)', () => {
  describe('useCreateTenant', () => {
    it('deve criar tenant e retornar dados', async () => {
      const { result } = renderHook(() => useCreateTenant(), { wrapper: createWrapper() });

      result.current.mutate({
        zitadelOrgId: 'zitadel-org-test',
        name: 'Studio Test',
        slug: 'studio-test',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.slug).toBe('studio-test');
      expect(result.current.data?.name).toBe('Studio Test');
      expect(result.current.data?.id).toBeDefined();
    });

    it('deve expor erro quando a API falhar', async () => {
      server.use(
        http.post('http://localhost:8080/api/v1/tenants', () => {
          return HttpResponse.json(
            { title: 'TENANT_SLUG_ALREADY_TAKEN' },
            { status: 422 }
          );
        })
      );

      const { result } = renderHook(() => useCreateTenant(), { wrapper: createWrapper() });

      result.current.mutate({
        zitadelOrgId: 'x',
        name: 'X',
        slug: 'duplicado',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  describe('useTenantBySlug', () => {
    it('deve buscar tenant por slug', async () => {
      const { result } = renderHook(() => useTenantBySlug('studio-x'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.slug).toBe('studio-x');
    });

    it('deve ficar disabled quando slug vazio', () => {
      const { result } = renderHook(() => useTenantBySlug(''), {
        wrapper: createWrapper(),
      });
      expect(result.current.fetchStatus).toBe('idle');
    });
  });
});
