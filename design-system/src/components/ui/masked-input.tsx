import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from './input'

/**
 * Masked inputs · variantes BR (CPF, CNPJ, CEP, RG, placa, conta bancária).
 * Cada componente exporta com máscara aplicada + armazenamento de dígitos puros.
 *
 * Também exporta:
 *  - InputAffix · input com banda prefix/suffix (ds-input-affix do HTML)
 *  - MoneyDisplay · campo Fraunces grande (ds-money-display do HTML)
 *
 * ─── Boas práticas de performance embutidas ─────────────────────────────────
 *  1. Intl.NumberFormat e regex como singletons no módulo · init é caro
 *     (~5-10ms cold) e alocações repetidas pesam em forms grandes.
 *  2. useMaskedInput · preserva o caret no meio do texto formatado · evita
 *     o "pulo pro fim" clássico de masked inputs.
 *  3. React.memo em todos os componentes públicos · num form com 20+ campos,
 *     mudar um não re-renderiza os outros (passe onChange estável — useState
 *     setter ou useCallback).
 *  4. Predicados de caracter "permitido" feitos com comparação de char (sem
 *     RegExp.test no hot path) · hot path roda por keystroke.
 *  5. Mask functions O(n) sem alocações desnecessárias além das fatias.
 * ────────────────────────────────────────────────────────────────────────────
 */

// ============================================================================
// Singletons · evita re-instanciar a cada keystroke
// ============================================================================

const NF_BR_THOUSANDS = new Intl.NumberFormat('pt-BR')
const NF_BRL_CURRENCY = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const NF_BR_2_DEC = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const NF_BR_1_DEC = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const RX_NOT_DIGIT = /\D/g
const RX_NOT_DIGIT_X = /[^\dxX]/g
const RX_NOT_ALPHANUM = /[^a-zA-Z0-9]/g

// ============================================================================
// Predicados de chars "permitidos" · usados pelo caret tracker
// (comparação direta de char · evita RegExp.test no hot path)
// ============================================================================

type IsAllowed = (ch: string) => boolean

const isDigit: IsAllowed = (c) => c >= '0' && c <= '9'
const isDigitOrX: IsAllowed = (c) => isDigit(c) || c === 'x' || c === 'X'
const isAlphanum: IsAllowed = (c) =>
  isDigit(c) || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')

// ============================================================================
// Parsers · extraem o "canônico" (digits, alphanum, etc.) de qualquer entrada
// ============================================================================

const parseDigits = (s: string) => s.replace(RX_NOT_DIGIT, '')
const parseDigitsOrXUpper = (s: string) => s.replace(RX_NOT_DIGIT_X, '').toUpperCase()
const parseAlphanumUpper = (s: string) => s.replace(RX_NOT_ALPHANUM, '').toUpperCase()

// ============================================================================
// Máscaras compartilhadas (InputAffix + *Input)
// ============================================================================

export type InputAffixMask = 'cpf' | 'cnpj' | 'cep' | 'phone' | 'date' | 'money-br' | 'digits'

