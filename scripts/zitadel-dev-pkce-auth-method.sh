#!/usr/bin/env bash
# Corrige app Web para PKCE público (auth_method_type=NONE). Evita "empty client assertion".
set -euo pipefail

CLIENT_ID="${1:?Informe o client_id do app Web}"

docker compose exec -T postgres psql -U tkws -d zitadel -v ON_ERROR_STOP=1 -c \
  "UPDATE projections.apps7_oidc_configs
   SET auth_method_type = 2,
       client_secret = NULL
   WHERE client_id = '${CLIENT_ID}';"

echo "auth_method_type=PKCE (NONE) aplicado para client_id=${CLIENT_ID}"
echo "Faça logout/login no frontend. No console: Authentication Method = PKCE (not Private Key JWT)."
