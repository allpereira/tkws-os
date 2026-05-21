#!/usr/bin/env bash
# Lista ou sugere VITE_ZITADEL_CLIENT_ID para dev local (app Web com redirect localhost:5173).
set -euo pipefail

REDIRECT_FRAGMENT="${1:-localhost:5173/callback}"

rows=$(docker compose exec -T postgres psql -U tkws -d zitadel -t -A -F '|' -c \
  "SELECT a.name, o.client_id, array_to_string(o.redirect_uris, ', ')
   FROM projections.apps7 a
   JOIN projections.apps7_oidc_configs o
     ON a.instance_id = o.instance_id AND a.id = o.app_id
   WHERE EXISTS (
     SELECT 1 FROM unnest(o.redirect_uris) u WHERE u LIKE '%${REDIRECT_FRAGMENT}%'
   )
   ORDER BY a.creation_date;" 2>/dev/null || true)

if [[ -z "${rows// }" ]]; then
  echo "Nenhum app OIDC com redirect *${REDIRECT_FRAGMENT}* encontrado no Zitadel local."
  echo ""
  echo "Crie o app Web manualmente:"
  echo "  1. http://localhost:8088 — login admin@tkws.local / Admin@123456"
  echo "  2. Projects → Create → nome: TKWS OS"
  echo "  3. Applications → New → Web → PKCE"
  echo "  4. Redirect URI: http://localhost:5173/callback"
  echo "  5. Post logout URI: http://localhost:5173"
  echo "  6. Copie o Client ID e coloque em frontend/.env.local:"
  echo "     VITE_ZITADEL_CLIENT_ID=<client_id>"
  echo ""
  echo "Detalhes: docs/04-AUTH.md (Setup inicial)"
  exit 1
fi

echo "Apps OIDC encontrados:"
echo "$rows" | while IFS='|' read -r name client_id uris; do
  echo "  - $name"
  echo "    client_id: $client_id"
  echo "    redirect_uris: $uris"
  echo ""
  echo "Cole em frontend/.env.local:"
  echo "VITE_ZITADEL_CLIENT_ID=$client_id"
done
