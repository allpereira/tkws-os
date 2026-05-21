/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL pública do Zitadel — usada APENAS no fallback de Login V1. */
  readonly VITE_ZITADEL_AUTHORITY: string;
  /** Base same-origin que o JS usa para falar com o Zitadel (proxy injeta Bearer). */
  readonly VITE_ZITADEL_API_BASE?: string;
  /** Upstream real do proxy (lado servidor — só usado em vite.config.ts). */
  readonly VITE_ZITADEL_UPSTREAM?: string;
  /** Client ID do app Web principal — usado para detectar redirecionamento ao Login V1. */
  readonly VITE_ZITADEL_CLIENT_ID?: string;
  readonly VITE_ZITADEL_ORG_ID?: string;
  readonly VITE_LOGIN_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
