import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  invitePageSchema,
  inviteCreatedSchema,
  inviteListItemSchema,
  type CreateInviteInput,
  type InviteCreated,
  type InviteListItem,
  type InviteListParams,
  type InvitePage,
} from './schema'

const BASE = '/api/v1/invites'

/**
 * Funções puras que chamam o backend. Multi-tenancy é resolvida no servidor via
 * JWT (`@CurrentTenant`) — o frontend nunca envia tenantId (ADR-019).
 */
export const invitesApi = {
  async list(params: InviteListParams = {}): Promise<InvitePage> {
    const { data } = await api.get(BASE, {
      params: {
        status: params.status,
        limit: params.limit ?? 50,
        offset: params.offset ?? 0,
      },
    })
    return invitePageSchema.parse(data)
  },

  async create(input: CreateInviteInput): Promise<InviteCreated> {
    const { data } = await api.post(BASE, input)
    return inviteCreatedSchema.parse(data)
  },

  async revoke(id: string): Promise<InviteListItem> {
    const { data } = await api.post(`${BASE}/${id}/revoke`)
    return inviteListItemSchema.parse(data)
  },

  async resend(id: string): Promise<InviteListItem> {
    const { data } = await api.post(`${BASE}/${id}/resend`)
    return inviteListItemSchema.parse(data)
  },
}

export const invitesKeys = {
  all: ['invites'] as const,
  list: (params?: InviteListParams) => [...invitesKeys.all, 'list', params ?? {}] as const,
}

export function useInvites(params: InviteListParams = {}) {
  return useQuery({
    queryKey: invitesKeys.list(params),
    queryFn: () => invitesApi.list(params),
  })
}

export function useCreateInvite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateInviteInput) => invitesApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitesKeys.all })
    },
  })
}

export function useRevokeInvite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => invitesApi.revoke(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitesKeys.all })
    },
  })
}

export function useResendInvite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => invitesApi.resend(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitesKeys.all })
    },
  })
}
