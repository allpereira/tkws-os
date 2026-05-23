import * as React from 'react'
import { Input } from './input'

/**
 * PhoneInput · máscara BR (xx) xxxxx-xxxx
 * Para uso internacional, considere libphonenumber-js.
 */

function maskPhone(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  const len = digits.length
  if (len === 0) return ''
  if (len <= 2) return `(${digits}`
  if (len <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (len <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  error?: boolean
  disabled?: boolean
}

export function PhoneInput({ value, onChange, placeholder = '(47) 98xxx-xxxx', id, error, disabled }: PhoneInputProps) {
  return (
    <Input
      id={id}
      type="tel"
      inputMode="numeric"
      value={maskPhone(value)}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
      placeholder={placeholder}
      error={error}
      disabled={disabled}
      icon={<span className="mono text-[10px] font-bold" style={{ color: 'var(--text-mute)' }}>+55</span>}
    />
  )
}
