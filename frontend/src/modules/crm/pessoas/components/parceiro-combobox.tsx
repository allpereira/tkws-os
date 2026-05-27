import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { PessoaComboboxField } from './pessoa-combobox'

/**
 * Combobox de Parceiros · mesma UX do PessoaCombobox, filtrado por status PARCEIRO.
 */
export function ParceiroComboboxField<TFormValues extends FieldValues>({
  control,
  name,
  state,
  disabled,
}: {
  control: Control<TFormValues>
  name: FieldPath<TFormValues>
  state?: 'default' | 'error' | 'success'
  disabled?: boolean
}) {
  return (
    <PessoaComboboxField
      control={control}
      name={name}
      placeholder="Buscar parceiro…"
      state={state}
      disabled={disabled}
      statusFilter="PARCEIRO"
      inlineCreate={{
        status: 'PARCEIRO',
        actionLabel: (name) => `Criar parceiro “${name}”`,
        hint: 'Cadastrado como PF · refine depois no cadastro de parceiros',
      }}
    />
  )
}
