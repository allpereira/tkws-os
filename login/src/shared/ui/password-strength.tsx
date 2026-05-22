/**
 * Indicador de força de senha — 4 segmentos editoriais (fraca/média/forte/excelente).
 *
 * Espelha o `.pw-strength` do design system V1, seção 09.6 (Aceitar convite +
 * Reset de senha). A lógica é client-side e usa heurística simples (comprimento +
 * classes de caracteres). A validação real de policy do Zitadel acontece no
 * servidor — esta indicação é só UX preditiva.
 */
import { cn } from '@/shared/lib/utils';

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

export function evaluatePasswordStrength(password: string): {
  level: PasswordStrengthLevel;
  label: string;
  hint: string;
} {
  if (!password) return { level: 0, label: '', hint: '' };

  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const classes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;

  // Critério: Zitadel default exige 12+ chars + 4 classes. Aqui apenas indicamos.
  if (length < 8) {
    return {
      level: 1,
      label: 'FRACA',
      hint: 'Mínimo 12 caracteres com letras, números e símbolos.',
    };
  }
  if (length < 12 || classes < 3) {
    return {
      level: 2,
      label: 'MÉDIA',
      hint: 'Adicione mais caracteres ou um símbolo para fortalecer.',
    };
  }
  if (length >= 12 && classes === 3) {
    return {
      level: 3,
      label: 'FORTE',
      hint: 'Bom! Um símbolo adicional eleva para excelente.',
    };
  }
  return {
    level: 4,
    label: 'EXCELENTE',
    hint: 'Senha robusta — pronta para usar.',
  };
}

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const { level, label, hint } = evaluatePasswordStrength(password);
  if (!password) return null;

  const colorByLevel: Record<PasswordStrengthLevel, string> = {
    0: 'bg-ink-5',
    1: 'bg-danger',
    2: 'bg-warning',
    3: 'bg-brand',
    4: 'bg-success',
  };

  return (
    <div className={cn('mt-2 space-y-1.5', className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((seg) => (
          <span
            key={seg}
            className={cn(
              'h-[3px] flex-1 rounded-full transition-colors',
              seg <= level ? colorByLevel[level] : 'bg-ink-5/40',
            )}
          />
        ))}
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-4">
        {label} {hint && <span className="normal-case tracking-normal text-ink-4">· {hint}</span>}
      </p>
    </div>
  );
}
