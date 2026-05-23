import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Switch } from '@/components/ui/switch'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Switch',
  import: "import { Switch } from '@/components/ui/switch'",
  contexto:
    'Toggle binário liga/desliga · aplica IMEDIATAMENTE (sem necessidade de salvar). Use para preferências ativas (notificações, modo manutenção). Para escolhas que dependem de "salvar", use Checkbox.',
  quandoUsar: [
    'Preferências aplicadas em tempo real',
    'Notificações, modos, feature flags do usuário',
    'Settings que afetam imediatamente o produto',
  ],
  props: [
    { name: 'checked / defaultChecked', type: 'boolean', description: 'Estado' },
    { name: 'onCheckedChange', type: '(c: boolean) => void', description: 'Callback' },
  ],
  antiPatterns: [
    'Switch dentro de form que precisa "salvar" → use Checkbox',
    'Switch sem rótulo claro',
    'Switch para ações destrutivas (ex: arquivar) — use Button + confirmação',
  ],
  exemplo: `<label className="flex items-center gap-3">
  <Switch defaultChecked onCheckedChange={(v) => updateNotif(v)} />
  <span>Notificações no Portal dos Parceiros</span>
</label>`,
  relacionados: ['Checkbox', 'Toggle'],
}

export function SwitchPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.7"
        category="Inputs · Switch"
        title="Switch"
        italic="toggle binário · aplica imediato"
        description="Liga/desliga em tempo real. Sem botão salvar. Para opt-in tradicional (com salvar), use Checkbox."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Padrão · settings inline" />
      <Showcase>
        <div className="flex flex-col gap-3.5">
          {[
            { lbl: 'Notificações no Portal dos Parceiros', sub: 'Fornecedores recebem alertas em tempo real', on: true },
            { lbl: 'Modo manutenção', sub: 'Desativa cadastros temporariamente', on: false },
            { lbl: 'Lembretes automáticos de pagamento', sub: 'Email + Push 3 dias antes do vencimento', on: true },
          ].map((s, i) => (
            <label key={i} className="flex cursor-pointer items-center gap-3">
              <Switch defaultChecked={s.on} />
              <div>
                <div className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>
                  {s.lbl}
                </div>
                <div className="text-[12px]" style={{ color: 'var(--text-mute)' }}>
                  {s.sub}
                </div>
              </div>
            </label>
          ))}
        </div>
      </Showcase>
    </div>
  )
}
