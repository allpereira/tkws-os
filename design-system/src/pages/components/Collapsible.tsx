import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Collapsible',
  import: "import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'",
  contexto:
    'Show/hide simples · 1 seção. Diferente de Accordion (vários itens). Use para esconder detalhes opcionais (campos avançados de um form, advanced settings).',
  quandoUsar: [
    'Mostrar/esconder uma única seção',
    '"Configurações avançadas" em forms',
    'Detalhes opcionais em cards',
  ],
  props: [
    { name: 'open / onOpenChange', type: 'controlled', description: 'Estado externo' },
  ],
  antiPatterns: [
    'Collapsible com 2+ seções · use Accordion',
  ],
  exemplo: `<Collapsible>
  <CollapsibleTrigger asChild>
    <Button variant="ghost">Configurações avançadas</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    {/* campos opcionais */}
  </CollapsibleContent>
</Collapsible>`,
  relacionados: ['Accordion'],
}

export function CollapsiblePage() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.7"
        category="Data Display · Collapsible"
        title="Collapsible"
        italic="show/hide simples"
        description="Para uma única seção. Para múltiplos itens com 1 aberto, use Accordion."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Configurações avançadas" />
      <Showcase>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              Configurações avançadas
              <ChevronDown
                size={14}
                style={{
                  transform: open ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div
              className="mt-3 rounded-lg border p-4 text-[13px]"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)', color: 'var(--text-soft)' }}
            >
              <p>Campos opcionais que aparecem só quando o usuário quer mais controle.</p>
              <ul className="mt-2 list-disc pl-4 leading-relaxed">
                <li>Tags customizadas</li>
                <li>Webhook URL</li>
                <li>Override de margem alvo</li>
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Showcase>
    </div>
  )
}
