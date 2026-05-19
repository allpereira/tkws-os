import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';

const rootRoute = createRootRoute({ component: () => <Outlet /> });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

function HomePage() {
  const auth = useAuth();
  const me = useCurrentUser(auth.isAuthenticated);

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      auth.signinRedirect();
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  if (auth.isLoading || me.isLoading) {
    return <div className="p-8 text-muted-foreground">Carregando...</div>;
  }

  if (!auth.isAuthenticated) {
    return <div className="p-8">Redirecionando para login...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">TKWS OS</h1>
      <p className="mt-2 text-muted-foreground">
        Olá, {me.data?.fullName || me.data?.email}
      </p>
      <button
        onClick={() => auth.signoutRedirect()}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Sair
      </button>
    </div>
  );
}

export const routeTree = rootRoute.addChildren([indexRoute]);
