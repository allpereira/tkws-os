import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { currentUserSchema } from './schema'

export function useCurrentUser(accessToken?: string | null) {
  return useQuery({
    queryKey: ['users', 'me', accessToken],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      return currentUserSchema.parse(data)
    },
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60 * 10,
  })
}
