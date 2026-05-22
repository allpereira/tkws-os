import { useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

import {
  acceptInviteSchema,
  type AcceptInviteFormValues,
} from '@/features/accept-invite/types/accept-invite';
import { useAcceptInvite } from '@/features/accept-invite/hooks/use-accept-invite';
import { AuthStage } from '@/shared/ui/auth-stage';
import { Field } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Alert } from '@/shared/ui/alert';
import { PasswordStrength } from '@/shared/ui/password-strength';

const REASON_COPY: Record<string, { title: string; sub: string }> = {
  expired: {
    title: 'Convite expirado.',
    sub: 'Este link expirou. Peça ao admin do escritório que envie um novo convite.',
  },
  revoked: {
    title: 'Convite cancelado.',
    sub: 'Este convite foi revogado pelo admin. Entre em contato pra solicitar um novo.',
  },
  accepted: {
    title: 'Convite já utilizado.',
    sub: 'Este link já foi usado. Se você ainda não tem acesso, peça um novo convite.',
  },
  not_found: {
    title: 'Link inválido.',
    sub: 'Não encontramos esse convite. Confira o link ou solicite um novo ao admin.',
  },
};

export function AcceptInvitePage() {
  // O `validateSearch` da rota já garante tipo string | undefined.
  const search = useSearch({ from: '/accept-invite' });
  const token = search.token;

  const { lookupStatus, invite, invalidReason, submitStatus, errorMessage, submit } =
    useAcceptInvite(token);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AcceptInviteFormValues>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      fullName: '',
      password: '',
      termsAccepted: undefined as unknown as true,
    },
  });

  const password = watch('password');
  const isSubmitting = submitStatus === 'submitting';

  // ── Estados de loading / erro de lookup ────────────────────────────────
  if (lookupStatus === 'idle' || lookupStatus === 'loading') {
    return (
      <AuthStage
        quote={
          <>
            "Loiana convidou você
            <br />
            <em>para TKWS Decora.</em>"
          </>
        }
        quoteCite="· workspace · BC/SC"
        metaLeft="Convite"
        metaRight="primeiro acesso"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-4">
          Verificando convite…
        </p>
      </AuthStage>
    );
  }

  if (lookupStatus === 'invalid' || lookupStatus === 'error') {
    const reason = invalidReason ?? 'not_found';
    const copy = REASON_COPY[reason] ?? REASON_COPY.not_found;
    return (
      <AuthStage
        quote={
          <>
            "Anos
            <br />
            <em>à frente.</em>"
          </>
        }
        quoteCite="· TKWS OS"
        metaLeft="Convite"
        metaRight="indisponível"
      >
        <p className="mb-[22px] font-mono text-[10px] uppercase tracking-[0.15em] text-ink-4">
          Convite · {reason}
        </p>
        <h1 className="mb-3 font-editorial text-[38px] font-light leading-[1.05] tracking-[-0.03em] text-ink-1">
          {copy.title.split(' ').slice(0, -1).join(' ')}{' '}
          <em className="font-light italic text-ink-3">
            {copy.title.split(' ').slice(-1).join(' ')}
          </em>
        </h1>
        <p className="mb-[30px] max-w-[360px] text-[14px] leading-[1.55] text-ink-3">
          {copy.sub}
        </p>
        <Button
          type="button"
          size="lg"
          variant="ghost"
          onClick={() => window.location.assign('/login')}
        >
          ← Ir para o login
        </Button>
      </AuthStage>
    );
  }

  // ── Estado de sucesso (pós-submit, antes do redirect) ──────────────────
  if (submitStatus === 'success') {
    return (
      <AuthStage
        quote={
          <>
            "Bem-vindo
            <br />
            <em>ao cockpit.</em>"
          </>
        }
        quoteCite="· TKWS OS"
        metaLeft="Conta criada"
        metaRight="indo para o login"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-[18px] flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <CheckCircle2 className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <h1 className="mb-3 font-editorial text-[34px] font-light leading-[1.05] tracking-[-0.03em] text-ink-1">
            Tudo certo, <em className="font-light italic text-ink-3">vamos entrar.</em>
          </h1>
          <p className="max-w-[340px] text-[14px] leading-[1.55] text-ink-3">
            Sua conta em <span className="text-ink-1">{invite?.tenantName}</span> foi criada.
            Redirecionando para a tela de login…
          </p>
        </div>
      </AuthStage>
    );
  }

  // ── Form principal ─────────────────────────────────────────────────────
  return (
    <AuthStage
      quote={
        <>
          "Loiana convidou você
          <br />
          <em>para {invite?.tenantName ?? 'um workspace'}.</em>"
        </>
      }
      quoteCite="· workspace TKWS OS"
      metaLeft={`Convite válido`}
      metaRight={`role: ${invite?.role ?? '—'}`}
    >
      <p className="mb-[22px] font-mono text-[10px] uppercase tracking-[0.15em] text-ink-4">
        Convite · primeiro acesso
      </p>

      <h1 className="mb-3 font-editorial text-[38px] font-light leading-[1.05] tracking-[-0.03em] text-ink-1">
        Crie sua <em className="font-light italic text-ink-3">conta TKWS OS.</em>
      </h1>
      <p className="mb-[30px] max-w-[360px] text-[14px] leading-[1.55] text-ink-3">
        Você foi convidado(a) para integrar o workspace{' '}
        <span className="text-ink-1">{invite?.tenantName}</span> como{' '}
        <span className="text-ink-1">{invite?.role}</span>.
      </p>

      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-3.5">
        {errorMessage && <Alert variant="error" message={errorMessage} />}

        <Field label="Email · não editável" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={invite?.email ?? ''}
            disabled
            className="opacity-60"
            readOnly
          />
        </Field>

        <Field
          label="Nome completo"
          htmlFor="fullName"
          error={errors.fullName?.message}
        >
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Como você quer aparecer no sistema"
            error={!!errors.fullName}
            disabled={isSubmitting}
            {...register('fullName')}
          />
        </Field>

        <Field label="Senha" htmlFor="password" error={errors.password?.message}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              error={!!errors.password}
              disabled={isSubmitting}
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
          <PasswordStrength password={password ?? ''} />
        </Field>

        <label className="mt-1 flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            disabled={isSubmitting}
            {...register('termsAccepted')}
            className="mt-[3px] h-4 w-4 rounded border-line-3 bg-surface-2 text-brand focus:ring-brand"
          />
          <span className="text-[12.5px] leading-snug text-ink-3">
            Aceito os{' '}
            <a href="/terms" className="text-brand underline-offset-[3px] hover:underline">
              Termos de Uso
            </a>{' '}
            e a{' '}
            <a href="/privacy" className="text-brand underline-offset-[3px] hover:underline">
              Política de Privacidade
            </a>
            .
          </span>
        </label>
        {errors.termsAccepted && (
          <p role="alert" className="text-xs text-danger">
            {errors.termsAccepted.message}
          </p>
        )}

        <div className="pt-1">
          <Button type="submit" size="lg" loading={isSubmitting}>
            {isSubmitting ? 'Criando conta…' : 'Criar conta e entrar'}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </form>

      <p className="mt-7 text-center text-[12.5px] text-ink-4">
        Não foi você que recebeu este convite?{' '}
        <a
          href="mailto:contato@grupows.com.br"
          className="font-semibold text-brand underline-offset-[3px] hover:underline"
        >
          Reportar
        </a>
      </p>
    </AuthStage>
  );
}
