import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { WizardSteps } from '@/components/tkws/wizard-steps'
import { Button } from '@/components/ui/button'
import { Input, Field, FieldHint } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioCard } from '@/components/ui/radio-group'
import { NumberInput } from '@/components/ui/number-input'
import { CheckCards } from '@/components/ui/check-cards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { formatCurrency } from '@/lib/utils'
import { Boxes, ClipboardCheck, FileSpreadsheet, MessageSquare } from 'lucide-react'
import type { AIPrompt } from '@/lib/prompts'

const steps = [
  { label: 'Identificação', description: 'Cliente · localização' },
  { label: 'Escopo', description: 'Modalidade · ambientes' },
  { label: 'Equipe', description: 'Squad · módulos' },
  { label: 'Revisar', description: 'Confirmar e criar' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · New Project Wizard',
  import: '// Composição: WizardSteps + 4 steps + persist state + final review',
  contexto:
    'Wizard de criação multi-etapa com persistência (autosave por step). Step 4 SEMPRE é Review (read-only com Edit por seção). Validação por step via Zod refine. Permitir voltar steps anteriores · bloquear pular para frente sem validar.',
  quandoUsar: [
    'Criação de Projeto novo (4 etapas)',
    'Onboarding de novo Cliente',
    'Configuração inicial de Squad',
  ],
  props: [],
  antiPatterns: [
    'Wizard sem autosave · perda de dados',
    'Permitir pular steps · validação quebra',
    'Sem Review final · usuário não confere antes de submeter',
  ],
  exemplo: `// State global por step:
const [data, setData] = useState<NewProjectData>({...})
const [step, setStep] = useState(0)

// Validação por step:
function validateStep(n: number) {
  return stepSchemas[n].safeParse(data).success
}

// Avançar só se válido:
function next() {
  if (!validateStep(step)) return showErrors()
  if (step === steps.length - 1) submit()
  else setStep(s => s + 1)
}`,
  relacionados: ['WizardSteps', 'Form Review', 'Form Sectioned'],
}

export function NewProjectWizardPattern() {
  const [step, setStep] = useState(0)
  const [tipo, setTipo] = useState<'decor-full' | 'reform' | 'project'>('decor-full')
  const [modulos, setModulos] = useState<string[]>(['projects', 'briefings'])

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="P09.3"
        category="Pattern · Wizard"
        title="New Project Wizard"
        italic="4 etapas + review"
        description="Criação multi-etapa com autosave, validação por step e Review final read-only."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Wizard completo · novo projeto" />
      <Showcase padding="comfortable">
        <WizardSteps steps={steps} current={step} onStepClick={(i) => i <= step && setStep(i)} />

        <div className="mt-6">
          {step === 0 && (
            <Card>
              <CardHeader><CardTitle>Identificação</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
                  <Field>
                    <Label required>Nome do projeto</Label>
                    <Input placeholder="ex: Cobertura Vitra · 1801" />
                    <FieldHint>Aparece no Kanban e na listagem</FieldHint>
                  </Field>
                  <Field>
                    <Label required>Cliente</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Escolher cliente…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="andrade">Família Andrade</SelectItem>
                        <SelectItem value="costa">Família Costa</SelectItem>
                        <SelectItem value="ws">WS Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <Label required>Cidade / UF</Label>
                    <Input placeholder="ex: Balneário Camboriú · SC" />
                  </Field>
                  <Field>
                    <Label>Área</Label>
                    <NumberInput value={280} onChange={() => {}} suffix="m²" />
                  </Field>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <CardHeader><CardTitle>Escopo</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label>Modalidade</Label>
                    <div className="mt-2">
                      <RadioGroup value={tipo} onValueChange={(v) => setTipo(v as typeof tipo)} className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
                        <RadioCard value="decor-full" title="Decoração completa" description="Inclui mobiliário" />
                        <RadioCard value="reform" title="Reforma + decoração" description="Alterações estruturais" />
                        <RadioCard value="project" title="Apenas projeto" description="Sem execução" />
                      </RadioGroup>
                    </div>
                  </div>
                  <Field>
                    <Label>Briefing curto</Label>
                    <Textarea rows={4} placeholder="Programa, restrições, referências…" />
                  </Field>
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
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader><CardTitle>Equipe e módulos</CardTitle></CardHeader>
              <CardContent>
                <Field className="mb-5">
                  <Label required>Squad responsável</Label>
                  <Select defaultValue="orion">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orion">Squad Orion · signature</SelectItem>
                      <SelectItem value="apollo">Squad Apollo · marketing</SelectItem>
                      <SelectItem value="neptune">Squad Neptune · operação</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Label>Módulos a habilitar</Label>
                <div className="mt-2">
                  <CheckCards
                    value={modulos}
                    onChange={setModulos}
                    cols={2}
                    options={[
                      { value: 'projects', title: 'Projetos', description: 'CRUD · Kanban · Timeline', icon: <Boxes size={15} /> },
                      { value: 'briefings', title: 'Briefings', description: 'Editor co-autoria · Tiptap', icon: <FileSpreadsheet size={15} /> },
                      { value: 'comms', title: 'Comunicação', description: 'Chat · comentários inline', icon: <MessageSquare size={15} /> },
                      { value: 'checklist', title: 'Punch list', description: 'Vistorias e correções', icon: <ClipboardCheck size={15} /> },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <div>
              <Alert tone="warning">
                <AlertTitle>Ao confirmar, o seguinte é disparado:</AlertTitle>
                <AlertDescription>
                  Cliente recebe email · Squad Orion é notificado · cronograma inicial é gerado · briefing template é criado.
                </AlertDescription>
              </Alert>

              <div className="mt-5 grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
                {[
                  ['Nome', 'Cobertura Vitra · 1801'],
                  ['Cliente', 'Família Costa'],
                  ['Cidade', 'Balneário Camboriú · SC'],
                  ['Área', '280 m²'],
                  ['Modalidade', tipo === 'decor-full' ? 'Decoração completa' : tipo === 'reform' ? 'Reforma + decoração' : 'Apenas projeto'],
                  ['Valor contrato', formatCurrency(12_500_000)],
                  ['Margem alvo', '32%'],
                  ['Squad', 'Orion · signature'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border p-3" style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}>
                    <div className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                      {k}
                    </div>
                    <div className="mt-1 text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {modulos.map((m) => (
                  <Badge key={m} tone="brand">{m}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between border-t pt-5" style={{ borderColor: 'var(--line-1)' }}>
          <Button variant="outline" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>
            <ChevronLeft size={14} /> Voltar
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>
              Avançar <ChevronRight size={14} />
            </Button>
          ) : (
            <Button>Criar projeto</Button>
          )}
        </div>
      </Showcase>
    </div>
  )
}
