import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { cn } from '@/lib/utils'

/**
 * SelectField · wrapper do Radix `Select` integrado com react-hook-form via `Controller`.
 *
 * Padrão de uso com `options` array (caso mais comum):
 *   <SelectField
 *     control={control}
 *     name="tipoPessoa"
 *     placeholder="Selecione…"
 *     options={[
 *       { value: 'fisica', label: 'Pessoa Física' },
 *       { value: 'juridica', label: 'Pessoa Jurídica' },
 *     ]}
 *   />
 *
 * Caso queira customizar items (com ícones, etc.), use `<Select>` direto com
 * `Controller` em vez de SelectField (importe os primitivos de `./select`).
 *
 * O Radix Select **não funciona com `{...register()}`** — precisa de `Controller`,
 * que esse wrapper resolve.
 */

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectFieldProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>
  name: FieldPath<TFormValues>
  options: ReadonlyArray<SelectOption>
  placeholder?: string
  /** Borda vermelha quando há erro de validação. */
  state?: 'default' | 'error' | 'success'
  /** @deprecated use `state="error"`. */
  error?: boolean
  disabled?: boolean
  className?: string
  /** Marca o campo como required no a11y (HTML attribute, não impõe validação). */
  required?: boolean
  /** Valor que representa "vazio" / "nenhum" · default `''` (string vazia). */
  emptyValue?: string
}

function borderForState(s: 'default' | 'error' | 'success') {
  if (s === 'error') return 'var(--danger)'
  if (s === 'success') return 'var(--success)'
  return 'var(--line-2)'
}

export function SelectField<TFormValues extends FieldValues>({
  control,
  name,
  options,
  placeholder = 'Selecione…',
  state,
  error,
  disabled,
  className,
  required,
  emptyValue = '',
}: SelectFieldProps<TFormValues>) {
  const resolvedState: 'default' | 'error' | 'success' = state ?? (error ? 'error' : 'default')

  // `optionsSig` força o Radix Select a remontar quando o conjunto de opções
  // muda (workaround conhecido · Radix Select 1.x não recalcula `SelectContent`
  // se as `Items` mudam de identidade após o mount). Quando a lista chega via
  // hook (TanStack Query), o componente atualiza visualmente sem precisar
  // fechar/abrir o modal de novo.
  const optionsSig = options.map((o) => o.value).join('|')

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value == null ? emptyValue : String(field.value)
        return (
          <Select
            key={optionsSig}
            value={value || undefined}
            onValueChange={(v) => field.onChange(v)}
            disabled={disabled}
            required={required}
          >
            <SelectTrigger
              className={cn(className)}
              style={{ borderColor: borderForState(resolvedState) }}
              aria-invalid={resolvedState === 'error'}
              onBlur={field.onBlur}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }}
    />
  )
}
