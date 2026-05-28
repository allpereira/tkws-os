import { describe, expect, it } from 'vitest'
import {
  addCalendarDays,
  compareCalendarDates,
  formatCalendarDatePtBr,
  formatCalendarDateShortPtBr,
  isCalendarDateString,
  parseCalendarDate,
  toCalendarDateIso,
} from '../calendar-date'

describe('calendar-date', () => {
  it('identifica string yyyy-MM-dd', () => {
    expect(isCalendarDateString('2026-06-30')).toBe(true)
    expect(isCalendarDateString('2026-06-30T00:00:00Z')).toBe(false)
  })

  it('parse e exibição pt-BR preservam o dia civil em America/Sao_Paulo', () => {
    const iso = '2026-06-30'
    expect(formatCalendarDatePtBr(iso)).toBe('30/06/2026')
    expect(formatCalendarDateShortPtBr(iso)).toMatch(/30/)
  })

  it('toCalendarDateIso usa componentes locais (não UTC)', () => {
    const utcMidnightJune30 = new Date(Date.UTC(2026, 5, 30))
    expect(toCalendarDateIso(utcMidnightJune30)).toBe('2026-06-29')
    const localJune30 = new Date(2026, 5, 30)
    expect(toCalendarDateIso(localJune30)).toBe('2026-06-30')
  })

  it('round-trip parse → iso', () => {
    const iso = '2026-06-30'
    const d = parseCalendarDate(iso)
    expect(d).toBeDefined()
    expect(toCalendarDateIso(d!)).toBe(iso)
  })

  it('compareCalendarDates ordena lexicograficamente', () => {
    expect(compareCalendarDates('2026-06-29', '2026-06-30')).toBeLessThan(0)
    expect(compareCalendarDates('2026-06-30', '2026-06-30')).toBe(0)
  })

  it('addCalendarDays soma dias no calendário civil', () => {
    expect(addCalendarDays('2026-06-30', 1)).toBe('2026-07-01')
    expect(addCalendarDays('2026-02-28', 1)).toBe('2026-03-01')
  })

  it('não confunde com new Date(iso) — anti-regressão', () => {
    const iso = '2026-06-30'
    const wrong = new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    expect(wrong).toBe('29/06/2026')
    expect(formatCalendarDatePtBr(iso)).toBe('30/06/2026')
  })
})
