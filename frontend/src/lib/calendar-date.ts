/**
 * Datas de calendário (sem hora) · contrato com API `LocalDate` / PostgreSQL `DATE`.
 *
 * Wire format: `yyyy-MM-dd` apenas. Nunca use `new Date('yyyy-MM-dd')` — o JS
 * interpreta como meia-noite UTC e desloca o dia em fusos como America/Sao_Paulo.
 *
 * @see docs/15-API-BEST-PRACTICES.md § Campos de data (LocalDate)
 */

import { format, isValid, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/** ISO date-only · alinhado a `z.string().date()` e `java.time.LocalDate`. */
export const CALENDAR_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function isCalendarDateString(v: string): boolean {
  return CALENDAR_DATE_RE.test(v)
}

/** Converte `yyyy-MM-dd` → `Date` em horário local (meia-noite local). */
export function parseCalendarDate(iso: string): Date | undefined {
  if (!isCalendarDateString(iso)) return undefined
  const d = parse(iso, 'yyyy-MM-dd', new Date())
  return isValid(d) ? d : undefined
}

/** Converte `Date` → `yyyy-MM-dd` pelos componentes locais (ano/mês/dia). */
export function toCalendarDateIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayCalendarDateIso(): string {
  return toCalendarDateIso(new Date())
}

export function addCalendarDays(iso: string, days: number): string {
  const base = parseCalendarDate(iso)
  if (!base) return iso
  const next = new Date(base)
  next.setDate(next.getDate() + days)
  return toCalendarDateIso(next)
}

export function compareCalendarDates(a: string, b: string): number {
  return a.localeCompare(b)
}

/** 30/06/2026 */
export function formatCalendarDatePtBr(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = parseCalendarDate(iso)
  if (!d) return '—'
  return format(d, 'dd/MM/yyyy', { locale: ptBR })
}

/** 30 jun · para cards compactos */
export function formatCalendarDateShortPtBr(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = parseCalendarDate(iso)
  if (!d) return '—'
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}
