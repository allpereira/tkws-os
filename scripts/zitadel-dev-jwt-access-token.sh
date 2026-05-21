#!/usr/bin/env bash
# Ajusta app OIDC para emitir access token JWT (necessário para Spring Resource Server).
set -euo pipefail

CLIENT_ID="${1:?Informe o client_id do app Web (ex.: valor de VITE_ZITADEL_CLIENT_ID)}"

docker compose exec -T postgres psql -U tkws -d zitadel -v ON_ERROR_STOP=1 -c \
  "UPDATE projections.apps7_oidc_configs
   SET access_token_type = 1
   WHERE client_id = '${CLIENT_ID}';"

echo "access_token_type=JWT aplicado para client_id=${CLIENT_ID}"
echo "Faça logout/login no frontend para obter um novo access token."
echo "No console Zitadel, confira também: app Web → Token Settings → Access Token Type: JWT"
