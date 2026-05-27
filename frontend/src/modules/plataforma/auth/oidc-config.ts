import { WebStorageStateStore } from 'oidc-client-ts';
import type { AuthProviderProps } from 'react-oidc-context';

export const ZITADEL_AUTHORITY =
  import.meta.env.VITE_ZITADEL_AUTHORITY || 'http://localhost:8088';
export const ZITADEL_CLIENT_ID = import.meta.env.VITE_ZITADEL_CLIENT_ID || '';
export const ZITADEL_PROJECT_ID = import.meta.env.VITE_ZITADEL_PROJECT_ID || '';
export const OIDC_REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173/callback';

/**
 * Para onde o Zitadel redireciona DEPOIS do logout (end_session). Precisa casar
 * **exatamente** (inclusive barra final) com uma das "Post Logout URIs" do app no
 * Zitadel — que hoje é `http://localhost:5173` (SEM barra). Por isso derivamos da
 * origem do redirect_uri (`new URL(...).origin` nunca tem barra final), em vez de
 * `window.location.origin + '/'`, que mandava `…5173/` e o Zitadel recusava com
 * `post_logout_redirect_uri invalid`. Sem enviar nada, cairia em `…/logout/done`.
 */
export const OIDC_POST_LOGOUT_REDIRECT_URI =
  import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI || new URL(OIDC_REDIRECT_URI).origin;

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
 *   - urn:zitadel:iam:org:project:id:{ProjectId}:aud · adiciona o project_id
 *     no audience do token, **obrigatório** para o claim
 *     `urn:zitadel:iam:org:project:roles` ser emitido. Sem isso, mesmo com
 *     `accessTokenRoleAssertion=true` no app Zitadel, as roles não vêm.
 */
const SCOPES = [
  'openid',
  'profile',
  'email',
  'offline_access',
  'urn:zitadel:iam:user:resourceowner',
  ...(ZITADEL_PROJECT_ID ? [`urn:zitadel:iam:org:project:id:${ZITADEL_PROJECT_ID}:aud`] : []),
].join(' ')

export const oidcConfig: AuthProviderProps = {
  authority: ZITADEL_AUTHORITY,
  client_id: ZITADEL_CLIENT_ID,
  redirect_uri: OIDC_REDIRECT_URI,
  // Volta pro app após o logout (em vez da página `logout/done` do Zitadel).
  // O `signoutRedirect()` envia também o `id_token_hint`, então o Zitadel não
  // pede confirmação e respeita esta URI (precisa estar nas Post Logout URIs).
  post_logout_redirect_uri: OIDC_POST_LOGOUT_REDIRECT_URI,
  response_type: 'code',
  scope: SCOPES,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, '/');
  },
};
