import { useState } from 'react'
import { Check, Save } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Input, Field, FieldHint } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { NumberInput } from '@/components/ui/number-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const sections = [
  { id: 'basic', label: 'Identificação' },
  { id: 'contract', label: 'Contrato' },
  { id: 'scope', label: 'Escopo' },
  { id: 'squad', label: 'Squad' },
  { id: 'comms', label: 'Comunicação' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Sectioned Form com TOC',
  import: "// Composição: Form + Card + Label + Input + sticky TOC",
  contexto:
    'Padrão para forms longos (15+ campos). Sticky TOC à esquerda mostra progresso por seção · marca como concluído quando todos os campos required da seção estão preenchidos. Autosave indicador "SALVO HÁ Xs" no rodapé.',
  quandoUsar: [
    'Cadastro completo de projeto / cliente / fornecedor',
    'Briefing detalhado',
    'Onboarding longo (assinatura, dados fiscais, configurações)',
  ],
  props: [],
  antiPatterns: [
    'Tudo num único form sem seções · usuário se perde',
    'Sem autosave em forms longos · perda de dados',
    'TOC sem indicação de progresso · perde valor',
  ],
  exemplo: `// 1) Schema Zod com refine por seção
// 2) form sectioned · cada seção é uma <section id={sectionId}>
// 3) TOC com IntersectionObserver marca active
// 4) Autosave a cada 3s · TanStack mutation
// 5) Submit final valida tudo`,
  relacionados: ['Form', 'Wizard', 'Sheet'],
}

export function FormSectionedPattern() {
  const [active, setActive] = useState('basic')

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="P10.1"
        category="Pattern · Form"
        title="Sectioned Form"
        italic="TOC sticky · autosave"
        description="Forms longos (15+ campos). Sticky TOC mostra progresso. Autosave automático a cada 3s."
        tag="form longo"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Novo projeto · briefing completo" />
      <Showcase padding="none">
        <div className="grid grid-cols-[240px_1fr] gap-0 max-[760px]:grid-cols-1">
          {/* TOC sticky */}
          <nav
            className="sticky top-4 self-start border-r p-5 max-[760px]:static max-[760px]:border-b max-[760px]:border-r-0"
            style={{ borderColor: 'var(--line-1)' }}
          >
            <div
              className="mono mb-3 text-[10.5px] font-bold uppercase tracking-[1.6px]"
              style={{ color: 'var(--text-mute)' }}
            >
              Seções
            </div>
            <ol className="flex flex-col gap-1 max-[760px]:flex-row max-[760px]:overflow-x-auto">
              {sections.map((s, i) => {
                const isActive = active === s.id
                const isDone = sections.findIndex((x) => x.id === active) > i
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setActive(s.id)}
                      className={cn(
                        'grid w-full grid-cols-[20px_1fr] items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[12.5px] font-medium transition-colors',
                        'hover:bg-white/[0.04]'
                      )}
                      style={{
                        background: isActive ? 'var(--brand-soft)' : 'transparent',
                        color: isActive ? 'var(--brand)' : 'var(--text-soft)',
                      }}
                    >
                      <span
                        className="mono inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold"
                        style={{
                          background: isDone ? 'var(--success)' : isActive ? 'var(--brand)' : 'transparent',
                          borderColor: isDone || isActive ? 'transparent' : 'var(--line-3)',
                          color: isDone || isActive ? 'var(--bg)' : 'var(--text-mute)',
                        }}
                      >
                        {isDone ? <Check size={10} strokeWidth={3} /> : i + 1}
                      </span>
                      {s.label}
                    </button>
                  </li>
                )
              })}
            </ol>
            <div
              className="mt-4 grid gap-1.5 rounded-md border p-2.5 text-[11px]"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)', color: 'var(--text-soft)' }}
            >
              <div className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--success)' }}>
                Salvo há 3s
              </div>
              <span style={{ color: 'var(--text-mute)' }}>Autosave ativo · TanStack Query mutation</span>
            </div>
          </nav>

          {/* Content */}
          <div className="p-7 max-[760px]:p-4">
            <Section id="basic" title="Identificação" subtitle="Como o projeto aparece na lista e no Kanban">
              <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
                <Field>
                  <Label required>Nome do projeto</Label>
                  <Input placeholder="ex: Cobertura Vitra · 1801" />
                  <FieldHint>Aparece no Kanban, listagem e exports</FieldHint>
                </Field>
                <Field>
                  <Label required>Código</Label>
                  <Input placeholder="#2415" />
                  <FieldHint>4 dígitos · auto-gerado se vazio</FieldHint>
                </Field>
              </div>
            </Section>

            <Section id="contract" title="Contrato" subtitle="Termos financeiros e prazo">
              <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
                <Field>
                  <Label required>Valor do contrato</Label>
                  <NumberInput value={12_500_000} onChange={() => {}} currency min={400_000} step={50_000} />
                </Field>
                <Field>
                  <Label>Margem alvo</Label>
                  <NumberInput value={32} onChange={() => {}} suffix="%" min={0} max={100} />
                </Field>
              </div>
            </Section>

            <Section id="scope" title="Escopo" subtitle="Definição do trabalho · áreas envolvidas">
              <Field>
                <Label>Descrição do escopo</Label>
                <Textarea rows={4} placeholder="Descreva ambientes, restrições, particularidades…" />
              </Field>
            </Section>

            <Section id="squad" title="Squad" subtitle="Quem vai conduzir o projeto">
              <Field>
                <Label>Squad responsável</Label>
                <Select defaultValue="orion">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orion">Squad Orion · signature</SelectItem>
                    <SelectItem value="apollo">Squad Apollo · marketing</SelectItem>
                    <SelectItem value="neptune">Squad Neptune · operação</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </Section>

            <Section id="comms" title="Comunicação" subtitle="Como notificar o cliente">
              <div className="flex flex-col gap-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <Switch defaultChecked />
                  <span className="text-[13px]" style={{ color: 'var(--text)' }}>
                    Email para milestones
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <Switch defaultChecked />
                  <span className="text-[13px]" style={{ color: 'var(--text)' }}>
                    Portal do cliente ativo
                  </span>
                </label>
              </div>
            </Section>

            <div
              className="sticky bottom-4 mt-7 flex items-center justify-between rounded-lg border p-3 shadow-2xl backdrop-blur-lg"
              style={{ background: 'rgba(10,47,77,0.94)', borderColor: 'var(--line-3)' }}
            >
              <div className="flex items-center gap-2">
                <Badge tone="success" pulse>Salvo há 3s</Badge>
                <span className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  18/24 campos preenchidos
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost">Salvar rascunho</Button>
                <Button><Save size={14} /> Criar projeto</Button>
              </div>
            </div>
          </div>
        </div>
      </Showcase>
    </div>
  )
}

function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-9 border-b pb-7 last:border-0" style={{ borderColor: 'var(--line-1)' }}>
      <header className="mb-4">
        <h3 className="serif text-[20px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-[13px]" style={{ color: 'var(--text-soft)' }}>
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </section>
  )
}
