import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ZitadelApiError } from '@/shared/lib/zitadel-client';

describe('ZitadelApiError', () => {
  it('carrega status e mensagem corretamente', () => {
    const err = new ZitadelApiError(401, 'Unauthorized', 'AUTH_ERR');
    expect(err.status).toBe(401);
    expect(err.message).toBe('Unauthorized');
    expect(err.code).toBe('AUTH_ERR');
    expect(err.name).toBe('ZitadelApiError');
  });

  it('é instância de Error', () => {
    const err = new ZitadelApiError(500, 'Server error');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ZitadelApiError);
  });
});

describe('createSession (integração mock)', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retorna sessionId e sessionToken em caso de sucesso', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        sessionId: 'sess-001',
        sessionToken: 'tok-abc',
      }),
    });

    const { createSession } = await import('@/shared/lib/zitadel-client');
    const result = await createSession('user@tkws.com');

    expect(result.sessionId).toBe('sess-001');
    expect(result.sessionToken).toBe('tok-abc');
    expect(result.challenges).toEqual([]);
  });

  it('lança ZitadelApiError em resposta 401', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'invalid credentials' }),
    });

    const { createSession } = await import('@/shared/lib/zitadel-client');
    await expect(createSession('wrong@tkws.com')).rejects.toThrow(ZitadelApiError);
  });

  it('mapeia desafio TOTP nos challenges retornados', async () => {
    // Primeiro call: createSession (cria sessão)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sessionId: 'sess-002', sessionToken: 'tok-002' }),
    });
    // Segundo call: checkPassword (verifica senha com MFA pendente)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        sessionId: 'sess-002',
        sessionToken: 'tok-002',
        challenges: { totp: true },
      }),
    });

    const { createSession, checkPassword } = await import('@/shared/lib/zitadel-client');
    const session = await createSession('mfa@tkws.com');
    const verified = await checkPassword(session.sessionId, session.sessionToken, 'senha');

    expect(verified.challenges).toContain('TOTP');
  });
});
