import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Checkbox',
  import: "import { Checkbox } from '@/components/ui/checkbox'",
  contexto:
    'Seleção múltipla independente. 1 checkbox = aceite/opt-in. N checkboxes = filtros múltiplos. Para escolha única, use Radio. Para liga/desliga, use Switch.',
  quandoUsar: [
    'Aceite de termos, concordância',
    'Filtros múltiplos (múltiplos status, múltiplas tags)',
    'Seleção bulk em tabelas (com indeterminate)',
  ],
  props: [
    { name: 'checked / defaultChecked', type: 'boolean | "indeterminate"', description: 'Estado' },
    { name: 'onCheckedChange', type: '(c: boolean) => void', description: 'Callback' },
  ],
  antiPatterns: [
    'Checkbox para liga/desliga global → use Switch',
    '1 checkbox em radio group → não faz sentido lógico',
    'Checkbox sem label clicável (perde alvo de toque)',
  ],
  exemplo: `<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Aceito os termos do contrato</Label>
</div>`,
  relacionados: ['Switch', 'RadioGroup'],
}

export function CheckboxPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.6"
        category="Inputs · Checkbox"
        title="Checkbox"
        italic="seleção múltipla"
        description="Para escolhas independentes ou aceites. Switch é para liga/desliga; Radio é para 1 de N."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Termos e aceites" />
      <Showcase
        code={`<div className="flex items-center gap-2">
  <Checkbox id="t1" defaultChecked />
  <Label htmlFor="t1">Concordo com os termos do contrato</Label>
</div>`}
      >
        <div className="flex flex-col gap-3">
          {[
            ['t1', 'Concordo com os termos do contrato', true],
            ['t2', 'Receber novidades por email', false],
            ['t3', 'Aceito políticas de privacidade', true],
          ].map(([id, label, checked]) => (
            <label key={String(id)} className="flex cursor-pointer items-center gap-2.5">
              <Checkbox id={String(id)} defaultChecked={!!checked} />
              <span className="text-[13px]" style={{ color: 'var(--text)' }}>
                {String(label)}
              </span>
            </label>
          ))}
        </div>
      </Showcase>
    </div>
  )
}
