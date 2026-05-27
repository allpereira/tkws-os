import * as React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  LayoutGrid,
  Pencil,
  RefreshCw,
  Search,
  Table as TableIcon,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { DataTable, type DataTableColumn } from '@/components/tkws/data-table'
import { PageShell } from '@/components/tkws/page-shell'
import { SystemFrame } from '@/components/tkws/system-frame'
import { formatApiErrorInfo, parseApiError, toneForStatus } from '@/lib/api-error'
import { usePessoasPage } from '../api'
import type { Pessoa, PessoaListParams, SortPessoa, StatusPessoa, TipoPessoa } from '../schema'
import { PessoaCard } from './pessoa-card'

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
  /** Colunas da tabela (sem coluna de ações — é injetada quando há onEdit). */
  columns: DataTableColumn<Pessoa>[]
  /** Habilita "Editar" (menu no card / coluna na tabela) e clique para abrir. */
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

/**
 * Listagem reutilizável de Pessoas (Leads/Clientes) com:
 *  - busca textual, filtros (tipo PF/PJ · cidade · UF) e ordenação — server-side
 *  - alternância Tabela ⇄ Cards (preferência lembrada no navegador)
 *  - paginação inteligente integrada à API (envelope com `total`)
 *
 * Toda a UI vem do design-system (regra "DS → Frontend é espelho").
 */
export function PessoaListing({
  status,
  crumb,
  title,
  description,
  headerActions,
  columns,
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

  const hasFilters = !!q || !!cidade || !!tipo || !!uf

  // Qualquer mudança de filtro/ordenação/tamanho volta para a primeira página.
  React.useEffect(() => {
    setOffset(0)
  }, [q, cidade, tipo, uf, sort, pageSize, status])

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

  // Coluna de ações (Editar) injetada na tabela quando aplicável.
  const tableColumns: DataTableColumn<Pessoa>[] = onEdit
    ? [
        ...columns,
        {
          key: '__actions__',
          header: '',
          align: 'right',
          width: 'w-16',
          cell: (row) => (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Editar ${row.nomeContato}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(row)
                }}
              >
                <Pencil size={14} />
              </Button>
            </div>
          ),
        },
      ]
    : columns

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

        <ToggleGroup
          type="single"
          value={tipo || 'ALL'}
          onValueChange={(v: string) => v && setTipo(v === 'ALL' ? '' : (v as TipoPessoa))}
          aria-label="Filtrar por tipo"
        >
          <ToggleGroupItem value="ALL">Todos</ToggleGroupItem>
          <ToggleGroupItem value="PF">PF</ToggleGroupItem>
          <ToggleGroupItem value="PJ">PJ</ToggleGroupItem>
        </ToggleGroup>

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
      {hasFilters && (
        <div className="mb-3 flex items-center gap-2 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
          <span>
            {query.isPending ? 'Buscando…' : `${total} ${total === 1 ? 'resultado' : 'resultados'}`}
          </span>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 hover:underline"
            style={{ color: 'var(--brand)' }}
          >
            <X size={12} /> Limpar filtros
          </button>
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
            <DataTable
              data={items}
              columns={tableColumns}
              getRowKey={(r) => r.id}
              onRowClick={onEdit}
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
    </PageShell>
  )
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
