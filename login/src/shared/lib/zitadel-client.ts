/**
 * Zitadel Session API v2 client
 *
 * Documentação: https://zitadel.com/docs/apis/resources/session_service_v2
 *
 * Fluxo do Custom Login:
 *  1. Zitadel redireciona para esta app com ?authRequestId=<id>
 *  2. Criamos uma sessão com o loginName do usuário
 *  3. Verificamos a senha (PATCH /sessions/{id})
 *  4. Se houver desafio MFA, verificamos o TOTP (PATCH /sessions/{id})
 *  5. Criamos o callback OIDC → obtemos a callbackUrl
 *  6. Redirecionamos o browser para a callbackUrl
 */

// Base same-origin para que o Vite dev proxy (ou o gateway em prod) injete o
// Bearer do login-client PAT antes de bater no Zitadel. Não use a URL direta
// do Zitadel aqui — a Session API exige IAM_LOGIN_CLIENT e o navegador não
// pode segurar PAT. Sobrescreva via VITE_ZITADEL_API_BASE só se você tiver
// outro gateway autenticando por você.
const BASE_URL = import.meta.env.VITE_ZITADEL_API_BASE ?? '/zitadel-api';

// ---------------------------------------------------------------------------
// Tipos da API
// ---------------------------------------------------------------------------

export type SessionChallenge =
  | 'PASSWORD'
  | 'TOTP'
  | 'EMAIL_OTP'
  | 'SMS_OTP'
  | 'WEB_AUTH_N';

export interface ZitadelSession {
  sessionId: string;
  sessionToken: string;
  /** Desafios adicionais exigidos após o step de usuário */
  challenges: SessionChallenge[];
}

export interface AuthRequestInfo {
  authRequestId: string;
  clientId?: string;
  redirectUri?: string;
  loginName?: string;
  prompt?: string[];
}

export interface CallbackResult {
  callbackUrl: string;
}

// ---------------------------------------------------------------------------
// Erros tipados
// ---------------------------------------------------------------------------

export class ZitadelApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ZitadelApiError';
  }
}

// ---------------------------------------------------------------------------
// Helper de fetch
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message: string =
      (body as { message?: string }).message ??
      `Request failed with status ${res.status}`;
    const code: string | undefined = (body as { code?: string }).code;
    throw new ZitadelApiError(res.status, message, code);
  }

  return body as T;
}

// ---------------------------------------------------------------------------
// Auth Request
// ---------------------------------------------------------------------------

/**
 * Retorna as informações do OIDC auth request iniciado pelo Zitadel.
 * Usado para pré-preencher o loginName quando disponível.
 */
export async function getAuthRequest(authRequestId: string): Promise<AuthRequestInfo> {
  const data = await apiFetch<{
    authRequest: {
      id: string;
      clientId?: string;
      redirectUri?: string;
      loginName?: string;
      prompt?: string[];
    };
  }>(`/v2/oidc/auth_requests/${authRequestId}`);

  return {
    authRequestId: data.authRequest.id,
    clientId: data.authRequest.clientId,
    redirectUri: data.authRequest.redirectUri,
    loginName: data.authRequest.loginName,
    prompt: data.authRequest.prompt,
  };
}

// ---------------------------------------------------------------------------
// Session — criação e verificações
// ---------------------------------------------------------------------------

/**
 * Cria uma sessão identificando o usuário pelo loginName.
 * Esta chamada NÃO autentica — apenas resolve o usuário.
 */
export async function createSession(loginName: string): Promise<ZitadelSession> {
  const data = await apiFetch<{
    sessionId: string;
    sessionToken: string;
    details?: {
      factors?: {
        intent?: unknown;
        password?: { verifiedAt?: string };
        totp?: { verifiedAt?: string };
      };
      authFactors?: SessionChallenge[];
    };
  }>('/v2/sessions', {
    method: 'POST',
    body: JSON.stringify({
      checks: {
        user: { loginName },
      },
    }),
  });

  return {
    sessionId: data.sessionId,
    sessionToken: data.sessionToken,
    challenges: [],
  };
}

/**
 * Verifica a senha de uma sessão existente.
 * Retorna os desafios pendentes (ex.: TOTP) se autenticação multifator estiver ativa.
 */
export async function checkPassword(
  sessionId: string,
  sessionToken: string,
  password: string,
): Promise<ZitadelSession> {
  const data = await apiFetch<{
    sessionId: string;
    sessionToken: string;
    challenges?: { totp?: boolean; emailOtp?: boolean; smsOtp?: boolean };
  }>(`/v2/sessions/${sessionId}`, {
    method: 'PATCH',
    headers: { 'x-zitadel-session-token': sessionToken },
    body: JSON.stringify({
      checks: {
        password: { password },
      },
    }),
  });

  const challenges: SessionChallenge[] = [];
  if (data.challenges?.totp) challenges.push('TOTP');
  if (data.challenges?.emailOtp) challenges.push('EMAIL_OTP');
  if (data.challenges?.smsOtp) challenges.push('SMS_OTP');

  return {
    sessionId: data.sessionId ?? sessionId,
    sessionToken: data.sessionToken ?? sessionToken,
    challenges,
  };
}

