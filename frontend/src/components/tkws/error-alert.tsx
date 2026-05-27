import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { parseApiError } from '@/lib/api-error'

interface ErrorAlertProps {
  /** Erro do TanStack mutation/query (AxiosError, Error ou unknown). */
  error: unknown
  /** Título curto e amigável · default "Não foi possível concluir". */
  title?: string
}

/**
 * Alerta de erro padronizado para forms/ações · usa o design-system (Alert)
 * e o `parseApiError` para SEMPRE exibir a mensagem real do backend (o `detail`
 * do problem+json) em vez do texto técnico do Axios. Lista também os erros de
 * campo (Bean Validation), quando houver. Ver feedback "Erros usam DS".
 */
export function ErrorAlert({ error, title = 'Não foi possível concluir' }: ErrorAlertProps) {
  const detail = parseApiError(error)
  return (
    <Alert tone="danger">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {detail.message}
        {detail.fieldErrors.length > 0 && (
          <ul className="mt-1.5 list-disc pl-4">
            {detail.fieldErrors.map((f, i) => (
              <li key={`${f.field}-${i}`}>
                {f.field ? <strong>{f.field}: </strong> : null}
                {f.message}
              </li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  )
}
