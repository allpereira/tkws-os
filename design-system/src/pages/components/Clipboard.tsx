import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Clipboard } from '@/components/ui/clipboard'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Clipboard',
  import: "import { Clipboard } from '@/components/ui/clipboard'",
  contexto:
    'Botão "copiar para clipboard" com feedback verde temporário. Use 2 variantes: icon (botão compacto) ou inline (input readonly + botão). Toda funcionalidade de copy no TKWS passa por este componente.',
  quandoUsar: [
    'Compartilhar URL pública (portal de fornecedor, share link)',
    'Copiar código de projeto/cliente para colar em outro sistema',
    'Copiar bloco de texto longo (JSON, prompt, snippet)',
  ],
  props: [
    { name: 'value', type: 'string', description: 'O que será copiado' },
    { name: 'variant', type: '"icon" | "inline"', description: 'icon = botão · inline = input + botão' },
    { name: 'label', type: 'string', description: 'Texto opcional ao lado' },
  ],
  antiPatterns: [
    'Implementação manual de navigator.clipboard sem feedback visual',
    'Botão "copiar" sem aria-label',
  ],
  exemplo: `<Clipboard value="https://portal.tkws.com/p/2410" />

<Clipboard variant="inline" value={shareUrl} />`,
  relacionados: ['Tooltip', 'Toast'],
}

export function ClipboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="10.9"
        category="Feedback · Clipboard"
        title="Clipboard"
        italic="copiar com feedback"
        description="Copy-to-clipboard com toast verde. 2 variantes: icon e inline (input + botão)."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Icon · compacto" />
      <Showcase>
        <div className="flex flex-wrap items-center gap-3">
          <Clipboard value="https://portal.tkws.com/p/2410" />
          <Clipboard value="https://portal.tkws.com/p/2410" label="Copiar URL" />
        </div>
      </Showcase>

      <SubHead num="B" title="Inline · input + botão" />
      <Showcase>
        <div className="max-w-md">
          <Clipboard variant="inline" value="https://portal.tkws.com/p/2410/share?token=abc123" />
        </div>
      </Showcase>
    </div>
  )
}
