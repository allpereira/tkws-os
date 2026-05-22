import { useCallback, useEffect, useState } from 'react';
import {
  acceptInvite,
  getInviteByToken,
  TkwsApiError,
  type InviteTokenInfo,
} from '@/shared/lib/tkws-api-client';
import type { AcceptInviteFormValues } from '@/features/accept-invite/types/accept-invite';

type LookupStatus = 'idle' | 'loading' | 'valid' | 'invalid' | 'error';
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

interface UseAcceptInviteReturn {
  lookupStatus: LookupStatus;
  invite: InviteTokenInfo | null;
  invalidReason: string | null;

  submitStatus: SubmitStatus;
  errorMessage: string | null;

  submit: (values: AcceptInviteFormValues) => Promise<void>;
}

/**
 * Orquestra a tela /accept-invite:
 *
 *  1. No mount, faz GET /api/v1/invites/by-token pra validar e pegar metadata
 *     (email, role, tenant). Decide se renderiza o form ou tela de erro.
 *  2. No submit, POST /api/v1/invites/accept. Em sucesso, dispara redirect pro
 *     fluxo OIDC normal de /login (carregando o email como hint, se possível).
 */
export function useAcceptInvite(token: string | undefined): UseAcceptInviteReturn {
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle');
  const [invite, setInvite] = useState<InviteTokenInfo | null>(null);
  const [invalidReason, setInvalidReason] = useState<string | null>(null);

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLookupStatus('invalid');
      setInvalidReason('not_found');
      return;
    }
    setLookupStatus('loading');
    getInviteByToken(token)
      .then((info) => {
        setInvite(info);
        if (info.valid) {
          setLookupStatus('valid');
        } else {
          setLookupStatus('invalid');
          setInvalidReason(info.reason ?? 'not_found');
        }
      })
      .catch((err) => {
        setLookupStatus('error');
        setInvalidReason(null);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Não foi possível verificar o convite. Tente recarregar a página.',
        );
      });
  }, [token]);

  const submit = useCallback(
    async (values: AcceptInviteFormValues) => {
      if (!token) return;
      setSubmitStatus('submitting');
      setErrorMessage(null);
      try {
        await acceptInvite({
          token,
          fullName: values.fullName,
          password: values.password,
        });
        setSubmitStatus('success');
        // Redireciona pra tela de login com hint do email do invite. O usuário
        // entra com a senha que acabou de definir — não fazemos auto-login para
        // não bagunçar o fluxo PKCE/Zitadel.
        const email = invite?.email ?? '';
        window.setTimeout(() => {
          window.location.assign(
            `/login?loginNameHint=${encodeURIComponent(email)}`,
          );
        }, 1200);
      } catch (err) {
        setSubmitStatus('error');
        if (err instanceof TkwsApiError) {
          switch (err.status) {
            case 400:
              setErrorMessage(err.message ?? 'Dados inválidos. Revise o formulário.');
              break;
            case 410:
              setErrorMessage('Este convite expirou ou já foi usado.');
              break;
            default:
              setErrorMessage(err.message ?? 'Não foi possível concluir o cadastro.');
          }
        } else {
          setErrorMessage('Não foi possível conectar ao servidor.');
        }
      }
    },
    [token, invite?.email],
  );

  return {
    lookupStatus,
    invite,
    invalidReason,
    submitStatus,
    errorMessage,
    submit,
  };
}
