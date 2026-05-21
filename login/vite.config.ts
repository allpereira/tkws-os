/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';

// ---------------------------------------------------------------------------
// Proxy Zitadel: /zitadel-api/* → http://localhost:8088/*
//
// Por quê: este app de login é uma SPA pura. As chamadas para a Session API
// do Zitadel (`POST /v2/sessions`, `POST /v2/oidc/auth_requests/{id}/callback`,
// `GET /v2/oidc/auth_requests/{id}`) exigem Bearer auth com um PAT do machine
// user `login-client` (role `IAM_LOGIN_CLIENT`). Esse segredo NÃO pode ficar
// no bundle do browser — então o Vite dev server lê o PAT do disco e injeta
// o `Authorization: Bearer <PAT>` em cada request encaminhada.
//
// Em produção: a mesma topologia precisa ser replicada por Caddy/Worker/edge
// function que injete o Bearer antes de chamar o Zitadel.
// ---------------------------------------------------------------------------

const ZITADEL_UPSTREAM = process.env.VITE_ZITADEL_UPSTREAM ?? 'http://localhost:8088';
const PAT_PATH =
  process.env.ZITADEL_LOGIN_CLIENT_PAT_PATH ??
  path.resolve(__dirname, '../docker/zitadel/login-client.pat');

function readPat(): string | null {
  try {
    const pat = fs.readFileSync(PAT_PATH, 'utf-8').trim();
    return pat.length > 0 ? pat : null;
  } catch {
    return null;
  }
}

// Lê uma vez no startup só para validar; releitura por request pega rotação do PAT em dev.
const initialPat = readPat();
if (!initialPat) {
  // eslint-disable-next-line no-console
  console.warn(
    `\n[zitadel-proxy] AVISO: PAT do login-client não encontrado em ${PAT_PATH}.\n` +
      '  Sem ele, todas as chamadas à Session API retornarão 401.\n' +
      '  Extraia rodando:  bash scripts/extract-login-pat.sh\n',
  );
}

const zitadelProxy = {
  target: ZITADEL_UPSTREAM,
  changeOrigin: true,
  secure: false,
  rewrite: (p: string) => p.replace(/^\/zitadel-api/, ''),
  configure: (proxy: {
    on: (event: string, handler: (...args: unknown[]) => void) => void;
  }) => {
    proxy.on('proxyReq', (...args: unknown[]) => {
      const proxyReq = args[0] as {
        getHeader: (name: string) => unknown;
        setHeader: (name: string, value: string) => void;
      };
      const pat = readPat();
      if (pat && !proxyReq.getHeader('authorization')) {
        proxyReq.setHeader('authorization', `Bearer ${pat}`);
      }
    });
    proxy.on('error', (...args: unknown[]) => {
      const err = args[0] as Error;
      const res = args[2] as {
        writeHead?: (status: number, headers: Record<string, string>) => void;
        end: (body: string) => void;
      };
      // eslint-disable-next-line no-console
      console.error('[zitadel-proxy] erro:', err.message);
      if (typeof res.writeHead === 'function') {
        res.writeHead(502, { 'content-type': 'application/json' });
        res.end(
          JSON.stringify({ error: 'zitadel_upstream_unreachable', detail: err.message }),
        );
      }
    });
  },
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    proxy: {
      '/zitadel-api': zitadelProxy,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.config.*', '**/*.d.ts', 'src/main.tsx'],
    },
  },
});
