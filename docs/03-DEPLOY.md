# 03 — Deploy & Infraestrutura

> Guia completo. **API + Zitadel + Redis** rodam em EC2 (AWS sa-east-1). **Frontend** roda
> em **Cloudflare Pages**. Banco em **RDS Postgres**.

## Visão geral

```
┌───────────────────────────────────────────────────────────────────┐
│ Usuários (Web + iOS + Android via Capacitor)                       │
└────────────┬──────────────────────────────────┬───────────────────┘
             │ HTTPS                            │ HTTPS
             ▼                                  ▼
   ┌──────────────────┐              ┌─────────────────────────┐
   │ Cloudflare Pages │              │  Cloudflare DNS + WAF   │
   │   (frontend)     │              │  (proxy ativado)         │
   │  app.tkws.com.br │              └────────────┬────────────┘
   └────────┬─────────┘                           │
            │ chama API                            │
            └──────────────────┬──────────────────┘
                               ▼
                  ┌─────────────────────────┐
                  │  EC2 sa-east-1 (AWS)    │
                  │  ┌──────────────────┐   │
                  │  │ Caddy (TLS auto) │   │
                  │  └────────┬─────────┘   │
                  │           │              │
                  │  ┌────────┴─────────┐   │
                  │  │ API Spring Boot  │   │
                  │  │ Zitadel          │   │
                  │  │ Redis            │   │
                  │  └────────┬─────────┘   │
                  └───────────┼──────────────┘
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
            ┌──────────┐         ┌─────────────────┐
            │ RDS PG   │         │  S3 (uploads +  │
            │ (AWS)    │         │   backups)      │
            └──────────┘         └─────────────────┘
```

## Setup inicial (uma vez por ambiente)

### Parte 1: AWS (backend)

#### 1.1 — RDS PostgreSQL

1. AWS Console → RDS → Criar banco
2. PostgreSQL 16+
3. Templates: Production (prod) ou Dev/Test (staging)
4. Instância: `db.t4g.micro` (staging) ou `db.t4g.small` (prod)
5. Storage: 20GB gp3, autoscaling até 100GB
6. VPC: a mesma da EC2
7. Acesso público: **Não**
8. Security Group: porta 5432 só da SG da EC2
9. Backup automático: 7 dias staging, 30 dias prod
10. Multi-AZ: **ativar em produção**
11. Performance Insights: ativar (free tier disponível)

Conecta via psql e cria:
```sql
CREATE USER tkws_app WITH PASSWORD 'senha_forte';
CREATE DATABASE tkws OWNER tkws_app;
CREATE DATABASE zitadel OWNER tkws_app;
```

#### 1.2 — EC2

1. AWS Console → EC2 → Launch instance
2. AMI: **Ubuntu Server 24.04 LTS ARM (Graviton)** ou Amazon Linux 2023 ARM
3. Instance type: `t4g.small` (staging) ou `t4g.medium` (prod)
4. Storage: 30GB gp3
5. VPC: mesma do RDS
6. Security Group:
   - 22 (seu IP apenas — use SSH com chave)
   - 80 (0.0.0.0/0)
   - 443 (0.0.0.0/0)
7. Key pair: criar/usar existente
8. **Elastic IP:** alocar e anexar (pra não mudar entre restarts)

Após subir:
```bash
ssh ubuntu@<elastic-ip>

# Provisionamento automático
curl -fsSL https://raw.githubusercontent.com/SEU_USUARIO/tkws-os/main/scripts/provision-vm.sh | bash

# Logout/login pra ativar grupo docker
exit && ssh ubuntu@<elastic-ip>

# Clone
sudo mkdir -p /opt/tkws-os && sudo chown ubuntu:ubuntu /opt/tkws-os
cd /opt/tkws-os
git clone https://github.com/SEU_USUARIO/tkws-os.git .

# Configurar env
cp .env.example .env.prod  # ou .env.staging
nano .env.prod
```

#### 1.3 — S3

```bash
aws s3 mb s3://tkws-uploads-prod --region sa-east-1
aws s3 mb s3://tkws-uploads-staging --region sa-east-1
aws s3 mb s3://tkws-backups --region sa-east-1

# Versionamento em backups
aws s3api put-bucket-versioning \
  --bucket tkws-backups \
  --versioning-configuration Status=Enabled
```

### Parte 2: Cloudflare (frontend + DNS)

#### 2.1 — Criar conta Cloudflare + adicionar domínio

1. Cria conta em https://dash.cloudflare.com (free)
2. Add Site → `tkws.com.br`
3. Escolhe plano **Free**
4. Cloudflare vai listar nameservers — atualiza no seu registrar (Registro.br ou similar)
5. Aguarda propagação (5min a 24h, geralmente rápido)

#### 2.2 — Conectar GitHub ao Cloudflare Pages

