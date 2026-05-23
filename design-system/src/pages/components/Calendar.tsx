import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Calendar } from '@/components/ui/calendar'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Calendar (react-day-picker)',
  import: "import { Calendar } from '@/components/ui/calendar'",
  contexto:
    'Calendar standalone (react-day-picker) com pt-BR. Use direto em telas de agenda · combinado com Popover vira Datepicker. Suporta single/range/multiple, datas desabilitadas, semanas com offset.',
  quandoUsar: [
    'Página de agenda · sempre visível',
    'Seletor de período em dashboard',
    'Picker dentro de Popover · use o Datepicker pronto',
  ],
  props: [
    { name: 'mode', type: '"single" | "range" | "multiple"', description: 'Tipo de seleção' },
    { name: 'selected / onSelect', type: 'controlled', description: 'Estado externo' },
    { name: 'disabled', type: '(date) => boolean | Matcher', description: 'Bloqueia datas' },
    { name: 'numberOfMonths', type: 'number', description: 'Renderiza N meses lado a lado' },
  ],
  antiPatterns: [
    'Calendar com locale en-US · sempre pt-BR no TKWS',
    'Calendar sem disabled handler quando datas inválidas existem',
  ],
  exemplo: `<Calendar mode="single" selected={date} onSelect={setDate} />

<Calendar
  mode="range"
  numberOfMonths={2}
  selected={range}
  onSelect={setRange}
  disabled={(d) => d < new Date()}
/>`,
  relacionados: ['Datepicker', 'Popover'],
}

export function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.10b"
        category="Inputs · Calendar"
        title="Calendar"
        italic="standalone"
        description="Calendar sem Popover. Use em telas de agenda. Sempre pt-BR."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Single mês · standalone" />
      <Showcase>
        <Calendar standalone mode="single" selected={date} onSelect={setDate} />
      </Showcase>

      <SubHead num="B" title="2 meses · range · standalone" />
      <Showcase>
        <Calendar standalone mode="range" numberOfMonths={2} />
      </Showcase>
    </div>
  )
}
