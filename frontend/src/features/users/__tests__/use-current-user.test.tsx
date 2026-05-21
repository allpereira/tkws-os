import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw-server';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe('useCurrentUser', () => {
  it('deve retornar dados do usuário autenticado', async () => {
    const { result } = renderHook(() => useCurrentUser('test-access-token'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.email).toBe('test@tkws.local');
    expect(result.current.data?.fullName).toBe('Test User');
  });

  it('deve validar schema com Zod (falha se resposta inválida)', async () => {
    server.use(
      http.get('http://localhost:8080/api/v1/users/me', () => {
        return HttpResponse.json({ id: 'not-uuid', email: 'invalid' });
      })
    );

    const { result } = renderHook(() => useCurrentUser('test-access-token'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('não deve fazer fetch quando enabled=false', () => {
    const { result } = renderHook(() => useCurrentUser(null), { wrapper });
    expect(result.current.fetchStatus).toBe('idle');
  });
});
