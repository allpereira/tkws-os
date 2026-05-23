import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
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
              className="inline-flex h-10 w-80 items-center justify-between gap-2 rounded-md border px-3 text-[13.5px]"
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
    </div>
  )
}
