/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZITADEL_AUTHORITY: string;
  readonly VITE_ZITADEL_ORG_ID?: string;
  readonly VITE_LOGIN_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
