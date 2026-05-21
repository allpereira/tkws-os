#!/usr/bin/env bash
# Ativa Login V2 apontando para o app customizado de login (login/ → porta 5174).
# Uso: ./scripts/zitadel-dev-enable-login-v2-custom.sh
#
# Contexto: ZITADEL_DEFAULTINSTANCE_FEATURES_* só são lidos no primeiro init.
# Em instâncias já existentes, o feature flag fica gravado no Postgres e
# precisa ser atualizado diretamente nesta projeção.
#
# Pré-requisitos:
#   - docker compose up -d (postgres e zitadel rodando)
#   - app login/ rodando em localhost:5174 (cd login && npm run dev)
#   - docker-compose.yml com ZITADEL_OIDC_DEFAULTLOGINURLV2 = http://localhost:5174/login?authRequestId=
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

LOGIN_V2_BASE_URI="${LOGIN_V2_BASE_URI:-http://localhost:5174/}"

# ── 1. Diagnóstico ────────────────────────────────────────────────────────────
echo "Estado atual da feature login_v2 no banco:"
docker compose exec -T postgres psql -U tkws -d zitadel -x -c \
  "SELECT instance_id, key, value, change_date
   FROM projections.instance_features5
   WHERE key = 'login_v2';" 2>/dev/null || echo "  (tabela vazia ou sem linha login_v2)"

echo ""

# ── 2. Upsert do feature flag ─────────────────────────────────────────────────
echo "Ativando login_v2 (required=true, baseUri=$LOGIN_V2_BASE_URI)..."

docker compose exec -T postgres psql -U tkws -d zitadel -v ON_ERROR_STOP=1 -c \
  "INSERT INTO projections.instance_features5 (instance_id, key, value, change_date, sequence)
   SELECT instance_id,
          'login_v2',
          jsonb_build_object('required', true, 'baseUri', '${LOGIN_V2_BASE_URI}'),
          now(),
          COALESCE((SELECT MAX(sequence) FROM projections.instance_features5), 0) + 1
   FROM projections.instance_features5
   WHERE key = 'login_v2'
   LIMIT 1
   ON CONFLICT (instance_id, key)
   DO UPDATE SET value = jsonb_build_object('required', true, 'baseUri', '${LOGIN_V2_BASE_URI}'),
                 change_date = now();" 2>/dev/null || {

    # Fallback: UPDATE simples quando a linha já existe
    echo "  Tentando UPDATE direto..."
    docker compose exec -T postgres psql -U tkws -d zitadel -v ON_ERROR_STOP=1 -c \
      "UPDATE projections.instance_features5
       SET value = jsonb_build_object('required', true, 'baseUri', '${LOGIN_V2_BASE_URI}'),
           change_date = now()
       WHERE key = 'login_v2';"
}

echo ""
echo "Verificando resultado:"
docker compose exec -T postgres psql -U tkws -d zitadel -x -c \
  "SELECT key, value, change_date FROM projections.instance_features5 WHERE key = 'login_v2';"

# ── 3. Restart ────────────────────────────────────────────────────────────────
echo ""
echo "Reiniciando Zitadel e gateway para aplicar..."
docker compose restart zitadel zitadel-gateway

echo ""
echo "✓ Pronto! Login V2 ativado apontando para $LOGIN_V2_BASE_URI"
echo ""
echo "Certifique-se de que o app customizado de login está rodando:"
echo "  cd login && npm run dev   (porta 5174)"
echo ""
echo "Fluxo esperado:"
echo "  localhost:5173 → Zitadel OIDC → localhost:5174/login?authRequestId=<id>"
echo ""
echo "Para reverter para Login V1:"
echo "  ./scripts/zitadel-dev-disable-login-v2.sh"
