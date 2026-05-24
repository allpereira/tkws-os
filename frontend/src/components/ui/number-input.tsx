import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import { Input } from './input'
import { cn } from '@/lib/utils'

export interface NumberInputProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
  min?: number
  max?: number
  step?: number
  /** Formata como moeda BR · usa Intl.NumberFormat */
  currency?: boolean
  /** Sufixo · ex: "m²", "%" */
  suffix?: string
  placeholder?: string
  className?: string
  id?: string
  disabled?: boolean
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  currency,
  suffix,
  placeholder,
  className,
  id,
  disabled,
}: NumberInputProps) {
  const inc = () => {
    const next = (value ?? 0) + step
    if (max !== undefined && next > max) return
    onChange(next)
  }
  const dec = () => {
    const next = (value ?? 0) - step
    if (min !== undefined && next < min) return
    onChange(next)
  }

  const display = React.useMemo(() => {
    if (value === undefined) return ''
    if (currency) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
      }).format(value)
    }
    return new Intl.NumberFormat('pt-BR').format(value) + (suffix ? ` ${suffix}` : '')
  }, [value, currency, suffix])

  return (
    <div className={cn('relative inline-flex w-full', className)}>
      <button
        type="button"
        onClick={dec}
        disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
        aria-label="Diminuir"
        className="inline-flex h-10 w-9 cursor-pointer items-center justify-center rounded-l-md border border-r-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: 'var(--surface-2)',
          borderColor: 'var(--line-2)',
          color: 'var(--text-soft)',
        }}
      >
        <Minus size={13} />
      </button>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        value={display}
        placeholder={placeholder}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/[^\d,-]/g, '').replace(',', '.')
          const num = parseFloat(cleaned)
          onChange(isNaN(num) ? undefined : num)
        }}
        disabled={disabled}
        className="rounded-none text-center"
      />
      <button
        type="button"
        onClick={inc}
        disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
        aria-label="Aumentar"
        className="inline-flex h-10 w-9 cursor-pointer items-center justify-center rounded-r-md border border-l-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: 'var(--surface-2)',
          borderColor: 'var(--line-2)',
          color: 'var(--text-soft)',
        }}
      >
        <Plus size={13} />
      </button>
    </div>
  )
}
