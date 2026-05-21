import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Navigate,
  useNavigate,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { LoginPage } from '@/features/login/components/login-page';
import { RecoveryPage } from '@/features/password-recovery/components/recovery-page';
import { MfaPage } from '@/features/mfa/components/mfa-page';
import { getAuthRequest } from '@/shared/lib/zitadel-client';

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------

const ZITADEL_AUTHORITY = import.meta.env.VITE_ZITADEL_AUTHORITY ?? 'http://localhost:8088';
// Client ID do app principal. Se não configurado, o login customizado é
// exibido para todos os auth requests (comportamento de dev sem restrição).
const MAIN_APP_CLIENT_ID: string | undefined = import.meta.env.VITE_ZITADEL_CLIENT_ID || undefined;

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// ---------------------------------------------------------------------------
// /login — tela principal de autenticação
// ---------------------------------------------------------------------------

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>) => ({
    authRequestId: typeof search.authRequestId === 'string'
      ? search.authRequestId
      : undefined,
  }),
  component: LoginPage,
});

// ---------------------------------------------------------------------------
// /recovery — recuperação de senha
// ---------------------------------------------------------------------------

const recoveryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/recovery',
  component: RecoveryPage,
});

// ---------------------------------------------------------------------------
// /mfa — verificação TOTP
// ---------------------------------------------------------------------------

const mfaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mfa',
  component: MfaPage,
});

// ---------------------------------------------------------------------------
// / — ponto de entrada: detecta o cliente e roteia adequadamente
//
// Lógica:
//  1. Se não há authRequestId → vai para /login (mostrará erro de param ausente)
//  2. Busca as infos do auth request no Zitadel (/v2/oidc/auth_requests/{id})
//  3. Se o clientId bate com VITE_ZITADEL_CLIENT_ID → exibe UI customizada
//  4. Se o clientId é de outro app (ex: console Zitadel) → redireciona
//     silenciosamente para o Login V1 nativo do Zitadel
//  5. Se a chamada falhar (sem PAT ou timeout) → exibe UI customizada por
//     segurança (fail-open para o app principal)
// ---------------------------------------------------------------------------

function IndexGate() {
  const navigate = useNavigate();
  const search = new URLSearchParams(window.location.search);
  const authRequestId = search.get('authRequestId');

  type State = 'checking' | 'custom' | 'redirect_v1';
  const [state, setState] = useState<State>(authRequestId ? 'checking' : 'custom');

  useEffect(() => {
    if (!authRequestId) return;

    // Se não há MAIN_APP_CLIENT_ID configurado, exibe UI customizada diretamente
    if (!MAIN_APP_CLIENT_ID) {
      void navigate({ to: '/login', search: { authRequestId } });
      return;
    }

    getAuthRequest(authRequestId)
      .then((info) => {
        if (info.clientId && info.clientId !== MAIN_APP_CLIENT_ID) {
          // Auth request de outro app (console, etc.) → Login V1
          setState('redirect_v1');
        } else {
          // Nosso app ou clientId não disponível → UI customizada
          setState('custom');
        }
      })
      .catch(() => {
        // Falha na checagem → fail-open: exibe UI customizada
        setState('custom');
      });
  }, [authRequestId, navigate]);

  // Redireciona para Login V1 do Zitadel (tela nativa de admin)
  if (state === 'redirect_v1' && authRequestId) {
    window.location.assign(
      `${ZITADEL_AUTHORITY}/ui/login/login?authRequestID=${authRequestId}`
    );
    return <p className="p-8 text-sm text-ink-4">Redirecionando…</p>;
  }

  // Aguarda a verificação
  if (state === 'checking') {
    return <p className="p-8 text-sm text-ink-4">Carregando…</p>;
  }

  // UI customizada — navega para /login preservando o authRequestId
  const to = authRequestId ? `/login?authRequestId=${authRequestId}` : '/login';
  return <Navigate to={to} />;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexGate,
});

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  recoveryRoute,
  mfaRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
