import { describe, expect, it } from 'vitest'
import { pessoaPageSchema } from '../schema'
import { formatDocumento } from '../components/pessoa-card'

const pessoa = {
  id: '11111111-1111-1111-1111-111111111111',
  tenantId: 1,
  tipoPessoa: 'PF' as const,
  documento: '10683397990',
  nomeContato: 'Ana Silva',
  emailContato: 'ana@exemplo.com',
  celularContato: null,
  nomeEmpresa: null,
  status: 'LEAD' as const,
  convertidoEm: null,
  endereco: null,
  cidade: 'São Paulo',
  uf: 'SP',
  cep: null,
  notas: null,
  createdAt: '2026-05-26T12:00:00Z',
  updatedAt: '2026-05-26T12:00:00Z',
}

describe('pessoaPageSchema', () => {
  it('valida um envelope de paginação completo', () => {
    const parsed = pessoaPageSchema.parse({
      content: [pessoa],
      limit: 50,
      offset: 0,
      total: 137,
      hasNext: true,
    })
    expect(parsed.content).toHaveLength(1)
    expect(parsed.total).toBe(137)
    expect(parsed.hasNext).toBe(true)
  })

  it('aceita página vazia', () => {
    const parsed = pessoaPageSchema.parse({
      content: [],
      limit: 24,
      offset: 0,
      total: 0,
      hasNext: false,
    })
    expect(parsed.content).toEqual([])
  })

  it('rejeita envelope sem total', () => {
    expect(() =>
      pessoaPageSchema.parse({ content: [], limit: 50, offset: 0, hasNext: false }),
    ).toThrow()
  })
})

describe('formatDocumento', () => {
  it('formata CPF (11 dígitos)', () => {
    expect(formatDocumento('10683397990', 'PF')).toBe('106.833.979-90')
  })

  it('formata CNPJ (14 dígitos)', () => {
    expect(formatDocumento('11222333000181', 'PJ')).toBe('11.222.333/0001-81')
  })

  it('retorna null quando vazio', () => {
    expect(formatDocumento(null)).toBeNull()
    expect(formatDocumento('')).toBeNull()
  })
})
