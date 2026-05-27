import { describe, expect, it } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { ReactNode } from 'react'
import { server } from '@/test/msw-server'
import { useCreateInvite, useInvites, useResendInvite, useRevokeInvite } from '../api'

const BASE = 'http://localhost:8080/api/v1/invites'

function wrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )
}

const pendingItem = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'a@b.com',
  fullName: 'A B',
  role: 'default',
  status: 'PENDING',
  expiresAt: '2026-06-01T12:00:00Z',
  createdAt: '2026-05-25T12:00:00Z',
  acceptedAt: null,
  revokedAt: null,
}

describe('invites api hooks (MSW)', () => {
  it('useInvites lista o envelope paginado', async () => {
    server.use(
      http.get(BASE, () =>
        HttpResponse.json({ content: [pendingItem], limit: 50, offset: 0, total: 1, hasNext: false }),
      ),
    )
    const { result } = renderHook(() => useInvites(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.content[0].email).toBe('a@b.com')
  })

  it('useCreateInvite envia convite e retorna o token claro', async () => {
    server.use(
      http.post(BASE, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(
          {
            id: '22222222-2222-2222-2222-222222222222',
            tenantId: 1,
            email: body.email,
            fullName: body.fullName ?? null,
            role: body.role,
            status: 'PENDING',
            expiresAt: '2026-06-01T12:00:00Z',
            createdAt: '2026-05-25T12:00:00Z',
            rawToken: 'tok-123',
          },
          { status: 201 },
        )
      }),
    )
    const { result } = renderHook(() => useCreateInvite(), { wrapper: wrapper() })
    result.current.mutate({ email: 'nova@x.com', role: 'comercial_proposta' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.rawToken).toBe('tok-123')
    expect(result.current.data?.email).toBe('nova@x.com')
  })

  it('useCreateInvite expõe erro 409 (convite duplicado)', async () => {
    server.use(
      http.post(BASE, () => HttpResponse.json({ title: 'invites.duplicate' }, { status: 409 })),
    )
    const { result } = renderHook(() => useCreateInvite(), { wrapper: wrapper() })
    result.current.mutate({ email: 'dup@x.com', role: 'default' })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('useRevokeInvite cancela o convite', async () => {
    server.use(
      http.post(`${BASE}/:id/revoke`, () =>
        HttpResponse.json({ ...pendingItem, status: 'REVOKED', revokedAt: '2026-05-26T12:00:00Z' }),
      ),
    )
    const { result } = renderHook(() => useRevokeInvite(), { wrapper: wrapper() })
    result.current.mutate(pendingItem.id)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe('REVOKED')
  })

  it('useResendInvite reenvia o convite', async () => {
    server.use(http.post(`${BASE}/:id/resend`, () => HttpResponse.json(pendingItem)))
    const { result } = renderHook(() => useResendInvite(), { wrapper: wrapper() })
    result.current.mutate(pendingItem.id)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe('PENDING')
  })
})
