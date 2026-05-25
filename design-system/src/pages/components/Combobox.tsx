import { useMemo, useState, type FormEvent } from 'react'
import { Check, ChevronDown, Plus } from 'lucide-react'
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
    </div>
  )
}
