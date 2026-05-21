import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

import { usePasswordRecovery } from '@/features/password-recovery/hooks/use-password-recovery';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Field } from '@/shared/ui/field';
import { Alert } from '@/shared/ui/alert';
import { Logo } from '@/shared/ui/logo';
import { AuthLayout } from '@/features/login/components/login-page';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const recoverySchema = z.object({
  loginName: z
    .string()
    .min(1, 'Informe seu e-mail ou nome de usuário')
    .max(256),
});

type RecoveryFormValues = z.infer<typeof recoverySchema>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function RecoveryPage() {
  const { status, errorMessage, submit } = usePasswordRecovery();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RecoveryFormValues>({
    resolver: zodResolver(recoverySchema),
  });

  const isLoading = status === 'loading';
  const isSent = status === 'sent';

  return (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="lg" />
        </div>

        <div className="card-glass rounded-xl p-8 space-y-6">
          {isSent ? (
            <SuccessState email={getValues('loginName')} />
          ) : (
            <>
              {/* Cabeçalho */}
              <div className="space-y-1">
                <h1 className="text-lg font-semibold text-ink-1 tracking-tight">
                  Recuperar acesso
                </h1>
                <p className="text-sm text-ink-4 leading-relaxed">
                  Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
                </p>
              </div>

              {/* Erro */}
              {errorMessage && (
                <Alert variant="error" message={errorMessage} />
              )}

              {/* Formulário */}
              <form
                onSubmit={handleSubmit((v) => submit(v.loginName))}
                noValidate
                className="space-y-5"
              >
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

                <Button
                  type="submit"
                  size="lg"
                  loading={isLoading}
                  className="w-full"
                >
                  <Mail className="h-4 w-4" />
                  {isLoading ? 'Enviando…' : 'Enviar instruções'}
                </Button>
              </form>
            </>
          )}
        </div>

        {/* Voltar para login */}
        <div className="flex justify-center">
          <a
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-ink-4 hover:text-brand transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Voltar para o login
          </a>
        </div>

        <p className="text-center text-xs text-ink-5">
          TKWS OS · Group WS &copy; {new Date().getFullYear()}
        </p>
      </div>
    </AuthLayout>
  );
}

// ---------------------------------------------------------------------------
// Estado de sucesso
// ---------------------------------------------------------------------------

function SuccessState({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 border border-success/30">
        <CheckCircle className="h-7 w-7 text-success" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-base font-semibold text-ink-1">
          Verifique seu e-mail
        </h2>
        <p className="text-sm text-ink-4 leading-relaxed max-w-xs">
          Se <span className="text-ink-2 font-medium">{email}</span> estiver
          cadastrado, você receberá um link em breve.
        </p>
        <p className="text-xs text-ink-5">
          Não recebeu? Verifique a pasta de spam ou tente novamente.
        </p>
      </div>
    </div>
  );
}
