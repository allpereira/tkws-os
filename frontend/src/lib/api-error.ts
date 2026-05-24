import { AxiosError, isAxiosError } from 'axios'

/**
 * Normaliza erros de API (Axios + Spring Boot) em uma estrutura que a UI
 * pode consumir diretamente: status HTTP, mensagem do backend, request ID,
 * path, e timestamp. Todas as telas de erro (SystemFrame, Alert) devem
 * passar pelo `parseApiError` para refletir o que a API REALMENTE retornou,
 * em vez de mostrar textos genéricos.
 *
 * Cobre os formatos de erro mais comuns no Spring Boot:
 *
 *   1) Default Spring error:
 *      { timestamp, status, error, message, path }
 *
 *   2) Problem Details (RFC 7807 · Spring 3+):
 *      { type, title, status, detail, instance }
 *
 *   3) Erro custom da app:
 *      { message, code, errors: [{ field, message }] }
 *
 *   4) Bean Validation:
 *      { errors: [{ field, defaultMessage }] }  ou similar
 */

export interface ApiErrorDetail {
  /** Status HTTP (e.g. 400, 404, 500). null se erro de rede. */
  status: number | null
  /** Status text curto · "Bad Request", "Not Found", "Internal Server Error". null se desconhecido. */
  statusText: string | null
  /** Mensagem extraída do backend (response.data.message/detail/error) · ou fallback do axios. */
  message: string
  /** Erros de campo (Bean Validation) · vazio se ausente. */
  fieldErrors: Array<{ field: string; message: string }>
  /** Path da URL que falhou. null se desconhecido. */
  path: string | null
  /** Request ID, se backend mandou via header X-Request-Id ou no body. */
  requestId: string | null
  /** ISO timestamp do erro (do backend ou local). */
  timestamp: string
  /** AxiosError | Error | unknown original · pra debug. */
  raw: unknown
  /** Erro de rede (sem resposta do servidor). */
  isNetworkError: boolean
  /** True se a request foi cancelada pelo usuário/code. */
  isCanceled: boolean
}

function readField(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined
  const v = (obj as Record<string, unknown>)[key]
  return typeof v === 'string' && v.trim().length > 0 ? v : undefined
}

function readFieldErrors(obj: unknown): Array<{ field: string; message: string }> {
  if (!obj || typeof obj !== 'object') return []
  const errs = (obj as Record<string, unknown>).errors
  if (!Array.isArray(errs)) return []
  return errs
    .map((e) => {
      if (!e || typeof e !== 'object') return null
      const rec = e as Record<string, unknown>
      const field =
        (typeof rec.field === 'string' && rec.field) ||
        (typeof rec.fieldName === 'string' && rec.fieldName) ||
        ''
      const message =
        (typeof rec.message === 'string' && rec.message) ||
        (typeof rec.defaultMessage === 'string' && rec.defaultMessage) ||
        ''
      if (!field && !message) return null
      return { field, message }
    })
    .filter((x): x is { field: string; message: string } => x !== null)
}

const statusTextMap: Record<number, string> = {
  400: 'Bad Request',
  401: 'Não autorizado',
  403: 'Acesso negado',
  404: 'Não encontrado',
  408: 'Timeout',
  409: 'Conflito',
  422: 'Dados inválidos',
  429: 'Muitas requisições',
  500: 'Erro interno',
  502: 'Bad Gateway',
  503: 'Indisponível',
  504: 'Timeout do gateway',
}

/**
 * Converte qualquer erro em uma estrutura `ApiErrorDetail` previsível.
 *
 * **Sempre prefira a mensagem real do backend** (`response.data.message`,
 * `response.data.detail`, `response.data.error`) sobre textos genéricos.
 */
export function parseApiError(err: unknown): ApiErrorDetail {
  const now = new Date().toISOString()

  if (isAxiosError(err)) {
    const ax = err as AxiosError
    const status = ax.response?.status ?? null
    const data = ax.response?.data as unknown

    const backendMessage =
      readField(data, 'message') ??
      readField(data, 'detail') ??
      readField(data, 'error') ??
      readField(data, 'title')

    // Se o backend mandou só fieldErrors (Bean Validation), monta resumo
    const fieldErrors = readFieldErrors(data)
    const synthesizedFromFields =
      !backendMessage && fieldErrors.length > 0
        ? fieldErrors.map((e) => `${e.field ? `${e.field}: ` : ''}${e.message}`).join(' · ')
        : undefined

    const message =
      backendMessage ??
      synthesizedFromFields ??
      (ax.code === 'ERR_NETWORK'
        ? 'Sem resposta do servidor. Verifique sua conexão.'
        : ax.code === 'ECONNABORTED'
          ? 'A requisição demorou demais e foi cancelada.'
          : ax.message)

    const path =
      readField(data, 'path') ??
      readField(data, 'instance') ??
      (ax.config?.url ?? null)

    const requestId =
      (ax.response?.headers?.['x-request-id'] as string | undefined) ??
      (ax.response?.headers?.['X-Request-Id'] as string | undefined) ??
      readField(data, 'requestId') ??
      readField(data, 'traceId') ??
      null

    const timestamp = readField(data, 'timestamp') ?? now

    return {
      status,
      statusText: status ? (statusTextMap[status] ?? null) : null,
      message,
      fieldErrors,
      path,
      requestId,
      timestamp,
      raw: err,
      isNetworkError: ax.code === 'ERR_NETWORK' || !ax.response,
      isCanceled: ax.code === 'ERR_CANCELED',
    }
  }

  if (err instanceof Error) {
    return {
      status: null,
      statusText: null,
      message: err.message,
      fieldErrors: [],
      path: null,
      requestId: null,
      timestamp: now,
      raw: err,
      isNetworkError: false,
      isCanceled: false,
    }
  }

  return {
    status: null,
    statusText: null,
    message: 'Erro desconhecido.',
    fieldErrors: [],
    path: null,
    requestId: null,
    timestamp: now,
    raw: err,
    isNetworkError: false,
    isCanceled: false,
  }
}

/**
 * Formata a linha técnica para o rodapé do SystemFrame.
 *
 * Inclui só campos que existem · evita "null · null · 14:22".
 *
 * Ex: "HTTP 404 · /api/v1/organizacao/setores/xyz · REQ-ID abc · 14:22"
 */
export function formatApiErrorInfo(detail: ApiErrorDetail): string {
  const parts: string[] = []

  if (detail.status) {
    parts.push(`HTTP ${detail.status}`)
  } else if (detail.isNetworkError) {
    parts.push('NETWORK')
  } else {
    parts.push('ERR')
  }

  if (detail.path) parts.push(detail.path)
  if (detail.requestId) parts.push(`REQ ${detail.requestId}`)

  const t = new Date(detail.timestamp).toLocaleTimeString('pt-BR')
  parts.push(t)

  return parts.join(' · ')
}

/**
 * Devolve o `bigEmTone` recomendado do SystemFrame baseado no status.
 *
 *   - 5xx → 'danger'
 *   - 4xx → 'warning' (cliente cometeu erro / não autorizado)
 *   - 404 → 'brand' (caso especial · curiosidade editorial)
 *   - network → 'alert'
 *   - 'success' não vem daqui · use direto
 */
export function toneForStatus(detail: ApiErrorDetail): 'brand' | 'danger' | 'warning' | 'alert' {
  if (detail.status === 404) return 'brand'
  if (detail.status && detail.status >= 500) return 'danger'
  if (detail.status && detail.status >= 400) return 'warning'
  if (detail.isNetworkError) return 'alert'
  return 'danger'
}
