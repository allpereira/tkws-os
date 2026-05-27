import { useMemo } from 'react'
import { useAuth } from 'react-oidc-context'

/**
 * Claim do Zitadel que carrega os roles do projeto no access token:
 *   `urn:zitadel:iam:org:project:roles` → { "<role_key>": { "<org_id>": "<org_name>" } }
 *
 * A emissão depende de 3 flags no Zitadel (ver memória "JWT sem claim de roles").
 * Sem o claim, `roles` vem vazio e o gate de UI esconde itens admin — o backend
 * continua sendo a fonte de verdade da autorização (@PreAuthorize).
 */
const ROLES_CLAIM = 'urn:zitadel:iam:org:project:roles'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

function extractRoles(accessToken: string | undefined): string[] {
  if (!accessToken) return []
  const claims = decodeJwtPayload(accessToken)
  const claim = claims?.[ROLES_CLAIM]
  if (!claim || typeof claim !== 'object') return []
  return Object.keys(claim as Record<string, unknown>)
}

export interface UseRolesResult {
  roles: string[]
  hasRole: (role: string) => boolean
  hasAnyRole: (...roles: string[]) => boolean
  /** Pode gerenciar usuários/convites do tenant. */
  isAdmin: boolean
}

/**
 * Lê os roles do usuário a partir do access token corrente. Use para gate de UI
 * (esconder menus/ações) — nunca como única barreira de segurança.
 */
export function useRoles(): UseRolesResult {
  const auth = useAuth()
  const accessToken = auth.user?.access_token

  return useMemo(() => {
    const roles = extractRoles(accessToken)
    const hasRole = (role: string) => roles.includes(role)
    const hasAnyRole = (...wanted: string[]) => wanted.some((r) => roles.includes(r))
    return {
      roles,
      hasRole,
      hasAnyRole,
      isAdmin: hasAnyRole('org_admin', 'system_admin'),
    }
  }, [accessToken])
}
