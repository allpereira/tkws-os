import { describe, expect, it } from 'vitest'
import { createOrigemNegocioSchema } from '../schema'

describe('createOrigemNegocioSchema', () => {
  it('aceita origem mínima (código + nome) com defaults de flags', () => {
    const result = createOrigemNegocioSchema.safeParse({ codigo: 'ORI-001', nome: 'Google' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.exigeParceiro).toBe(false)
      expect(result.data.exigeDetalhe).toBe(false)
      expect(result.data.ativo).toBe(true)
    }
  })

  it('preserva flags quando informadas', () => {
    const result = createOrigemNegocioSchema.safeParse({
      codigo: 'ORI-002',
      nome: 'Indicação de Parceiro',
      exigeParceiro: true,
      exigeDetalhe: false,
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.exigeParceiro).toBe(true)
  })

  it('rejeita nome vazio', () => {
    const result = createOrigemNegocioSchema.safeParse({ codigo: 'ORI-003', nome: '' })
    expect(result.success).toBe(false)
  })
})
