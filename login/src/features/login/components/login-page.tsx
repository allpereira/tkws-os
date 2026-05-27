import { useEffect, useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

import { loginSchema, type LoginFormValues } from '@/features/login/types/auth';
import { loadSavedLogin, persistSavedLogin } from '@/features/login/lib/saved-login';
import { useLoginFlowStore } from '@/features/login/store/login-flow-store';
import { useLoginFlow } from '@/features/login/hooks/use-login-flow';
import { startIdpIntent, ZitadelApiError } from '@/shared/lib/zitadel-client';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { Field } from '@/shared/ui/field';
import { Alert } from '@/shared/ui/alert';
import { AuthStage } from '@/shared/ui/auth-stage';
import { Separator } from '@/shared/ui/separator';

const MICROSOFT_IDP_ID: string | undefined =
  import.meta.env.VITE_ZITADEL_MICROSOFT_IDP_ID || undefined;

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 21 21"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

export function LoginPage() {
  const search = useSearch({ from: '/login' });
  // Selector granular — evita recriar o objeto inteiro do store a cada render,
  // o que causaria um loop infinito no useEffect abaixo.
  const setAuthRequestId = useLoginFlowStore((s) => s.setAuthRequestId);
  const { status, errorMessage, submit } = useLoginFlow();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [idpStatus, setIdpStatus] = useState<'idle' | 'loading'>('idle');
  const [idpError, setIdpError] = useState<string | null>(null);

  // Persiste o authRequestId no store assim que a página carrega.
  // `search.authRequestId` já é `string | undefined` graças ao validateSearch da rota.
  useEffect(() => {
    if (search.authRequestId) setAuthRequestId(search.authRequestId);
  }, [search.authRequestId, setAuthRequestId]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginName: '', password: '' },
  });

  useEffect(() => {
    void loadSavedLogin().then((saved) => {
      if (!saved) return;
      setRememberDevice(true);
      reset({ loginName: saved.loginName, password: saved.password });
    });
  }, [reset]);

  const isLoading = status === 'loading';

  const onSubmit = async (values: LoginFormValues) => {
    await persistSavedLogin({
      remember: rememberDevice,
      loginName: values.loginName,
      password: values.password,
    });
    await submit(values);
  };

  const onMicrosoftLogin = async () => {
    if (!MICROSOFT_IDP_ID) return;
    if (!search.authRequestId) {
      setIdpError(
        'Parâmetro de autenticação ausente. Tente acessar novamente pelo aplicativo.',
      );
      return;
    }

    setIdpStatus('loading');
    setIdpError(null);
    try {
      const successUrl = `${window.location.origin}/idp-callback?authRequestId=${encodeURIComponent(search.authRequestId)}`;
      const failureUrl = `${window.location.origin}/login?authRequestId=${encodeURIComponent(search.authRequestId)}`;
      const { authUrl } = await startIdpIntent(MICROSOFT_IDP_ID, successUrl, failureUrl);
      window.location.assign(authUrl);
    } catch (err) {
      setIdpStatus('idle');
      if (err instanceof ZitadelApiError) {
        setIdpError(
          'Não foi possível iniciar o login com Microsoft. Tente novamente em instantes.',
        );
      } else {
        setIdpError('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
    }
  };

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
      metaLeft="Login"
      metaRight="sessão OIDC"
    >
      <p className="mb-[22px] font-mono text-[10px] uppercase tracking-[0.15em] text-ink-4">
        Entrar · TKWS OS
      </p>

      <h1 className="mb-3 font-editorial text-[38px] font-light leading-[1.05] tracking-[-0.03em] text-ink-1">
        Bem-vindo <em className="font-light italic text-ink-3">de volta.</em>
      </h1>
      <p className="mb-[30px] max-w-[360px] text-[14px] leading-[1.55] text-ink-3">
        Se for sua primeira vez, peça convite ao admin.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
        {(errorMessage || idpError) && (
          <Alert variant="error" message={errorMessage ?? idpError ?? ''} />
        )}

        <Field
          label="Email corporativo"
          htmlFor="loginName"
          error={errors.loginName?.message}
        >
          <Input
            id="loginName"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="seumail@groupws.com.br"
            error={!!errors.loginName}
            disabled={isLoading}
            {...register('loginName')}
          />
        </Field>

        <Field label="Senha" htmlFor="password" error={errors.password?.message}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              error={!!errors.password}
              disabled={isLoading}
              className="pr-11"
              {...register('password')}
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-4 transition-colors hover:text-ink-2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </Field>

        <div className="-mt-1 flex items-center justify-between gap-3">
          <label
            htmlFor="rememberDevice"
            className="flex cursor-pointer items-center gap-2.5"
          >
            <Checkbox
              id="rememberDevice"
              checked={rememberDevice}
              onCheckedChange={(checked) => setRememberDevice(checked === true)}
              disabled={isLoading}
            />
            <span className="text-[12.5px] text-ink-2">Lembrar deste dispositivo</span>
          </label>
          <a
            href="/recovery"
            className="shrink-0 text-xs font-semibold text-brand underline-offset-[3px] hover:underline"
          >
            Esqueci minha senha
          </a>
        </div>

        <div className="pt-1">
          <Button type="submit" size="lg" loading={isLoading}>
            {isLoading ? 'Entrando…' : 'Entrar'}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {MICROSOFT_IDP_ID && (
          <div className="space-y-3 pt-3">
            <Separator label="Ou continue com" />
            <Button
              type="button"
              variant="outline"
              size="lg"
              loading={idpStatus === 'loading'}
              disabled={isLoading}
              onClick={() => {
                void onMicrosoftLogin();
              }}
            >
              {idpStatus !== 'loading' && <MicrosoftLogo className="h-4 w-4" />}
              {idpStatus === 'loading' ? 'Redirecionando…' : 'Microsoft'}
            </Button>
          </div>
        )}
      </form>

      <p className="mt-7 text-center text-[12.5px] text-ink-4">
        Ainda não tem conta?{' '}
        <a
          href="mailto:contato@grupows.com.br"
          className="font-semibold text-brand underline-offset-[3px] hover:underline"
        >
          Solicitar convite
        </a>
      </p>
    </AuthStage>
  );
}
