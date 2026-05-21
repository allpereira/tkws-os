import { describe, it, expect } from 'vitest';
import { loginSchema } from '@/features/login/types/auth';

describe('loginSchema', () => {
  it('aceita credenciais válidas', () => {
    const result = loginSchema.safeParse({
      loginName: 'user@tkws.com',
      password: 'minhasenha123',
    });
    expect(result.success).toBe(true);
  });

  it('rejeita loginName vazio', () => {
    const result = loginSchema.safeParse({ loginName: '', password: 'senha' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Informe seu e-mail ou nome de usuário');
  });

  it('rejeita senha vazia', () => {
    const result = loginSchema.safeParse({ loginName: 'user@tkws.com', password: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Informe sua senha');
  });

  it('rejeita loginName com mais de 256 caracteres', () => {
    const result = loginSchema.safeParse({
      loginName: 'a'.repeat(257),
      password: 'senha',
    });
    expect(result.success).toBe(false);
  });

  it('aceita username sem formato de e-mail (login alternativo)', () => {
    const result = loginSchema.safeParse({
      loginName: 'allysson.pereira',
      password: 'senhasegura',
    });
    expect(result.success).toBe(true);
  });
});
