import type { LeadTemperature } from '@/components/tkws/crm-lead-score'
import type { Deal } from '@/components/tkws/crm-deal-card'
import type { BadgeTone } from '@/components/ui/badge'
import type { Etapa } from '@/modules/crm/configuracoes/etapas/schema'
import type { Oferta } from '@/modules/organizacao/configuracoes/ofertas/schema'
import type { Pessoa } from '@/modules/crm/pessoas/schema'
import { formatCalendarDateShortPtBr } from '@/lib/calendar-date'
import { formatRelative, initials } from '@/lib/format'
import type { Oportunidade } from '../schema'

export interface KanbanTotals {
  total: number
  weighted: number
  hot: number
  stale: number
  count: number
}

export function pessoaLabel(pessoa: Pessoa | undefined): string {
  if (!pessoa) return 'Sem conta'
  if (pessoa.tipoPessoa === 'PJ' && pessoa.nomeEmpresa) return pessoa.nomeEmpresa
  return pessoa.nomeContato
}

export function temperatureFromProbability(probability: number): LeadTemperature {
  if (probability >= 70) return 'hot'
  if (probability >= 40) return 'warm'
  return 'cold'
}

export function staleDays(updatedAt: string): number | undefined {
  const diff = Date.now() - new Date(updatedAt).getTime()
  const days = Math.floor(diff / 86_400_000)
  return days >= 3 ? days : undefined
}

export function formatCloseShort(iso: string | null | undefined): string {
  return formatCalendarDateShortPtBr(iso)
}

export function ofertaTag(oferta: Oferta | undefined): { label: string; tone: BadgeTone } | undefined {
  if (!oferta) return undefined
  return { label: oferta.nome, tone: 'brand' }
}

export function computeKanbanTotals(
  oportunidades: Oportunidade[],
  etapaById: Map<string, Etapa>,
): KanbanTotals {
  let total = 0
  let weighted = 0
  let hot = 0
  let stale = 0
  for (const op of oportunidades) {
    const etapa = etapaById.get(op.etapaId)
    const prob = etapa?.probabilidade ?? 0
    total += op.valor
    weighted += (op.valor * prob) / 100
    if (temperatureFromProbability(prob) === 'hot') hot += 1
    if (staleDays(op.updatedAt)) stale += 1
  }
  return { total, weighted, hot, stale, count: oportunidades.length }
}

export function mapOportunidadeToDeal(
  op: Oportunidade,
  etapa: Etapa,
  account: string,
  tag?: { label: string; tone: BadgeTone },
): Deal {
  return {
    id: op.id,
    account,
    title: op.descricao,
    value: Math.round(op.valor * 100),
    probability: etapa.probabilidade,
    expectedClose: formatCloseShort(op.previsaoFechamento),
    owner: {
      initials: initials('Comercial', 2),
      name: formatRelative(op.updatedAt),
      color: 'var(--brand)',
    },
    temperature: temperatureFromProbability(etapa.probabilidade),
    tag,
  }
}

export function filterOportunidades(
  oportunidades: Oportunidade[],
  search: string,
  pessoaById: Map<string, Pessoa>,
): Oportunidade[] {
  const q = search.trim().toLowerCase()
  if (!q) return oportunidades
  return oportunidades.filter((op) => {
    const account = pessoaLabel(op.pessoaId ? pessoaById.get(op.pessoaId) : undefined).toLowerCase()
    const valor = String(op.valor)
    return (
      op.descricao.toLowerCase().includes(q) ||
      account.includes(q) ||
      valor.includes(q)
    )
  })
}
