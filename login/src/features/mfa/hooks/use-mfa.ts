import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  checkTotp,
  createOidcCallback,
  ZitadelApiError,
} from '@/shared/lib/zitadel-client';
import { useLoginFlowStore } from '@/features/login/store/login-flow-store';

type MfaStatus = 'idle' | 'loading' | 'error';

interface UseMfaReturn {
  status: MfaStatus;
  errorMessage: string | null;
  submit: (code: string) => Promise<void>;
  goBack: () => void;
}

/**
 * Orquestra o step de MFA (TOTP):
 *  1. Verifica o código TOTP na sessão existente
 *  2. Cria o callback OIDC → redireciona o browser
 *
 * `submit` é memoizado com useCallback para que o useEffect de auto-submit
 * em mfa-page.tsx não re-execute a cada render, evitando loop de efeito.
 */
export function useMfa(): UseMfaReturn {
  const navigate = useNavigate();

  // Selects granulares: evita re-render desnecessário e torna as deps de
  // useCallback estáveis (só mudam quando o valor real muda).
  const sessionId    = useLoginFlowStore((s) => s.sessionId);
  const sessionToken = useLoginFlowStore((s) => s.sessionToken);
  const authRequestId = useLoginFlowStore((s) => s.authRequestId);
  const reset        = useLoginFlowStore((s) => s.reset);

  const [status, setStatus] = useState<MfaStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = useCallback(async (code: string) => {
    if (!sessionId || !sessionToken || !authRequestId) {
      // Estado inconsistente — volta para o login
      await navigate({ to: '/login', search: { authRequestId: undefined } });
      return;
    }

    if (code.length !== 6) {
      setErrorMessage('Informe os 6 dígitos do código.');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      const verified = await checkTotp(sessionId, sessionToken, code);

      // Finaliza o fluxo OIDC
      const { callbackUrl } = await createOidcCallback(
        authRequestId,
        verified.sessionId,
        verified.sessionToken,
      );

      window.location.assign(callbackUrl);
    } catch (err) {
      setStatus('error');

      if (err instanceof ZitadelApiError) {
        switch (err.status) {
          case 400:
          case 401:
            setErrorMessage('Código incorreto. Verifique o aplicativo autenticador e tente novamente.');
            break;
          case 429:
            setErrorMessage('Muitas tentativas incorretas. Aguarde alguns minutos.');
            break;
          default:
            setErrorMessage('Ocorreu um erro. Tente novamente em instantes.');
        }
      } else {
        setErrorMessage('Não foi possível conectar ao servidor.');
      }
    }
  }, [navigate, sessionId, sessionToken, authRequestId]);

  const goBack = useCallback(() => {
    reset();
    void navigate({ to: '/login', search: { authRequestId: undefined } });
  }, [reset, navigate]);

  return { status, errorMessage, submit, goBack };
}
