import * as React from 'react'
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  Inbox,
  LayoutGrid,
  Pencil,
  RefreshCw,
  Search,
  Table as TableIcon,
  X,
} from 'lucide-react'
import { Avatar, initialsOf } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/ui/empty-state'
import { Field, Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle'
import { BulkActionBar } from '@/components/tkws/bulk-action-bar'
import { PageShell } from '@/components/tkws/page-shell'
import { SystemFrame } from '@/components/tkws/system-frame'
import { formatApiErrorInfo, parseApiError, toneForStatus } from '@/lib/api-error'
import { cn } from '@/lib/utils'
import { usePessoasPage } from '../api'
import type { Pessoa, PessoaListParams, SortPessoa, StatusPessoa, TipoPessoa } from '../schema'
import { PessoaCard, formatDocumento } from './pessoa-card'

type ViewMode = 'table' | 'cards'

const PAGE_SIZES = [24, 48, 96] as const
const DEFAULT_PAGE_SIZE = 24

/** UFs brasileiras · filtro de localização. */
const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

/** Debounce simples para não disparar request a cada tecla. */
function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

/** Preferência de visualização (tabela/cards) persistida no navegador. */
function usePersistedView(storageKey: string, fallback: ViewMode): [ViewMode, (v: ViewMode) => void] {
  const [view, setView] = React.useState<ViewMode>(() => {
    if (typeof window === 'undefined') return fallback
    const saved = window.localStorage.getItem(storageKey)
    return saved === 'table' || saved === 'cards' ? saved : fallback
  })
  const update = React.useCallback(
    (v: ViewMode) => {
      setView(v)
      try {
        window.localStorage.setItem(storageKey, v)
      } catch {
        /* localStorage indisponível · não bloqueia a UI */
      }
    },
    [storageKey],
  )
  return [view, update]
}

export interface PessoaListingProps {
  status: StatusPessoa
  crumb?: string
  title: string
  description?: string
  /** Ações do cabeçalho · ex.: botão "Novo lead". */
  headerActions?: React.ReactNode
  /** Habilita "Editar" (menu no card / ação na linha) e clique para abrir. */
  onEdit?: (p: Pessoa) => void
  /** Metadado extra no rodapé do card · ex.: data de conversão. */
  cardMeta?: (p: Pessoa) => React.ReactNode
  /** Oferece ordenar por "convertido recente" (útil em Clientes). */
  showConversaoSort?: boolean
  /** Chave de persistência da preferência de view. */
  viewStorageKey: string
  /** Visualização inicial quando não há preferência salva. Default: 'table'. */
  defaultView?: ViewMode
  emptyTitle?: string
  emptyDescription?: string
  /** Ação exibida no empty quando a lista está realmente vazia (sem filtros). */
  emptyAction?: React.ReactNode
}

interface SavedView {
  id: string
  label: string
  tipo: TipoPessoa | ''
}

const SAVED_VIEWS: SavedView[] = [
  { id: 'all', label: 'Todos', tipo: '' },
  { id: 'pf', label: 'Pessoas', tipo: 'PF' },
  { id: 'pj', label: 'Empresas', tipo: 'PJ' },
]

/**
 * Listagem reutilizável de Pessoas (Leads/Clientes) no padrão "Lista" do CRM
 * (espelha `/crm/atendimento`):
 *  - **visões salvas** (chips Todos · Pessoas · Empresas)
 *  - **filtros ativos** explícitos e removíveis (busca · cidade · UF)
 *  - **tabela editorial** (avatar + nome serif + rótulo mono + ações no hover)
 *  - **seleção em massa** com BulkActionBar (exportar CSV dos selecionados)
 *  - alternância Tabela ⇄ Cards · paginação server-side (envelope com `total`)
 *
 * Toda a UI vem do design-system (regra "DS → Frontend é espelho").
 */
export function PessoaListing({
  status,
  crumb,
  title,
  description,
  headerActions,
  onEdit,
  cardMeta,
  showConversaoSort,
  viewStorageKey,
  defaultView = 'table',
  emptyTitle,
  emptyDescription,
  emptyAction,
}: PessoaListingProps) {
  const [view, setView] = usePersistedView(viewStorageKey, defaultView)

  const [qInput, setQInput] = React.useState('')
  const [cidadeInput, setCidadeInput] = React.useState('')
  const q = useDebouncedValue(qInput.trim())
  const cidade = useDebouncedValue(cidadeInput.trim())
  const [tipo, setTipo] = React.useState<TipoPessoa | ''>('')
  const [uf, setUf] = React.useState('')
  const [sort, setSort] = React.useState<SortPessoa>('RECENTE')

  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE)
  const [offset, setOffset] = React.useState(0)

  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const hasFilters = !!q || !!cidade || !!tipo || !!uf

  // Qualquer mudança de filtro/ordenação/tamanho volta para a 1ª página e
  // limpa a seleção (que é por página · evita seleção fantasma cross-page).
  React.useEffect(() => {
    setOffset(0)
  }, [q, cidade, tipo, uf, sort, pageSize, status])
  React.useEffect(() => {
    setSelected(new Set())
  }, [q, cidade, tipo, uf, sort, pageSize, offset, status])

  const params: PessoaListParams = {
    status,
    q: q || undefined,
    tipoPessoa: tipo || undefined,
    cidade: cidade || undefined,
    uf: uf || undefined,
    sort,
    limit: pageSize,
    offset,
  }
  const query = usePessoasPage(params)
  const page = query.data
  const items = page?.content ?? []
  const total = page?.total ?? 0

  const clearFilters = () => {
    setQInput('')
    setCidadeInput('')
    setTipo('')
    setUf('')
  }

  const activeViewId = SAVED_VIEWS.find((v) => v.tipo === tipo)?.id ?? 'all'

  const selectedRows = items.filter((p) => selected.has(p.id))
  const allOnPageSelected = items.length > 0 && items.every((p) => selected.has(p.id))

  const toggleAll = () => {
    setSelected((prev) => {
      if (items.every((p) => prev.has(p.id))) {
        const next = new Set(prev)
        items.forEach((p) => next.delete(p.id))
        return next
      }
      const next = new Set(prev)
      items.forEach((p) => next.add(p.id))
      return next
    })
  }
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toolbar = (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
      <Field className="min-w-[220px] flex-1">
        <Input
          icon={<Search size={15} />}
          placeholder="Buscar por nome, empresa, e-mail ou documento…"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          aria-label="Buscar"
        />
      </Field>

      <Input
        className="w-[150px]"
        placeholder="Cidade"
        value={cidadeInput}
        onChange={(e) => setCidadeInput(e.target.value)}
        aria-label="Filtrar por cidade"
      />

      <Select value={uf || 'ALL'} onValueChange={(v) => setUf(v === 'ALL' ? '' : v)}>
        <SelectTrigger className="w-[110px]" aria-label="Filtrar por UF">
          <SelectValue placeholder="UF" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas UFs</SelectItem>
          {UFS.map((u) => (
            <SelectItem key={u} value={u}>
              {u}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => setSort(v as SortPessoa)}>
        <SelectTrigger className="w-[170px]" aria-label="Ordenar">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="RECENTE">Mais recentes</SelectItem>
          <SelectItem value="NOME">Nome (A–Z)</SelectItem>
          {showConversaoSort && <SelectItem value="CONVERSAO">Convertido recente</SelectItem>}
        </SelectContent>
      </Select>

      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(v: string) => v && setView(v as ViewMode)}
        aria-label="Modo de visualização"
      >
        <ToggleGroupItem value="table" aria-label="Tabela">
          <TableIcon size={15} />
        </ToggleGroupItem>
        <ToggleGroupItem value="cards" aria-label="Cards">
          <LayoutGrid size={15} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )

  return (
    <PageShell
      crumb={crumb}
      title={title}
      description={description}
      actions={headerActions}
      toolbar={toolbar}
    >
      {/* Visões salvas (chips) · padrão Lista do Atendimento */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]"
          style={{ color: 'var(--text-mute)' }}
        >
          Visões
        </span>
        {SAVED_VIEWS.map((v) => {
          const active = v.id === activeViewId
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setTipo(v.tipo)}
              aria-pressed={active}
              className={cn(
                'mono inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors',
                active ? 'cursor-default' : 'cursor-pointer hover:brightness-110',
              )}
              style={{
                background: active ? 'var(--brand-soft)' : 'var(--surface-2)',
                borderColor: active ? 'var(--brand)' : 'var(--line-2)',
                color: active ? 'var(--brand)' : 'var(--text-soft)',
              }}
            >
              {v.label}
            </button>
          )
        })}
      </div>

      {/* Filtros ativos · chips removíveis */}
      {(hasFilters || query.isFetching) && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[12.5px]">
          <span style={{ color: 'var(--text-mute)' }}>
            {query.isPending ? 'Buscando…' : `${total} ${total === 1 ? 'resultado' : 'resultados'}`}
          </span>
          {q && <FilterChip label="Busca" value={`“${q}”`} onClear={() => setQInput('')} />}
          {tipo && (
            <FilterChip
              label="Tipo"
              value={tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              onClear={() => setTipo('')}
            />
          )}
          {cidade && <FilterChip label="Cidade" value={cidade} onClear={() => setCidadeInput('')} />}
          {uf && <FilterChip label="UF" value={uf} onClear={() => setUf('')} />}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 hover:underline"
              style={{ color: 'var(--brand)' }}
            >
              <X size={12} /> Limpar tudo
            </button>
          )}
        </div>
      )}

      {/* Corpo */}
      {query.isError ? (
        (() => {
          const err = parseApiError(query.error)
          const big = err.status ? String(err.status) : err.isNetworkError ? '⚡' : '!'
          return (
            <SystemFrame
              bigNum={big}
              bigEmTone={toneForStatus(err)}
              label={`${err.statusText ?? 'Erro'} · ${title}`}
              title="Não conseguimos carregar"
              italic={`os dados de ${title.toLowerCase()}.`}
              description={err.message}
              info={formatApiErrorInfo(err)}
              actions={
                <Button onClick={() => query.refetch()}>
                  <RefreshCw size={14} /> Tentar novamente
                </Button>
              }
            />
          )
        })()
      ) : query.isPending ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size={20} label="Carregando registros" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Inbox size={20} strokeWidth={1.6} />}
          title={hasFilters ? 'Nenhum resultado' : (emptyTitle ?? title)}
          description={
            hasFilters
              ? 'Tente ajustar a busca ou os filtros.'
              : (emptyDescription ?? 'Ainda não há registros aqui.')
          }
          action={
            hasFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                <X size={14} /> Limpar filtros
              </Button>
            ) : (
              emptyAction
            )
          }
        />
      ) : (
        <div className={query.isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          {view === 'cards' ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => (
                <PessoaCard
                  key={p.id}
                  pessoa={p}
                  onClick={onEdit ? () => onEdit(p) : undefined}
                  onEdit={onEdit ? () => onEdit(p) : undefined}
                  meta={cardMeta?.(p)}
                />
              ))}
            </div>
          ) : (
            <PessoaEditorialTable
              items={items}
              status={status}
              selected={selected}
              allOnPageSelected={allOnPageSelected}
              onToggleAll={toggleAll}
              onToggleOne={toggleOne}
              onEdit={onEdit}
            />
          )}

          <PaginationFooter
            offset={offset}
            pageSize={pageSize}
            count={items.length}
            total={total}
            hasNext={page?.hasNext ?? false}
            onPageSize={setPageSize}
            onPrev={() => setOffset((o) => Math.max(0, o - pageSize))}
            onNext={() => setOffset((o) => o + pageSize)}
            busy={query.isFetching}
          />
        </div>
      )}

      {/* Barra de ações em massa · flutuante (DS) */}
      <BulkActionBar count={selected.size} onClear={() => setSelected(new Set())}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportPessoasCsv(selectedRows, title)}
          disabled={selectedRows.length === 0}
        >
          <Download size={13} /> Exportar CSV
        </Button>
      </BulkActionBar>
    </PageShell>
  )
}

