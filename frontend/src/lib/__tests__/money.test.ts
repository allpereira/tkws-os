import { describe, expect, it } from 'vitest'
import { centsToReais, reaisToCents, roundReais } from '../money'

describe('money', () => {
  it('converte reais da API para centavos do MoneyInput', () => {
    expect(reaisToCents(12_500)).toBe(1_250_000)
    expect(reaisToCents(0.5)).toBe(50)
  })

  it('converte centavos digitados para reais da API', () => {
    expect(centsToReais(1_250_000)).toBe(12_500)
    expect(centsToReais(99)).toBe(0.99)
  })

  it('arredonda reais para 2 casas decimais no payload', () => {
    expect(roundReais(10.005)).toBe(10.01)
    expect(roundReais(10.004)).toBe(10)
  })
})
