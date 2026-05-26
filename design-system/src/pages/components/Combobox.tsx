import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AlertTriangle, Check, ChevronDown, Plus } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field, FieldHint, Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const clientes = [
  { value: 'andrade', label: 'Família Andrade · Yachthouse 2104' },
  { value: 'titanium', label: 'WS Group · Cobertura Titanium' },
  { value: 'vitra', label: 'Família Costa · Vitra 1801' },
  { value: 'oz', label: 'Família Oz · Sky Resort' },
  { value: 'campo', label: 'Campo Belo Investments' },
]

const prompt: AIPrompt = {
  componente: 'Combobox',
  import: "import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'\nimport { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from '@/components/ui/command'",
  contexto:
    'Combobox = Select com busca fuzzy. Usa Popover + Command (cmdk) por baixo. Use para listas com 10+ opções ou quando o usuário precisa filtrar (clientes, fornecedores, contas).',
  quandoUsar: [
    'Lista de 10+ opções',
    'Busca fuzzy necessária (nome, CNPJ, código)',
    'Quando há padrão de digitar parte do nome',
  ],
  props: [
    { name: 'value', type: 'string', description: 'Selecionado · controlled' },
    { name: 'onValueChange', type: '(v: string) => void', description: 'Callback ao escolher' },
  ],
  antiPatterns: [
    'Combobox para 3 opções — use Select',
    'Combobox que aceita texto livre — vire Input ou MultiSelect',
    'Async sem debounce · bate na API a cada tecla → trava o front e estoura rate-limit',
    'Async sem AbortController · respostas antigas chegam depois e bagunçam a lista',
    'Async filtrando localmente com shouldFilter padrão · resultado da API some quando o termo muda',
  ],
  exemplo: `const [value, setValue] = useState('')

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">{value || 'Escolher cliente…'} <ChevronDown size={14}/></Button>
  </PopoverTrigger>
  <PopoverContent className="p-0">
    <Command>
      <CommandInput placeholder="Buscar cliente…" />
      <CommandList>
        <CommandEmpty>Nada encontrado.</CommandEmpty>
        <CommandGroup>
          {clientes.map(c => (
            <CommandItem key={c.value} onSelect={() => setValue(c.value)}>
              <Check className={value === c.value ? 'opacity-100' : 'opacity-0'} />
              {c.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>`,
  relacionados: ['Select', 'Command'],
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const triggerCls =
  'inline-flex h-10 w-80 items-center justify-between gap-2 rounded-md border px-3 text-[13.5px]'

function ComboboxInlineCreate() {
  const [tags, setTags] = useState<string[]>(['turnkey', 'cobertura', 'litoral', 'comercial', 'pré-obra'])
  const [value, setValue] = useState('')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tags
    return tags.filter((t) => t.toLowerCase().includes(q))
  }, [tags, query])

  const trimmed = query.trim()
  const exactMatch = tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())
  const showCreate = trimmed.length > 0 && !exactMatch

  const create = () => {
    setTags((cur) => [...cur, trimmed])
    setValue(trimmed)
    setQuery('')
    setOpen(false)
  }

  return (
    <Field className="max-w-sm">
      <Label htmlFor="tag-inline">Tag do projeto</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id="tag-inline"
            className={triggerCls}
            style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)', color: value ? 'var(--text)' : 'var(--text-mute)' }}
          >
            {value || 'Escolher ou criar tag…'}
            <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Buscar ou digitar nova tag…"
            />
            <CommandList>
              {filtered.length === 0 && !showCreate && <CommandEmpty>Nada encontrado.</CommandEmpty>}
              {filtered.length > 0 && (
                <CommandGroup heading="Tags">
                  {filtered.map((t) => (
                    <CommandItem
                      key={t}
                      value={t}
                      onSelect={() => {
                        setValue(t === value ? '' : t)
                        setQuery('')
                        setOpen(false)
                      }}
                    >
                      <Check
                        size={13}
                        className={cn('mr-2', value === t ? 'opacity-100' : 'opacity-0')}
                        style={{ color: 'var(--brand)' }}
                      />
                      {t}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {showCreate && (
                <>
                  {filtered.length > 0 && <CommandSeparator />}
                  <CommandGroup heading="Criar">
                    <CommandItem value={`__create__${trimmed}`} onSelect={create}>
                      <Plus size={13} className="mr-2" style={{ color: 'var(--brand)' }} />
                      <span>
                        Criar tag “<strong style={{ color: 'var(--brand)' }}>{trimmed}</strong>”
                      </span>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FieldHint>Digite o nome · se não existir, aparece a opção “Criar”.</FieldHint>
    </Field>
  )
}

type Fornecedor = {
  value: string
  label: string
  cnpj?: string
  categoria?: string
}

const categoriasFornecedor = [
  { value: 'marmoraria', label: 'Marmoraria' },
  { value: 'iluminacao', label: 'Iluminação' },
  { value: 'marcenaria', label: 'Marcenaria' },
  { value: 'metalurgia', label: 'Metalurgia' },
  { value: 'tecidos', label: 'Tecidos & estofados' },
]

function ComboboxModalCreate() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([
    { value: 'aco-forte', label: 'Aço Forte Ltda', cnpj: '12.345.678/0001-90', categoria: 'metalurgia' },
    { value: 'marmores-veneza', label: 'Mármores Veneza', cnpj: '98.765.432/0001-10', categoria: 'marmoraria' },
    { value: 'iluminacao-premium', label: 'Iluminação Premium', cnpj: '55.444.333/0001-22', categoria: 'iluminacao' },
  ])
  const [value, setValue] = useState('')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ nome: '', cnpj: '', categoria: 'marmoraria' })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return fornecedores
    return fornecedores.filter(
      (f) => f.label.toLowerCase().includes(q) || (f.cnpj ?? '').includes(q)
    )
  }, [fornecedores, query])

  const trimmed = query.trim()
  const exactMatch = fornecedores.some(
    (f) => f.label.toLowerCase() === trimmed.toLowerCase()
  )
  const showCreate = trimmed.length > 0 && !exactMatch

  const openCreate = () => {
    setForm({ nome: trimmed, cnpj: '', categoria: 'marmoraria' })
    setOpen(false)
    setModalOpen(true)
  }

  const save = (e: FormEvent) => {
    e.preventDefault()
    const name = form.nome.trim()
    if (!name) return
    const v = slug(name) || `fornecedor-${fornecedores.length + 1}`
    const novo: Fornecedor = { value: v, label: name, cnpj: form.cnpj, categoria: form.categoria }
    setFornecedores((cur) => [...cur, novo])
    setValue(v)
    setQuery('')
    setModalOpen(false)
  }

  const selected = fornecedores.find((f) => f.value === value)

  return (
    <>
      <Field className="max-w-sm">
        <Label htmlFor="fornecedor-modal">Fornecedor</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              id="fornecedor-modal"
              className={triggerCls}
              style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)', color: selected ? 'var(--text)' : 'var(--text-mute)' }}
            >
              {selected ? selected.label : 'Escolher fornecedor…'}
              <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command shouldFilter={false}>
              <CommandInput
                value={query}
                onValueChange={setQuery}
                placeholder="Buscar por nome ou CNPJ…"
              />
              <CommandList>
                {filtered.length === 0 && !showCreate && (
                  <CommandEmpty>Nada encontrado.</CommandEmpty>
                )}
                {filtered.length > 0 && (
                  <CommandGroup heading="Fornecedores">
                    {filtered.map((f) => (
                      <CommandItem
                        key={f.value}
                        value={f.value}
                        onSelect={() => {
                          setValue(f.value === value ? '' : f.value)
                          setQuery('')
                          setOpen(false)
                        }}
                      >
                        <Check
                          size={13}
                          className={cn('mr-2', value === f.value ? 'opacity-100' : 'opacity-0')}
                          style={{ color: 'var(--brand)' }}
                        />
                        <span className="flex flex-col">
                          <span>{f.label}</span>
                          {f.cnpj && (
                            <span className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                              {f.cnpj}
                            </span>
                          )}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {showCreate && (
                  <>
                    {filtered.length > 0 && <CommandSeparator />}
                    <CommandGroup heading="Não encontrou?">
                      <CommandItem value={`__create__${trimmed}`} onSelect={openCreate}>
                        <Plus size={13} className="mr-2" style={{ color: 'var(--brand)' }} />
                        <span>
                          Cadastrar “<strong style={{ color: 'var(--brand)' }}>{trimmed}</strong>”…
                        </span>
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
                {!showCreate && trimmed.length === 0 && (
                  <CommandGroup>
                    <CommandItem
                      value="__create__manual__"
                      onSelect={() => {
                        setForm({ nome: '', cnpj: '', categoria: 'marmoraria' })
                        setOpen(false)
                        setModalOpen(true)
                      }}
                    >
                      <Plus size={13} className="mr-2" style={{ color: 'var(--brand)' }} />
                      <span style={{ color: 'var(--brand)' }}>Cadastrar novo fornecedor…</span>
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FieldHint>O cadastro completo abre num modal e ao salvar já seleciona aqui.</FieldHint>
      </Field>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <form onSubmit={save}>
            <DialogHeader>
              <DialogTitle>Cadastrar fornecedor</DialogTitle>
              <DialogDescription>
                Você refina o cadastro depois em Suprimentos › Fornecedores. Aqui só o essencial.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid gap-3.5">
                <Field>
                  <Label htmlFor="m-fnome" required>
                    Razão social
                  </Label>
                  <Input
                    id="m-fnome"
                    autoFocus
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Mármores Veneza Ltda"
                  />
                </Field>
                <Field>
                  <Label htmlFor="m-cnpj">CNPJ</Label>
                  <Input
                    id="m-cnpj"
                    value={form.cnpj}
                    onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                    placeholder="00.000.000/0001-00"
                  />
                </Field>
                <Field>
                  <Label htmlFor="m-cat">Categoria</Label>
                  <Select
                    value={form.categoria}
                    onValueChange={(v) => setForm({ ...form, categoria: v })}
                  >
                    <SelectTrigger id="m-cat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasFornecedor.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!form.nome.trim()}>
                Cadastrar e selecionar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * D · Combobox async (busca direto na API)
 * ───────────────────────────────────────────────────────────────────────── */

type Empresa = { value: string; label: string; cnpj: string; cidade: string }

const MOCK_EMPRESAS: Empresa[] = [
  ['Andrade Engenharia', '12.345.678/0001-90', 'Florianópolis/SC'],
  ['Aço Forte Indústria', '23.456.789/0001-01', 'Joinville/SC'],
  ['Atelier Litoral', '34.567.890/0001-12', 'Balneário Camboriú/SC'],
  ['Bertotti Construtora', '45.678.901/0001-23', 'Curitiba/PR'],
  ['Brasil Mármores', '56.789.012/0001-34', 'Cachoeiro do Itapemirim/ES'],
  ['Campo Belo Investments', '67.890.123/0001-45', 'São Paulo/SP'],
  ['Casa Cobogó', '78.901.234/0001-56', 'Recife/PE'],
  ['Cobertura Titanium SPE', '89.012.345/0001-67', 'Itapema/SC'],
  ['Decora & Cia', '90.123.456/0001-78', 'Porto Alegre/RS'],
  ['Estofados Veneza', '01.234.567/0001-89', 'Bento Gonçalves/RS'],
  ['Família Andrade Holding', '11.222.333/0001-44', 'Florianópolis/SC'],
  ['Família Costa Investimentos', '22.333.444/0001-55', 'Itajaí/SC'],
  ['Famiglia Oz Patrimônio', '33.444.555/0001-66', 'São Paulo/SP'],
  ['Iluminação Premium SA', '44.555.666/0001-77', 'Campinas/SP'],
  ['Madeireira Atlântica', '55.666.777/0001-88', 'Blumenau/SC'],
  ['Mármores Veneza', '66.777.888/0001-99', 'Cachoeiro do Itapemirim/ES'],
  ['Metalurgia Sul', '77.888.999/0001-00', 'Caxias do Sul/RS'],
  ['Núcleo Arquitetura', '88.999.000/0001-11', 'Belo Horizonte/MG'],
  ['Plenum Casa', '99.000.111/0001-22', 'Brasília/DF'],
  ['Tecidos Donatelli', '10.111.222/0001-33', 'São Paulo/SP'],
  ['WS Group Empreendimentos', '20.222.333/0001-44', 'Itapema/SC'],
  ['Yachthouse 2104 SPE', '30.333.444/0001-55', 'Itajaí/SC'],
].map(([label, cnpj, cidade]) => ({
  value: slug(label),
  label,
  cnpj,
  cidade,
}))

/**
 * API simulada · 350-650ms de latência aleatória.
 * No real, troque por `fetch('/api/empresas?q=' + encodeURIComponent(q), { signal })`.
 */
async function searchEmpresasApi(q: string, signal: AbortSignal): Promise<Empresa[]> {
  const latency = 350 + Math.random() * 300
  await new Promise<void>((resolve, reject) => {
    const id = window.setTimeout(resolve, latency)
    const onAbort = () => {
      window.clearTimeout(id)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    if (signal.aborted) onAbort()
    else signal.addEventListener('abort', onAbort, { once: true })
  })
  const norm = q.toLowerCase()
  return MOCK_EMPRESAS.filter(
    (e) => e.label.toLowerCase().includes(norm) || e.cnpj.replace(/\D/g, '').includes(norm.replace(/\D/g, '')),
  ).slice(0, 8)
}

/** Hook genérico de debounce · adia o valor por `delay`ms desde a última mudança. */
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}

const MIN_CHARS = 2
const DEBOUNCE_MS = 280

type FetchStatus = 'idle' | 'loading' | 'ok' | 'error'

/**
 * Hook compartilhado · busca async + merge com itens criados localmente.
 *
 * Mantém as 7 travas anti-trava-do-front:
 *  - debounce no termo · não bate na API a cada tecla
 *  - mínimo de chars · não dispara em texto curto
 *  - cache por query · evita refetch
 *  - AbortController · cancela request obsoleto
 *  - seq tracker · descarta resposta tardia
 *  - itens locais (criados na sessão) entram no merge — sem refetch
 *  - status idle/loading/ok/error explícito
 */
function useAsyncEmpresaSearch(query: string, extraLocal: Empresa[]) {
  const debounced = useDebouncedValue(query.trim(), DEBOUNCE_MS)

  const [apiItems, setApiItems] = useState<Empresa[]>([])
  const [status, setStatus] = useState<FetchStatus>('idle')

  const cacheRef = useRef<Map<string, Empresa[]>>(new Map())
  const abortRef = useRef<AbortController | null>(null)
  const seqRef = useRef(0)

  useEffect(() => {
    if (debounced.length < MIN_CHARS) {
      setApiItems([])
      setStatus('idle')
      abortRef.current?.abort()
      return
    }
    const cached = cacheRef.current.get(debounced)
    if (cached) {
      setApiItems(cached)
      setStatus('ok')
      return
    }
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    const mySeq = ++seqRef.current
    setStatus('loading')

    searchEmpresasApi(debounced, ac.signal)
      .then((res) => {
        if (mySeq !== seqRef.current) return
        cacheRef.current.set(debounced, res)
        setApiItems(res)
        setStatus('ok')
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        if (mySeq !== seqRef.current) return
        setStatus('error')
      })

    return () => {
      ac.abort()
    }
  }, [debounced])

  // merge itens locais (criados nesta sessão) que casam com o termo
  // local sempre vem primeiro · dedupe por value (local prevalece)
  const items = useMemo(() => {
    if (debounced.length < MIN_CHARS) return []
    const norm = debounced.toLowerCase()
    const normDigits = debounced.replace(/\D/g, '')
    const localMatches = extraLocal.filter(
      (e) =>
        e.label.toLowerCase().includes(norm) ||
        (normDigits && e.cnpj.replace(/\D/g, '').includes(normDigits)),
    )
    const localValues = new Set(localMatches.map((e) => e.value))
    const apiOnly = apiItems.filter((e) => !localValues.has(e.value))
    return [...localMatches, ...apiOnly]
  }, [apiItems, extraLocal, debounced])

  const exactMatch = useMemo(() => {
    if (!debounced) return false
    const norm = debounced.toLowerCase()
    return items.some((e) => e.label.toLowerCase() === norm)
  }, [items, debounced])

  const isTyping = query.trim() !== debounced && query.trim().length >= MIN_CHARS

  const reset = () => {
    abortRef.current?.abort()
    setApiItems([])
    setStatus('idle')
  }

  return { items, status, debounced, exactMatch, isTyping, reset }
}

/**
 * Renderiza os estados idle / loading / error / empty da busca async.
 * Extraído pra evitar duplicação entre as 3 variantes (D, E, F).
 */
function AsyncSearchStates({
  status,
  hasItems,
  debounced,
  hasCreateAction,
}: {
  status: FetchStatus
  hasItems: boolean
  debounced: string
  hasCreateAction: boolean
}) {
  return (
    <>
      {status === 'idle' && (
        <div
          className="px-4 py-6 text-center text-[12.5px]"
          style={{ color: 'var(--text-mute)' }}
        >
          Digite pelo menos {MIN_CHARS} caracteres pra começar.
        </div>
      )}
      {status === 'loading' && !hasItems && (
        <div className="flex items-center justify-center gap-2 px-4 py-7">
          <Spinner size="sm" tone="brand" label="Buscando…" />
        </div>
      )}
      {status === 'error' && (
        <div
          className="flex items-center justify-center gap-2 px-4 py-6 text-[12.5px]"
          style={{ color: 'var(--danger)' }}
        >
          <AlertTriangle size={14} />
          Falha ao buscar. Verifique a conexão e tente outro termo.
        </div>
      )}
      {/* Quando há "Criar" abaixo, não mostramos CommandEmpty (a ação assume o espaço). */}
      {status === 'ok' && !hasItems && !hasCreateAction && (
        <CommandEmpty>Nada encontrado para “{debounced}”.</CommandEmpty>
      )}
    </>
  )
}

function EmpresaItem({
  empresa,
  selected,
  onPick,
  badge,
}: {
  empresa: Empresa
  selected: Empresa | null
  onPick: (e: Empresa) => void
  badge?: string
}) {
  return (
    <CommandItem
      key={empresa.value}
      value={empresa.value}
      onSelect={() => onPick(empresa)}
    >
      <Check
        size={13}
        className={cn('mr-2', selected?.value === empresa.value ? 'opacity-100' : 'opacity-0')}
        style={{ color: 'var(--brand)' }}
      />
      <span className="flex flex-1 flex-col">
        <span className="flex items-center gap-1.5">
          {empresa.label}
          {badge && (
            <span
              className="mono rounded-[4px] border px-1 py-px text-[9px] font-semibold uppercase tracking-wider"
              style={{
                color: 'var(--brand)',
                borderColor: 'var(--brand)',
                background: 'var(--brand-soft)',
              }}
            >
              {badge}
            </span>
          )}
        </span>
        <span className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
          {empresa.cnpj} · {empresa.cidade}
        </span>
      </span>
    </CommandItem>
  )
}

const NO_LOCAL: Empresa[] = []

/* ─── D · Async puro · sem create ──────────────────────────────────────── */

function ComboboxAsyncSearch() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Empresa | null>(null)
  const [query, setQuery] = useState('')

  const { items, status, debounced, isTyping, reset } = useAsyncEmpresaSearch(query, NO_LOCAL)

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setQuery('')
      reset()
    }
  }

  const choose = (e: Empresa) => {
    setSelected(e)
    onOpenChange(false)
  }

  return (
    <Field className="max-w-sm">
      <Label htmlFor="emp-async">Empresa</Label>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            id="emp-async"
            className={triggerCls}
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--line-2)',
              color: selected ? 'var(--text)' : 'var(--text-mute)',
            }}
          >
            <span className="truncate">{selected ? selected.label : 'Buscar empresa…'}</span>
            <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Nome ou CNPJ…"
              trailing={
                (status === 'loading' || isTyping) && (
                  <Spinner size="sm" tone="brand" aria-label="Buscando" />
                )
              }
            />
            <CommandList>
              <AsyncSearchStates
                status={status}
                hasItems={items.length > 0}
                debounced={debounced}
                hasCreateAction={false}
              />
              {items.length > 0 && (
                <CommandGroup
                  heading={`${items.length} resultado${items.length === 1 ? '' : 's'}`}
                >
                  {items.map((e) => (
                    <EmpresaItem key={e.value} empresa={e} selected={selected} onPick={choose} />
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FieldHint>
        Debounce {DEBOUNCE_MS}ms · mín. {MIN_CHARS} chars · aborta requests obsoletos · cache em memória.
      </FieldHint>
    </Field>
  )
}

/* ─── E · Async + adicionar inline ─────────────────────────────────────── */

function ComboboxAsyncInlineCreate() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Empresa | null>(null)
  const [query, setQuery] = useState('')
  const [createdItems, setCreatedItems] = useState<Empresa[]>([])

  const { items, status, debounced, exactMatch, isTyping, reset } = useAsyncEmpresaSearch(
    query,
    createdItems,
  )

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setQuery('')
      reset()
    }
  }

  const choose = (e: Empresa) => {
    setSelected(e)
    onOpenChange(false)
  }

  // só oferece criar quando a API já respondeu (ok ou error) e não há match exato
  const canCreate =
    debounced.length >= MIN_CHARS &&
    !exactMatch &&
    (status === 'ok' || status === 'error')

  const createInline = () => {
    const novo: Empresa = {
      value: `${slug(debounced)}-${Date.now()}`,
      label: debounced,
      cnpj: '— a preencher —',
      cidade: 'criado na sessão',
    }
    setCreatedItems((cur) => [novo, ...cur])
    choose(novo)
  }

  return (
    <Field className="max-w-sm">
      <Label htmlFor="emp-async-inline">Empresa</Label>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            id="emp-async-inline"
            className={triggerCls}
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--line-2)',
              color: selected ? 'var(--text)' : 'var(--text-mute)',
            }}
          >
            <span className="truncate">{selected ? selected.label : 'Buscar ou criar empresa…'}</span>
            <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[360px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Nome ou CNPJ…"
              trailing={
                (status === 'loading' || isTyping) && (
                  <Spinner size="sm" tone="brand" aria-label="Buscando" />
                )
              }
            />
            <CommandList>
              <AsyncSearchStates
                status={status}
                hasItems={items.length > 0}
                debounced={debounced}
                hasCreateAction={canCreate}
              />
              {items.length > 0 && (
                <CommandGroup
                  heading={`${items.length} resultado${items.length === 1 ? '' : 's'}`}
                >
                  {items.map((e) => (
                    <EmpresaItem
                      key={e.value}
                      empresa={e}
                      selected={selected}
                      onPick={choose}
                      badge={createdItems.some((c) => c.value === e.value) ? 'novo' : undefined}
                    />
                  ))}
                </CommandGroup>
              )}
              {canCreate && (
                <>
                  {items.length > 0 && <CommandSeparator />}
                  <CommandGroup heading="Não encontrou?">
                    <CommandItem value={`__create__${debounced}`} onSelect={createInline}>
                      <Plus size={13} className="mr-2" style={{ color: 'var(--brand)' }} />
                      <span>
                        Criar “<strong style={{ color: 'var(--brand)' }}>{debounced}</strong>” na hora
                      </span>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FieldHint>
        API busca + criação leve · novos entram no merge e ficam pesquisáveis na mesma sessão.
      </FieldHint>
    </Field>
  )
}

/* ─── F · Async + adicionar via modal ──────────────────────────────────── */

function ComboboxAsyncModalCreate() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Empresa | null>(null)
  const [query, setQuery] = useState('')
  const [createdItems, setCreatedItems] = useState<Empresa[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ label: '', cnpj: '', cidade: '' })

  const { items, status, debounced, exactMatch, isTyping, reset } = useAsyncEmpresaSearch(
    query,
    createdItems,
  )

  const closePopover = () => {
    setOpen(false)
    setQuery('')
    reset()
  }

  const onOpenChange = (next: boolean) => {
    if (!next) closePopover()
    else setOpen(next)
  }

  const choose = (e: Empresa) => {
    setSelected(e)
    closePopover()
  }

  const canCreate =
    debounced.length >= MIN_CHARS &&
    !exactMatch &&
    (status === 'ok' || status === 'error')

  const openCreate = () => {
    setForm({ label: debounced, cnpj: '', cidade: '' })
    setOpen(false)
    setModalOpen(true)
  }

  const save = (e: FormEvent) => {
    e.preventDefault()
    const label = form.label.trim()
    if (!label) return
    const novo: Empresa = {
      value: `${slug(label)}-${Date.now()}`,
      label,
      cnpj: form.cnpj.trim() || '—',
      cidade: form.cidade.trim() || '—',
    }
    setCreatedItems((cur) => [novo, ...cur])
    setSelected(novo)
    setQuery('')
    reset()
    setModalOpen(false)
  }

  return (
    <>
      <Field className="max-w-sm">
        <Label htmlFor="emp-async-modal">Empresa</Label>
        <Popover open={open} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <button
              id="emp-async-modal"
              className={triggerCls}
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--line-2)',
                color: selected ? 'var(--text)' : 'var(--text-mute)',
              }}
            >
              <span className="truncate">
                {selected ? selected.label : 'Buscar empresa…'}
              </span>
              <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[360px] p-0">
            <Command shouldFilter={false}>
              <CommandInput
                value={query}
                onValueChange={setQuery}
                placeholder="Nome ou CNPJ…"
                trailing={
                  (status === 'loading' || isTyping) && (
                    <Spinner size="sm" tone="brand" aria-label="Buscando" />
                  )
                }
              />
              <CommandList>
                <AsyncSearchStates
                  status={status}
                  hasItems={items.length > 0}
                  debounced={debounced}
                  hasCreateAction={canCreate}
                />
                {items.length > 0 && (
                  <CommandGroup
                    heading={`${items.length} resultado${items.length === 1 ? '' : 's'}`}
                  >
                    {items.map((e) => (
                      <EmpresaItem
                        key={e.value}
                        empresa={e}
                        selected={selected}
                        onPick={choose}
                        badge={createdItems.some((c) => c.value === e.value) ? 'novo' : undefined}
                      />
                    ))}
                  </CommandGroup>
                )}
                {canCreate && (
                  <>
                    {items.length > 0 && <CommandSeparator />}
                    <CommandGroup heading="Não encontrou?">
                      <CommandItem value={`__create__${debounced}`} onSelect={openCreate}>
                        <Plus size={13} className="mr-2" style={{ color: 'var(--brand)' }} />
                        <span>
                          Cadastrar “<strong style={{ color: 'var(--brand)' }}>{debounced}</strong>”…
                        </span>
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FieldHint>
          API busca + cadastro completo num Dialog · termo digitado vai pré-preenchido pro modal.
        </FieldHint>
      </Field>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <form onSubmit={save}>
            <DialogHeader>
              <DialogTitle>Cadastrar empresa</DialogTitle>
              <DialogDescription>
                A empresa não foi encontrada na API. Cadastre o essencial agora — você refina depois.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid gap-3.5">
                <Field>
                  <Label htmlFor="a-label" required>
                    Razão social
                  </Label>
                  <Input
                    id="a-label"
                    autoFocus
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    placeholder="Nome da empresa"
                  />
                </Field>
                <Field>
                  <Label htmlFor="a-cnpj">CNPJ</Label>
                  <Input
                    id="a-cnpj"
                    value={form.cnpj}
                    onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                  />
                </Field>
                <Field>
                  <Label htmlFor="a-cidade">Cidade/UF</Label>
                  <Input
                    id="a-cidade"
                    value={form.cidade}
                    onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                    placeholder="Florianópolis/SC"
                  />
                </Field>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!form.label.trim()}>
                Cadastrar e selecionar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function ComboboxPage() {
  const [value, setValue] = useState('')

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.4"
        category="Inputs · Combobox"
        title="Combobox"
        italic="select com busca fuzzy"
        description="Popover + Command (cmdk). Use para listas grandes onde a busca acelera. 10+ opções: combobox; menos, Select."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Buscar cliente" />
      <Showcase>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={triggerCls}
              style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)', color: 'var(--text)' }}
            >
              {value ? clientes.find((c) => c.value === value)?.label : 'Escolher cliente…'}
              <ChevronDown size={14} style={{ color: 'var(--text-mute)' }} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <CommandInput placeholder="Buscar cliente…" />
              <CommandList>
                <CommandEmpty>Nada encontrado.</CommandEmpty>
                <CommandGroup>
                  {clientes.map((c) => (
                    <CommandItem
                      key={c.value}
                      onSelect={() => setValue(c.value === value ? '' : c.value)}
                    >
                      <Check
                        size={13}
                        className={cn('mr-2', value === c.value ? 'opacity-100' : 'opacity-0')}
                        style={{ color: 'var(--brand)' }}
                      />
                      {c.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </Showcase>

      <SubHead
        num="B"
        title="Adicionar inline"
        italic="cria direto no dropdown"
        tag="cadastro leve"
      />
      <Showcase
        title="Inline"
        description="Quando o usuário digita e não há match exato, surge a opção “Criar …” dentro da própria lista. Clicar adiciona e seleciona — sem sair do contexto. Ideal para tags, etiquetas, classificações de 1 campo."
      >
        <ComboboxInlineCreate />
      </Showcase>

      <SubHead
        num="C"
        title="Adicionar via modal"
        italic="cadastro completo num Dialog"
        tag="cadastro com validação"
      />
      <Showcase
        title="Modal"
        description="A busca pode disparar “Cadastrar …” que abre um Dialog com mais campos (CNPJ, categoria, validação). Útil para entidades de domínio (fornecedor, cliente, conta contábil). O termo digitado é levado pré-preenchido pro modal."
      >
        <ComboboxModalCreate />
      </Showcase>

      <SubHead
        num="D"
        title="Busca assíncrona"
        italic="dados que vêm da API"
        tag="async · debounced"
      />
      <Showcase
        title="Async + debounce"
        description={`Pra listas que vivem no backend (empresas, contas contábeis, produtos). Sete travas anti-trava-do-front: (1) shouldFilter={false} — a API decide o filtro · (2) debounce ${DEBOUNCE_MS}ms no termo · (3) mínimo de ${MIN_CHARS} caracteres antes da 1ª chamada · (4) AbortController cancela request em curso quando o termo muda · (5) seq-tracker descarta resposta antiga que chegue depois de uma nova · (6) cache em memória por termo · (7) estados explícitos idle/loading/ok/error (sem “tela em branco” enquanto carrega).`}
      >
        <ComboboxAsyncSearch />
      </Showcase>

      <SubHead
        num="E"
        title="Async + adicionar inline"
        italic="busca na API e cria na hora se não achar"
        tag="async · inline create"
      />
      <Showcase
        title="Async + inline"
        description="Mesma busca da API, mas se o termo não casar exatamente com nenhum resultado, aparece “Criar …” no fim da lista. Criar é leve (1 campo · só o nome) e o item entra no merge — fica pesquisável e marcado com badge “novo” na mesma sessão sem refetch."
      >
        <ComboboxAsyncInlineCreate />
      </Showcase>

      <SubHead
        num="F"
        title="Async + adicionar via modal"
        italic="busca na API + cadastro completo num Dialog"
        tag="async · modal create"
      />
      <Showcase
        title="Async + modal"
        description="Quando o cadastro pede mais campos (CNPJ, cidade, validação) o item “Cadastrar …” abre um Dialog com o termo digitado pré-preenchido. Ao salvar, entra no merge local e é selecionado. Reaproveita o mesmo hook async de D/E, só troca a ação de criação."
      >
        <ComboboxAsyncModalCreate />
      </Showcase>
    </div>
  )
}