/** Chip de filtro ativo · removível. */
function FilterChip({
  label,
  value,
  onClear,
}: {
  label: string
  value: string
  onClear: () => void
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px]"
      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)', color: 'var(--text-soft)' }}
    >
      <span className="mono text-[9.5px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--text-mute)' }}>
        {label}
      </span>
      <span style={{ color: 'var(--text)' }}>{value}</span>
      <button
        type="button"
        onClick={onClear}
        aria-label={`Remover filtro ${label}`}
        className="inline-flex items-center justify-center rounded-full transition-colors hover:text-[var(--danger)]"
        style={{ color: 'var(--text-mute)' }}
      >
        <X size={12} />
      </button>
    </span>
  )
}

/**
 * Tabela editorial de Pessoas · espelha o "Lista" do Atendimento:
 * checkbox de seleção, avatar + rótulo mono + nome serif, ação no hover.
 */
function PessoaEditorialTable({
  items,
  status,
  selected,
  allOnPageSelected,
  onToggleAll,
  onToggleOne,
  onEdit,
}: {
  items: Pessoa[]
  status: StatusPessoa
  selected: Set<string>
  allOnPageSelected: boolean
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onEdit?: (p: Pessoa) => void
}) {
  const showConvertido = status === 'CLIENTE'

  return (
    <div className="overflow-x-auto rounded-[12px] border" style={{ borderColor: 'var(--line-1)' }}>
      <table className="w-full text-[13px]" style={{ color: 'var(--text)' }}>
        <thead>
          <tr className="border-b" style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}>
            <th className="w-[40px] px-4 py-2.5 text-left">
              <Checkbox
                checked={allOnPageSelected}
                onCheckedChange={onToggleAll}
                aria-label="Selecionar todos"
              />
            </th>
            <Th>Nome</Th>
            <Th className="w-[80px]">Tipo</Th>
            <Th>Contato</Th>
            <Th className="w-[170px]">Documento</Th>
            {showConvertido && <Th className="w-[140px]">Cliente desde</Th>}
            <th className="w-[64px] px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const isPJ = p.tipoPessoa === 'PJ'
            const primary = isPJ && p.nomeEmpresa ? p.nomeEmpresa : p.nomeContato
            const secondary = isPJ
              ? p.nomeContato || 'Pessoa Jurídica'
              : [p.cidade, p.uf].filter(Boolean).join(' · ') || 'Pessoa Física'
            const doc = formatDocumento(p.documento, p.tipoPessoa)
            const isSelected = selected.has(p.id)

            return (
              <tr
                key={p.id}
                onClick={onEdit ? () => onEdit(p) : undefined}
                className={cn(
                  'group border-b transition-colors',
                  onEdit && 'cursor-pointer',
                  isSelected ? 'bg-[var(--brand-soft)]' : 'hover:bg-white/[0.025]',
                )}
                style={{ borderColor: 'var(--line-1)' }}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleOne(p.id)}
                    aria-label={`Selecionar ${primary}`}
                  />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>
                      {isPJ ? <Building2 size={14} /> : initialsOf(primary)}
                    </Avatar>
                    <div className="min-w-0">
                      <div
                        className="mono truncate text-[9.5px] font-semibold uppercase tracking-[1.1px]"
                        style={{ color: 'var(--text-mute)' }}
                      >
                        {secondary}
                      </div>
                      <div
                        className="serif mt-0.5 truncate text-[14px] font-normal leading-tight"
                        style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
                      >
                        {primary}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <Badge tone={isPJ ? 'purple' : 'brand'}>{p.tipoPessoa}</Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-col text-[12px]" style={{ color: 'var(--text-soft)' }}>
                    <span className="truncate">{p.emailContato ?? '—'}</span>
                    {p.celularContato && <span className="mono text-[11.5px]">{p.celularContato}</span>}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="mono text-[11.5px]" style={{ color: doc ? 'var(--text)' : 'var(--text-mute)' }}>
                    {doc ?? '—'}
                  </span>
                </td>
                {showConvertido && (
                  <td className="px-3 py-3">
                    <span className="mono text-[11.5px]" style={{ color: 'var(--text-soft)' }}>
                      {p.convertidoEm ? new Date(p.convertidoEm).toLocaleDateString('pt-BR') : '—'}
                    </span>
                  </td>
                )}
                <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  {onEdit && (
                    <div className="inline-flex opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar ${primary}`}
                        onClick={() => onEdit(p)}
                      >
                        <Pencil size={14} />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        'mono px-3 py-2.5 text-left text-[9.5px] font-bold uppercase tracking-[1.3px]',
        className,
      )}
      style={{ color: 'var(--text-mute)' }}
    >
      {children}
    </th>
  )
}

