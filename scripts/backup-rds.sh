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

# Dump dos DOIS bancos da instância: o da aplicação (tkws) E o do Zitadel.
# Perder o banco do Zitadel = perder toda a identidade/auth dos tenants, então
# ele entra no dump portável (defesa em profundidade além do snapshot do RDS).
DATABASES=(tkws zitadel)

for DB in "${DATABASES[@]}"; do
    DUMP_FILE="${DB}-${ENV}-${TIMESTAMP}.sql.gz"
    echo "==> Fazendo dump do banco ${DB}..."
    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
        -d "$DB" --no-owner --no-acl --clean --if-exists \
        | gzip > "/tmp/$DUMP_FILE"

    echo "==> Enviando ${DB} pra S3..."
    aws s3 cp "/tmp/$DUMP_FILE" "s3://${AWS_S3_BUCKET}/backups/${ENV}/${DUMP_FILE}" \
        --storage-class STANDARD_IA

    rm "/tmp/$DUMP_FILE"
    echo "✓ ${DB}: s3://${AWS_S3_BUCKET}/backups/${ENV}/${DUMP_FILE}"
done

echo "✓ Backup concluído (tkws + zitadel)."
