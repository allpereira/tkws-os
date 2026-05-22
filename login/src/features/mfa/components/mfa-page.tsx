import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { useMfa } from '@/features/mfa/hooks/use-mfa';
import { useLoginFlowStore } from '@/features/login/store/login-flow-store';
import { Button } from '@/shared/ui/button';
import { Alert } from '@/shared/ui/alert';
import { AuthStage } from '@/shared/ui/auth-stage';
import { cn } from '@/shared/lib/utils';

const CODE_LENGTH = 6;

export function MfaPage() {
  const navigate = useNavigate();
  const sessionId = useLoginFlowStore((s) => s.sessionId);
  const loginName = useLoginFlowStore((s) => s.loginName);
  const { status, errorMessage, submit, goBack } = useMfa();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    Array(CODE_LENGTH).fill(null),
  );

  const isLoading = status === 'loading';
  const code = digits.join('');

  // Redireciona se não houver sessão (acesso direto à rota).
  useEffect(() => {
    if (!sessionId) {
      void navigate({ to: '/login', search: { authRequestId: undefined } });
    }
  }, [sessionId, navigate]);

  // Auto-submit quando os 6 dígitos estiverem preenchidos.
  useEffect(() => {
    if (code.length === CODE_LENGTH && !digits.includes('') && !isLoading) {
      void submit(code);
    }
  }, [code, digits, isLoading, submit]);

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
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
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i] ?? '';
    }
    setDigits(next);
    const lastIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[lastIndex]?.focus();
  }

  return (
    <AuthStage
      quote={
        <>
          "Anos
          <br />
          <em>à frente.</em>"
        </>
      }
      quoteCite="· Years Ahead"
      metaLeft="2FA · obrigatório p/ admin"
      metaRight="código expira em 10min"
    >
      <p className="mb-[22px] font-mono text-[10px] uppercase tracking-[0.15em] text-ink-4">
        Verificação em dois passos
      </p>

      <h1 className="mb-3 font-editorial text-[38px] font-light leading-[1.05] tracking-[-0.03em] text-ink-1">
        Insira o código <em className="font-light italic text-ink-3">de 6 dígitos.</em>
      </h1>
      <p className="mb-[30px] max-w-[360px] text-[14px] leading-[1.55] text-ink-3">
        Abra o app autenticador (1Password, Authy, Google Authenticator) e
        digite o código que aparece para "TKWS OS".
      </p>

      <div className="space-y-5">
        {errorMessage && <Alert variant="error" message={errorMessage} />}

        <div
          className="flex items-center justify-center gap-2"
          onPaste={handlePaste}
          role="group"
          aria-label="Código de verificação"
        >
          {digits.flatMap((digit, index) => {
            const input = (
              <input
                key={`digit-${index}`}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
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
                  'h-14 w-11 rounded-[10px] border border-line-2 bg-surface-2',
                  'text-center font-editorial text-2xl font-light text-ink-1',
                  'caret-brand transition-[border-color,background-color] duration-150',
                  'focus:outline-none focus:border-brand focus:bg-surface-1',
                  isLoading && 'cursor-not-allowed opacity-40',
                )}
              />
            );
            // Separador "·" no meio dos 6 dígitos (entre o 3º e o 4º).
            if (index === 2) {
              return [
                input,
                <span
                  key="sep"
                  aria-hidden="true"
                  className="select-none text-ink-4"
                >
                  ·
                </span>,
              ];
            }
            return [input];
          })}
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-sm text-ink-4">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              Verificando…
            </div>
          </div>
        )}

        {!isLoading && code.length === CODE_LENGTH && (
          <Button
            onClick={() => submit(code)}
            size="lg"
            loading={isLoading}
          >
            Verificar e entrar
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="mt-7 flex flex-col items-center gap-2 text-[12.5px] text-ink-4">
        <button
          type="button"
          onClick={goBack}
          className="font-semibold text-brand underline-offset-[3px] hover:underline"
        >
          ← Voltar para entrar com senha
        </button>
        {loginName && (
          <span className="text-ink-5">
            Entrando como <span className="text-ink-4">{loginName}</span>
          </span>
        )}
      </div>
    </AuthStage>
  );
}
