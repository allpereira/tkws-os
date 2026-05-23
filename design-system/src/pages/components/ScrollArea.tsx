import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { AIPrompt } from '@/lib/prompts'

const tags = Array.from({ length: 30 }).map((_, i) => `Tag ${(i + 1).toString().padStart(2, '0')}`)

const prompt: AIPrompt = {
  componente: 'ScrollArea',
  import: "import { ScrollArea } from '@/components/ui/scroll-area'",
  contexto:
    'ScrollArea custom (Radix) · estiliza scrollbar consistente entre browsers. Use em containers com altura limitada · evita scrollbar nativa feia no Windows. Para conteúdo muito longo (1000+ rows), use @tanstack/virtual em vez de ScrollArea.',
  quandoUsar: [
    'Listas com altura fixa · sidebar, comments, atividade',
    'Containers com overflow vertical estilizado',
    'Forms muito longos com sticky header',
  ],
  props: [
    { name: 'className', type: 'string', description: 'Aplica height/width · ScrollArea só estiliza' },
  ],
  antiPatterns: [
    'ScrollArea sem altura definida · não terá scroll',
    'ScrollArea para 1000+ items · use @tanstack/virtual',
  ],
  exemplo: `<ScrollArea className="h-72 rounded-md border p-3">
  {items.map(it => <div key={it.id}>{it.label}</div>)}
</ScrollArea>`,
  relacionados: ['@tanstack/virtual', 'Sheet'],
}

export function ScrollAreaPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.11"
        category="Data Display · ScrollArea"
        title="ScrollArea"
        italic="scroll estilizado"
        description="Scroll consistente cross-browser via Radix. Para 1000+ items, use virtualize."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="30 tags em 240px" />
      <Showcase>
        <ScrollArea
          className="h-60 max-w-xs rounded-md border p-4"
          style={{ borderColor: 'var(--line-2)', background: 'var(--surface-1)' }}
        >
          <div className="mono mb-2 text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
            Tags
          </div>
          {tags.map((t, i) => (
            <div key={i}>
              <div className="py-1.5 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                {t}
              </div>
              {i < tags.length - 1 && <Separator />}
            </div>
          ))}
        </ScrollArea>
      </Showcase>
    </div>
  )
}
