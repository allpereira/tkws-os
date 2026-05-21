#!/usr/bin/env bash
# Copia um PAT do login-client para o volume zitadel-bootstrap (instâncias Zitadel já existentes).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAT_FILE="${1:-$ROOT_DIR/docker/zitadel/login-client.pat}"
VOLUME_NAME="${ZITADEL_BOOTSTRAP_VOLUME:-tkws-os_zitadel-bootstrap}"

if [[ ! -f "$PAT_FILE" ]]; then
  echo "Arquivo não encontrado: $PAT_FILE"
  echo ""
  echo "Crie o PAT no console Zitadel:"
  echo "  1. http://localhost:8088/ui/console"
  echo "  2. Users → Create machine user (ex.: login-client)"
  echo "  3. Gere um PAT e salve em docker/zitadel/login-client.pat"
  echo "  4. Instance → Members → adicione o usuário com role 'Instance Login Client'"
  echo ""
  echo "Depois rode: $0 docker/zitadel/login-client.pat"
  exit 1
fi

if ! docker volume inspect "$VOLUME_NAME" >/dev/null 2>&1; then
  echo "Volume Docker não encontrado: $VOLUME_NAME"
  echo "Suba o stack uma vez: docker compose up -d zitadel"
  exit 1
fi

docker run --rm \
  -v "$VOLUME_NAME:/bootstrap" \
  -v "$PAT_FILE:/pat.in:ro" \
  alpine:3.20 \
  sh -c 'cp /pat.in /bootstrap/login-client.pat && chmod 644 /bootstrap/login-client.pat'

echo "PAT instalado em volume $VOLUME_NAME. Reinicie o login:"
echo "  docker compose up -d zitadel-login zitadel-gateway"
