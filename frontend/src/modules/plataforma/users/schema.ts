import { z } from 'zod'

/** Usuário autenticado (espelho local do perfil do Zitadel). Fonte da verdade dos tipos. */
export const currentUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  tenantId: z.number().int().positive().nullable(),
  active: z.boolean(),
  lastLoginAt: z.string().datetime({ offset: true }).nullable(),
})

export type CurrentUser = z.infer<typeof currentUserSchema>
