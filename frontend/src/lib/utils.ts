import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind class merge · evita conflitos (p-2 + p-4 → p-4) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
