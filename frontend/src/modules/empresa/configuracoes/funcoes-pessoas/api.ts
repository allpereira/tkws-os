import { createCrudApi } from '@/lib/api'
import { createCrudHooks } from '@/lib/crud-hooks'
import type { CreateFuncaoPessoa, FuncaoPessoa, UpdateFuncaoPessoa } from './schema'

export const funcoesPessoasApi = createCrudApi<FuncaoPessoa, CreateFuncaoPessoa, UpdateFuncaoPessoa>(
  '/api/v1/empresa/funcoes-pessoa',
)

export const {
  keys: funcoesPessoasKeys,
  useList: useFuncoesPessoas,
  useFindById: useFuncaoPessoaById,
  useCreate: useCreateFuncaoPessoa,
  useUpdate: useUpdateFuncaoPessoa,
  useRemove: useRemoveFuncaoPessoa,
} = createCrudHooks<FuncaoPessoa, CreateFuncaoPessoa, UpdateFuncaoPessoa>(['funcoes-pessoa'], funcoesPessoasApi)
