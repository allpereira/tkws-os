import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { RadioGroup, RadioCard } from '@/components/ui/radio-group'
import { Input, Field, FieldHint } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { NumberInput } from '@/components/ui/number-input'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { motion, AnimatePresence } from 'motion/react'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Pattern · Conditional Fields',
  import: '// Composição: react-hook-form watch + AnimatePresence + Zod refine',
  contexto:
    'Form onde campos aparecem/somem com base em escolhas anteriores. Use motion para entrada/saída suave. Zod refine garante validação correta para CADA combinação. NUNCA esconda campos com display:none e mantenha valor · UNREGISTER.',
  quandoUsar: [
    'Tipo de projeto define campos extras (decoração full → adiciona orçamento; só projeto → sem orçamento)',
    'Modalidade fiscal define campos de imposto',
    'Cliente PF vs PJ define CPF vs CNPJ',
  ],
  props: [],
  antiPatterns: [
    'Esconder com CSS mantendo no DOM · zod-resolver valida campo invisível',
    'Sem animação · aparece de surpresa',
    'Múltiplos níveis condicionais aninhados · vire Wizard',
  ],
  exemplo: `const tipo = form.watch('tipo')

<RadioGroup value={tipo} onValueChange={(v) => form.setValue('tipo', v)}>
  <RadioCard value="decor-full" title="Decoração completa" />
  <RadioCard value="reform" title="Reforma + decor" />
  <RadioCard value="project" title="Só projeto" />
</RadioGroup>

<AnimatePresence>
  {tipo === 'reform' && (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
      <Field>
        <Label>Tipo de obra estrutural</Label>
        <Input {...form.register('obraTipo')} />
      </Field>
    </motion.div>
  )}
</AnimatePresence>`,
  relacionados: ['Form', 'Wizard'],
}

export function FormConditionalPattern() {
  const [tipo, setTipo] = useState<'decor-full' | 'reform' | 'project'>('reform')
  const [hasFinanciamento, setFinanc] = useState(true)

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="P10.4"
        category="Pattern · Conditional Fields"
        title="Conditional Fields"
        italic="campos reativos"
        description="Campos aparecem/somem conforme escolhas. motion para entrada suave. Zod refine valida cada combinação."
        tag="reativo · animado"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Tipo de projeto · escolhe campos extras" />
      <Showcase>
        <div className="grid gap-5">
          <div>
            <Label>Tipo de projeto</Label>
            <div className="mt-2">
              <RadioGroup value={tipo} onValueChange={(v) => setTipo(v as typeof tipo)} className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
                <RadioCard value="decor-full" title="Decoração completa" description="Inclui mobiliário · escopo único" />
                <RadioCard value="reform" title="Reforma + decoração" description="Alterações estruturais" />
                <RadioCard value="project" title="Apenas projeto" description="Sem execução" />
              </RadioGroup>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {tipo === 'reform' && (
              <motion.div
                key="reform"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Alert tone="warning">
                  <AlertTitle>Reforma estrutural exige aprovação do condomínio</AlertTitle>
                  <AlertDescription>Preencha o RT abaixo · arquitetura precisa do CREA do responsável técnico.</AlertDescription>
                </Alert>
                <div className="mt-4 grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
                  <Field>
                    <Label required>Responsável Técnico (CREA)</Label>
                    <Input placeholder="CREA 12345/SC" />
                  </Field>
                  <Field>
                    <Label>Aprovação do condomínio</Label>
                    <Input placeholder="Nº do protocolo" />
                  </Field>
                </div>
              </motion.div>
            )}

            {tipo === 'decor-full' && (
              <motion.div
                key="decor"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
                  <Field>
                    <Label>Orçamento de mobiliário</Label>
                    <NumberInput value={3_200_000} onChange={() => {}} currency />
                    <FieldHint>Inclui execução · marcenaria · entrega</FieldHint>
                  </Field>
                  <Field>
                    <Label>Estilo · referência principal</Label>
                    <Input placeholder="Editorial · Hygge · Mediterrâneo…" />
                  </Field>
                </div>
              </motion.div>
            )}

            {tipo === 'project' && (
              <motion.div
                key="project"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Field>
                  <Label>Entregáveis</Label>
                  <Textarea rows={3} placeholder="Plantas baixas · cortes · vistas · executivos…" />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Switch que abre sub-form */}
          <div>
            <label className="flex cursor-pointer items-center gap-3">
              <Switch checked={hasFinanciamento} onCheckedChange={setFinanc} />
              <div>
                <div className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>
                  Cliente terá financiamento
                </div>
                <div className="text-[12px]" style={{ color: 'var(--text-mute)' }}>
                  Abre campos de banco · taxa · prazo
                </div>
              </div>
            </label>

            <AnimatePresence>
              {hasFinanciamento && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
                    <Field>
                      <Label>Banco</Label>
                      <Input placeholder="ex: Itaú" />
                    </Field>
                    <Field>
                      <Label>Taxa anual</Label>
                      <NumberInput value={11} onChange={() => {}} suffix="%" />
                    </Field>
                    <Field>
                      <Label>Prazo</Label>
                      <NumberInput value={180} onChange={() => {}} suffix="meses" />
                    </Field>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
