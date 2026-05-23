import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Datepicker',
  import: "import { Calendar } from '@/components/ui/calendar'\nimport { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'",
  contexto:
    'Datepicker = Popover + Calendar (react-day-picker). Use mode="single" para data única e mode="range" para intervalo. Sempre PT-BR via date-fns locale. Botão de trigger mostra a data formatada · placeholder quando vazio.',
  quandoUsar: [
    'Data de entrega, prazo de pagamento, milestone',
    'Range para filtros temporais (período de relatório)',
    'Selecionar dia em calendário de obra/agenda',
  ],
  props: [
    { name: 'mode', type: '"single" | "range" | "multiple"', description: 'Tipo de seleção' },
    { name: 'selected / onSelect', type: 'controlled', description: 'Estado externo' },
    { name: 'disabled', type: '(date) => boolean', description: 'Bloqueia datas (passado, finais de semana)' },
  ],
  antiPatterns: [
    'Datepicker para hora exata — combine com TimePicker (futuro)',
    'Formatar data com hardcode (ex: dd/MM/yyyy manual) — use date-fns format',
    'Aceitar input de texto livre para data — sempre via picker',
  ],
  exemplo: `const [date, setDate] = useState<Date>()

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <CalendarDays size={14} />
      {date ? format(date, "PPP", { locale: ptBR }) : 'Selecionar data…'}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar mode="single" selected={date} onSelect={setDate} />
  </PopoverContent>
</Popover>`,
  relacionados: ['Calendar', 'Popover'],
}

export function DatepickerPage() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 5, 15))
  const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>({
    from: new Date(2026, 4, 1),
    to: new Date(2026, 4, 28),
  })

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.10"
        category="Inputs · Datepicker"
        title="Datepicker"
        italic="single · range · pt-BR"
        description="Calendar (react-day-picker) dentro de Popover. Locale pt-BR. Formato sempre via date-fns."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Single date" />
      <Showcase>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarDays size={14} />
              {date ? format(date, 'PPP', { locale: ptBR }) : 'Selecionar data…'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </Showcase>

      <SubHead num="B" title="Range · período de relatório" />
      <Showcase>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarDays size={14} />
              {range?.from && range?.to
                ? `${format(range.from, 'dd/MM', { locale: ptBR })} → ${format(range.to, 'dd/MM/yyyy', { locale: ptBR })}`
                : 'Selecionar período…'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <Calendar
              mode="range"
              selected={range as any}
              onSelect={(r: any) => setRange(r)}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </Showcase>
    </div>
  )
}