/** Exporta os registros selecionados como CSV (client-side · sem backend). */
function exportPessoasCsv(rows: Pessoa[], title: string) {
  if (rows.length === 0) return
  const headers = ['Nome', 'Tipo', 'Empresa', 'Email', 'Celular', 'Documento', 'Cidade', 'UF']
  const escape = (v: string | null | undefined) => {
    const s = (v ?? '').replace(/"/g, '""')
    return /[",\n;]/.test(s) ? `"${s}"` : s
  }
  const lines = rows.map((p) =>
    [
      p.nomeContato,
      p.tipoPessoa,
      p.nomeEmpresa,
      p.emailContato,
      p.celularContato,
      formatDocumento(p.documento, p.tipoPessoa),
      p.cidade,
      p.uf,
    ]
      .map(escape)
      .join(';'),
  )
  const csv = [headers.join(';'), ...lines].join('\n')
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${rows.length}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

interface PaginationFooterProps {
  offset: number
  pageSize: number
  count: number
  total: number
  hasNext: boolean
  busy?: boolean
  onPageSize: (n: number) => void
  onPrev: () => void
  onNext: () => void
}

function PaginationFooter({
  offset,
  pageSize,
  count,
  total,
  hasNext,
  busy,
  onPageSize,
  onPrev,
  onNext,
}: PaginationFooterProps) {
  const start = total === 0 ? 0 : offset + 1
  const end = offset + count
  const currentPage = Math.floor(offset / pageSize) + 1
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div
      className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-[12.5px]"
      style={{ borderColor: 'var(--line-1)', color: 'var(--text-soft)' }}
    >
      <div className="flex items-center gap-2">
        <span>
          {start}–{end} de {total}
        </span>
        <span className="opacity-50">·</span>
        <label className="flex items-center gap-1.5">
          <span>Por página</span>
          <Select value={String(pageSize)} onValueChange={(v) => onPageSize(Number(v))}>
            <SelectTrigger className="h-8 w-[72px]" aria-label="Itens por página">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={offset === 0 || busy}
          aria-label="Página anterior"
        >
          <ChevronLeft size={14} /> Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!hasNext || busy}
          aria-label="Próxima página"
        >
          Próxima <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}
