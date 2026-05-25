import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select'
import { Field, Input, FieldHint } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Select',
  import: "import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'",
  contexto:
    'Select dropdown nativo customizado · até ~10 opções. Para mais (busca), use Combobox. Suporta grupos com SelectGroup + SelectLabel.',
  quandoUsar: [
    'Lista de opções fixa (status, UF, tipo de projeto)',
    '≤ 10 opções · acima disso, use Combobox com busca',
    'Quando há ordem natural (estados, prioridades)',
  ],
  props: [
    { name: 'value / onValueChange', type: 'controlled', description: 'Controle externo (RHF Controller)' },
    { name: 'defaultValue', type: 'string', description: 'Valor inicial' },
    { name: 'disabled', type: 'boolean', description: 'Bloqueia abertura' },
  ],
  antiPatterns: [
    'Select com 30+ opções — vire Combobox',
    'Select sem placeholder no Value',
    'Usar value para guardar objeto — só strings/numbers',
  ],
  exemplo: `<Field>
  <Label htmlFor="status">Status</Label>
  <Select onValueChange={(v) => form.setValue('status', v)}>
    <SelectTrigger id="status">
      <SelectValue placeholder="Escolher status…" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="draft">Rascunho</SelectItem>
      <SelectItem value="active">Ativo</SelectItem>
      <SelectItem value="done">Concluído</SelectItem>
    </SelectContent>
  </Select>
</Field>`,
  relacionados: ['Combobox', 'RadioGroup'],
}

const CREATE_VALUE = '__create__'

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function SelectInlineCreate() {
  const [options, setOptions] = useState([
    { value: 'materiais', label: 'Materiais' },
    { value: 'servicos', label: 'Serviços' },
    { value: 'mobiliario', label: 'Mobiliário' },
  ])
  const [value, setValue] = useState('')
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')
  const [err, setErr] = useState<string | null>(null)

  const handleChange = (v: string) => {
    if (v === CREATE_VALUE) {
      setAdding(true)
      setDraft('')
      setErr(null)
    } else {
      setValue(v)
    }
  }

  const save = () => {
    const name = draft.trim()
    if (!name) {
      setErr('Informe um nome.')
      return
    }
    const v = slug(name)
    if (options.some((o) => o.value === v)) {
      setErr('Já existe uma opção com esse nome.')
      return
    }
    setOptions((cur) => [...cur, { value: v, label: name }])
    setValue(v)
    setAdding(false)
    setDraft('')
    setErr(null)
  }

  const cancel = () => {
    setAdding(false)
    setDraft('')
    setErr(null)
  }

  return (
    <Field className="max-w-sm">
      <Label htmlFor="cat-inline">Categoria</Label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger id="cat-inline">
          <SelectValue placeholder="Escolher categoria…" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
          <SelectSeparator />
          <SelectItem value={CREATE_VALUE}>
            <span className="flex items-center gap-2" style={{ color: 'var(--brand)' }}>
              <Plus size={12} />
              Adicionar categoria…
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      {adding && (
        <div
          className="mt-2 rounded-[10px] border p-2.5"
          style={{ borderColor: 'var(--brand)', background: 'var(--brand-soft)' }}
        >
          <div
            className="mono mb-2 text-[10px] font-semibold uppercase tracking-[1.2px]"
            style={{ color: 'var(--brand)' }}
          >
            Nova categoria
          </div>
          <div className="flex gap-1.5">
            <Input
              autoFocus
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                if (err) setErr(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  save()
                }
                if (e.key === 'Escape') cancel()
              }}
              state={err ? 'error' : 'default'}
              placeholder="Ex.: Iluminação"
            />
            <Button size="sm" onClick={save}>
              Adicionar
            </Button>
            <Button size="sm" variant="ghost" onClick={cancel}>
              Cancelar
            </Button>
          </div>
          {err && (
            <div className="mt-1.5">
              <FieldHint state="error">{err}</FieldHint>
            </div>
          )}
        </div>
      )}
    </Field>
  )
}

