import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind class merge · evita conflitos (p-2 + p-4 → p-4) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formata BRL · "R$ 12.500" (sem centavos por padrão) */
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Formata número PT-BR · padrão 1 casa decimal */
export function formatNumber(value: number, maxFraction = 1) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: maxFraction,
  }).format(value)
}

/** Formata percentual · "12%" */
export function formatPercent(value: number, digits = 0) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    maximumFractionDigits: digits,
  }).format(value)
}
