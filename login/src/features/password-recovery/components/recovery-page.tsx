import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { usePasswordRecovery } from '@/features/password-recovery/hooks/use-password-recovery';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Field } from '@/shared/ui/field';
import { Alert } from '@/shared/ui/alert';
import { AuthStage } from '@/shared/ui/auth-stage';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const recoverySchema = z.object({
  loginName: z.string().min(1, 'Informe seu e-mail ou nome de usuário').max(256),
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
    <AuthStage
      quote={
        <>
          "Motion como
          <br />
          <em>linguagem.</em>"
        </>
      }
      metaLeft="Recuperação"
      metaRight="token expira em 24h"
    >
      {isSent ? (
        <SuccessState email={getValues('loginName')} />
      ) : (
        <>
          <p className="mb-[22px] font-mono text-[10px] uppercase tracking-[0.15em] text-ink-4">
            Recuperação de senha · etapa 1 de 2
          </p>

          <h1 className="mb-3 font-editorial text-[38px] font-light leading-[1.05] tracking-[-0.03em] text-ink-1">
            Vamos enviar um{' '}
            <em className="font-light italic text-ink-3">link de reset.</em>
          </h1>
          <p className="mb-[30px] max-w-[360px] text-[14px] leading-[1.55] text-ink-3">
            Informe o email cadastrado no TKWS OS. Vamos enviar um link que abre
            a tela para definir uma nova senha. Por segurança, o link expira em
            24 horas.
          </p>

          <form
            onSubmit={handleSubmit((v) => submit(v.loginName))}
            noValidate
            className="space-y-3.5"
          >
            {errorMessage && <Alert variant="error" message={errorMessage} />}

            <Field
              label="Email corporativo"
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
                placeholder="você@empresa.com.br"
                error={!!errors.loginName}
                disabled={isLoading}
                {...register('loginName')}
              />
            </Field>

            <div className="flex flex-col gap-2.5 pt-1">
              <Button type="submit" size="lg" loading={isLoading}>
                {isLoading ? 'Enviando…' : 'Enviar link de reset'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="ghost"
                onClick={() => {
                  window.location.assign('/login');
                }}
              >
                ← Voltar para entrar
              </Button>
            </div>
          </form>

          <p className="mt-7 text-center text-[12.5px] text-ink-4">
            Não tem mais acesso ao email?{' '}
            <a
              href="mailto:contato@grupows.com.br"
              className="font-semibold text-brand underline-offset-[3px] hover:underline"
            >
              Contatar admin do workspace
            </a>
          </p>
        </>
      )}
    </AuthStage>
  );
}

// ---------------------------------------------------------------------------
// Estado de sucesso
// ---------------------------------------------------------------------------

function SuccessState({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-[18px] flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <CheckCircle2 className="h-7 w-7" strokeWidth={1.8} />
      </div>

      <h1 className="mb-3 font-editorial text-[34px] font-light leading-[1.05] tracking-[-0.03em] text-ink-1">
        Confira seu <em className="font-light italic text-ink-3">email.</em>
      </h1>
      <p className="mb-5 max-w-[340px] text-[14px] leading-[1.55] text-ink-3">
        Se um usuário com esse identificador estiver cadastrado, enviamos um
        link de reset. Ele expira em 24 horas e só funciona uma vez.
      </p>

      <div className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface-2 px-3.5 py-1.5 font-mono text-[12px] text-ink-1">
        <CheckCircle2 className="h-3 w-3 text-brand" strokeWidth={2.5} />
        {email}
      </div>

      <p className="mt-6 text-[12.5px] text-ink-4">
        Não recebeu?{' '}
        <a
          href="/recovery"
          className="font-semibold text-brand underline-offset-[3px] hover:underline"
        >
          Tentar de novo
        </a>{' '}
        ·{' '}
        <a
          href="/login"
          className="font-semibold text-brand underline-offset-[3px] hover:underline"
        >
          Voltar para entrar
        </a>
      </p>
    </div>
  );
}
