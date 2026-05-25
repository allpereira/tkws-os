import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { z } from 'zod';

export const currentUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  tenantId: z.number().int().positive().nullable(),
  active: z.boolean(),
  lastLoginAt: z.string().datetime({ offset: true }).nullable(),
});

export type CurrentUser = z.infer<typeof currentUserSchema>;

export function useCurrentUser(accessToken?: string | null) {
  return useQuery({
    queryKey: ['users', 'me', accessToken],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return currentUserSchema.parse(data);
    },
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60 * 10,
  });
}