1. Cloudflare Dashboard → **Workers & Pages** → Create application → Pages → **Connect to Git**
2. Autoriza GitHub e seleciona o repositório `tkws-os`
3. Begin setup

**Config do build (Production - branch main):**
| Campo | Valor |
|---|---|
| Project name | `tkws-os` (vira `tkws-os.pages.dev`) |
| Production branch | `main` |
| Framework preset | **Vite** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `frontend` |
| Environment variables | (próximo passo) |

**Variáveis de ambiente (Settings → Environment variables):**

Production:
```
VITE_API_URL=https://api.tkws.com.br
VITE_ZITADEL_AUTHORITY=https://auth.tkws.com.br
VITE_ZITADEL_CLIENT_ID=<gerado no Zitadel>
VITE_REDIRECT_URI=https://app.tkws.com.br/callback
VITE_ENVIRONMENT=production
VITE_SENTRY_DSN=<opcional>
```

Preview (qualquer branch != main):
```
VITE_API_URL=https://api.staging.tkws.com.br
VITE_ZITADEL_AUTHORITY=https://auth.staging.tkws.com.br
VITE_ZITADEL_CLIENT_ID=<gerado no Zitadel staging>
VITE_REDIRECT_URI=https://staging.tkws.com.br/callback
VITE_ENVIRONMENT=staging
```

#### 2.3 — Configurar custom domains

Settings → Custom domains:

| Branch | Custom domain |
|---|---|
| `main` (production) | `app.tkws.com.br` |
| `develop` (preview branch alias) | `staging.tkws.com.br` |

Cloudflare cria CNAME automaticamente, SSL é instantâneo (cert da própria Cloudflare).

Pra branch develop virar alias estável de staging:
1. Settings → Branch Deployments → Branch alias control
2. Configura `develop` como production-like branch

#### 2.4 — DNS dos subdomínios da API/Zitadel

No Cloudflare Dashboard → DNS:

| Tipo | Nome | Conteúdo | Proxy |
|---|---|---|---|
| A | `api` | IP EC2 produção | ✅ Proxied |
| A | `auth` | IP EC2 produção | ✅ Proxied |
| A | `api.staging` | IP EC2 staging | ✅ Proxied |
| A | `auth.staging` | IP EC2 staging | ✅ Proxied |

**Importante sobre proxy:** com proxy ativado (laranja), Cloudflare faz CDN + WAF + DDoS protection.
Mas se você quer Caddy gerar cert via Let's Encrypt, precisa de DNS-01 challenge (com proxy on, HTTP-01
não funciona). Alternativas:
- **Opção A (simples):** desativa proxy (cinza) → Caddy gera cert via HTTP-01 normalmente
- **Opção B (recomendada):** mantém proxy → configura Caddy com "Full (strict)" SSL no Cloudflare e
  origin certificate da Cloudflare

Para começar, vai com **Opção A**. Migra pra B quando estabilizar.

### Parte 3: Zitadel — Setup inicial

Após primeiro `docker compose up -d` em cada ambiente:

1. Acessa `https://auth.staging.tkws.com.br` (ou prod)
2. Login com credenciais do `.env`
3. Cria projeto `TKWS OS`
4. Cria app tipo Web com PKCE
5. Redirect URIs:
   - Dev: `http://localhost:5173/callback`
   - Staging: `https://staging.tkws.com.br/callback` + `https://*.tkws-os.pages.dev/callback`
   - Prod: `https://app.tkws.com.br/callback`
6. Copia Client ID
7. Atualiza variáveis no Cloudflare Pages (Settings → Environment variables)
8. Trigger novo deploy: Cloudflare → Deployments → Retry deployment

Detalhes em `docs/04-AUTH.md`.

### Parte 4: GitHub Secrets

Em `Settings → Secrets → Actions`:

**Staging:**
- `STAGING_HOST` — IP EC2 staging
- `STAGING_USER` — `ubuntu`
- `STAGING_SSH_KEY` — chave privada PEM

**Produção:**
- `PROD_HOST`
- `PROD_USER`
- `PROD_SSH_KEY`

**Não precisa mais** dos secrets de Zitadel/Vite — estão no Cloudflare Pages.

## Processo de deploy

### Frontend (Cloudflare Pages — automático)

```
git push origin develop  →  Cloudflare builda  →  staging.tkws.com.br atualizado
                            (preview: branch-name.tkws-os.pages.dev)
git push origin main     →  Cloudflare builda  →  app.tkws.com.br atualizado
```

**Tempo:** 1-3 minutos. Zero intervenção sua.

**Preview deploys:** **toda branch e todo PR** ganham URL única tipo
`abc123.tkws-os.pages.dev`. Você manda pro cliente revisar ANTES de mergear.

**Rollback:** Cloudflare Dashboard → Deployments → escolhe versão antiga → "Rollback to this deployment".
Um clique.

