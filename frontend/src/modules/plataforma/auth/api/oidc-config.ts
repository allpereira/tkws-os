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

/**
 * Scopes solicitados ao Zitadel:
 *   - openid · obrigatório · libera id_token
 *   - profile · nome, picture, etc.
 *   - email · email do usuário
 *   - offline_access · refresh token
 *   - urn:zitadel:iam:user:resourceowner · **claim org_id no JWT**, necessário
 *     para o backend resolver o tenant (ver ADR-019 e docs/04-AUTH.md § 4.1).
 *   - urn:zitadel:iam:org:project:id:zitadel:aud · força o audience do
 *     projeto · usado pelas claims de roles. Em alguns setups o claim
 *     `urn:zitadel:iam:org:project:roles` só vem com este scope.
 */
const SCOPES = [
  'openid',
  'profile',
  'email',
  'offline_access',
  'urn:zitadel:iam:user:resourceowner',
].join(' ')

export const oidcConfig: AuthProviderProps = {
  authority: ZITADEL_AUTHORITY,
  client_id: ZITADEL_CLIENT_ID,
  redirect_uri: OIDC_REDIRECT_URI,
  response_type: 'code',
  scope: SCOPES,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, '/');
  },
};
