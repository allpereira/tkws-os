import { describe, expect, it } from 'vitest'
import { createOportunidadeSchema } from '../schema'

describe('createOportunidadeSchema', () => {
  const base = {
    pipelineId: '00000000-0000-0000-0000-000000000001',
    etapaId: '00000000-0000-0000-0000-000000000002',
    descricao: 'Apto 2104',
    valor: 0,
    origem: 'GOOGLE' as const,
  }

  it('exige parceiro quando origem é indicação de parceiro', () => {
    const result = createOportunidadeSchema.safeParse({
      ...base,
      origem: 'INDICACAO_PARCEIRO',
      parceiroId: null,
    })
    expect(result.success).toBe(false)
  })

  it('exige origemOutros quando origem é OUTROS', () => {
    const result = createOportunidadeSchema.safeParse({
      ...base,
      origem: 'OUTROS',
      origemOutros: '  ',
    })
    expect(result.success).toBe(false)
  })
})
