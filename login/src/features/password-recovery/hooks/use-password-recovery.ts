import { useState } from 'react';
import { requestPasswordReset, ZitadelApiError } from '@/shared/lib/zitadel-client';

type RecoveryStatus = 'idle' | 'loading' | 'sent' | 'error';

interface UsePasswordRecoveryReturn {
  status: RecoveryStatus;
  errorMessage: string | null;
  submit: (loginName: string) => Promise<void>;
}

/**
 * Hook para o fluxo de recuperação de senha.
 * Intencionalmente não diferencia "usuário não encontrado" de "e-mail enviado"
 * para não revelar se um loginName existe no sistema (security by design).
 */
export function usePasswordRecovery(): UsePasswordRecoveryReturn {
  const [status, setStatus] = useState<RecoveryStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit(loginName: string) {
    if (!loginName.trim()) return;

    setStatus('loading');
    setErrorMessage(null);

    try {
      await requestPasswordReset(loginName.trim());
      setStatus('sent');
    } catch (err) {
      setStatus('error');

      if (err instanceof ZitadelApiError && err.status === 429) {
        setErrorMessage('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
      } else {
        // Mensagem genérica — não revelar detalhes do erro para o usuário
        setErrorMessage('Não foi possível processar a solicitação. Tente novamente em instantes.');
      }
    }
  }

  return { status, errorMessage, submit };
}
