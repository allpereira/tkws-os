import { describe, expect, it } from 'vitest'
import {
  createInviteSchema,
  invitePageSchema,
  INVITE_ROLE_LABELS,
  inviteRoleValues,
} from '../schema'

describe('createInviteSchema', () => {
  it('normaliza email (trim + lowercase) e aceita papel válido', () => {
    const parsed = createInviteSchema.parse({
      email: '  Pessoa@Escritorio.COM ',
      fullName: '  Maria Souza ',
      role: 'comercial_atendimento',
    })
    expect(parsed.email).toBe('pessoa@escritorio.com')
    expect(parsed.fullName).toBe('Maria Souza')
    expect(parsed.role).toBe('comercial_atendimento')
  })

  it('trata fullName vazio como undefined (opcional)', () => {
    const parsed = createInviteSchema.parse({ email: 'a@b.com', fullName: '   ', role: 'default' })
    expect(parsed.fullName).toBeUndefined()
  })

  it('rejeita email inválido', () => {
    const result = createInviteSchema.safeParse({ email: 'nao-eh-email', role: 'default' })
    expect(result.success).toBe(false)
  })

  it('rejeita papel fora do enum', () => {
    const result = createInviteSchema.safeParse({ email: 'a@b.com', role: 'system_admin' })
    expect(result.success).toBe(false)
  })

  it('tem rótulo pt-BR para todos os papéis', () => {
    for (const role of inviteRoleValues) {
      expect(INVITE_ROLE_LABELS[role]).toBeTruthy()
    }
  })
})

describe('invitePageSchema', () => {
  it('valida o envelope paginado padrão', () => {
    const page = invitePageSchema.parse({
      content: [
        {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'a@b.com',
          fullName: null,
          role: 'default',
          status: 'PENDING',
          expiresAt: '2026-06-01T12:00:00Z',
          createdAt: '2026-05-25T12:00:00Z',
          acceptedAt: null,
          revokedAt: null,
        },
      ],
      limit: 50,
      offset: 0,
      total: 1,
      hasNext: false,
    })
    expect(page.content).toHaveLength(1)
    expect(page.content[0].status).toBe('PENDING')
  })
})
