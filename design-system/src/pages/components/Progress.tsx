import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Progress',
  import: "import { Progress } from '@/components/ui/progress'",
  contexto:
    'Barra horizontal de progresso 0-100. Use tone para indicar saúde (danger < 30, warning < 70, success ≥ 70). Em listas longas, sempre adicione o número ao lado.',
  quandoUsar: [
    'Progresso de upload, processamento longo',
    'Progresso de obra (% concluído) em listas',
    'KPI vs target em dashboards',
  ],
  props: [
    { name: 'value', type: 'number (0-100)', description: 'Progresso atual' },
    { name: 'tone', type: '"brand" | "success" | "warning" | "danger"', description: 'Cor do fill' },
  ],
  antiPatterns: [
    'Progress indeterminado · use Skeleton',
    'Progress sem valor visível',
  ],
  exemplo: `<Progress value={64} tone="warning" />
<div className="mono text-[10px]">64% · 8/12 etapas</div>`,
  relacionados: ['GoalRing', 'Skeleton'],
}

export function ProgressPage() {
  const [v, setV] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setV((x) => (x >= 100 ? 0 : x + 5)), 400)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="10.4"
        category="Feedback · Progress"
        title="Progress"
        italic="bar 0-100"
        description="Use tone semântico para indicar saúde. Para circular, use GoalRing."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Tons semânticos" />
      <Showcase>
        <div className="grid gap-4 max-w-md">
          {[
            { label: 'Sketchup model · upload', value: 28, tone: 'danger' as const },
            { label: 'Orçamento · curva de fornecedores', value: 64, tone: 'warning' as const },
            { label: 'Obra · concluído', value: 87, tone: 'success' as const },
            { label: 'Progresso de form · brand', value: 42, tone: 'brand' as const },
          ].map((p) => (
            <div key={p.label}>
              <div className="flex items-center justify-between text-[12px]">
                <span style={{ color: 'var(--text-soft)' }}>{p.label}</span>
                <span className="mono font-bold" style={{ color: 'var(--text)' }}>
                  {p.value}%
                </span>
              </div>
              <div className="mt-1.5">
                <Progress value={p.value} tone={p.tone} />
              </div>
            </div>
          ))}
        </div>
      </Showcase>

      <SubHead num="B" title="Animado" italic="sobe sozinho" />
      <Showcase>
        <div className="grid gap-3 max-w-md">
          <Progress value={v} />
          <Button variant="outline" size="sm" onClick={() => setV(0)}>
            Reset
          </Button>
        </div>
      </Showcase>
    </div>
  )
}