### Backend (API — automático via GitHub Actions)

```
git push origin develop  →  GHA builda API  →  Deploy via SSH em EC2 staging
git push origin main     →  GHA builda API  →  Deploy via SSH em EC2 prod
```

Path filter: só roda se `api/`, `docker/api/`, `docker-compose.*.yml` mudaram. Mudanças só
no frontend não rebuildam backend.

**Tempo:** 3-5 minutos.

### Deploy manual de API (fallback)

```bash
ssh ubuntu@<host>
cd /opt/tkws-os
git pull
docker compose -f docker-compose.prod.yml --env-file .env.prod pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## Rollback

### Frontend (Cloudflare Pages)

Dashboard → Deployments → "Rollback to this deployment". Um clique.

### Backend (API)

```bash
ssh ubuntu@<host>
cd /opt/tkws-os

# Lista tags disponíveis (vem com SHAs curtos)
docker images | grep tkws-os

# Volta pra SHA específico
IMAGE_TAG=abc1234 \
  docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Banco

Migrations Flyway **não fazem rollback automaticamente**.

Estratégia:
1. **Toda migration backward-compatible** (cria coluna antes de remover antiga)
2. **Emergência:** restore do snapshot do RDS (veja `docs/06-BACKUP-RECOVERY.md`)

## Comandos operacionais

```bash
# Backend (na EC2)
ssh ubuntu@<host>
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f api --tail=200
docker compose -f docker-compose.prod.yml restart api

# Frontend (no Cloudflare Dashboard)
# Não tem CLI necessária — tudo via UI. Mas se quiser:
npx wrangler pages deployment list --project-name=tkws-os
```

## Custos estimados

### Cloudflare Pages

| Tier | Limite | Custo |
|---|---|---|
| Free | Builds ilimitados, bandwidth ilimitado, 500 builds/mês, 100 custom domains | **R$ 0** |

Você NUNCA vai precisar pagar Cloudflare Pages no estágio TKWS OS (e provavelmente nunca,
pra MVP-Scale-Up).

### AWS (backend + banco)

#### Mês 1-12 (free tier ativo)

| Recurso | Custo/mês |
|---|---|
| EC2 t4g.small staging | R$ 0 (free) |
| EC2 t4g.medium prod | R$ 80-120 |
| RDS db.t4g.micro staging | R$ 0 (free) |
| RDS db.t4g.small prod | R$ 0 (free 12m) |
| Storage RDS | R$ 15-30 |
| S3 | R$ 5-20 |
| Egress AWS → Cloudflare | R$ 10-30 (Cloudflare Bandwidth Alliance: discount) |
| Route 53 | R$ 0 (DNS é Cloudflare) |
| **Total AWS** | **R$ 110-200/mês** |

#### Após free tier (mês 13+)

| Recurso | Custo/mês |
|---|---|
| EC2 t4g.small staging | R$ 60-80 |
| EC2 t4g.medium prod | R$ 80-120 |
| RDS db.t4g.micro staging | R$ 70 |
| RDS db.t4g.small prod (Multi-AZ) | R$ 200-300 |
| Storage + egress + S3 | R$ 50-100 |
| **Total AWS** | **R$ 460-670/mês** |

Cloudflare continua **R$ 0**.

## Onde olhar quando algo der errado

| Problema | Primeiro lugar a olhar |
|---|---|
| Frontend não carrega | Cloudflare Pages → Deployments → último build OK? |
| Frontend carrega mas API falha | Cloudflare Pages → veja env vars de Production |
| 401 em todas requests | Variável `VITE_ZITADEL_CLIENT_ID` no Cloudflare bate com Zitadel? |
| CORS error | `CORS_ORIGINS` no `.env.prod` da API contém domínio do Cloudflare? |
| API caiu | `docker compose logs api` na EC2 |
| Banco lento | RDS Performance Insights |
| SSL expirou em api.tkws.com.br | `docker compose logs caddy` (Caddy renova auto) |
| Preview deploy do PR não autentica | Zitadel não tem o redirect URI `*.pages.dev` cadastrado |

Veja `docs/09-RUNBOOKS.md` para playbooks específicos.

## Migrar de volta pra container (se der ruim)

Se algum dia o Cloudflare Pages te trouxer dor real e quiser voltar a servir frontend
via container:

1. Restaura `docker/frontend/Dockerfile` (existe no histórico Git)
2. Adiciona serviço `frontend` no `docker-compose.prod.yml`
3. Adiciona bloco no `Caddyfile.prod`
4. Restaura build do frontend no `.github/workflows/build-deploy.yml`
5. Aponta DNS de `app.tkws.com.br` pra IP da EC2
6. Remove projeto no Cloudflare Pages

Tempo estimado: 2 horas. **Tudo isso porque é monorepo coeso.**
