import { useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState } from 'react';

import { loginSchema, type LoginFormValues } from '@/features/login/types/auth';
import { useLoginFlowStore } from '@/features/login/store/login-flow-store';
import { useLoginFlow } from '@/features/login/hooks/use-login-flow';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Field } from '@/shared/ui/field';
import { Alert } from '@/shared/ui/alert';
import { Logo } from '@/shared/ui/logo';

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
    <AuthLayout>
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="lg" />
          <p className="text-sm text-ink-4 leading-relaxed">
            Acesse seu escritório
          </p>
        </div>

        {/* Card */}
        <div className="card-glass rounded-xl p-8 space-y-6">
          <form
            onSubmit={handleSubmit(submit)}
            noValidate
            className="space-y-5"
          >
            {/* Feedback de erro */}
            {errorMessage && (
              <Alert variant="error" message={errorMessage} />
            )}

            {/* E-mail / Login Name */}
            <Field
              label="E-mail"
              htmlFor="loginName"
              error={errors.loginName?.message}
            >
              <Input
                id="loginName"
                type="email"
                autoComplete="username email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="voce@escritorio.com.br"
                error={!!errors.loginName}
                disabled={isLoading}
                {...register('loginName')}
              />
            </Field>

            {/* Senha */}
            <Field
              label="Senha"
              htmlFor="password"
              error={errors.password?.message}
            >
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  error={!!errors.password}
                  disabled={isLoading}
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-4 hover:text-ink-2 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>

            {/* Link recuperação */}
            <div className="flex justify-end">
              <a
                href="/recovery"
                className="text-xs text-ink-4 hover:text-brand transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>

            {/* Botão */}
            <Button
              type="submit"
              size="lg"
              loading={isLoading}
              className="w-full mt-1"
            >
              {isLoading ? 'Entrando…' : 'Entrar'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-ink-5">
          TKWS OS · Group WS &copy; {new Date().getFullYear()}
        </p>
      </div>
    </AuthLayout>
  );
}

// ---------------------------------------------------------------------------
// Layout de autenticação — fundo navy + grid sutil
// ---------------------------------------------------------------------------

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-bg flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Grid de fundo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(116,199,228,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(116,199,228,1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Glow central */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-brand/5 blur-[120px]" />

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}

export { AuthLayout };
