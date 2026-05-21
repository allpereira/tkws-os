import { createRootRoute, createRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { useRequireAuth } from '@/features/auth/hooks/use-require-auth';
import {
  AuthErrorPanel,
  AuthSetupRequired,
} from '@/features/auth/components/auth-gate';

const rootRoute = createRootRoute({ component: () => <Outlet /> });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const callbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/callback',
  component: OidcCallbackPage,
});

function OidcCallbackPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      void navigate({ to: '/' });
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.error) {
    return (
      <AuthErrorPanel
        title="Falha ao concluir login"
        message={auth.error.message}
        onRetry={() => {
          window.location.assign('/');
        }}
      />
    );
  }

  return (
    <div className="p-8 text-muted-foreground">Concluindo login...</div>
  );
}

function HomePage() {
  const { auth, configured, blockingError, isRedirecting } = useRequireAuth();
  const me = useCurrentUser(auth.user?.access_token);

  if (!configured) {
    return <AuthSetupRequired />;
  }

  if (blockingError) {
    return (
      <AuthErrorPanel
        title="Não foi possível iniciar o login"
        message={blockingError}
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  if (auth.isLoading || me.isLoading) {
    return <div className="p-8 text-muted-foreground">Carregando...</div>;
  }

  if (isRedirecting || !auth.isAuthenticated) {
    return <div className="p-8 text-muted-foreground">Redirecionando para login...</div>;
  }

  if (me.isError) {
    const status =
      me.error &&
      typeof me.error === 'object' &&
      'response' in me.error
        ? (me.error as { response?: { status?: number } }).response?.status
        : undefined;
    return (
      <AuthErrorPanel
        title="Não foi possível carregar seu perfil"
        message={
          status === 401
            ? 'A API rejeitou o token (401). No Zitadel, defina o app Web com Access Token Type JWT, faça logout/login e confira VITE_ZITADEL_CLIENT_ID no .env.local.'
            : status === 400
              ? 'A API não encontrou e-mail no token. Faça logout/login; no Zitadel, confira scope email no app Web.'
              : me.error instanceof Error
                ? me.error.message
                : 'Verifique se a API está em execução em http://localhost:8080.'
        }
        onRetry={() => {
          void me.refetch();
        }}
      />
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">TKWS OS</h1>
      <p className="mt-2 text-muted-foreground">
        Olá, {me.data?.fullName || me.data?.email}
      </p>
      <button
        type="button"
        onClick={() => auth.signoutRedirect()}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Sair
      </button>
    </div>
  );
}

export const routeTree = rootRoute.addChildren([indexRoute, callbackRoute]);
