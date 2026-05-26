/**
 * Credenciais "lembrar deste dispositivo" no login customizado.
 *
 * Usa AES-GCM + PBKDF2 (Web Crypto) para não deixar senha em texto claro no
 * localStorage. Isso protege contra leitura casual do DevTools, mas NÃO
 * substitui proteção contra XSS (qualquer script na página pode descriptografar).
 *
 * Defina VITE_LOGIN_STORAGE_PEPPER no deploy do login (valor longo e aleatório).
 */

export const STORAGE_KEY = 'tkws-login:v1';

const STORAGE_VERSION = 1 as const;
const PBKDF2_ITERATIONS = 100_000;

export interface SavedLoginState {
  remember: boolean;
  loginName: string;
  password: string;
}

interface CredentialPayload {
  loginName: string;
  password: string;
}

interface StoredV1 {
  version: typeof STORAGE_VERSION;
  remember: boolean;
  salt: string;
  iv: string;
  ciphertext: string;
}

function getPepper(): string {
  const pepper = import.meta.env.VITE_LOGIN_STORAGE_PEPPER;
  if (typeof pepper === 'string' && pepper.length >= 16) {
    return pepper;
  }
  if (import.meta.env.DEV) {
    return 'tkws-login-dev-pepper-not-for-production';
  }
  throw new Error('VITE_LOGIN_STORAGE_PEPPER is required in production builds');
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveAesKey(salt: Uint8Array): Promise<CryptoKey> {
  const pepper = getPepper();
  const saltBuffer = new Uint8Array(salt);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pepper),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encryptPayload(payload: CredentialPayload): Promise<{
  salt: string;
  iv: string;
  ciphertext: string;
}> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(salt);
  const plain = new TextEncoder().encode(JSON.stringify(payload));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain);

  return {
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(encrypted)),
  };
}

async function decryptPayload(
  saltB64: string,
  ivB64: string,
  ciphertextB64: string,
): Promise<CredentialPayload> {
  const salt = new Uint8Array(fromBase64(saltB64));
  const iv = new Uint8Array(fromBase64(ivB64));
  const ciphertext = new Uint8Array(fromBase64(ciphertextB64));
  const key = await deriveAesKey(salt);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  const json = new TextDecoder().decode(decrypted);
  const parsed: unknown = JSON.parse(json);
  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'loginName' in parsed &&
    'password' in parsed &&
    typeof (parsed as CredentialPayload).loginName === 'string' &&
    typeof (parsed as CredentialPayload).password === 'string'
  ) {
    return parsed as CredentialPayload;
  }
  throw new Error('Invalid saved login payload');
}

export async function loadSavedLogin(): Promise<SavedLoginState | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const stored = JSON.parse(raw) as Partial<StoredV1>;
    if (
      stored.version !== STORAGE_VERSION ||
      !stored.remember ||
      !stored.salt ||
      !stored.iv ||
      !stored.ciphertext
    ) {
      return null;
    }

    const payload = await decryptPayload(stored.salt, stored.iv, stored.ciphertext);
    return {
      remember: true,
      loginName: payload.loginName,
      password: payload.password,
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export async function persistSavedLogin(input: {
  remember: boolean;
  loginName: string;
  password: string;
}): Promise<void> {
  try {
    if (!input.remember) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const { salt, iv, ciphertext } = await encryptPayload({
      loginName: input.loginName,
      password: input.password,
    });

    const stored: StoredV1 = {
      version: STORAGE_VERSION,
      remember: true,
      salt,
      iv,
      ciphertext,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Quota, modo privado ou crypto indisponível — falha silenciosa
  }
}
