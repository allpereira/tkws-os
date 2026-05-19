import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:8080';

/**
 * Handlers padrão dos testes. Cada teste pode sobrescrever com server.use().
 *
 * Convenção: o handler reflete o contrato real da API. Se a API mudar, mude aqui.
 */
export const handlers = [
  // ============ Users ============
  http.get(`${API_URL}/api/v1/users/me`, () => {
    return HttpResponse.json({
      id: '00000000-0000-0000-0000-000000000001',
      email: 'test@tkws.local',
      fullName: 'Test User',
      avatarUrl: 'https://example.com/avatar.png',
      tenantId: null,
      active: true,
      lastLoginAt: '2025-05-17T12:00:00Z',
    });
  }),

  // ============ Tenants ============
  http.post(`${API_URL}/api/v1/tenants`, async ({ request }) => {
    const body = (await request.json()) as {
      zitadelOrgId: string;
      name: string;
      slug: string;
    };
    return HttpResponse.json(
      {
        id: '00000000-0000-0000-0000-000000000010',
        zitadelOrgId: body.zitadelOrgId,
        name: body.name,
        slug: body.slug,
        active: true,
        createdAt: '2025-05-17T12:00:00Z',
        updatedAt: '2025-05-17T12:00:00Z',
      },
      { status: 201 }
    );
  }),

  http.get(`${API_URL}/api/v1/tenants/by-slug/:slug`, ({ params }) => {
    return HttpResponse.json({
      id: '00000000-0000-0000-0000-000000000020',
      zitadelOrgId: 'zitadel-org-x',
      name: 'Studio Test',
      slug: params.slug,
      active: true,
      createdAt: '2025-05-17T12:00:00Z',
      updatedAt: '2025-05-17T12:00:00Z',
    });
  }),
];
