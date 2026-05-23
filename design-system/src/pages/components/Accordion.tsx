import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { AIPrompt } from '@/lib/prompts'

const items = [
  { id: 'living', label: '🛋  Living · R$ 84.200 · 8 linhas', body: 'Pisos · Pintura · Iluminação · Cortinas · Mobiliário. Categorias detalhadas com fornecedor por linha.' },
  { id: 'kitchen', label: '🍳  Cozinha · R$ 142.800 · 12 linhas', body: 'Marcenaria sob medida · Granito · Eletros · Metais. Inclui mão de obra de instalação.' },
  { id: 'master', label: '🛏  Dormitório Master · R$ 96.400 · 9 linhas', body: 'Marcenaria · Cama · Cortinas blackout · Climatização · Iluminação cênica.' },
  { id: 'bwc', label: '🚿  BWC Master · R$ 38.600 · 6 linhas', body: 'Cuba esculpida · Metais Docol · Box · Espelho · Iluminação LED.' },
]

const prompt: AIPrompt = {
  componente: 'Accordion',
  import: "import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'",
  contexto:
    'Conteúdo agrupado expansível. Por padrão type="single" (só 1 aberto). Use type="multiple" quando o usuário pode comparar 2+ seções abertas (linhas de orçamento, FAQ).',
  quandoUsar: [
    'FAQ',
    'Orçamento agrupado por ambiente (cozinha, living, BWC)',
    'Configurações em seções colapsáveis',
  ],
  props: [
    { name: 'type', type: '"single" | "multiple"', description: 'single padrão · 1 aberto por vez' },
    { name: 'defaultValue', type: 'string | string[]', description: 'Aberto inicialmente' },
    { name: 'collapsible (em single)', type: 'boolean', description: 'Permite fechar todos' },
  ],
  antiPatterns: [
    'Accordion com 1 item · use Collapsible',
    'Accordion com 20+ itens · sidebar é melhor',
  ],
  exemplo: `<Accordion type="multiple" defaultValue={['living', 'kitchen']}>
  <AccordionItem value="living">
    <AccordionTrigger>🛋 Living · R$ 84.200</AccordionTrigger>
    <AccordionContent>8 linhas de mobiliário e iluminação…</AccordionContent>
  </AccordionItem>
  …
</Accordion>`,
  relacionados: ['Collapsible', 'Tabs'],
}

export function AccordionPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.6"
        category="Data Display · Accordion"
        title="Accordion"
        italic="single · multiple"
        description="Conteúdo agrupado expansível. Use multiple para comparar seções."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Orçamento por ambiente · multiple" />
      <Showcase>
        <Accordion type="multiple" defaultValue={['living']}>
          {items.map((it) => (
            <AccordionItem key={it.id} value={it.id}>
              <AccordionTrigger>{it.label}</AccordionTrigger>
              <AccordionContent>{it.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Showcase>
    </div>
  )
}
