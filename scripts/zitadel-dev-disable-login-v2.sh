#!/usr/bin/env bash
# Desbloqueia console/login em dev quando Login V2 está "required" mas zitadel-login não tem PAT.
# Usa Login V1 (embutido no container zitadel). Adequado só para desenvolvimento local.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Desativando Login V2 (required=false) na projeção instance_features5..."
docker compose exec -T postgres psql -U tkws -d zitadel -v ON_ERROR_STOP=1 -c \
  "UPDATE projections.instance_features5
   SET value = '{\"required\": false}'::jsonb,
       change_date = now()
   WHERE key = 'login_v2';"

echo "Reiniciando Zitadel e gateway..."
docker compose restart zitadel zitadel-gateway

echo ""
echo "Pronto. Teste:"
echo "  - Console: http://localhost:8088/ui/console (deve abrir sem ir para /ui/v2/login)"
echo "  - Login OIDC passa a usar /ui/login/login (v1)"
echo ""
echo "Para voltar ao Login V2 depois de configurar o PAT:"
echo "  ./scripts/zitadel-install-login-pat.sh"
echo "  docker compose exec -T postgres psql -U tkws -d zitadel -c \"UPDATE projections.instance_features5 SET value = '{\\\"required\\\": true}'::jsonb WHERE key = 'login_v2';\""
echo "  docker compose restart zitadel zitadel-login zitadel-gateway"
