import { useEffect, useMemo, useState } from 'react'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Check, ChevronDown, Plus } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { pessoasApi, pessoasKeys, usePessoaById, usePessoaSearch } from '../api'
import type { PessoaSearchResult, StatusPessoa } from '../schema'

export type PessoaComboboxInlineCreate = {
  status: StatusPessoa
  actionLabel: (name: string) => string
  hint?: string
}

const DEFAULT_INLINE_CREATE: PessoaComboboxInlineCreate = {
  status: 'LEAD',
  actionLabel: (name) => `Criar lead “${name}”`,
  hint: 'Cadastrado como PF · refine depois em CRM → Leads',
}

/**
 * PessoaCombobox · busca async de Pessoas (Lead/Cliente) com opção de
 * criar inline quando o termo não bate em nenhum resultado da API.
 *
 * Padrão alinhado com `ComboboxAsyncInlineCreate` do design-system:
 *   - Debounce 280ms no input
 *   - Mín. 2 caracteres antes da 1ª chamada
 *   - TanStack Query trata abort/cache/dedupe automaticamente
 *   - Itens criados na sessão entram no merge (sem refetch)
 *   - Estados explícitos idle/loading/ok/error
 *
 * Integração com react-hook-form via Controller (mesmo padrão do SelectField).
 */

const MIN_CHARS = 2
const DEBOUNCE_MS = 280

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}

function statusBadge(status: StatusPessoa): { label: string; color: string; bg: string } {
  switch (status) {
    case 'CLIENTE':
      return { label: 'cliente', color: 'var(--success)', bg: 'var(--success-soft, rgba(46, 160, 67, 0.12))' }
    case 'PARCEIRO':
      return { label: 'parceiro', color: 'var(--brand)', bg: 'var(--brand-soft)' }
    case 'FORNECEDOR':
      return { label: 'fornecedor', color: 'var(--text-mute)', bg: 'var(--surface-2)' }
    default:
      return { label: 'lead', color: 'var(--text-mute)', bg: 'var(--surface-2)' }
  }
}

function formatDoc(doc: string | null | undefined, tipo: 'PF' | 'PJ'): string | null {
  if (!doc) return null
  const d = doc.replace(/\D/g, '')
  if (tipo === 'PF' && d.length === 11) {
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
  }
  if (tipo === 'PJ' && d.length === 14) {
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
  }
  return doc
}

function meta(p: PessoaSearchResult): string {
  const parts: string[] = []
  const doc = formatDoc(p.documento, p.tipoPessoa)
  if (doc) parts.push(doc)
  if (p.cidade && p.uf) parts.push(`${p.cidade}/${p.uf}`)
  else if (p.cidade) parts.push(p.cidade)
  else if (p.uf) parts.push(p.uf)
  if (p.nomeEmpresa) parts.unshift(p.nomeEmpresa)
  return parts.join(' · ')
}

// ─── Wrapper RHF · mesmo padrão do SelectField ─────────────────────────────

export interface PessoaComboboxFieldProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>
  name: FieldPath<TFormValues>
  placeholder?: string
  state?: 'default' | 'error' | 'success'
  disabled?: boolean
  className?: string
  /** Restringe busca a um status (ex.: PARCEIRO). */
  statusFilter?: StatusPessoa
  /** Configura criação inline; `false` desabilita. */
  inlineCreate?: PessoaComboboxInlineCreate | false
}

export function PessoaComboboxField<TFormValues extends FieldValues>({
  control,
  name,
  placeholder = 'Buscar lead ou cliente…',
  state,
  disabled,
  className,
  statusFilter,
  inlineCreate = DEFAULT_INLINE_CREATE,
}: PessoaComboboxFieldProps<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <PessoaComboboxImpl
          value={(field.value as string | null | undefined) ?? null}
          onChange={field.onChange}
          onBlur={field.onBlur}
          placeholder={placeholder}
          state={state}
          disabled={disabled}
          className={className}
          statusFilter={statusFilter}
          inlineCreate={inlineCreate}
        />
      )}
    />
  )
}

// ─── Impl ──────────────────────────────────────────────────────────────────

interface PessoaComboboxImplProps {
  value: string | null
  onChange: (id: string | null) => void
  onBlur: () => void
  placeholder?: string
  state?: 'default' | 'error' | 'success'
  disabled?: boolean
  className?: string
  statusFilter?: StatusPessoa
  inlineCreate?: PessoaComboboxInlineCreate | false
}

function borderForState(s: 'default' | 'error' | 'success' | undefined): string {
  if (s === 'error') return 'var(--danger)'
  if (s === 'success') return 'var(--success)'
  return 'var(--line-2)'
}

