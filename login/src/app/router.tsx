import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Navigate,
} from '@tanstack/react-router';

import { LoginPage } from '@/features/login/components/login-page';
import { RecoveryPage } from '@/features/password-recovery/components/recovery-page';
import { MfaPage } from '@/features/mfa/components/mfa-page';

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
// / — redireciona para /login preservando a query string
// ---------------------------------------------------------------------------

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    // Zitadel pode chamar com /?authRequestId=xxx — preserva o parâmetro
    const search = new URLSearchParams(window.location.search);
    const authRequestId = search.get('authRequestId');
    const to = authRequestId ? `/login?authRequestId=${authRequestId}` : '/login';
    return <Navigate to={to} />;
  },
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
