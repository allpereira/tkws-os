import { z } from 'zod'

/**
 * Schemas Zod da feature Usuários (convites) — fonte da verdade dos tipos e
 * validações. O fluxo é: admin cria convite → backend cria user shell no Zitadel
 * + envia magic link por email → o usuário só ganha acesso ao confirmar pelo link.
 *
 * Espelha os DTOs do backend (CreateInviteCommand, InviteView, InviteListView).
 */

/** Roles que um admin pode atribuir a um convidado (system_admin é exclusivo da Group WS). */
export const inviteRoleValues = [
  'org_admin',
  'comercial_atendimento',
  'comercial_proposta',
  'default',
] as const
export type InviteRole = (typeof inviteRoleValues)[number]

export const inviteStatusValues = ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'] as const
export type InviteStatus = (typeof inviteStatusValues)[number]

/** Rótulos pt-BR exibidos na UI (código fica em inglês). */
export const INVITE_ROLE_LABELS: Record<InviteRole, string> = {
  org_admin: 'Administrador do escritório',
  comercial_atendimento: 'Comercial · Atendimento',
  comercial_proposta: 'Comercial · Proposta',
  default: 'Membro',
}

export const INVITE_STATUS_LABELS: Record<InviteStatus, string> = {
  PENDING: 'Pendente',
  ACCEPTED: 'Ativo',
  EXPIRED: 'Expirado',
  REVOKED: 'Cancelado',
}

/** Validação do formulário de convite (Bean Validation espelha no backend). */
export const createInviteSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Informe o email')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  fullName: z
    .string()
    .max(255, 'Nome muito longo')
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined)),
  role: z.enum(inviteRoleValues, { errorMap: () => ({ message: 'Selecione um papel' }) }),
})
export type CreateInviteInput = z.infer<typeof createInviteSchema>

/** Item de listagem (sem token nem zitadelUserId — o backend nunca os expõe aqui). */
export const inviteListItemSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  role: z.enum(inviteRoleValues),
  status: z.enum(inviteStatusValues),
  expiresAt: z.string().datetime({ offset: true }),
  createdAt: z.string().datetime({ offset: true }),
  acceptedAt: z.string().datetime({ offset: true }).nullable(),
  revokedAt: z.string().datetime({ offset: true }).nullable(),
})
export type InviteListItem = z.infer<typeof inviteListItemSchema>

/** Envelope paginado padrão do projeto (ADR-022). */
export const invitePageSchema = z.object({
  content: z.array(inviteListItemSchema),
  limit: z.number().int(),
  offset: z.number().int(),
  total: z.number().int(),
  hasNext: z.boolean(),
})
export type InvitePage = z.infer<typeof invitePageSchema>

/** Resposta da criação — inclui o token claro uma única vez (não persistimos). */
export const inviteCreatedSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.number().int(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  role: z.enum(inviteRoleValues),
  status: z.enum(inviteStatusValues),
  expiresAt: z.string().datetime({ offset: true }),
  createdAt: z.string().datetime({ offset: true }),
  rawToken: z.string().nullable(),
})
export type InviteCreated = z.infer<typeof inviteCreatedSchema>

export interface InviteListParams {
  status?: InviteStatus
  limit?: number
  offset?: number
}
