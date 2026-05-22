import { useEffect, useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

import { loginSchema, type LoginFormValues } from '@/features/login/types/auth';
import { useLoginFlowStore } from '@/features/login/store/login-flow-store';
import { useLoginFlow } from '@/features/login/hooks/use-login-flow';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Field } from '@/shared/ui/field';
import { Alert } from '@/shared/ui/alert';
import { AuthStage } from '@/shared/ui/auth-stage';

export function LoginPage() {
  const search = useSearch({ from: '/login' });
  // Selector granular — evita recriar o objeto inteiro do store a cada render,
  // o que causaria um loop infinito no useEffect abaixo.
  const setAuthRequestId = useLoginFlowStore((s) => s.setAuthRequestId);
  const { status, errorMessage, submit } = useLoginFlow();
  const [showPassword, setShowPassword] = useState(false);

  // Persiste o authRequestId no store assim que a página carrega.
  // `search.authRequestId` já é `string | undefined` graças ao validateSearch da rota.
  useEffect(() => {
    if (search.authRequestId) setAuthRequestId(search.authRequestId);
  }, [search.authRequestId, setAuthRequestId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginName: '', password: '' },
  });

  const isLoading = status === 'loading';

  return (
    <AuthStage
      quote={
        <>
          "Para arquitetos.
          <br />
          <em>Não para back-office.</em>"
        </>
      }
      quoteCite="· The TKWS OS Manifesto"
      metaLeft="São Paulo · Brasil"
      metaRight="2026 · v1.0"
    >
      <p className="mb-[22px] font-mono text-[10px] uppercase tracking-[0.15em] text-ink-4">
        Entrar · TKWS OS
      </p>

      <h1 className="mb-3 font-editorial text-[38px] font-light leading-[1.05] tracking-[-0.03em] text-ink-1">
        Bem-vindo <em className="font-light italic text-ink-3">de volta.</em>
      </h1>
      <p className="mb-[30px] max-w-[360px] text-[14px] leading-[1.55] text-ink-3">
        Acesse o cockpit do seu workspace. Se for sua primeira vez, peça convite
        ao admin.
      </p>

      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-3.5">
        {errorMessage && <Alert variant="error" message={errorMessage} />}

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
            placeholder="você@empresa.com.br"
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

        <div className="-mt-1 flex justify-end">
          <a
            href="/recovery"
            className="text-xs font-semibold text-brand underline-offset-[3px] hover:underline"
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
