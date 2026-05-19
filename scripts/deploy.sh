#!/usr/bin/env bash
# ============================================
# Deploy manual (caso CI esteja fora)
# Uso: ./scripts/deploy.sh staging|prod
# ============================================

set -euo pipefail

ENV=${1:-}
if [[ "$ENV" != "staging" && "$ENV" != "prod" ]]; then
    echo "Uso: $0 staging|prod"
    exit 1
fi

COMPOSE_FILE="docker-compose.${ENV}.yml"
ENV_FILE=".env.${ENV}"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Arquivo $COMPOSE_FILE não encontrado"
    exit 1
fi
if [ ! -f "$ENV_FILE" ]; then
    echo "Arquivo $ENV_FILE não encontrado"
    exit 1
fi

echo "==> Puxando últimas imagens..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" pull

echo "==> Aplicando..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --remove-orphans

echo "==> Aguardando saúde dos serviços..."
sleep 10

echo "==> Status:"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps

echo "==> Limpando imagens antigas..."
docker image prune -f

echo "✓ Deploy concluído"
