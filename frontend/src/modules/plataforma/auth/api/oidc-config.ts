import { WebStorageStateStore } from 'oidc-client-ts';
import type { AuthProviderProps } from 'react-oidc-context';

export const ZITADEL_AUTHORITY =
  import.meta.env.VITE_ZITADEL_AUTHORITY || 'http://localhost:8088';
export const ZITADEL_CLIENT_ID = import.meta.env.VITE_ZITADEL_CLIENT_ID || '';
export const OIDC_REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173/callback';

const PLACEHOLDER_CLIENT_IDS = new Set(['', 'replace-after-setup', 'cole_aqui_o_client_id_gerado_no_zitadel']);

/** True when Vite was built/run with a real Zitadel application client id. */
export function isOidcConfigured(): boolean {
  return !PLACEHOLDER_CLIENT_IDS.has(ZITADEL_CLIENT_ID.trim());
}

export const oidcConfig: AuthProviderProps = {
  authority: ZITADEL_AUTHORITY,
  client_id: ZITADEL_CLIENT_ID,
  redirect_uri: OIDC_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile email offline_access',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, '/');
  },
};
