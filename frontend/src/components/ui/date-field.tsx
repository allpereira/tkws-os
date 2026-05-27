import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { format, parse, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, X as XIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'
import { Button } from './button'
import { cn } from '@/lib/utils'

/**
 * DateField · wrapper do Calendar/Popover integrado com RHF via `Controller`.
 *
 * Internamente o `field.value` é uma **string ISO `yyyy-MM-dd`** (formato que
 * o backend `Oportunidade.previsaoFechamento` espera · ver schema Zod
 * `z.string().date()`). O usuário vê e clica no formato `dd/MM/yyyy` pt-BR
 * via DayPicker.
 *
 * Uso:
 *   <DateField
 *     control={control}
 *     name="previsaoFechamento"
 *     placeholder="Selecione a data"
 *   />
 */

export interface DateFieldProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>
  name: FieldPath<TFormValues>
  placeholder?: string
  state?: 'default' | 'error' | 'success'
  disabled?: boolean
  className?: string
  /** Permite limpar a data · default true. */
  clearable?: boolean
  /** Valor mínimo selecionável (Date). */
  minDate?: Date
  /** Valor máximo selecionável (Date). */
  maxDate?: Date
}

function borderForState(s: 'default' | 'error' | 'success') {
  if (s === 'error') return 'var(--danger)'
  if (s === 'success') return 'var(--success)'
  return 'var(--line-2)'
}

export function DateField<TFormValues extends FieldValues>({
  control,
  name,
  placeholder = 'Selecione a data',
  state = 'default',
  disabled,
  className,
  clearable = true,
  minDate,
  maxDate,
}: DateFieldProps<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const iso = field.value && typeof field.value === 'string' ? field.value : ''
        const parsed = iso ? parse(iso, 'yyyy-MM-dd', new Date()) : undefined
        const selectedDate = parsed && isValid(parsed) ? parsed : undefined
        const label = selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : ''

        const handleSelect = (date: Date | undefined) => {
          if (!date) {
            field.onChange(null)
          } else {
            field.onChange(format(date, 'yyyy-MM-dd'))
          }
        }

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onBlur={field.onBlur}
                aria-invalid={state === 'error'}
                className={cn(
                  'w-full justify-start font-normal',
                  !label && 'text-muted-foreground',
                  className,
                )}
                style={{ borderColor: borderForState(state) }}
              >
                <CalendarIcon className="mr-2 size-4 opacity-70" />
                <span className="flex-1 text-left">{label || placeholder}</span>
                {clearable && label && !disabled && (
                  <span
                    role="button"
                    tabIndex={-1}
                    aria-label="Limpar data"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      field.onChange(null)
                    }}
                    className="ml-2 inline-flex size-4 items-center justify-center rounded opacity-60 hover:opacity-100"
                  >
                    <XIcon className="size-3.5" />
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}
                disabled={[
                  ...(minDate ? [{ before: minDate }] : []),
                  ...(maxDate ? [{ after: maxDate }] : []),
                ]}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        )
      }}
    />
  )
}
