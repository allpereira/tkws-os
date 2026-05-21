#!/usr/bin/env bash
# Extrai o PAT do login-client do volume Docker zitadel-bootstrap.
#
# Por quê: o `login/` (porta 5174) é uma SPA — não pode segurar segredo no browser.
# Em dev, o Vite proxy lê esse PAT do disco e injeta o Bearer nas chamadas para
# /v2/sessions, /v2/oidc/auth_requests/...
#
# Uso:
#   bash scripts/extract-login-pat.sh                       # destino padrão
#   bash scripts/extract-login-pat.sh /caminho/alternativo  # destino custom
#
# Pré-requisitos:
#   - docker compose up -d zitadel   (o bootstrap gera o PAT no volume)
#
# Saída padrão: docker/zitadel/login-client.pat (já está no .gitignore)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-$ROOT_DIR/docker/zitadel/login-client.pat}"
VOLUME="${ZITADEL_BOOTSTRAP_VOLUME:-tkws-os_zitadel-bootstrap}"

# ── Cores ─────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn()  { echo -e "${YELLOW}[!]${NC} $*"; }
error() { echo -e "${RED}[✗]${NC} $*"; }

# ── Verificações ──────────────────────────────────────────────────────────────
if ! command -v docker >/dev/null 2>&1; then
  error "docker não encontrado no PATH."
  exit 1
fi

if ! docker volume inspect "$VOLUME" >/dev/null 2>&1; then
  error "Volume Docker não encontrado: $VOLUME"
  echo ""
  echo "Suba o stack uma vez para criar o volume:"
  echo "  docker compose up -d zitadel"
  exit 1
fi

# ── Extração ──────────────────────────────────────────────────────────────────
mkdir -p "$(dirname "$OUT")"

# Tenta extrair o PAT do volume. Pode ser que ainda não exista (Zitadel iniciando).
if ! docker run --rm \
     -v "${VOLUME}:/bootstrap:ro" \
     alpine:3.20 \
     test -s /bootstrap/login-client.pat 2>/dev/null; then
  error "O arquivo login-client.pat ainda não está no volume."
  echo ""
  echo "Causas comuns:"
  echo "  1. Zitadel ainda subindo — aguarde 1-2 min e tente de novo."
  echo "  2. Instância antiga (criada sem ZITADEL_FIRSTINSTANCE_LOGINCLIENTPATPATH):"
  echo "     crie o PAT manualmente no console e use:"
  echo "       bash scripts/zitadel-install-login-pat.sh docker/zitadel/login-client.pat"
  echo "  3. Volume com nome diferente — defina ZITADEL_BOOTSTRAP_VOLUME."
  exit 1
fi

docker run --rm \
  -v "${VOLUME}:/bootstrap:ro" \
  alpine:3.20 \
  cat /bootstrap/login-client.pat > "$OUT"

chmod 600 "$OUT"

LEN=$(wc -c < "$OUT" | tr -d ' ')
info "PAT extraído: $OUT ($LEN bytes)"
echo ""
echo "Agora reinicie o login app (porta 5174) para o Vite proxy pegar o token:"
echo "  cd login && npm run dev"
