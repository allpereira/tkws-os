# ADR-012: Cloudflare Pages para hospedagem do frontend

**Status:** Accepted
**Data:** 2025-05
**Decisores:** Allysson

## Contexto

Frontend React/Vite precisa de hospedagem. Inicialmente, scaffold contemplava servir o
frontend em container Nginx atrás do Caddy (mesma EC2 da API). Após avaliação, identificamos
ganhos significativos em separar hospedagem do frontend num CDN edge global, mantendo backend
em EC2.

Avaliamos Vercel (familiar ao Allysson), CloudFront/S3 (AWS-native), e Cloudflare Pages.

## Decisão

**Cloudflare Pages** hospeda o frontend, integrado nativamente com o repositório GitHub
(monorepo, root directory `frontend/`). Backend (API + Zitadel + Redis + Caddy) permanece
em EC2 conforme ADR-005 e ADR-006.

## Alternativas consideradas

1. **Vercel**
   - Pros: melhor DX de mercado, preview deploys, familiar ao dev
   - Contras: **uso comercial exige plano Pro ($20/mês/dev)**, bandwidth limitado no free,
     PoPs no Brasil são CloudFront/Cloudflare via parceria (não tão otimizado quanto Cloudflare nativo)

2. **CloudFront + S3 (AWS-native)**
   - Pros: tudo no mesmo provedor (AWS), custo previsível ($1-5/mês)
   - Contras: setup mais trabalhoso (~3h vs 15min), sem preview deploy nativo, UI de deploy
     mais lenta que Cloudflare/Vercel

3. **Servir em container Nginx atrás do Caddy** (scaffold original)
   - Pros: coesão máxima, mesma região (zero latência cross-region), zero vendor extra
   - Contras: você cuida do servidor pra servir arquivo estático, sem preview deploys nativos,
     CDN global ausente

4. **Cloudflare Pages (escolhido)**
   - Pros: **free pra uso comercial** (sem limite mensal de bandwidth), PoPs em São Paulo/Rio
     /Fortaleza (latência mínima pra usuários BR), preview deploys nativos, integração GitHub
     trivial, DNS no mesmo dashboard
   - Contras: vendor adicional (mais um console pra acessar), latência cross-region pra
     chamadas API (frontend no edge, API em sa-east-1 — mitigado por proxy Cloudflare na API
     também)

## Consequências

### Positivas
- **Custo zero** indefinidamente (mesmo em uso comercial)
- **Preview deploys por PR:** cada PR ganha URL única (`abc.tkws-os.pages.dev`) — útil pra
  revisar design com cliente ANTES de mergear
- **CDN global** com PoPs no Brasil (latência baixa pra usuários BR)
- **DDoS protection + WAF** grátis no Cloudflare (proxy ativado)
- **DNS no mesmo provedor** simplifica gestão
- **Rollback em 1 clique** via dashboard
- **Zero ops** no frontend (sem cuidar de container)
- **Backend não muda** — Caddy continua na EC2, só não serve mais frontend

### Negativas / Trade-offs
- **Vendor extra:** mais um console (Cloudflare Dashboard) pra acessar e configurar
- **Variáveis de ambiente em dois lugares:** Cloudflare Pages tem suas próprias env vars
  separadas das do backend (GitHub Secrets)
- **CORS preciso:** API precisa aceitar tanto domínio custom (`app.tkws.com.br`) quanto
  domínio Cloudflare (`tkws-os.pages.dev`)
- **Latência cross-region em API calls:** usuário no Brasil → frontend no edge BR (rápido) →
  chama API em sa-east-1 (rápido, mesmo continente) — overhead real mínimo
- **Zitadel redirect URIs com wildcard** necessário pra preview deploys

### Riscos
- Cloudflare Pages deprecar ou cobrar futuramente — mitigar: o build artifact é um diretório
  estático (`dist/`), pode ser deployado em qualquer hosting (S3+CloudFront, Vercel,
  Netlify, container Nginx) com 2h de trabalho. Sem lock-in profundo.
- Build falhar no Cloudflare — mitigar: CI no GitHub roda o mesmo `npm run build` antes
  do merge, então erros aparecem antes

## Como funciona o monorepo + Cloudflare Pages

1. Cloudflare Pages é configurado com:
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Output:** `dist`
2. Cloudflare detecta mudanças na branch e roda build automaticamente
3. Build é "smart": só roda se houver mudança em `frontend/` (Cloudflare detecta via Git)
4. Preview deploys são criados pra cada branch ativa
5. Variáveis de ambiente são separadas: Production (branch `main`) e Preview (todas as outras)

## Configuração mínima necessária

### Cloudflare Pages Dashboard

| Setting | Valor |
|---|---|
| Project name | `tkws-os` |
| Production branch | `main` |
| Framework preset | Vite |
| Root directory | `frontend` |
| Build command | `npm run build` |
| Output directory | `dist` |

### Variáveis de ambiente (Production)

```
VITE_API_URL=https://api.tkws.com.br
VITE_ZITADEL_AUTHORITY=https://auth.tkws.com.br
VITE_ZITADEL_CLIENT_ID=<gerado no Zitadel>
VITE_REDIRECT_URI=https://app.tkws.com.br/callback
VITE_ENVIRONMENT=production
VITE_SENTRY_DSN=<opcional>
```

### Custom domains

- `main` branch → `app.tkws.com.br`
- `develop` branch → `staging.tkws.com.br`

### Backend (API) — ajustes necessários

`docker-compose.prod.yml` env var:
```
CORS_ORIGINS: "https://app.tkws.com.br,https://tkws-os.pages.dev"
```

`docker-compose.staging.yml` env var:
```
CORS_ORIGINS: "https://staging.tkws.com.br,https://tkws-os-staging.pages.dev"
```

### Zitadel — redirect URIs

Adicionar wildcards pra preview deploys:
- Staging: `https://*.tkws-os-staging.pages.dev/callback`
- Prod: `https://tkws-os.pages.dev/callback` (sem wildcard em prod)

## Quando reavaliar

- Cloudflare começar a cobrar pra uso comercial (improvável, mas possível)
- Preview deploys começarem a atrapalhar (raro)
- Necessidade de SSR/RSC com Next.js → migrar pra Vercel ou Cloudflare Workers
- Latência cross-region virar problema medível (improvável pra usuários BR)
