import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  createSession,
  checkPassword,
  createOidcCallback,
  ZitadelApiError,
} from '@/shared/lib/zitadel-client';
import { useLoginFlowStore } from '@/features/login/store/login-flow-store';
import type { LoginFormValues } from '@/features/login/types/auth';

type LoginStatus = 'idle' | 'loading' | 'error';

interface UseLoginFlowReturn {
  status: LoginStatus;
  errorMessage: string | null;
  submit: (values: LoginFormValues) => Promise<void>;
}

/**
 * Orquestra o fluxo de login:
 *  1. Cria sessão com o loginName
 *  2. Verifica a senha
 *  3. Se houver MFA pendente → navega para /mfa
 *  4. Caso contrário → cria o callback OIDC e redireciona
 */
export function useLoginFlow(): UseLoginFlowReturn {
  const navigate = useNavigate();

  // Selects granulares para deps estáveis no useCallback
  const authRequestId       = useLoginFlowStore((s) => s.authRequestId);
  const setLoginName        = useLoginFlowStore((s) => s.setLoginName);
  const setSession          = useLoginFlowStore((s) => s.setSession);
  const setPendingChallenges = useLoginFlowStore((s) => s.setPendingChallenges);

  const [status, setStatus] = useState<LoginStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = useCallback(async (values: LoginFormValues) => {
    if (!authRequestId) {
      setErrorMessage('Parâmetro de autenticação ausente. Tente acessar novamente pelo aplicativo.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      // Passo 1 — identificar o usuário
      const session = await createSession(values.loginName);

      // Passo 2 — verificar a senha
      const verified = await checkPassword(
        session.sessionId,
        session.sessionToken,
        values.password,
      );

      // Salva estado no store
      setLoginName(values.loginName);
      setSession(verified.sessionId, verified.sessionToken);
      setPendingChallenges(verified.challenges);

      // Passo 3 — roteamento pós-senha
      if (verified.challenges.length > 0) {
        // Há desafio MFA — vai para a tela de verificação
        await navigate({ to: '/mfa' });
        return;
      }

      // Sem MFA — finaliza o fluxo OIDC
      const { callbackUrl } = await createOidcCallback(
        authRequestId,
        verified.sessionId,
        verified.sessionToken,
      );

      window.location.assign(callbackUrl);
    } catch (err) {
      setStatus('error');

      if (err instanceof ZitadelApiError) {
        // Mapeia os códigos de erro do Zitadel para mensagens amigáveis em pt-BR
        switch (err.status) {
          case 400:
            setErrorMessage('Dados inválidos. Verifique seu e-mail e senha.');
            break;
          case 401:
            setErrorMessage('E-mail ou senha incorretos.');
            break;
          case 404:
            // Intencionalmente genérico — não revelar se o usuário existe
            setErrorMessage('E-mail ou senha incorretos.');
            break;
          case 429:
            setErrorMessage('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
            break;
          default:
            setErrorMessage('Ocorreu um erro inesperado. Tente novamente em instantes.');
        }
      } else {
        setErrorMessage('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
    }
  }, [navigate, authRequestId, setLoginName, setSession, setPendingChallenges]);

  return { status, errorMessage, submit };
}
