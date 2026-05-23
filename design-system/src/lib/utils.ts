import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number, maxFraction = 1) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: maxFraction,
  }).format(value)
}

export function formatPercent(value: number, digits = 0) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    maximumFractionDigits: digits,
  }).format(value)
}
