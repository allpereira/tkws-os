import { describe, expect, it } from 'vitest'
import { createOportunidadeSchema } from '../schema'

describe('createOportunidadeSchema', () => {
  const base = {
    pipelineId: '00000000-0000-0000-0000-000000000001',
    etapaId: '00000000-0000-0000-0000-000000000002',
    descricao: 'Apto 2104',
    valor: 0,
    origemId: '00000000-0000-0000-0000-000000000003',
  }

  it('aceita oportunidade com origemId válido', () => {
    expect(createOportunidadeSchema.safeParse(base).success).toBe(true)
  })

  it('exige origemId', () => {
    const { origemId, ...semOrigem } = base
    void origemId
    expect(createOportunidadeSchema.safeParse(semOrigem).success).toBe(false)
  })

  it('rejeita origemId que não é uuid', () => {
    expect(createOportunidadeSchema.safeParse({ ...base, origemId: 'GOOGLE' }).success).toBe(false)
  })

  // As regras condicionais (exige parceiro / exige detalhe) dependem das flags
  // da origem selecionada em runtime e são validadas no formulário, não no schema.
})
