import { useState } from 'react'
import { ArrowRight, Boxes, Briefcase, Building2, Crown, HardHat, Heart, Plus, User, Users } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input, Field } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCards } from '@/components/ui/check-cards'
import { RadioGroup, RadioCard } from '@/components/ui/radio-group'
import { WizardSteps } from '@/components/tkws/wizard-steps'
import { Progress } from '@/components/ui/progress'
import { ChecklistWidget } from '@/components/tkws/checklist-widget'
import { Coachmark } from '@/components/tkws/coachmark'
import type { AIPrompt } from '@/lib/prompts'

const steps = [
  { label: 'Quem é você?', description: 'Persona · contexto' },
  { label: 'Sua organização', description: 'Nome · porte' },
  { label: 'Equipe', description: 'Convidar membros' },
  { label: 'Módulos', description: 'O que você quer usar' },
  { label: 'Pronto!', description: 'Bem-vindo ao TKWS OS' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Onboarding flow',
  import: '// Composição: WizardSteps + RadioCard + CheckCards + final celebration',
  contexto:
    'Fluxo de onboarding após signup. 4 etapas + celebração final. Cada etapa avança automaticamente quando os campos required estão preenchidos. Persona escolhida define a densidade default (Power/Standard/Guided).',
  quandoUsar: [
    'Primeira vez do usuário após signup',
    'Onboarding de squad inteiro (sequência de steps)',
    'Setup inicial de nova organização',
  ],
  props: [],
  antiPatterns: [
    'Onboarding longo demais (mais de 5 etapas) · usuário desiste',
    'Skip não permitido em todas etapas · UX trava',
    'Sem celebração final · perde momento de magia',
  ],
  exemplo: `// Steps:
// 1) Quem você é? (RadioCards de persona)
// 2) Sua organização (nome + porte)
// 3) Equipe (convidar via email · skip permitido)
// 4) Módulos (CheckCards)
// 5) Tela final · "Bem-vindo!" com CTA principal`,
  relacionados: ['WizardSteps', 'RadioCard', 'CheckCards'],
}

export function OnboardingPattern() {
  const [step, setStep] = useState(0)
  const [persona, setPersona] = useState<string>('arquiteto')
  const [modulos, setModulos] = useState<string[]>(['projects', 'briefings'])

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="P22"
        category="Pattern · Onboarding"
        title="Onboarding"
        italic="4 etapas + celebração"
        description="Fluxo de boas-vindas após signup. Persona define densidade default. Celebração final cria momento."
        tag="setup inicial"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Fluxo completo · navegue entre steps" />
      <Showcase padding="comfortable">
        <WizardSteps steps={steps} current={step} onStepClick={(i) => i <= step && setStep(i)} />

        <Card className="mt-6">
          <CardContent>
            {/* Step 0 · Persona */}
            {step === 0 && (
              <div>
                <h2 className="serif text-[28px] font-light tracking-tight" style={{ color: 'var(--text)' }}>
                  Bem-vindo. <em className="italic" style={{ color: 'var(--brand)' }}>Quem é você?</em>
                </h2>
                <p className="mt-2 text-[13.5px]" style={{ color: 'var(--text-soft)' }}>
                  Escolha a persona que mais combina · isso define a densidade visual padrão do TKWS OS para você.
                </p>
                <div className="mt-6">
                  <RadioGroup value={persona} onValueChange={setPersona} className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
                    <RadioCardWithIcon value="diretor" title="Diretor / CEO" description="Visão de portfólio · KPIs · margem" icon={<Crown size={15} />} />
                    <RadioCardWithIcon value="lider" title="Líder de Squad" description="Gerencia time + projetos" icon={<Briefcase size={15} />} />
                    <RadioCardWithIcon value="arquiteto" title="Arquiteto / Designer" description="Briefing · render · spec" icon={<Heart size={15} />} />
                    <RadioCardWithIcon value="obra" title="Gestor de Obra" description="Cronograma · punch list" icon={<HardHat size={15} />} />
                    <RadioCardWithIcon value="admin" title="Administrativo" description="NFs · cadastros · agenda" icon={<User size={15} />} />
                    <RadioCardWithIcon value="cliente" title="Cliente final" description="Acompanho meu projeto" icon={<Users size={15} />} />
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 1 · Organização */}
            {step === 1 && (
              <div>
                <h2 className="serif text-[28px] font-light tracking-tight" style={{ color: 'var(--text)' }}>
                  Sua <em className="italic" style={{ color: 'var(--brand)' }}>organização.</em>
                </h2>
                <p className="mt-2 text-[13.5px]" style={{ color: 'var(--text-soft)' }}>
                  Você pode ajustar depois em Configurações.
                </p>
                <div className="mt-6 grid gap-4">
                  <Field>
                    <Label required>Nome do escritório</Label>
                    <Input placeholder="ex: WS Group · Arquitetura" />
                  </Field>
                  <div>
                    <Label>Porte do escritório</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2 max-[760px]:grid-cols-1">
                      <RadioGroup defaultValue="medio">
                        <RadioCard value="solo" title="Solo" description="Você sozinho" />
                      </RadioGroup>
                      <RadioGroup>
                        <RadioCard value="medio" title="Time" description="2-15 pessoas" />
                      </RadioGroup>
                      <RadioGroup>
                        <RadioCard value="grande" title="Estúdio premium" description="15+ pessoas" />
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 · Equipe */}
            {step === 2 && (
              <div>
                <h2 className="serif text-[28px] font-light tracking-tight" style={{ color: 'var(--text)' }}>
                  Convide seu <em className="italic" style={{ color: 'var(--brand)' }}>squad.</em>
                </h2>
                <p className="mt-2 text-[13.5px]" style={{ color: 'var(--text-soft)' }}>
                  Pode pular e convidar depois.
                </p>
                <div className="mt-6 grid gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="grid grid-cols-[1fr_180px_auto] gap-2 max-[760px]:grid-cols-1">
                      <Input placeholder={`colega-${i}@email.com`} />
                      <Input placeholder="Papel · ex: Arquiteto" defaultValue={i === 1 ? 'Líder de Squad' : ''} />
                      <Button variant="outline">Convidar</Button>
                    </div>
                  ))}
                  <Button variant="ghost" className="self-start">+ Adicionar mais</Button>
                </div>
              </div>
            )}

            {/* Step 3 · Módulos */}
            {step === 3 && (
              <div>
                <h2 className="serif text-[28px] font-light tracking-tight" style={{ color: 'var(--text)' }}>
                  Quais módulos <em className="italic" style={{ color: 'var(--brand)' }}>quer ativar?</em>
                </h2>
                <p className="mt-2 text-[13.5px]" style={{ color: 'var(--text-soft)' }}>
                  Você pode ativar/desativar a qualquer momento.
                </p>
                <div className="mt-6">
                  <CheckCards
                    value={modulos}
                    onChange={setModulos}
                    cols={3}
                    options={[
                      { value: 'projects', title: 'Projetos', description: 'CRUD · Kanban · Timeline', icon: <Boxes size={15} /> },
                      { value: 'briefings', title: 'Briefings', description: 'Editor co-autoria', icon: <Heart size={15} /> },
                      { value: 'budget', title: 'Orçamentos', description: 'Curva · fornecedores', icon: <Building2 size={15} /> },
                      { value: 'obra', title: 'Obra', description: 'Gantt · punch list', icon: <HardHat size={15} /> },
                      { value: 'catalog', title: 'Catálogo', description: 'Curadoria editorial', icon: <Boxes size={15} /> },
                      { value: 'portals', title: 'Portais externos', description: 'Cliente + parceiros', icon: <Users size={15} /> },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Step 4 · Celebração */}
            {step === 4 && (
              <div className="py-8 text-center">
                <div
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: 'var(--brand)', color: 'var(--bg)' }}
                >
                  <Heart size={28} />
                </div>
                <h2 className="serif mt-4 text-[40px] font-light tracking-tight" style={{ color: 'var(--text)' }}>
                  Pronto. <em className="italic" style={{ color: 'var(--brand)' }}>Bem-vindo ao TKWS OS.</em>
                </h2>
                <p className="mx-auto mt-3 max-w-md text-[14px]" style={{ color: 'var(--text-soft)' }}>
                  Sua área está montada com base nas suas escolhas. Vá pra Dashboard e veja a magia.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Badge tone="success" pulse>Setup completo</Badge>
                  <span className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                    {modulos.length} módulos · 1 persona
                  </span>
                </div>
                <Button size="lg" className="mt-6">
                  Ir para Dashboard <ArrowRight size={14} />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-3">
          <Progress value={((step + 1) / steps.length) * 100} tone="brand" />
          <div className="mono mt-2 flex items-center justify-between text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
            <span>Etapa {step + 1} de {steps.length}</span>
            <span>{Math.round(((step + 1) / steps.length) * 100)}% completo</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>
            Voltar
          </Button>
          {step < steps.length - 1 ? (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(step + 1)}>Pular</Button>
              <Button onClick={() => setStep(step + 1)}>Continuar <ArrowRight size={14} /></Button>
            </div>
          ) : (
            <Button>Começar a usar</Button>
          )}
        </div>
      </Showcase>

      {/* Coachmark · spotlight feature nova */}
      <SubHead num="B" title="Coachmark · spotlight de feature nova" italic="aparece uma vez · com seta + balão" />
      <Showcase padding="none">
        <Coachmark
          step="Passo 2 de 4 · novidade"
          title="Criar projeto direto daqui"
          description={
            <>
              Você não precisa mais ir pro menu lateral. Use o atalho <kbd
                className="mono rounded-[4px] border px-1 py-0.5 text-[11px]"
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--line-1)',
                  color: 'var(--text)',
                }}
              >⌘N</kbd> em qualquer tela.
            </>
          }
          totalSteps={4}
          currentStep={1}
          target={
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
              <Plus size={14} /> Novo projeto
            </span>
          }
          onSkip={() => {}}
          onNext={() => {}}
        />
      </Showcase>

      {/* Checklist · primeiras ações */}
      <SubHead num="C" title="Checklist Widget · primeiras ações" italic="flutua bottom-right · colapsa após completar" />
      <Showcase>
        <div className="flex justify-center">
          <ChecklistWidget
            title="Primeiros"
            italic="passos"
            items={[
              { id: '1', title: 'Crie sua conta TKWS OS', meta: 'há 2 dias', trailing: '+1pt', state: 'done' },
              { id: '2', title: 'Convide sua equipe', meta: '38 membros aceitaram', trailing: '+5pt', state: 'done' },
              { id: '3', title: 'Importe seus projetos', meta: '43 projetos importados de XLSX', trailing: '+10pt', state: 'done' },
              { id: '4', title: 'Configure seu primeiro orçamento', meta: 'Tente o compositor de orçamentos', trailing: '→', state: 'current' },
              { id: '5', title: 'Conecte com seus fornecedores', meta: 'Portal dos Parceiros', trailing: '+8pt' },
              { id: '6', title: 'Personalize seu Cockpit', meta: 'Escolha KPIs e painéis', trailing: '+3pt' },
            ]}
          />
        </div>
      </Showcase>
    </div>
  )
}

function RadioCardWithIcon({ value, title, description, icon }: { value: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <RadioCard value={value} title={title} description={description}>
      <span className="mr-2 inline-flex">{icon}</span>
    </RadioCard>
  )
}
