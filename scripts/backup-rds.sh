#!/usr/bin/env bash
# ============================================
# Backup manual extra (além dos snapshots automáticos do RDS)
# Faz pg_dump e envia pra S3.
# Uso: ./scripts/backup-rds.sh staging|prod
# ============================================

set -euo pipefail

ENV=${1:-}
if [[ "$ENV" != "staging" && "$ENV" != "prod" ]]; then
    echo "Uso: $0 staging|prod"
    exit 1
fi

source ".env.${ENV}"

TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
DUMP_FILE="tkws-${ENV}-${TIMESTAMP}.sql.gz"

echo "==> Fazendo dump do banco tkws..."
PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
    -d tkws --no-owner --no-acl --clean --if-exists \
    | gzip > "/tmp/$DUMP_FILE"

echo "==> Enviando pra S3..."
aws s3 cp "/tmp/$DUMP_FILE" "s3://${AWS_S3_BUCKET}/backups/${ENV}/${DUMP_FILE}" \
    --storage-class STANDARD_IA

echo "==> Removendo dump local..."
rm "/tmp/$DUMP_FILE"

echo "✓ Backup concluído: s3://${AWS_S3_BUCKET}/backups/${ENV}/${DUMP_FILE}"
