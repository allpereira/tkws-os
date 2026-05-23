import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCrudApi } from './api'

/**
 * Factory de hooks CRUD · gera list/byId/create/update/remove com cache automático.
 *
 * Uso:
 *   // schema.ts
 *   export const tipoPagamentoSchema = z.object({ id: z.string().uuid(), name: z.string() })
 *   export type TipoPagamento = z.infer<typeof tipoPagamentoSchema>
 *   export type CreateTipoPagamento = Omit<TipoPagamento, 'id'>
 *
 *   // api.ts
 *   export const tipoPagamentoApi = createCrudApi<TipoPagamento, CreateTipoPagamento>('/api/v1/crm/tipos-pagamento')
 *   export const {
 *     useList: useTiposPagamento,
 *     useCreate: useCreateTipoPagamento,
 *     useUpdate: useUpdateTipoPagamento,
 *     useRemove: useRemoveTipoPagamento,
 *   } = createCrudHooks(['tipos-pagamento'], tipoPagamentoApi)
 */
export function createCrudHooks<T extends { id: string }, CreateInput, UpdateInput = Partial<CreateInput>>(
  keyBase: readonly string[],
  api: ReturnType<typeof createCrudApi<T, CreateInput, UpdateInput>>,
) {
  const keys = {
    all: keyBase,
    list: (params?: Record<string, unknown>) => [...keyBase, 'list', params ?? {}] as const,
    detail: (id: string) => [...keyBase, 'detail', id] as const,
  }

  return {
    keys,

    useList(params?: Record<string, string | number | boolean>) {
      return useQuery({
        queryKey: keys.list(params),
        queryFn: () => api.list(params),
      })
    },

    useFindById(id: string, enabled = true) {
      return useQuery({
        queryKey: keys.detail(id),
        queryFn: () => api.findById(id),
        enabled: enabled && !!id,
      })
    },

    useCreate() {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: (input: CreateInput) => api.create(input),
        onSuccess: (created) => {
          qc.invalidateQueries({ queryKey: keys.all })
          qc.setQueryData(keys.detail(created.id), created)
        },
      })
    },

    useUpdate() {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateInput }) => api.update(id, input),
        onSuccess: (updated) => {
          qc.invalidateQueries({ queryKey: keys.all })
          qc.setQueryData(keys.detail(updated.id), updated)
        },
      })
    },

    useRemove() {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: (id: string) => api.remove(id),
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: keys.all })
        },
      })
    },
  }
}
