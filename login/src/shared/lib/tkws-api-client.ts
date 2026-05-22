/**
 * Cliente HTTP da API TKWS (Spring Boot em :8080).
 *
 * Separado do `zitadel-client.ts` porque chama nossa API de domínio (convites,
 * usuários, tenants) — sem PAT, sem proxy injetando Bearer.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export class TkwsApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'TkwsApiError';
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  });
  const text = await res.text();
  const body = text ? safeParseJson(text) : null;
  if (!res.ok) {
    const msg =
      (body as { detail?: string; message?: string } | null)?.detail ??
      (body as { message?: string } | null)?.message ??
      `Request failed with status ${res.status}`;
    throw new TkwsApiError(res.status, msg, (body as { title?: string } | null)?.title);
  }
  return body as T;
}

function safeParseJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}

// ---------------------------------------------------------------------------
// Invites
// ---------------------------------------------------------------------------

export interface InviteTokenInfo {
  valid: boolean;
  /** undefined quando valid=true; senão 'expired' | 'revoked' | 'accepted' | 'not_found' */
  reason?: string;
  email?: string;
  fullName?: string;
  role?: string;
  tenantName?: string;
}

export interface AcceptInvitePayload {
  token: string;
  fullName: string;
  password: string;
}

/** Lookup público do invite pelo token. Sempre 200 — usar `valid` pra decidir. */
export async function getInviteByToken(token: string): Promise<InviteTokenInfo> {
  return apiFetch<InviteTokenInfo>(
    `/api/v1/invites/by-token?token=${encodeURIComponent(token)}`,
  );
}

/** Consome o token, define senha + nome, ativa o user. */
export async function acceptInvite(p: AcceptInvitePayload): Promise<InviteTokenInfo> {
  return apiFetch<InviteTokenInfo>('/api/v1/invites/accept', {
    method: 'POST',
    body: JSON.stringify(p),
  });
}
