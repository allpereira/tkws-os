import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Switch } from './switch'
import { cn } from '@/lib/utils'

/**
 * SwitchField · wrapper de `Switch` integrado com react-hook-form via `Controller`.
 *
 * Por padrão exibe label/descrição dinâmicas conforme o estado do switch:
 *   - **Ativo**   → "Atualmente disponível para uso"
 *   - **Inativo** → "Indisponível para uso. Clicar para ativar!"
 *
 * Para personalizar (ex: concordância feminina, outro domínio), passe
 * `activeLabel/inactiveLabel/activeDescription/inactiveDescription`.
 *
 * Uso típico:
 *   <SwitchField control={control} name="ativo" />
 *
 * Customizado:
 *   <SwitchField
 *     control={control}
 *     name="ativo"
 *     activeLabel="Ativa"
 *     inactiveLabel="Inativa"
 *   />
 */

const DEFAULT_ACTIVE_LABEL = 'Ativo'
const DEFAULT_INACTIVE_LABEL = 'Inativo'
const DEFAULT_ACTIVE_DESCRIPTION = 'Atualmente disponível para uso'
const DEFAULT_INACTIVE_DESCRIPTION = 'Indisponível para uso. Clicar para ativar!'

export interface SwitchFieldProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>
  name: FieldPath<TFormValues>
  /** Label quando o switch está ligado. Default: "Ativo". */
  activeLabel?: string
  /** Label quando o switch está desligado. Default: "Inativo". */
  inactiveLabel?: string
  /** Descrição quando ligado. Default: "Atualmente disponível para uso". */
  activeDescription?: string
  /** Descrição quando desligado. Default: "Indisponível para uso. Clicar para ativar!". */
  inactiveDescription?: string
  /**
   * @deprecated Use `activeLabel`/`inactiveLabel`. Se passado, força label
   * fixo nos dois estados (compat com chamadas antigas).
   */
  label?: string
  /**
   * @deprecated Use `activeDescription`/`inactiveDescription`. Se passado,
   * força descrição fixa nos dois estados.
   */
  description?: string
  disabled?: boolean
  className?: string
}

export function SwitchField<TFormValues extends FieldValues>({
  control,
  name,
  activeLabel = DEFAULT_ACTIVE_LABEL,
  inactiveLabel = DEFAULT_INACTIVE_LABEL,
  activeDescription = DEFAULT_ACTIVE_DESCRIPTION,
  inactiveDescription = DEFAULT_INACTIVE_DESCRIPTION,
  label,
  description,
  disabled,
  className,
}: SwitchFieldProps<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const checked = Boolean(field.value)
        const currentLabel = label ?? (checked ? activeLabel : inactiveLabel)
        const currentDescription =
          description ?? (checked ? activeDescription : inactiveDescription)
        return (
          <label
            className={cn(
              'inline-flex cursor-pointer select-none items-start gap-3',
              disabled && 'cursor-not-allowed opacity-50',
              className,
            )}
          >
            <Switch
              checked={checked}
              onCheckedChange={(v) => field.onChange(v)}
              disabled={disabled}
              className="mt-0.5"
            />
            <span className="flex flex-col leading-tight">
              <span
                className="text-[13px] font-semibold"
                style={{ color: checked ? 'var(--text)' : 'var(--text-soft)' }}
              >
                {currentLabel}
              </span>
              <span className="mt-0.5 text-[11.5px]" style={{ color: 'var(--text-mute)' }}>
                {currentDescription}
              </span>
            </span>
          </label>
        )
      }}
    />
  )
}
