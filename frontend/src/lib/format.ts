/**
 * Formatadores de display · pt-BR · usando Intl nativo.
 * Nunca formate "na mão" — sempre use estas funções.
 */

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

const BRL_COMPACT = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const NUM = new Intl.NumberFormat('pt-BR')

const DATE = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const DATE_TIME = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const PERCENT = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

/** R$ 12.500,00 · recebe valor em REAIS (não centavos) */
export const formatBRL = (v: number | null | undefined) => (v == null ? '—' : BRL.format(v))

/** R$ 12,5K · R$ 1,2M · compacto para KPIs/charts */
export const formatBRLCompact = (v: number | null | undefined) =>
  v == null ? '—' : BRL_COMPACT.format(v)

/** 1.234.567 */
export const formatNumber = (v: number | null | undefined) => (v == null ? '—' : NUM.format(v))

/** 15/05/2026 */
export const formatDate = (v: string | Date | null | undefined) => {
  if (!v) return '—'
  const d = typeof v === 'string' ? new Date(v) : v
  if (Number.isNaN(d.getTime())) return '—'
  return DATE.format(d)
}

/** 15/05/2026 14:22 */
export const formatDateTime = (v: string | Date | null | undefined) => {
  if (!v) return '—'
  const d = typeof v === 'string' ? new Date(v) : v
  if (Number.isNaN(d.getTime())) return '—'
  return DATE_TIME.format(d)
}

/** 32% · recebe fração (0.32 = 32%) */
export const formatPercent = (v: number | null | undefined) => (v == null ? '—' : PERCENT.format(v))

/** "há 2 dias" · "há 14 minutos" · relativo simples */
export function formatRelative(v: string | Date | null | undefined) {
  if (!v) return '—'
  const d = typeof v === 'string' ? new Date(v) : v
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `há ${minutes} min`
  if (hours < 24) return `há ${hours}h`
  if (days < 30) return `há ${days}d`
  return formatDate(d)
}

/** 123.456.789-09 · CPF formatado */
export function formatCPF(digits: string) {
  const d = digits.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

/** 00.000.000/0000-00 · CNPJ formatado */
export function formatCNPJ(digits: string) {
  const d = digits.replace(/\D/g, '').slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

/** Inicial(is) de um nome para Avatar fallback */
export function initials(name: string, max = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, max)
    .join('')
    .toUpperCase()
}
