import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  loadSavedLogin,
  persistSavedLogin,
  STORAGE_KEY,
} from '@/features/login/lib/saved-login';

describe('saved-login', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_LOGIN_STORAGE_PEPPER', 'test-pepper-for-unit-tests-only');
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllEnvs();
  });

  it('persiste e restaura credenciais quando remember está ativo', async () => {
    await persistSavedLogin({
      remember: true,
      loginName: 'user@tkws.com',
      password: 'senha-secreta',
    });

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(raw).not.toContain('senha-secreta');
    expect(raw).not.toContain('user@tkws.com');

    const loaded = await loadSavedLogin();
    expect(loaded).toEqual({
      remember: true,
      loginName: 'user@tkws.com',
      password: 'senha-secreta',
    });
  });

  it('remove armazenamento quando remember é false', async () => {
    await persistSavedLogin({
      remember: true,
      loginName: 'a@b.com',
      password: 'x',
    });
    await persistSavedLogin({
      remember: false,
      loginName: 'a@b.com',
      password: 'x',
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(await loadSavedLogin()).toBeNull();
  });

  it('retorna null quando não há dados salvos', async () => {
    expect(await loadSavedLogin()).toBeNull();
  });
});
