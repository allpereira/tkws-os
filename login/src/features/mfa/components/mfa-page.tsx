import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

import { useMfa } from '@/features/mfa/hooks/use-mfa';
import { useLoginFlowStore } from '@/features/login/store/login-flow-store';
import { Button } from '@/shared/ui/button';
import { Alert } from '@/shared/ui/alert';
import { Logo } from '@/shared/ui/logo';
import { AuthLayout } from '@/features/login/components/login-page';
import { cn } from '@/shared/lib/utils';

const CODE_LENGTH = 6;

export function MfaPage() {
  const navigate = useNavigate();
  const store = useLoginFlowStore();
  const { status, errorMessage, submit, goBack } = useMfa();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(CODE_LENGTH).fill(null));

  const isLoading = status === 'loading';
  const code = digits.join('');

  // Redireciona se não houver sessão (acesso direto à rota)
  useEffect(() => {
    if (!store.sessionId) {
      void navigate({ to: '/login', search: { authRequestId: undefined } });
    }
  }, [store.sessionId, navigate]);

  // Auto-submit quando todos os dígitos forem preenchidos
  useEffect(() => {
    if (code.length === CODE_LENGTH && !digits.includes('') && !isLoading) {
      void submit(code);
    }
  }, [code, digits, isLoading, submit]);

  function handleDigitChange(index: number, value: string) {
    // Aceita só dígito
    const digit = value.replace(/\D/g, '').slice(-1);

    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    // Avança o foco para o próximo campo
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        // Limpa o campo atual
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        // Retrocede o foco
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i] ?? '';
    }
    setDigits(next);

    // Foca o último campo preenchido
    const lastIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[lastIndex]?.focus();
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="lg" />
        </div>

        <div className="card-glass rounded-xl p-8 space-y-6">
          {/* Ícone + título */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft border border-brand/20">
              <ShieldCheck className="h-6 w-6 text-brand" />
            </div>
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-ink-1 tracking-tight">
                Verificação em duas etapas
              </h1>
              <p className="text-sm text-ink-4 leading-relaxed">
                Abra o aplicativo autenticador e informe
                o código de 6 dígitos.
              </p>
            </div>
          </div>

          {/* Erro */}
          {errorMessage && (
            <Alert variant="error" message={errorMessage} />
          )}

          {/* Input OTP */}
          <div
            className="flex justify-center gap-2"
            onPaste={handlePaste}
            role="group"
            aria-label="Código de verificação"
          >
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={(e) => e.target.select()}
                disabled={isLoading}
                aria-label={`Dígito ${index + 1} de ${CODE_LENGTH}`}
                className={cn(
                  'otp-digit',
                  isLoading && 'opacity-50 cursor-not-allowed',
                )}
              />
            ))}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-sm text-ink-4">
                <span className="h-4 w-4 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                Verificando…
              </div>
            </div>
          )}

          {/* Botão manual (caso auto-submit não dispare) */}
          {!isLoading && code.length === CODE_LENGTH && (
            <Button
              onClick={() => submit(code)}
              size="lg"
              className="w-full"
              loading={isLoading}
            >
              Verificar
            </Button>
          )}
        </div>

        {/* Voltar */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-xs text-ink-4 hover:text-brand transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Voltar para o login
          </button>
        </div>

        {/* Login name hint */}
        {store.loginName && (
          <p className="text-center text-xs text-ink-5">
            Entrando como{' '}
            <span className="text-ink-4">{store.loginName}</span>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}
