import { describe, it, expect, beforeEach } from 'vitest';
import { useLoginFlowStore } from '@/features/login/store/login-flow-store';

describe('useLoginFlowStore', () => {
  beforeEach(() => {
    useLoginFlowStore.getState().reset();
  });

  it('inicia com estado zerado', () => {
    const state = useLoginFlowStore.getState();
    expect(state.authRequestId).toBeNull();
    expect(state.sessionId).toBeNull();
    expect(state.sessionToken).toBeNull();
    expect(state.loginName).toBeNull();
    expect(state.pendingChallenges).toEqual([]);
  });

  it('persiste o authRequestId', () => {
    useLoginFlowStore.getState().setAuthRequestId('req-123');
    expect(useLoginFlowStore.getState().authRequestId).toBe('req-123');
  });

  it('persiste sessão (id + token)', () => {
    useLoginFlowStore.getState().setSession('sess-abc', 'token-xyz');
    const s = useLoginFlowStore.getState();
    expect(s.sessionId).toBe('sess-abc');
    expect(s.sessionToken).toBe('token-xyz');
  });

  it('persiste desafios pendentes', () => {
    useLoginFlowStore.getState().setPendingChallenges(['TOTP', 'EMAIL_OTP']);
    expect(useLoginFlowStore.getState().pendingChallenges).toEqual(['TOTP', 'EMAIL_OTP']);
  });

  it('reset limpa todo o estado', () => {
    const store = useLoginFlowStore.getState();
    store.setAuthRequestId('req-abc');
    store.setSession('sess-1', 'tok-1');
    store.setLoginName('user@tkws.com');
    store.setPendingChallenges(['TOTP']);

    store.reset();

    const s = useLoginFlowStore.getState();
    expect(s.authRequestId).toBeNull();
    expect(s.sessionId).toBeNull();
    expect(s.sessionToken).toBeNull();
    expect(s.loginName).toBeNull();
    expect(s.pendingChallenges).toEqual([]);
  });
});
