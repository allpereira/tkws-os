import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

/**
 * Calendar · react-day-picker v9 customizado para TKWS OS.
 *
 * v9 usa CSS vars `--rdp-*` · sobrescrevemos no .tkws-calendar.
 * O CSS default vem de 'react-day-picker/dist/style.css'.
 *
 * Por padrão SEM border/background · ideal dentro de Popover.
 * Use `standalone` para mostrar como card isolado (página de Agenda).
 */

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /** Quando true · adiciona border + bg + padding (uso standalone fora de Popover) */
  standalone?: boolean
}

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  standalone = false,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={ptBR}
      className={cn('tkws-calendar', standalone && 'tkws-calendar--standalone', className)}
      classNames={classNames}
      {...(props as any)}
    />
  )
}
