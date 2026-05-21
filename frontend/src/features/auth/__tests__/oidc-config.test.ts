import { describe, expect, it } from 'vitest';
import { isOidcConfigured, ZITADEL_CLIENT_ID } from '@/features/auth/api/oidc-config';

describe('isOidcConfigured', () => {
  it('returns false when VITE_ZITADEL_CLIENT_ID is unset in test env', () => {
    expect(ZITADEL_CLIENT_ID).toBe('');
    expect(isOidcConfigured()).toBe(false);
  });
});
