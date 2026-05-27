import { describe, expect, it } from 'vitest'
import {
  RELACIONAMENTO_LABEL,
  TIPO_RELACIONAMENTO_PF,
  TIPO_RELACIONAMENTO_PJ,
  createContatoSchema,
  relacionamentosParaTipo,
} from '../schema'

describe('createContatoSchema', () => {
  it('valida um contato completo', () => {
    const parsed = createContatoSchema.parse({
      nome: 'João Sócio',
      email: 'joao@acme.com',
      telefone: '11999999999',
      tipoRelacionamento: 'SOCIO',
    })
    expect(parsed.nome).toBe('João Sócio')
    expect(parsed.tipoRelacionamento).toBe('SOCIO')
  })

  it('aceita email vazio (campo opcional)', () => {
    const parsed = createContatoSchema.parse({
      nome: 'Ana',
      email: '',
      tipoRelacionamento: 'CONJUGE',
    })
    expect(parsed.email).toBe('')
  })

  it('rejeita nome vazio', () => {
    expect(() =>
      createContatoSchema.parse({ nome: '', tipoRelacionamento: 'PAI' }),
    ).toThrow()
  })

  it('rejeita relacionamento inválido', () => {
    expect(() =>
      createContatoSchema.parse({ nome: 'X', tipoRelacionamento: 'AMIGO' }),
    ).toThrow()
  })

  it('rejeita email mal formado', () => {
    expect(() =>
      createContatoSchema.parse({ nome: 'X', email: 'nao-eh-email', tipoRelacionamento: 'PAI' }),
    ).toThrow()
  })
})

describe('relacionamentosParaTipo', () => {
  it('PJ retorna sócio e representante legal', () => {
    expect(relacionamentosParaTipo('PJ')).toEqual(TIPO_RELACIONAMENTO_PJ)
  })

  it('PF retorna parentes/cônjuge/outros', () => {
    expect(relacionamentosParaTipo('PF')).toEqual(TIPO_RELACIONAMENTO_PF)
  })

  it('todo relacionamento tem rótulo PT-BR', () => {
    for (const r of [...TIPO_RELACIONAMENTO_PJ, ...TIPO_RELACIONAMENTO_PF]) {
      expect(RELACIONAMENTO_LABEL[r]).toBeTruthy()
    }
  })
})
