import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreatePipeline, Pipeline, UpdatePipeline } from './schema'

export const pipelinesApi = createCrudApi<Pipeline, CreatePipeline, UpdatePipeline>('/api/v1/crm/pipelines')

export const {
  keys: pipelinesKeys,
  useList: usePipelines,
  useFindById: usePipelineById,
  useCreate: useCreatePipeline,
  useUpdate: useUpdatePipeline,
  useRemove: useRemovePipeline,
} = createCrudHooks<Pipeline, CreatePipeline, UpdatePipeline>(['pipelines'], pipelinesApi)
