import { useState } from 'react'
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
    { name: 'error', type: 'boolean', description: 'Estado de validação' },
  ],
  antiPatterns: [
    'Armazenar valor formatado · perde portabilidade entre BR e internacional',
    'Validar máscara via regex no front sem libVerify (cpf-cnpj-validator)',
    'Hardcode de "R$" · use MoneyInput que faz Intl',
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
              state="success"
              suffix={<Check size={12} style={{ color: 'var(--success)' }} />}
              placeholder="000.000.000-00"
              defaultValue="123.456.789-09"
            />
            <FieldHint>
              <span style={{ color: 'var(--success)' }}>Validado · Receita Federal</span>
            </FieldHint>
          </Field>

          <Field>
            <Label>CNPJ da empresa</Label>
            <InputAffix placeholder="00.000.000/0000-00" />
            <FieldHint>14 dígitos · validado ao sair do campo</FieldHint>
          </Field>

          <Field>
            <Label>Telefone · WhatsApp</Label>
            <InputAffix
              prefix="+55"
              suffix={<Phone size={12} />}
              placeholder="(00) 00000-0000"
              defaultValue="(11) 98765-4321"
            />
          </Field>

          <Field>
            <Label>CEP do endereço</Label>
            <InputAffix
              suffix={
                <span style={{ color: 'var(--brand)', fontWeight: 700, fontSize: 14 }}>
                  <RotateCw size={12} />
                </span>
              }
              placeholder="00000-000"
              defaultValue="04547-130"
            />
            <FieldHint>Rua Joaquim Floriano · Itaim Bibi · SP</FieldHint>
          </Field>

          <Field>
            <Label>Data de nascimento</Label>
            <InputAffix
              prefix={<Calendar size={12} />}
              placeholder="dd/mm/aaaa"
              defaultValue="12/03/1978"
            />
          </Field>

          <Field>
            <Label>Área</Label>
            <InputAffix
              suffix="m²"
              placeholder="0"
              defaultValue="280"
              inputMode="numeric"
            />
          </Field>

          <Field>
            <Label>Código do projeto</Label>
            <InputAffix
              prefix={<Hash size={12} />}
              placeholder="0000"
              defaultValue="2410"
              maxLength={4}
              inputMode="numeric"
            />
            <FieldHint>Sequencial automático · 4 dígitos</FieldHint>
          </Field>

          <Field>
            <Label>Valor da parcela</Label>
            <InputAffix
              prefix="R$"
              suffix=",00"
              placeholder="0,00"
              defaultValue="300.000"
            />
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
    </div>
  )
}
