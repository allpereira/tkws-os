import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from './input'

/**
 * Masked inputs · variantes BR (CPF, CNPJ, CEP, RG, placa, conta bancária).
 * Cada componente exporta com máscara aplicada + armazenamento de dígitos puros.
 *
 * Também exporta:
 *  - InputAffix · input com banda prefix/suffix (ds-input-affix do HTML)
 *  - MoneyDisplay · campo Fraunces grande (ds-money-display do HTML)
 */

// ============================================================================
// InputAffix · prefix/suffix com bandas surface-3 separadas por linha
// ============================================================================
/**
 * Fiel ao HTML · ds-input-affix:
 *   flex stretch · bg surface-2 · border 1px line-2 · radius 10px
 *   prefix/suffix: bg surface-3 · mono 12.5px/600 text-mute · padding 0 12px
 *     prefix: radius 9px 0 0 9px + border-right line-1
 *     suffix: radius 0 9px 9px 0 + border-left line-1
 *   input: padding 10px 13px · bg transparent · font 14px tabular-nums
 *   focus-within: border brand · bg surface-1
 *   err: border danger · success: border success
 */

export interface InputAffixProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  state?: 'default' | 'success' | 'error'
  containerClassName?: string
}

export const InputAffix = React.forwardRef<HTMLInputElement, InputAffixProps>(
  ({ prefix, suffix, state = 'default', containerClassName, className, ...inputProps }, ref) => {
    const borderColor =
      state === 'error' ? 'var(--danger)' : state === 'success' ? 'var(--success)' : 'var(--line-2)'
    return (
      <div
        className={cn(
          'relative flex items-stretch overflow-hidden rounded-[10px] border transition-all focus-within:[&]:border-[var(--brand)] focus-within:[&]:bg-[var(--surface-1)]',
          containerClassName
        )}
        style={{
          background: 'var(--surface-2)',
          borderColor,
        }}
      >
        {prefix !== undefined && prefix !== null && (
          <span
            className="mono inline-flex select-none items-center px-3 text-[12.5px] font-semibold"
            style={{
              background: 'var(--surface-3)',
              color: 'var(--text-mute)',
              borderRight: '1px solid var(--line-1)',
            }}
          >
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          {...inputProps}
          className={cn(
            'num-tabular min-w-0 flex-1 bg-transparent px-[13px] py-[10px] text-[14px] outline-none placeholder:text-[var(--text-mute)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          style={{ color: 'var(--text)', ...inputProps.style }}
        />
        {suffix !== undefined && suffix !== null && (
          <span
            className="mono inline-flex select-none items-center px-3 text-[12.5px] font-semibold"
            style={{
              background: 'var(--surface-3)',
              color: 'var(--text-mute)',
              borderLeft: '1px solid var(--line-1)',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    )
  }
)
InputAffix.displayName = 'InputAffix'

// ============================================================================
// MoneyDisplay · valor em Fraunces grande enquanto digita
// ============================================================================
/**
 * Fiel ao HTML · ds-money-display:
 *   container bg surface-1 · border line-2 · radius 12px · padding 14px 18px · flex col gap 6
 *   label mono 10px / 1.3px uppercase text-mute / 600
 *   input-row: flex baseline gap 8px
 *     currency: Fraunces 20px text-soft / 400
 *     input: Fraunces 32px / 300 · letter-spacing -0.025em · tabular-nums
 *     unit: Fraunces 18px text-soft italic
 *   hint: 11.5px text-mute
 */

export interface MoneyDisplayProps {
  label: string
  /** centavos (1250000 = R$ 12.500,00) — se undefined, exibe placeholder */
  value: number | undefined
  onChange: (cents: number | undefined) => void
  currency?: string
  unit?: string
  hint?: React.ReactNode
  placeholder?: string
  /** Quando true, exibe input em estilo "percent": currency vira `%`, unit sumiu. */
  percent?: boolean
  id?: string
  className?: string
}

export function MoneyDisplay({
  label,
  value,
  onChange,
  currency = 'R$',
  unit = ',00',
  hint,
  placeholder = '0,00',
  percent = false,
  id,
  className,
}: MoneyDisplayProps) {
  const format = (v: number | undefined) => {
    if (v === undefined) return ''
    if (percent) {
      // mostra com vírgula decimal · v aqui representa "valor inteiro x 100"
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(v / 10)
    }
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v / 100)
  }

  return (
    <div
      className={cn('flex flex-col gap-1.5 rounded-[12px] border', className)}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-2)',
        padding: '14px 18px',
      }}
    >
      <span
        className="mono text-[10px] font-semibold uppercase tracking-[1.3px]"
        style={{ color: 'var(--text-mute)' }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        {!percent && (
          <span
            className="serif"
            style={{
              fontSize: 20,
              color: 'var(--text-soft)',
              fontWeight: 400,
            }}
          >
            {currency}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={format(value)}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '')
            onChange(digits === '' ? undefined : parseInt(digits, 10))
          }}
          className="num-tabular flex-1 bg-transparent outline-none placeholder:italic"
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: '-0.025em',
            color: 'var(--text)',
            border: 0,
          }}
        />
        {!percent && unit && (
          <span
            className="serif italic"
            style={{
              fontSize: 18,
              color: 'var(--text-soft)',
            }}
          >
            {unit}
          </span>
        )}
        {percent && (
          <span
            className="serif"
            style={{
              fontSize: 20,
              color: 'var(--text-soft)',
              fontWeight: 400,
            }}
          >
            %
          </span>
        )}
      </div>
      {hint && (
        <span className="text-[11.5px]" style={{ color: 'var(--text-mute)' }}>
          {hint}
        </span>
      )}
    </div>
  )
}


export interface MaskedProps {
  value: string
  onChange: (digitsOrFormatted: string) => void
  id?: string
  error?: boolean
  disabled?: boolean
  placeholder?: string
}

// ============================================================================
// CPF · 000.000.000-00
// ============================================================================
function maskCPF(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

export function CPFInput({ value, onChange, placeholder = '000.000.000-00', ...rest }: MaskedProps) {
  return (
    <Input
      {...rest}
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={maskCPF(value)}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
    />
  )
}

// ============================================================================
// CNPJ · 00.000.000/0000-00
// ============================================================================
function maskCNPJ(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

export function CNPJInput({ value, onChange, placeholder = '00.000.000/0000-00', ...rest }: MaskedProps) {
  return (
    <Input
      {...rest}
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={maskCNPJ(value)}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
    />
  )
}

// ============================================================================
// CEP · 00000-000
// ============================================================================
function maskCEP(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

export function CEPInput({ value, onChange, placeholder = '00000-000', ...rest }: MaskedProps) {
  return (
    <Input
      {...rest}
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={maskCEP(value)}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
    />
  )
}

// ============================================================================
// RG · 00.000.000-X (genérico · varia por estado)
// ============================================================================
function maskRG(raw: string) {
  const d = raw.replace(/[^\dxX]/g, '').slice(0, 9)
  if (d.length <= 2) return d.toUpperCase()
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`.toUpperCase()
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`.toUpperCase()
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}-${d.slice(8)}`.toUpperCase()
}

export function RGInput({ value, onChange, placeholder = '00.000.000-0', ...rest }: MaskedProps) {
  return (
    <Input
      {...rest}
      type="text"
      placeholder={placeholder}
      value={maskRG(value)}
      onChange={(e) => onChange(e.target.value.replace(/[^\dxX]/g, '').toUpperCase())}
    />
  )
}

// ============================================================================
// Placa de veículo · ABC-1234 ou ABC1D23 (Mercosul)
// ============================================================================
function maskPlate(raw: string) {
  const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 7)
  if (cleaned.length <= 3) return cleaned
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
}

export function PlateInput({ value, onChange, placeholder = 'ABC-1234', ...rest }: MaskedProps) {
  return (
    <Input
      {...rest}
      type="text"
      placeholder={placeholder}
      value={maskPlate(value)}
      onChange={(e) => onChange(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
    />
  )
}

// ============================================================================
// Money · digitar dígitos, formata como BRL
// ============================================================================
export interface MoneyInputProps {
  /** centavos · 1250000 = R$ 12.500,00 */
  value: number | undefined
  onChange: (cents: number | undefined) => void
  id?: string
  error?: boolean
  disabled?: boolean
}

export function MoneyInput({ value, onChange, ...rest }: MoneyInputProps) {
  const display = value === undefined
    ? ''
    : new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value / 100)

  return (
    <Input
      {...rest}
      type="text"
      inputMode="numeric"
      value={display}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, '')
        onChange(digits === '' ? undefined : parseInt(digits, 10))
      }}
      placeholder="R$ 0,00"
    />
  )
}
