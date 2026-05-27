import { useEffect, useState } from 'react';
import { useSearch } from '@tanstack/react-router';

import {
  createOidcCallback,
  createSessionFromIdpIntent,
  ZitadelApiError,
} from '@/shared/lib/zitadel-client';
import { Alert } from '@/shared/ui/alert';
import { AuthStage } from '@/shared/ui/auth-stage';
import { Button } from '@/shared/ui/button';

/**
 * Página de retorno do Identity Provider externo (Microsoft, Google, etc.).
 *
 * Fluxo:
 *  1. Zitadel redireciona o browser pra cá com `?id=<intentId>&token=<intentToken>&authRequestId=<id>`
 *     (o authRequestId é preservado via successUrl montada na LoginPage).
 *  2. Trocamos o intent por uma sessão (POST /v2/sessions).
 *  3. Criamos o callback OIDC e mandamos o browser pra ele,
 *     fechando o fluxo de autorização.
 */
export function IdpCallbackPage() {
  const search = useSearch({ from: '/idp-callback' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { id, token, authRequestId } = search;

  useEffect(() => {
    let cancelled = false;

    async function finalize() {
      if (!authRequestId) {
        setErrorMessage('Sessão de login expirou. Volte ao app e tente novamente.');
        return;
      }
      if (!id || !token) {
        setErrorMessage('Resposta do provedor inválida. Tente entrar novamente.');
        return;
      }

      try {
        const session = await createSessionFromIdpIntent(id, token);
        const { callbackUrl } = await createOidcCallback(
          authRequestId,
          session.sessionId,
          session.sessionToken,
        );
        if (!cancelled) window.location.assign(callbackUrl);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ZitadelApiError) {
          setErrorMessage(
            err.status === 404
              ? 'Conta Microsoft não encontrada no TKWS OS. Peça acesso ao admin.'
              : 'Não foi possível concluir o login com Microsoft. Tente novamente.',
          );
        } else {
          setErrorMessage('Não foi possível conectar ao servidor. Verifique sua conexão.');
        }
      }
    }

    void finalize();

    return () => {
      cancelled = true;
    };
  }, [id, token, authRequestId]);

  const backHref = authRequestId
    ? `/login?authRequestId=${encodeURIComponent(authRequestId)}`
    : '/login';

  return (
    <AuthStage
      quote={
        <>
          "Onde o briefing, o orçamento e a obra
          <br />
          <em>moram juntos.</em>"
        </>
      }
      quoteCite="· OS do TKWS"
      metaLeft="Login · Microsoft"
      metaRight="sessão OIDC"
    >
      <p className="mb-[22px] font-mono text-[10px] uppercase tracking-[0.15em] text-ink-4">
        Concluindo · Microsoft
      </p>

      <h1 className="mb-3 font-editorial text-[38px] font-light leading-[1.05] tracking-[-0.03em] text-ink-1">
        {errorMessage ? (
          <>Não foi possível <em className="font-light italic text-ink-3">entrar.</em></>
        ) : (
          <>Validando <em className="font-light italic text-ink-3">sua conta.</em></>
        )}
      </h1>
      <p className="mb-[30px] max-w-[360px] text-[14px] leading-[1.55] text-ink-3">
        {errorMessage
          ? 'O login externo não foi concluído. Volte e tente novamente.'
          : 'Aguarde enquanto confirmamos seu acesso com a Microsoft.'}
      </p>

      {errorMessage ? (
        <div className="space-y-3.5">
          <Alert variant="error" message={errorMessage} />
          <Button type="button" size="lg" onClick={() => window.location.assign(backHref)}>
            Voltar para o login
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-[13px] text-ink-3">
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          Conectando…
        </div>
      )}
    </AuthStage>
  );
}