function PessoaComboboxImpl({
  value,
  onChange,
  onBlur,
  placeholder,
  state = 'default',
  disabled,
  className,
  statusFilter,
  inlineCreate = DEFAULT_INLINE_CREATE,
}: PessoaComboboxImplProps) {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [createdItems, setCreatedItems] = useState<PessoaSearchResult[]>([])
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const debounced = useDebouncedValue(query.trim(), DEBOUNCE_MS)

  // TanStack Query · cuida de abort/cache/dedupe. Só dispara quando popover
  // aberto E termo >= MIN_CHARS (`enabled`).
  const searchQuery = usePessoaSearch(debounced, open, statusFilter)
  const apiItems = useMemo<PessoaSearchResult[]>(() => searchQuery.data ?? [], [searchQuery.data])
  const isLoading = open && debounced.length >= MIN_CHARS && searchQuery.isFetching
  const isTyping = query.trim() !== debounced && query.trim().length >= MIN_CHARS

  // Merge local + API · dedupe por id (local prevalece)
  const items = useMemo(() => {
    if (debounced.length < MIN_CHARS) return []
    const norm = debounced.toLowerCase()
    const normDigits = debounced.replace(/\D/g, '')
    const localMatches = createdItems.filter(
      (p) =>
        p.nomeContato.toLowerCase().includes(norm) ||
        (p.nomeEmpresa ?? '').toLowerCase().includes(norm) ||
        (normDigits !== '' && (p.documento ?? '').includes(normDigits)),
    )
    const localIds = new Set(localMatches.map((p) => p.id))
    const apiOnly = apiItems.filter((p) => !localIds.has(p.id))
    return [...localMatches, ...apiOnly]
  }, [apiItems, createdItems, debounced])

  const exactMatch = useMemo(() => {
    if (!debounced) return false
    const norm = debounced.toLowerCase()
    return items.some((p) => p.nomeContato.toLowerCase() === norm)
  }, [items, debounced])

  // Resolve o label do valor selecionado · prioriza fontes locais antes de
  // disparar um GET por ID extra (edição de Oportunidade existente).
  const selectedFromCreated = useMemo(
    () => (value ? createdItems.find((p) => p.id === value) ?? null : null),
    [value, createdItems],
  )
  const selectedFromSearch = useMemo(
    () => (value ? apiItems.find((p) => p.id === value) ?? null : null),
    [value, apiItems],
  )
  const needsFetchById = !!value && !selectedFromCreated && !selectedFromSearch
  const pessoaById = usePessoaById(value ?? '', needsFetchById)

  const displayedLabel: PessoaSearchResult | null = useMemo(() => {
    if (!value) return null
    if (selectedFromCreated) return selectedFromCreated
    if (selectedFromSearch) return selectedFromSearch
    if (pessoaById.data) {
      const p = pessoaById.data
      return {
        id: p.id,
        nomeContato: p.nomeContato,
        nomeEmpresa: p.nomeEmpresa ?? null,
        tipoPessoa: p.tipoPessoa,
        documento: p.documento ?? null,
        cidade: p.cidade ?? null,
        uf: p.uf ?? null,
        status: p.status,
      }
    }
    return null
  }, [value, selectedFromCreated, selectedFromSearch, pessoaById.data])

  const triggerLoading = !!value && !displayedLabel && pessoaById.isLoading

  const createConfig = inlineCreate === false ? null : inlineCreate

  const canCreate =
    createConfig !== null &&
    !creating &&
    debounced.length >= MIN_CHARS &&
    !exactMatch &&
    !searchQuery.isFetching &&
    (searchQuery.isSuccess || searchQuery.isError)

  const closePopover = () => {
    setOpen(false)
    setQuery('')
    setCreateError(null)
    onBlur()
  }

  const choose = (p: PessoaSearchResult) => {
    onChange(p.id === value ? null : p.id)
    closePopover()
  }

  const createInline = async () => {
    setCreating(true)
    setCreateError(null)
    try {
      const created = await pessoasApi.create({
        tipoPessoa: 'PF',
        nomeContato: debounced,
        status: createConfig?.status,
      })
      const light: PessoaSearchResult = {
        id: created.id,
        nomeContato: created.nomeContato,
        nomeEmpresa: created.nomeEmpresa ?? null,
        tipoPessoa: created.tipoPessoa,
        documento: created.documento ?? null,
        cidade: created.cidade ?? null,
        uf: created.uf ?? null,
        status: created.status,
      }
      setCreatedItems((cur) => [light, ...cur])
      // invalida listas em cache · próxima abertura de Leads vai refletir
      qc.invalidateQueries({ queryKey: pessoasKeys.all })
      choose(light)
    } catch (e) {
      setCreateError(
        e instanceof Error
          ? e.message
          : 'Não foi possível criar o cadastro. Verifique sua permissão e tente novamente.',
      )
    } finally {
      setCreating(false)
    }
  }

  const onOpenChange = (next: boolean) => {
    if (next) setOpen(true)
    else closePopover()
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-invalid={state === 'error'}
          className={cn(
            'flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-[10px] border px-[14px] py-[10px] text-[14px] outline-none transition-all',
            'focus:[&]:border-[var(--brand)] focus:[&]:bg-[var(--surface-1)]',
            'data-[state=open]:[&]:border-[var(--brand)] data-[state=open]:[&]:bg-[var(--surface-1)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          style={{
            background: 'var(--surface-2)',
            borderColor: borderForState(state),
            color: displayedLabel ? 'var(--text)' : 'var(--text-mute)',
          }}
        >
          <span className="line-clamp-1 flex-1 text-left">
            {triggerLoading
              ? 'Carregando…'
              : displayedLabel
              ? `${displayedLabel.nomeContato}${
                  displayedLabel.nomeEmpresa ? ' · ' + displayedLabel.nomeEmpresa : ''
                }`
              : placeholder}
          </span>
          <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[320px] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Nome, empresa ou CPF/CNPJ…"
            trailing={
              (isLoading || isTyping || creating) && (
                <Spinner size={14} label="Buscando" />
              )
            }
          />
          <CommandList>
            {debounced.length < MIN_CHARS && (
              <div
                className="px-4 py-6 text-center text-[12.5px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Digite pelo menos {MIN_CHARS} caracteres pra começar.
              </div>
            )}

            {isLoading && items.length === 0 && (
              <div className="flex items-center justify-center gap-2 px-4 py-7">
                <Spinner size={16} label="Buscando…" />
              </div>
            )}

            {searchQuery.isError && (
              <div
                className="flex items-center justify-center gap-2 px-4 py-6 text-[12.5px]"
                style={{ color: 'var(--danger)' }}
              >
                <AlertTriangle size={14} />
                Falha ao buscar pessoas. Verifique sua conexão.
              </div>
            )}

            {searchQuery.isSuccess && items.length === 0 && !canCreate && (
              <CommandEmpty>Nada encontrado para “{debounced}”.</CommandEmpty>
            )}

            {items.length > 0 && (
              <CommandGroup
                heading={`${items.length} ${items.length === 1 ? 'pessoa' : 'pessoas'}`}
              >
                {items.map((p) => {
                  const isCreated = createdItems.some((c) => c.id === p.id)
                  const badge = statusBadge(p.status)
                  const m = meta(p)
                  return (
                    <CommandItem key={p.id} value={p.id} onSelect={() => choose(p)}>
                      <Check
                        size={13}
                        className={cn('mr-2', value === p.id ? 'opacity-100' : 'opacity-0')}
                        style={{ color: 'var(--brand)' }}
                      />
                      <span className="flex flex-1 flex-col">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate">{p.nomeContato}</span>
                          <span
                            className="mono shrink-0 rounded-[4px] px-1 py-px text-[9px] font-semibold uppercase tracking-wider"
                            style={{
                              color: badge.color,
                              background: badge.bg,
                              border: `1px solid ${badge.color}`,
                            }}
                          >
                            {badge.label}
                          </span>
                          {isCreated && (
                            <span
                              className="mono shrink-0 rounded-[4px] border px-1 py-px text-[9px] font-semibold uppercase tracking-wider"
                              style={{
                                color: 'var(--brand)',
                                borderColor: 'var(--brand)',
                                background: 'var(--brand-soft)',
                              }}
                            >
                              novo
                            </span>
                          )}
                        </span>
                        {m && (
                          <span
                            className="mono truncate text-[10.5px]"
                            style={{ color: 'var(--text-mute)' }}
                          >
                            {m}
                          </span>
                        )}
                      </span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}

            {canCreate && (
              <>
                {items.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Não encontrou?">
                  <CommandItem
                    value={`__create__${debounced}`}
                    onSelect={createInline}
                    disabled={creating}
                  >
                    {creating ? (
                      <Spinner size={13} className="mr-2" />
                    ) : (
                      <Plus size={13} className="mr-2" style={{ color: 'var(--brand)' }} />
                    )}
                    <span className="flex flex-col">
                      <span>
                        {createConfig ? createConfig.actionLabel(debounced) : debounced}
                      </span>
                      {createConfig?.hint && (
                        <span
                          className="mono text-[10.5px]"
                          style={{ color: 'var(--text-mute)' }}
                        >
                          {createConfig.hint}
                        </span>
                      )}
                    </span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}

            {createError && (
              <div
                className="border-t px-4 py-3 text-[12px]"
                style={{ borderColor: 'var(--line-1)', color: 'var(--danger)' }}
              >
                {createError}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