function SelectModalCreate() {
  const [options, setOptions] = useState([
    { value: 'andrade', label: 'Família Andrade · Yachthouse 2104' },
    { value: 'titanium', label: 'WS Group · Cobertura Titanium' },
    { value: 'campo', label: 'Campo Belo Investments' },
  ])
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nome: '', tipo: 'pf', email: '' })

  const handleChange = (v: string) => {
    if (v === CREATE_VALUE) {
      setForm({ nome: '', tipo: 'pf', email: '' })
      setOpen(true)
    } else {
      setValue(v)
    }
  }

  const save = (e: FormEvent) => {
    e.preventDefault()
    const name = form.nome.trim()
    if (!name) return
    const v = slug(name) || `cliente-${options.length + 1}`
    setOptions((cur) => [...cur, { value: v, label: name }])
    setValue(v)
    setOpen(false)
  }

  return (
    <>
      <Field className="max-w-sm">
        <Label htmlFor="cli-modal">Cliente</Label>
        <Select value={value} onValueChange={handleChange}>
          <SelectTrigger id="cli-modal">
            <SelectValue placeholder="Escolher cliente…" />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
            <SelectSeparator />
            <SelectItem value={CREATE_VALUE}>
              <span className="flex items-center gap-2" style={{ color: 'var(--brand)' }}>
                <Plus size={12} />
                Cadastrar novo cliente…
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        <FieldHint>Não encontrou o cliente na lista? Cadastre direto daqui.</FieldHint>
      </Field>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={save}>
            <DialogHeader>
              <DialogTitle>Cadastrar cliente</DialogTitle>
              <DialogDescription>
                Inclua o mínimo necessário · você refina o cadastro depois em CRM › Pessoas.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid gap-3.5">
                <Field>
                  <Label htmlFor="m-nome" required>
                    Nome ou razão social
                  </Label>
                  <Input
                    id="m-nome"
                    autoFocus
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Família Costa · Vitra 1801"
                  />
                </Field>
                <Field>
                  <Label htmlFor="m-tipo">Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                    <SelectTrigger id="m-tipo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pf">Pessoa física</SelectItem>
                      <SelectItem value="pj">Pessoa jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <Label htmlFor="m-email">E-mail de contato</Label>
                  <Input
                    id="m-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contato@exemplo.com"
                  />
                </Field>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
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

export function SelectPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.3"
        category="Inputs · Select"
        title="Select"
        italic="dropdown nativo"
        description="Até ~10 opções fixas. Acessibilidade total via Radix. Para listas grandes ou busca, use Combobox."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Básico" />
      <Showcase>
        <Field className="max-w-xs">
          <Label htmlFor="uf">UF</Label>
          <Select>
            <SelectTrigger id="uf">
              <SelectValue placeholder="Escolher…" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sul</SelectLabel>
                <SelectItem value="sc">Santa Catarina</SelectItem>
                <SelectItem value="pr">Paraná</SelectItem>
                <SelectItem value="rs">Rio Grande do Sul</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Sudeste</SelectLabel>
                <SelectItem value="sp">São Paulo</SelectItem>
                <SelectItem value="rj">Rio de Janeiro</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </Showcase>

      <SubHead
        num="B"
        title="Adicionar inline"
        italic="opção rápida no próprio campo"
        tag="cadastro leve"
      />
      <Showcase
        title="Inline"
        description="Para cadastros simples (1 campo · sem regras). O item “Adicionar…” fica no final da lista e abre um mini-form embaixo do Select — sem tirar o usuário do contexto."
      >
        <SelectInlineCreate />
      </Showcase>

      <SubHead
        num="C"
        title="Adicionar via modal"
        italic="quando o cadastro precisa de mais campos"
        tag="cadastro completo"
      />
      <Showcase
        title="Modal"
        description="Para cadastros com 2+ campos ou validações. O item “Cadastrar…” abre um Dialog com formulário próprio. Ao salvar, a nova opção é adicionada e selecionada automaticamente."
      >
        <SelectModalCreate />
      </Showcase>
    </div>
  )
}
