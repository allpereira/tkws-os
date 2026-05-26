import { memo, useMemo, useRef, useState } from 'react'
import { Calendar, Check, Hash, Phone, RotateCw } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  CEPInput,
  CNPJInput,
  CPFInput,
  InputAffix,
  MoneyDisplay,
  MoneyInput,
  PlateInput,
  RGInput,
} from '@/components/ui/masked-input'
import { Field, FieldHint } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Masked Inputs (BR)',
  import: "import { CPFInput, CNPJInput, CEPInput, RGInput, PlateInput, MoneyInput, MoneyDisplay, InputAffix } from '@/components/ui/masked-input'",
  contexto:
    'Inputs com máscaras BR · CPF, CNPJ, CEP, RG, placa de veículo, moeda BRL, percentual. Internamente guardam SÓ dígitos puros (ou centavos para money) · exibem formatado. MoneyDisplay é variante editorial com Fraunces 32px. InputAffix permite prefix/suffix em bandas surface-3 (CPF + ✓, +55, R$, m², #, etc).',
  quandoUsar: [
    'Cadastros com identificação (cliente PF/PJ)',
    'Endereços (CEP)',
    'Veículos da equipe (placa)',
    'Valores monetários sem stepper (MoneyInput)',
    'Hero do contrato com valor em destaque (MoneyDisplay)',
    'Telefone, código com prefixo, área com sufixo m² (InputAffix)',
  ],
  props: [
    { name: 'value', type: 'string (dígitos puros) ou number (centavos · money)', description: 'Sempre o valor "limpo"' },
    { name: 'onChange', type: '(digits|cents) => void', description: 'Recebe valor limpo · você guarda assim' },
    { name: 'mask', type: 'InputAffixMask', description: 'Em InputAffix: cpf · cnpj · cep · phone · date · money-br · digits' },
    { name: 'rawValue / onRawValueChange', type: 'string', description: 'InputAffix mascarado · armazena só dígitos' },
    { name: 'error', type: 'boolean', description: 'Estado de validação' },
  ],
  antiPatterns: [
    'Armazenar valor formatado · perde portabilidade entre BR e internacional',
    'Validar máscara via regex no front sem libVerify (cpf-cnpj-validator)',
    'Hardcode de "R$" · use MoneyInput que faz Intl',
    'Reformatar com `new Intl.NumberFormat(...)` por keystroke · hoist como singleton',
    'Não preservar o caret · usuário digita no meio e o cursor pula pro fim',
    'Esquecer React.memo · num form com 20+ campos, todo keystroke re-renderiza todos',
  ],
  exemplo: `const [cpf, setCpf] = useState('')
const [valor, setValor] = useState<number | undefined>(1_250_000) // cents

<CPFInput value={cpf} onChange={setCpf} />
<MoneyInput value={valor} onChange={setValor} />
<MoneyDisplay label="Valor do contrato" value={valor} onChange={setValor} />
<InputAffix prefix="+55" placeholder="(11) 98765-4321" />`,
  relacionados: ['Input', 'NumberInput', 'PhoneInput'],
}