function maskCPF(raw: string) {
  const d = raw.replace(RX_NOT_DIGIT, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function maskCNPJ(raw: string) {
  const d = raw.replace(RX_NOT_DIGIT, '').slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

function maskCEP(raw: string) {
  const d = raw.replace(RX_NOT_DIGIT, '').slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

function maskPhone(raw: string) {
  const digits = raw.replace(RX_NOT_DIGIT, '').slice(0, 11)
  const len = digits.length
  if (len === 0) return ''
  if (len <= 2) return `(${digits}`
  if (len <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (len <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function maskDate(raw: string) {
  const d = raw.replace(RX_NOT_DIGIT, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

function maskMoneyBr(raw: string) {
  const d = raw.replace(RX_NOT_DIGIT, '')
  if (!d) return ''
  return NF_BR_THOUSANDS.format(Number(d))
}

function maskRG(raw: string) {
  const d = parseDigitsOrXUpper(raw).slice(0, 9)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}-${d.slice(8)}`
}

function maskPlate(raw: string) {
  const cleaned = parseAlphanumUpper(raw).slice(0, 7)
  if (cleaned.length <= 3) return cleaned
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
}

function maskMoneyBRL(raw: string) {
  const d = raw.replace(RX_NOT_DIGIT, '')
  if (!d) return ''
  return NF_BRL_CURRENCY.format(Number(d) / 100)
}

function maskMoneyPercentBR(raw: string) {
  const d = raw.replace(RX_NOT_DIGIT, '')
  if (!d) return ''
  return NF_BR_1_DEC.format(Number(d) / 10)
}

function maskMoneyDecimalBR(raw: string) {
  const d = raw.replace(RX_NOT_DIGIT, '')
  if (!d) return ''
  return NF_BR_2_DEC.format(Number(d) / 100)
}

function maxDigitsForMask(mask: InputAffixMask, explicitMax?: number): number | undefined {
  switch (mask) {
    case 'cpf':
      return 11
    case 'cnpj':
      return 14
    case 'cep':
      return 8
    case 'phone':
      return 11
    case 'date':
      return 8
    case 'digits':
      return explicitMax
    case 'money-br':
      return undefined
  }
}

function formatAffixMask(mask: InputAffixMask, raw: string) {
  switch (mask) {
    case 'cpf':
      return maskCPF(raw)
    case 'cnpj':
      return maskCNPJ(raw)
    case 'cep':
      return maskCEP(raw)
    case 'phone':
      return maskPhone(raw)
    case 'date':
      return maskDate(raw)
    case 'money-br':
      return maskMoneyBr(raw)
    case 'digits':
      return raw.replace(RX_NOT_DIGIT, '')
  }
}

// ============================================================================
// Caret preservation · hook canônico de input mascarado
// ============================================================================
//
// Sem isso, ao editar no meio do texto formatado, o cursor pula pro fim.
// Truque: contar quantos chars "permitidos" existem antes do caret no input
// recém-mudado, e após o React repintar reposicionar o caret logo depois do
// mesmo número de chars permitidos no novo texto formatado.

function countAllowedChars(s: string, end: number, isAllowed: IsAllowed) {
  let count = 0
  const max = Math.min(end, s.length)
  for (let i = 0; i < max; i++) {
    if (isAllowed(s[i])) count++
  }
  return count
}

function caretAfterNAllowed(formatted: string, n: number, isAllowed: IsAllowed) {
  if (n <= 0) return 0
  let count = 0
  for (let i = 0; i < formatted.length; i++) {
    if (isAllowed(formatted[i])) {
      count++
      if (count === n) return i + 1
    }
  }
  return formatted.length
}

function useMaskedInput(
  inputRef: React.RefObject<HTMLInputElement | null>,
  rawValue: string,
  onRawChange: (raw: string) => void,
  format: (raw: string) => string,
  parse: (s: string) => string,
  isAllowed: IsAllowed,
  maxRaw?: number,
) {
  const pendingCaret = React.useRef<number | null>(null)
  const formatted = format(rawValue)

  // useLayoutEffect · roda antes do paint, evita flicker do caret
  React.useLayoutEffect(() => {
    const target = pendingCaret.current
    if (target == null) return
    pendingCaret.current = null
    const el = inputRef.current
    if (!el || document.activeElement !== el) return
    try {
      el.setSelectionRange(target, target)
    } catch {
      /* alguns tipos de input não suportam · noop */
    }
  })

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target
    const raw = el.value
    const caret = el.selectionStart ?? raw.length
    const allowedBefore = countAllowedChars(raw, caret, isAllowed)

    let parsed = parse(raw)
    if (maxRaw !== undefined) parsed = parsed.slice(0, maxRaw)

    const nextFormatted = format(parsed)
    pendingCaret.current = caretAfterNAllowed(nextFormatted, allowedBefore, isAllowed)
    onRawChange(parsed)
  }

  return { formatted, onInputChange }
}

// Funções "no-op" reaproveitáveis · evitam alocar a cada render quando
// InputAffix está no modo não-mascarado.
const NOOP_RAW_CHANGE = (_: string) => {}
const IDENTITY = (s: string) => s

// ============================================================================
// InputAffix · prefix/suffix com bandas surface-3 separadas por linha
// ============================================================================
/**
 * Fiel ao HTML · ds-input-affix:
 *   flex stretch · bg surface-2 · border 1px line-2 · radius 10px
 *   prefix/suffix: bg surface-3 · mono 12.5px/600 text-mute · padding 0 12px
 *     prefix: radius 9px 0 0 9px + border-right line-1
 *     suffix: radius 0 9px 9px 0 + border-left line-1
 *   input: padding 10px 13px · bg transparent · font 14px tabular-nums
 *   focus-within: border brand · bg surface-1
 *   err: border danger · success: border success
 */

export interface InputAffixProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'value' | 'defaultValue' | 'onChange'> {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  state?: 'default' | 'success' | 'error'
  containerClassName?: string
  /** Com `rawValue` + `onRawValueChange`, aplica máscara e guarda só dígitos. */
  mask?: InputAffixMask
  rawValue?: string
  onRawValueChange?: (digits: string) => void
  value?: string
  defaultValue?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export const InputAffix = React.memo(
  React.forwardRef<HTMLInputElement, InputAffixProps>(function InputAffix(
    {
      prefix,
      suffix,
      state = 'default',
      containerClassName,
      className,
      mask,
      rawValue,
      onRawValueChange,
      value,
      defaultValue,
      onChange,
      maxLength,
      inputMode,
      ...inputProps
    },
    externalRef,
  ) {
    const innerRef = React.useRef<HTMLInputElement>(null)
    const setRef = (node: HTMLInputElement | null) => {
      ;(innerRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof externalRef === 'function') externalRef(node)
      else if (externalRef)
        (externalRef as React.MutableRefObject<HTMLInputElement | null>).current = node
    }

    const isMasked = mask != null && onRawValueChange != null
    const borderColor =
      state === 'error' ? 'var(--danger)' : state === 'success' ? 'var(--success)' : 'var(--line-2)'

    // Hook é sempre chamado (regra dos hooks). No modo não-mascarado, recebe
    // no-ops baratos · custo é apenas 1 useRef + 1 useLayoutEffect vazio.
    const { formatted, onInputChange } = useMaskedInput(
      innerRef,
      isMasked ? rawValue ?? '' : '',
      isMasked ? onRawValueChange : NOOP_RAW_CHANGE,
      isMasked ? (s) => formatAffixMask(mask, s) : IDENTITY,
      parseDigits,
      isDigit,
      isMasked ? maxDigitsForMask(mask, maxLength) : undefined,
    )

    const resolvedInputMode = inputMode ?? (isMasked ? 'numeric' : undefined)

    return (
      <div
        className={cn(
          'relative flex items-stretch overflow-hidden rounded-[10px] border transition-all focus-within:[&]:border-[var(--brand)] focus-within:[&]:bg-[var(--surface-1)]',
          containerClassName
        )}
        style={{
          background: 'var(--surface-2)',
          borderColor,
        }}
      >
        {prefix != null && (
          <span
            className="mono inline-flex select-none items-center px-3 text-[12.5px] font-semibold"
            style={{
              background: 'var(--surface-3)',
              color: 'var(--text-mute)',
              borderRight: '1px solid var(--line-1)',
            }}
          >
            {prefix}
          </span>
        )}
        <input
          ref={setRef}
          {...inputProps}
          type={inputProps.type ?? 'text'}
          inputMode={resolvedInputMode}
          value={isMasked ? formatted : value}
          defaultValue={isMasked ? undefined : defaultValue}
          onChange={isMasked ? onInputChange : onChange}
          maxLength={isMasked ? undefined : maxLength}
          className={cn(
            'num-tabular min-w-0 flex-1 bg-transparent px-[13px] py-[10px] text-[14px] outline-none placeholder:text-[var(--text-mute)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          style={{ color: 'var(--text)', ...inputProps.style }}
        />
        {suffix != null && (
          <span
            className="mono inline-flex select-none items-center px-3 text-[12.5px] font-semibold"
            style={{
              background: 'var(--surface-3)',
              color: 'var(--text-mute)',
              borderLeft: '1px solid var(--line-1)',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    )
  })
)
;(InputAffix as { displayName?: string }).displayName = 'InputAffix'

// ============================================================================
// MoneyDisplay · valor em Fraunces grande enquanto digita
// ============================================================================
/**
 * Fiel ao HTML · ds-money-display:
 *   container bg surface-1 · border line-2 · radius 12px · padding 14px 18px · flex col gap 6
 *   label mono 10px / 1.3px uppercase text-mute / 600
 *   input-row: flex baseline gap 8px
 *     currency: Fraunces 20px text-soft / 400
 *     input: Fraunces 32px / 300 · letter-spacing -0.025em · tabular-nums
 *     unit: Fraunces 18px text-soft italic
 *   hint: 11.5px text-mute
 */

export interface MoneyDisplayProps {
  label: string
  /** centavos (1250000 = R$ 12.500,00) — se undefined, exibe placeholder */
  value: number | undefined
  onChange: (cents: number | undefined) => void
  currency?: string
  unit?: string
  hint?: React.ReactNode
  placeholder?: string
  /** Quando true, exibe input em estilo "percent": currency vira `%`, unit sumiu. */
  percent?: boolean
  id?: string
  className?: string
}

export const MoneyDisplay = React.memo(function MoneyDisplay({
  label,
  value,
  onChange,
  currency = 'R$',
  unit = ',00',
  hint,
  placeholder = '0,00',
  percent = false,
  id,
  className,
}: MoneyDisplayProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Ponte entre o "canônico" (digits string) que o hook usa e o `number | undefined`
  // (cents) que o componente expõe.
  const rawValue = value === undefined ? '' : String(value)
  const formatRaw = percent ? maskMoneyPercentBR : maskMoneyDecimalBR

  const { formatted, onInputChange } = useMaskedInput(
    inputRef,
    rawValue,
    (r) => onChange(r === '' ? undefined : parseInt(r, 10)),
    formatRaw,
    parseDigits,
    isDigit,
  )

  return (
    <div
      className={cn('flex flex-col gap-1.5 rounded-[12px] border', className)}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-2)',
        padding: '14px 18px',
      }}
    >
      <span
        className="mono text-[10px] font-semibold uppercase tracking-[1.3px]"
        style={{ color: 'var(--text-mute)' }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        {!percent && (
          <span
            className="serif"
            style={{
              fontSize: 20,
              color: 'var(--text-soft)',
              fontWeight: 400,
            }}
          >
            {currency}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={formatted}
          onChange={onInputChange}
          className="num-tabular flex-1 bg-transparent outline-none placeholder:italic"
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: '-0.025em',
            color: 'var(--text)',
            border: 0,
          }}
        />
        {!percent && unit && (
          <span
            className="serif italic"
            style={{
              fontSize: 18,
              color: 'var(--text-soft)',
            }}
          >
            {unit}
          </span>
        )}
        {percent && (
          <span
            className="serif"
            style={{
              fontSize: 20,
              color: 'var(--text-soft)',
              fontWeight: 400,
            }}
          >
            %
          </span>
        )}
      </div>
      {hint && (
        <span className="text-[11.5px]" style={{ color: 'var(--text-mute)' }}>
          {hint}
        </span>
      )}
    </div>
  )
})
;(MoneyDisplay as { displayName?: string }).displayName = 'MoneyDisplay'

// ============================================================================
// Componentes públicos · *Input com máscara + memoização
// ============================================================================

export interface MaskedProps {
  value: string
  onChange: (raw: string) => void
  id?: string
  error?: boolean
  disabled?: boolean
  placeholder?: string
}

// ─── CPF · 000.000.000-00 ───────────────────────────────────────────────────
export const CPFInput = React.memo(function CPFInput({
  value,
  onChange,
  placeholder = '000.000.000-00',
  ...rest
}: MaskedProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { formatted, onInputChange } = useMaskedInput(
    inputRef,
    value,
    onChange,
    maskCPF,
    parseDigits,
    isDigit,
    11,
  )
  return (
    <Input
      ref={inputRef}
      {...rest}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
      value={formatted}
      onChange={onInputChange}
    />
  )
})
;(CPFInput as { displayName?: string }).displayName = 'CPFInput'

// ─── CNPJ · 00.000.000/0000-00 ──────────────────────────────────────────────
export const CNPJInput = React.memo(function CNPJInput({
  value,
  onChange,
  placeholder = '00.000.000/0000-00',
  ...rest
}: MaskedProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { formatted, onInputChange } = useMaskedInput(
    inputRef,
    value,
    onChange,
    maskCNPJ,
    parseDigits,
    isDigit,
    14,
  )
  return (
    <Input
      ref={inputRef}
      {...rest}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
      value={formatted}
      onChange={onInputChange}
    />
  )
})
;(CNPJInput as { displayName?: string }).displayName = 'CNPJInput'

// ─── CEP · 00000-000 ────────────────────────────────────────────────────────
export const CEPInput = React.memo(function CEPInput({
  value,
  onChange,
  placeholder = '00000-000',
  ...rest
}: MaskedProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { formatted, onInputChange } = useMaskedInput(
    inputRef,
    value,
    onChange,
    maskCEP,
    parseDigits,
    isDigit,
    8,
  )
  return (
    <Input
      ref={inputRef}
      {...rest}
      type="text"
      inputMode="numeric"
      autoComplete="postal-code"
      placeholder={placeholder}
      value={formatted}
      onChange={onInputChange}
    />
  )
})
;(CEPInput as { displayName?: string }).displayName = 'CEPInput'

// ─── RG · 00.000.000-X (genérico · varia por estado) ────────────────────────
export const RGInput = React.memo(function RGInput({
  value,
  onChange,
  placeholder = '00.000.000-0',
  ...rest
}: MaskedProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { formatted, onInputChange } = useMaskedInput(
    inputRef,
    value,
    onChange,
    maskRG,
    parseDigitsOrXUpper,
    isDigitOrX,
    9,
  )
  return (
    <Input
      ref={inputRef}
      {...rest}
      type="text"
      inputMode="text"
      autoComplete="off"
      placeholder={placeholder}
      value={formatted}
      onChange={onInputChange}
    />
  )
})
;(RGInput as { displayName?: string }).displayName = 'RGInput'

// ─── Placa · ABC-1234 ou ABC1D23 (Mercosul) ─────────────────────────────────
export const PlateInput = React.memo(function PlateInput({
  value,
  onChange,
  placeholder = 'ABC-1234',
  ...rest
}: MaskedProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { formatted, onInputChange } = useMaskedInput(
    inputRef,
    value,
    onChange,
    maskPlate,
    parseAlphanumUpper,
    isAlphanum,
    7,
  )
  return (
    <Input
      ref={inputRef}
      {...rest}
      type="text"
      autoComplete="off"
      placeholder={placeholder}
      value={formatted}
      onChange={onInputChange}
    />
  )
})
;(PlateInput as { displayName?: string }).displayName = 'PlateInput'

// ─── Money inline · armazena centavos ───────────────────────────────────────
export interface MoneyInputProps {
  /** centavos · 1250000 = R$ 12.500,00 */
  value: number | undefined
  onChange: (cents: number | undefined) => void
  id?: string
  error?: boolean
  disabled?: boolean
}

export const MoneyInput = React.memo(function MoneyInput({
  value,
  onChange,
  ...rest
}: MoneyInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const rawValue = value === undefined ? '' : String(value)

  const { formatted, onInputChange } = useMaskedInput(
    inputRef,
    rawValue,
    (r) => onChange(r === '' ? undefined : parseInt(r, 10)),
    maskMoneyBRL,
    parseDigits,
    isDigit,
  )

  return (
    <Input
      ref={inputRef}
      {...rest}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={formatted}
      onChange={onInputChange}
      placeholder="R$ 0,00"
    />
  )
})
;(MoneyInput as { displayName?: string }).displayName = 'MoneyInput'
