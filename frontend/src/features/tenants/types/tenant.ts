import { z } from 'zod';

/**
 * Schema Zod do Tenant. Fonte da verdade pros tipos e validações
 * (forms reutilizam isso, garantindo consistência client ↔ server).
 */
export const tenantSchema = z.object({
  id: z.string().uuid(),
  zitadelOrgId: z.string(),
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  active: z.boolean(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const createTenantSchema = tenantSchema.pick({
  zitadelOrgId: true,
  name: true,
  slug: true,
});

export type Tenant = z.infer<typeof tenantSchema>;
export type CreateTenantInput = z.infer<typeof createTenantSchema>;