export function MaskedInputsPage() {
  const [cpf, setCpf] = useState('12345678901')
  const [cnpj, setCnpj] = useState('12345678000190')
  const [cep, setCep] = useState('88330000')
  const [rg, setRg] = useState('12345678X')
  const [plate, setPlate] = useState('ABC1234')
  const [money, setMoney] = useState<number | undefined>(1_250_000)
  const [contract, setContract] = useState<number | undefined>(240_000_000)
  const [margin, setMargin] = useState<number | undefined>(325)

  const [affixCpf, setAffixCpf] = useState('12345678909')
  const [affixCnpj, setAffixCnpj] = useState('')
  const [affixPhone, setAffixPhone] = useState('11987654321')
  const [affixCep, setAffixCep] = useState('04547130')
  const [affixBirth, setAffixBirth] = useState('12031978')
  const [affixArea, setAffixArea] = useState('280')
  const [affixCode, setAffixCode] = useState('2410')
  const [affixMoney, setAffixMoney] = useState('300000')

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="07.17"
        category="Inputs · Masked"
        title="Masked Inputs (BR)"
        italic="CPF · CNPJ · CEP · RG · Placa · Money · Affix"
        description="Máscaras BR + InputAffix (prefix/suffix bandas) + MoneyDisplay (Fraunces 32px). Armazenam dígitos puros."
        tag="9 variantes"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Money Display · valor em Fraunces ao vivo" italic="formato R$ pt-BR · vírgula decimal · ponto milhar" />
      <Showcase>
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          <MoneyDisplay
            label="Valor do contrato"
            value={contract}
            onChange={setContract}
            hint="dois milhões e quatrocentos mil reais"
          />
          <MoneyDisplay
            label="Margem-alvo"
            value={margin}
            onChange={setMargin}
            percent
            hint="cima da meta de 30%"
          />
        </div>
      </Showcase>

      <SubHead num="B" title="Input com afixos · prefix/suffix em bandas" italic="CPF · Telefone · CEP · Data · m² · #código" />
      <Showcase>
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          <Field>
            <Label required>CPF do cliente</Label>
            <InputAffix
              mask="cpf"
              rawValue={affixCpf}
              onRawValueChange={setAffixCpf}
              state="success"
              suffix={<Check size={12} style={{ color: 'var(--success)' }} />}
              placeholder="000.000.000-00"
            />
            <FieldHint>
              <span style={{ color: 'var(--success)' }}>Validado · Receita Federal</span>
              {' · '}
              <code className="mono">{affixCpf}</code>
            </FieldHint>
          </Field>

          <Field>
            <Label>CNPJ da empresa</Label>
            <InputAffix
              mask="cnpj"
              rawValue={affixCnpj}
              onRawValueChange={setAffixCnpj}
              placeholder="00.000.000/0000-00"
            />
            <FieldHint>
              14 dígitos · validado ao sair do campo · <code className="mono">{affixCnpj || '—'}</code>
            </FieldHint>
          </Field>

          <Field>
            <Label>Telefone · WhatsApp</Label>
            <InputAffix
              mask="phone"
              rawValue={affixPhone}
              onRawValueChange={setAffixPhone}
              prefix="+55"
              suffix={<Phone size={12} />}
              placeholder="(00) 00000-0000"
            />
            <FieldHint>
              Dígitos: <code className="mono">{affixPhone}</code>
            </FieldHint>
          </Field>

          <Field>
            <Label>CEP do endereço</Label>
            <InputAffix
              mask="cep"
              rawValue={affixCep}
              onRawValueChange={setAffixCep}
              suffix={
                <span style={{ color: 'var(--brand)', fontWeight: 700, fontSize: 14 }}>
                  <RotateCw size={12} />
                </span>
              }
              placeholder="00000-000"
            />
            <FieldHint>
              Rua Joaquim Floriano · Itaim Bibi · SP · <code className="mono">{affixCep}</code>
            </FieldHint>
          </Field>

          <Field>
            <Label>Data de nascimento</Label>
            <InputAffix
              mask="date"
              rawValue={affixBirth}
              onRawValueChange={setAffixBirth}
              prefix={<Calendar size={12} />}
              placeholder="dd/mm/aaaa"
            />
            <FieldHint>
              ISO parcial: <code className="mono">{affixBirth}</code>
            </FieldHint>
          </Field>

          <Field>
            <Label>Área</Label>
            <InputAffix
              mask="digits"
              rawValue={affixArea}
              onRawValueChange={setAffixArea}
              suffix="m²"
              placeholder="0"
            />
            <FieldHint>
              m² · <code className="mono">{affixArea}</code>
            </FieldHint>
          </Field>

          <Field>
            <Label>Código do projeto</Label>
            <InputAffix
              mask="digits"
              rawValue={affixCode}
              onRawValueChange={setAffixCode}
              prefix={<Hash size={12} />}
              placeholder="0000"
              maxLength={4}
            />
            <FieldHint>
              Sequencial automático · 4 dígitos · <code className="mono">{affixCode}</code>
            </FieldHint>
          </Field>

          <Field>
            <Label>Valor da parcela</Label>
            <InputAffix
              mask="money-br"
              rawValue={affixMoney}
              onRawValueChange={setAffixMoney}
              prefix="R$"
              suffix=",00"
              placeholder="0"
            />
            <FieldHint>
              Centavos implícitos no sufixo · dígitos: <code className="mono">{affixMoney}</code>
            </FieldHint>
          </Field>
        </div>
      </Showcase>

      <SubHead num="C" title="Identificação · CPF · CNPJ · RG" />
      <Showcase>
        <div className="grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
          <Field>
            <Label htmlFor="m-cpf" required>CPF</Label>
            <CPFInput id="m-cpf" value={cpf} onChange={setCpf} />
            <FieldHint>Salvo: <code className="mono">{cpf}</code></FieldHint>
          </Field>
          <Field>
            <Label htmlFor="m-cnpj">CNPJ</Label>
            <CNPJInput id="m-cnpj" value={cnpj} onChange={setCnpj} />
            <FieldHint>Salvo: <code className="mono">{cnpj}</code></FieldHint>
          </Field>
          <Field>
            <Label htmlFor="m-rg">RG</Label>
            <RGInput id="m-rg" value={rg} onChange={setRg} />
            <FieldHint>Aceita X final</FieldHint>
          </Field>
        </div>
      </Showcase>

      <SubHead num="D" title="Endereço · CEP" italic="auto-fill com ViaCEP no submit" />
      <Showcase>
        <Field className="max-w-xs">
          <Label htmlFor="m-cep">CEP</Label>
          <CEPInput id="m-cep" value={cep} onChange={setCep} />
          <FieldHint>
            Dígitos: <code className="mono">{cep}</code> · use viaCEP para preencher cidade/rua
          </FieldHint>
        </Field>
      </Showcase>

      <SubHead num="E" title="Placa de veículo · Mercosul OK" />
      <Showcase>
        <Field className="max-w-xs">
          <Label htmlFor="m-plate">Placa</Label>
          <PlateInput id="m-plate" value={plate} onChange={setPlate} />
        </Field>
      </Showcase>

      <SubHead num="F" title="Moeda inline · armazena centavos" italic="1250000 = R$ 12.500,00" />
      <Showcase>
        <Field className="max-w-xs">
          <Label htmlFor="m-money" required>Valor do contrato</Label>
          <MoneyInput id="m-money" value={money} onChange={setMoney} />
          <FieldHint>
            Cents salvos: <code className="mono">{money}</code>
          </FieldHint>
        </Field>
      </Showcase>

      <SubHead
        num="G"
        title="Performance"
        italic="memo + cursor preservation + Intl hoisted"
        tag="boas práticas"
      />
      <Showcase
        title="Cursor preservation"
        description="Digite no meio de um CPF formatado abaixo (ex.: clique entre o 3º e o 4º dígito e digite). O caret continua exatamente onde você estava — sem pular pro fim. Implementado via useLayoutEffect que conta dígitos antes do caret e re-âncora após o re-render."
      >
        <Field className="max-w-sm">
          <Label htmlFor="m-caret">CPF · edite no meio</Label>
          <CPFInput id="m-caret" value={cpf} onChange={setCpf} />
          <FieldHint>
            Sem caret-preservation, o cursor pularia pro final a cada tecla.
          </FieldHint>
        </Field>
      </Showcase>

      <Showcase
        title="Memoização · 12 CPFs"
        description="Cada linha tem um contador de renders próprio. Digite em qualquer uma — só o contador daquela linha incrementa. Sem React.memo, mudar um campo re-renderizaria os 12 (relevante em forms de 20+ campos)."
      >
        <PerfStressDemo />
      </Showcase>

      <Showcase
        title="O que está embutido"
        bg="surface-1"
      >
        <ul
          className="grid gap-2 text-[13px]"
          style={{ color: 'var(--text-soft)' }}
        >
          <li>
            <strong style={{ color: 'var(--text)' }}>1. Intl.NumberFormat como singleton</strong> — instanciado uma vez no módulo. <code className="mono">new Intl.NumberFormat(...)</code> custa ~5-10ms cold; reusar economiza por keystroke.
          </li>
          <li>
            <strong style={{ color: 'var(--text)' }}>2. useMaskedInput · caret preservation</strong> — conta chars permitidos antes do cursor, reposiciona no novo texto formatado em <code className="mono">useLayoutEffect</code> (antes do paint, sem flicker).
          </li>
          <li>
            <strong style={{ color: 'var(--text)' }}>3. React.memo em todos os componentes públicos</strong> — só re-renderiza quando suas props mudam. Combina com setters estáveis do <code className="mono">useState</code> ou <code className="mono">useCallback</code>.
          </li>
          <li>
            <strong style={{ color: 'var(--text)' }}>4. Predicados de char inline</strong> — <code className="mono">isDigit/isAlphanum</code> usam comparação de char em vez de <code className="mono">RegExp.test</code> no hot path.
          </li>
          <li>
            <strong style={{ color: 'var(--text)' }}>5. Regex literais hoisted</strong> — <code className="mono">/\D/g</code>, <code className="mono">/[^\dxX]/g</code> e <code className="mono">/[^a-zA-Z0-9]/g</code> compilados uma vez no topo do módulo.
          </li>
          <li>
            <strong style={{ color: 'var(--text)' }}>6. inputMode + autoComplete corretos</strong> — <code className="mono">numeric</code> em CPF/CNPJ/CEP/Phone/Money, <code className="mono">postal-code</code> em CEP. Teclado certo no mobile, sem auto-fill agressivo do navegador.
          </li>
        </ul>
      </Showcase>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Demo de stress · 12 CPFs com contador de renders por linha.
 * Setters memoizados → React.memo de PerfRow funciona → ao digitar em uma
 * linha, só ela re-renderiza · as outras 11 ficam no count anterior.
 * ───────────────────────────────────────────────────────────────────────── */

const STRESS_COUNT = 12

function PerfStressDemo() {
  const [values, setValues] = useState<string[]>(() => Array(STRESS_COUNT).fill(''))
  const setters = useMemo(
    () =>
      Array.from({ length: STRESS_COUNT }, (_, i) => (next: string) =>
        setValues((cur) => {
          if (cur[i] === next) return cur
          const arr = cur.slice()
          arr[i] = next
          return arr
        })
      ),
    [],
  )

  return (
    <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
      {values.map((v, i) => (
        <PerfRow key={i} index={i + 1} value={v} onChange={setters[i]} />
      ))}
    </div>
  )
}

type PerfRowProps = {
  index: number
  value: string
  onChange: (raw: string) => void
}

const PerfRow = memo(function PerfRow({ index, value, onChange }: PerfRowProps) {
  const renders = useRef(0)
  renders.current++
  return (
    <Field>
      <Label>CPF #{index}</Label>
      <CPFInput value={value} onChange={onChange} />
      <FieldHint>
        Renders:{' '}
        <strong
          style={{
            color: renders.current === 1 ? 'var(--text-mute)' : 'var(--brand)',
          }}
        >
          {renders.current}
        </strong>
      </FieldHint>
    </Field>
  )
})
