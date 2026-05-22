import { z } from 'zod';

/**
 * Schema do formulário /accept-invite. A validação fina da senha acontece
 * no servidor (policy do Zitadel); aqui exigimos só o mínimo razoável.
 */
export const acceptInviteSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Informe seu nome completo')
    .max(255, 'Nome muito longo'),
  password: z
    .string()
    .min(12, 'A senha precisa ter pelo menos 12 caracteres')
    .max(256, 'Senha muito longa'),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Você precisa aceitar os termos para continuar' }),
  }),
});

export type AcceptInviteFormValues = z.infer<typeof acceptInviteSchema>;
