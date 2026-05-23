import { useAuth } from 'react-oidc-context';
import { useEffect, useState } from 'react';
import { isOidcConfigured } from '@/modules/plataforma/auth/api/oidc-config';

export function useRequireAuth() {
  const auth = useAuth();
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const configured = isOidcConfigured();

  const { signinRedirect, isAuthenticated, isLoading, activeNavigator, error } = auth;

  useEffect(() => {
    if (!configured) {
      return;
    }
    if (isLoading || isAuthenticated || activeNavigator) {
      return;
    }

    setRedirectError(null);
    void signinRedirect().catch((redirectFailure: unknown) => {
      const message =
        redirectFailure instanceof Error
          ? redirectFailure.message
          : 'Não foi possível redirecionar para o login.';
      setRedirectError(message);
    });
  }, [configured, isAuthenticated, isLoading, activeNavigator, signinRedirect]);

  const blockingError = redirectError ?? (error ? error.message : null);

  return {
    auth,
    configured,
    blockingError,
    isRedirecting:
      configured &&
      !auth.isAuthenticated &&
      !blockingError &&
      (Boolean(auth.activeNavigator) || (!auth.isLoading && !auth.error)),
  };
}
