import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Field, FieldHint, Input, Label } from '@/components/ui/input'
import { SelectField } from '@/components/ui/select-field'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { parseApiError, formatApiErrorInfo } from '@/lib/api-error'
import { useCreateInvite } from '../api'
import {
  createInviteSchema,
  inviteRoleValues,
  INVITE_ROLE_LABELS,
  type CreateInviteInput,
  type InviteCreated,
} from '../schema'

const roleOptions = inviteRoleValues.map((value) => ({
  value,
  label: INVITE_ROLE_LABELS[value],
}))

interface InviteFormProps {
  onSuccess: (created: InviteCreated) => void
  onCancel: () => void
}

/**
 * Formulário de convite de usuário. Cria o convite no backend, que dispara o
 * email com o magic link. O acesso só é ativado quando o convidado confirma
 * pelo link — aqui apenas emitimos o convite.
 */
export function InviteForm({ onSuccess, onCancel }: InviteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateInviteInput>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: { email: '', fullName: undefined, role: 'default' },
  })

  const createMut = useCreateInvite()

  const onSubmit = handleSubmit(async (data) => {
    const created = await createMut.mutateAsync(data)
    onSuccess(created)
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-label="Convidar usuário" noValidate>
      {createMut.isError && (
        <Alert tone="danger">
          <AlertTitle>Não foi possível enviar o convite</AlertTitle>
          <AlertDescription>{formatApiErrorInfo(parseApiError(createMut.error))}</AlertDescription>
        </Alert>
      )}

      <Field>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="off"
          placeholder="pessoa@escritorio.com"
          state={errors.email ? 'error' : 'default'}
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email && <FieldHint state="error">{errors.email.message}</FieldHint>}
        <FieldHint>O convite é enviado para este endereço. O acesso só é ativado após a confirmação.</FieldHint>
      </Field>

      <Field>
        <Label htmlFor="fullName">Nome (opcional)</Label>
        <Input
          id="fullName"
          type="text"
          autoComplete="off"
          placeholder="Como a pessoa será exibida no sistema"
          state={errors.fullName ? 'error' : 'default'}
          disabled={isSubmitting}
          {...register('fullName')}
        />
        {errors.fullName && <FieldHint state="error">{errors.fullName.message}</FieldHint>}
      </Field>

      <Field>
        <Label required>Papel</Label>
        <SelectField
          control={control}
          name="role"
          placeholder="Selecione o papel"
          state={errors.role ? 'error' : 'default'}
          options={roleOptions}
        />
        {errors.role && <FieldHint state="error">{errors.role.message}</FieldHint>}
      </Field>

      <div className="flex flex-row-reverse items-center gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting || createMut.isPending}>
          {isSubmitting || createMut.isPending ? 'Enviando…' : 'Enviar convite'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