/**
 * Verifica o código TOTP (6 dígitos) de uma sessão.
 */
export async function checkTotp(
  sessionId: string,
  sessionToken: string,
  code: string,
): Promise<ZitadelSession> {
  const data = await apiFetch<{
    sessionId: string;
    sessionToken: string;
  }>(`/v2/sessions/${sessionId}`, {
    method: 'PATCH',
    headers: { 'x-zitadel-session-token': sessionToken },
    body: JSON.stringify({
      checks: {
        totp: { code },
      },
    }),
  });

  return {
    sessionId: data.sessionId ?? sessionId,
    sessionToken: data.sessionToken ?? sessionToken,
    challenges: [],
  };
}

// ---------------------------------------------------------------------------
// Identity Provider Intents — login social (Microsoft, Google, etc.)
// ---------------------------------------------------------------------------

export interface IdpIntentStartResult {
  /** URL para qual o browser deve ser redirecionado para iniciar o login no IdP externo. */
  authUrl: string;
}

/**
 * Inicia um intent de login via Identity Provider externo (ex.: Microsoft).
 * O Zitadel devolve a URL de autorização do IdP (ex.: login.microsoftonline.com).
 *
 * Após o usuário autenticar no IdP, o Zitadel processa o callback interno e
 * redireciona o browser para `successUrl` com `?id=<intentId>&token=<intentToken>`.
 */
export async function startIdpIntent(
  idpId: string,
  successUrl: string,
  failureUrl: string,
): Promise<IdpIntentStartResult> {
  const data = await apiFetch<{ authUrl?: string; details?: unknown }>(
    `/v2/idp_intents`,
    {
      method: 'POST',
      body: JSON.stringify({
        idpId,
        urls: { successUrl, failureUrl },
      }),
    },
  );

  if (!data.authUrl) {
    throw new ZitadelApiError(500, 'Zitadel não retornou authUrl para o IdP.');
  }

  return { authUrl: data.authUrl };
}

/**
 * Cria uma sessão a partir de um intent de IdP já concluído.
 * Use após o Zitadel ter redirecionado o browser para o `successUrl` com
 * `id` (intentId) e `token` (intentToken) na query string.
 */
export async function createSessionFromIdpIntent(
  idpIntentId: string,
  idpIntentToken: string,
): Promise<ZitadelSession> {
  const data = await apiFetch<{
    sessionId: string;
    sessionToken: string;
  }>('/v2/sessions', {
    method: 'POST',
    body: JSON.stringify({
      checks: {
        idpIntent: { idpIntentId, idpIntentToken },
      },
    }),
  });

  return {
    sessionId: data.sessionId,
    sessionToken: data.sessionToken,
    challenges: [],
  };
}

// ---------------------------------------------------------------------------
// OIDC Callback — finaliza o fluxo
// ---------------------------------------------------------------------------

/**
 * Cria o callback OIDC com a sessão autenticada.
 * Retorna a URL para qual o browser deve ser redirecionado,
 * encerrando o fluxo de login e devolvendo o controle ao Zitadel/app principal.
 */
export async function createOidcCallback(
  authRequestId: string,
  sessionId: string,
  sessionToken: string,
): Promise<CallbackResult> {
  // No Zitadel 4.x o gRPC-transcoding para POST
  // /v2/oidc/auth_requests/{id}/callback responde 404. Chamamos o método
  // Connect-RPC direto, que é o caminho oficial dessa versão.
  const data = await apiFetch<{ callbackUrl: string }>(
    `/zitadel.oidc.v2.OIDCService/CreateCallback`,
    {
      method: 'POST',
      body: JSON.stringify({
        authRequestId,
        session: { sessionId, sessionToken },
      }),
    },
  );

  return { callbackUrl: data.callbackUrl };
}

// ---------------------------------------------------------------------------
// Password Reset
// ---------------------------------------------------------------------------

/**
 * Solicita reset de senha por loginName.
 * O Zitadel envia um e-mail com o link de redefinição.
 */
export async function requestPasswordReset(loginName: string): Promise<void> {
  // Passo 1: resolve o userId pelo loginName
  const users = await apiFetch<{
    result?: Array<{ userId: string }>;
  }>(`/v2/users?loginName=${encodeURIComponent(loginName)}`);

  const userId = users.result?.[0]?.userId;
  if (!userId) {
    // Não revelar se o usuário existe por segurança (silent no-op)
    return;
  }

  // Passo 2: solicita o reset — o Zitadel envia e-mail automaticamente
  await apiFetch(`/v2/users/${userId}/password_reset`, {
    method: 'POST',
    body: JSON.stringify({ sendLink: { notificationType: 'TYPE_EMAIL' } }),
  });
}
