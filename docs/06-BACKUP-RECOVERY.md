# 06 — Backup & Disaster Recovery

> Toda dor de operação eventualmente vira dor de backup. Este documento garante que você
> nunca perca dados e saiba exatamente como recuperar quando algo der errado.

## Princípios

1. **Backup automatizado, não manual.** Manual será esquecido.
2. **Backup testado.** Backup que nunca foi restaurado **não é backup**, é esperança.
3. **3-2-1:** 3 cópias, 2 mídias diferentes, 1 offsite.
4. **Documentar o restore.** Stress não é momento de descobrir o procedimento.
5. **RTO/RPO definidos** por ambiente.

## RTO e RPO

| Ambiente | RTO (tempo até voltar) | RPO (dados que podem perder) |
|---|---|---|
| Dev | N/A (sem dados reais) | N/A |
| Staging | 4 horas | 24 horas |
| Produção | 1 hora | 15 minutos |

## O que precisa ser protegido

| Dado | Onde está | Estratégia |
|---|---|---|
| PostgreSQL TKWS | RDS | Snapshot automático + dump extra |
| PostgreSQL Zitadel | RDS | Snapshot automático + dump extra |
| Uploads de usuário | S3 | Versionamento ativado |
| Zitadel masterkey | Secrets Manager | Cópia em 1Password |
| GitHub secrets | GitHub | Exportar trimestral para 1Password |
| Configuração Zitadel | Banco | Coberto pelos snapshots |
| Código | Git/GitHub | Mirror semanal para GitLab opcional |
| Containers imagens | GHCR | Reproducível pelo build |

## Estratégia por banco de dados (todos os bancos)

Visão consolidada de **cada datastore** do TKWS OS e como ele é protegido:

| Banco | Conteúdo | Criticidade | Estratégia | RPO efetivo |
|---|---|---|---|---|
| **PostgreSQL `tkws`** (RDS) | Dados de negócio (tenants, pessoas, oportunidades, configs…) | **Crítico** | PITR (logs) + snapshot diário + `pg_dump` diário → S3 | ~5 min (PITR) |
| **PostgreSQL `zitadel`** (RDS, mesma instância) | Identidade/auth: usuários, orgs, sessões, grants | **Crítico** | Mesma instância → PITR + snapshot; `pg_dump` próprio (ver `backup-rds.sh`) | ~5 min (PITR) |
| **Redis** | Cache (L2) | **Descartável** | **Sem backup** — é cache reconstrutível; ver nota abaixo | N/A |
| **S3 uploads** | Arquivos de usuário | Alto | Versionamento + lifecycle Glacier | imediato (versionado) |

> **Por que os dois bancos PostgreSQL?** TKWS e Zitadel compartilham a **mesma
> instância RDS** (bancos lógicos distintos). O snapshot do RDS cobre os dois de
> uma vez. O dump portável (`scripts/backup-rds.sh`) faz `pg_dump` de **ambos** —
> perder o `zitadel` significa perder todo o login dos tenants.

### Point-in-Time Recovery (PITR) — a base do RPO de 15 min

Snapshots diários sozinhos dariam RPO de ~24h. O RPO de **15 min** (prod) vem do
**PITR**, habilitado pelos *automated backups* do RDS (retém os WAL/transaction
logs). Garanta no setup da instância:

```bash
# Verifica que automated backups + PITR estão ligados (retention > 0)
aws rds describe-db-instances --db-instance-identifier tkws-prod \
  --query 'DBInstances[0].[BackupRetentionPeriod,LatestRestorableTime]' --output table

# Restore para um instante específico (ex.: 5 min antes de um incidente)
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier tkws-prod \
  --target-db-instance-identifier tkws-prod-pitr \
  --restore-time 2026-05-27T14:25:00Z
```

> Defina `BackupRetentionPeriod` ≥ 7 (staging) / ≥ 30 (prod). Retention 0 **desliga**
> o PITR — checar isso é parte do checklist de deploy.

### Redis — por que não fazer backup

Redis aqui é **cache** (nível L2 compartilhado; o L1 é Caffeine in-process, ver
`docs/16-PERFORMANCE.md`). Não guarda fonte-da-verdade: tudo é recomputável a
partir do PostgreSQL. Logo, **não precisa de backup** — em caso de perda, o cache
reaquece sozinho. `--maxmemory-policy allkeys-lru` já assume volatilidade.

⚠️ **Se** no futuro o Redis passar a guardar **sessões** ou qualquer dado
não-reconstrutível, esta decisão muda: habilite persistência (`appendonly yes`,
AOF) e inclua o volume `redis-data` num snapshot, **ou** troque a policy para
`volatile-lru` para não despejar sessões.

## Melhores práticas (resumo aplicável)

1. **PITR ligado** nos dois bancos PostgreSQL — é o que entrega RPO de 15 min.
2. **Dump portável dos dois bancos** (`tkws` + `zitadel`) diário no S3 versionado — independe do RDS/região.
3. **3-2-1**: snapshot RDS (1) + dump S3 (2) + cópia cross-region opcional (3, offsite).
4. **Backup testado mensalmente** (restore real, não só "existe o arquivo").
5. **Criptografia em repouso**: snapshots RDS (AES-256) e bucket S3 com SSE.
6. **Segredos fora dos bancos e fora da AWS**: `ZITADEL_MASTERKEY` e `.env.prod` no 1Password — sem eles, o backup do Zitadel é inútil.
7. **Alertas de frescor**: último snapshot/dump < 25h; falha de cron = página.
8. **Restore documentado e ensaiado** (runbooks abaixo) — emergência não é hora de aprender.

## Backups automáticos

### 1. RDS Snapshots (primária)

Configurado no setup:
- **Staging:** retenção 7 dias
- **Produção:** retenção 30 dias

```bash
# Listar snapshots existentes
aws rds describe-db-snapshots --db-instance-identifier tkws-prod

# Snapshot manual antes de operação arriscada
aws rds create-db-snapshot \
  --db-instance-identifier tkws-prod \
  --db-snapshot-identifier tkws-prod-before-migration-$(date +%Y%m%d)
```

Snapshots automáticos são **criptografados** (AES-256 nativo do RDS).

### 2. Dump pg_dump extra (defesa em profundidade)

Dump diário enviado pra S3 com versionamento. Vantagens sobre snapshot:
- Portável (pode restaurar em qualquer Postgres, não só RDS)
- Texto (inspecionável)
- Versionamento do S3 dá histórico

#### Setup do cron na EC2 produção

```bash
ssh ubuntu@<prod-host>

# Adiciona ao crontab do user
crontab -e

# Cola:
0 3 * * * cd /opt/tkws-os && ./scripts/backup-rds.sh prod >> /var/log/tkws-backup.log 2>&1
```

#### Verificação semanal

```bash
# Lista backups recentes
aws s3 ls s3://tkws-backups/prod/ --recursive | tail -10

# Tamanho do mais recente (deve ser estável ou crescente)
aws s3 ls s3://tkws-backups/prod/ --recursive --summarize | tail -3
```

### 3. S3 versionamento

Buckets `tkws-uploads-prod` e `tkws-backups` têm versionamento ativo.
Deletar objeto vira "delete marker" — original preservado.

Lifecycle configurado:
- 30 dias após criação → move para Glacier Instant Retrieval (75% mais barato)
- 365 dias → expira (atenção: backup mensal você deve manter mais tempo se exigido por compliance)

### 4. Disaster Recovery — Cross-region (opcional, futuro)

Quando aplicável:
```bash
# Copia snapshot para outra região
aws rds copy-db-snapshot \
  --source-db-snapshot-identifier arn:aws:rds:sa-east-1:...:snapshot:... \
  --target-db-snapshot-identifier tkws-prod-dr-$(date +%Y%m%d) \
  --source-region sa-east-1 \
  --region us-east-1
```

## Runbook: Restore de banco

### Cenário 1: Restaurar produção a partir de snapshot RDS

**Quando usar:** corrupção de dados, deleção acidental, ataque ransomware.

**Tempo estimado:** 20-60 min (depende do tamanho do banco).

```bash
# 1. Identifica o snapshot certo
aws rds describe-db-snapshots \
  --db-instance-identifier tkws-prod \
  --query 'DBSnapshots[*].[DBSnapshotIdentifier,SnapshotCreateTime,Status]' \
  --output table

# 2. Restaura para nova instância (NUNCA sobrescreve a existente)
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier tkws-prod-restored \
  --db-snapshot-identifier <snapshot-id> \
  --db-instance-class db.t4g.small \
  --vpc-security-group-ids <sg-id>

# 3. Aguarda available
aws rds wait db-instance-available --db-instance-identifier tkws-prod-restored

# 4. Pega novo endpoint
NEW_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier tkws-prod-restored \
  --query 'DBInstances[0].Endpoint.Address' --output text)

# 5. Valida (conecta e verifica dados-chave)
PGPASSWORD=$DB_PASSWORD psql -h $NEW_ENDPOINT -U tkws_app -d tkws \
  -c "SELECT COUNT(*) FROM tenants; SELECT COUNT(*) FROM users;"

# 6. Aponta a aplicação para o novo endpoint
ssh ubuntu@<prod-host>
cd /opt/tkws-os
sed -i "s/DB_HOST=.*/DB_HOST=$NEW_ENDPOINT/" .env.prod
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# 7. Confirma saúde
curl https://api.tkws.com.br/actuator/health

# 8. Após confirmar tudo OK por 24-48h, remove instância antiga
# (deixa snapshot final pra história)
aws rds delete-db-instance \
  --db-instance-identifier tkws-prod-OLD \
  --final-db-snapshot-identifier tkws-prod-final-$(date +%Y%m%d)
```

### Cenário 2: Restaurar a partir do dump no S3

**Quando usar:** snapshot não está disponível (raro), ou precisa de dados específicos sem
restaurar tudo.

```bash
# 1. Lista dumps
aws s3 ls s3://tkws-backups/prod/ --recursive | tail -20

# 2. Baixa o dump
aws s3 cp s3://tkws-backups/prod/tkws-prod-20250516T030000Z.sql.gz /tmp/

# 3. Cria banco temporário no mesmo RDS
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U tkws_app -d postgres \
  -c "CREATE DATABASE tkws_restore;"

# 4. Restaura
gunzip -c /tmp/tkws-prod-*.sql.gz | \
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U tkws_app -d tkws_restore

# 5. Verifica
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U tkws_app -d tkws_restore \
  -c "SELECT COUNT(*) FROM tenants;"

# 6. Renomeia (em janela de manutenção)
# Faça com cuidado, com aplicação parada:
docker compose -f docker-compose.prod.yml down
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U tkws_app -d postgres -c "
  ALTER DATABASE tkws RENAME TO tkws_old;
  ALTER DATABASE tkws_restore RENAME TO tkws;
"
docker compose -f docker-compose.prod.yml up -d
```

### Cenário 3: Restaurar apenas uma tabela

```bash
# Extrai só a tabela do dump
gunzip -c /tmp/tkws-prod-*.sql.gz | \
  pg_restore --data-only --table=tenants > /tmp/tenants-only.sql

# Limpa tabela atual (CUIDADO) e importa
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U tkws_app -d tkws \
  -c "TRUNCATE tenants CASCADE;" \
  -f /tmp/tenants-only.sql
```

## Runbook: Restore de objeto S3

### Recuperar versão antiga de upload

```bash
# Lista versões do objeto
aws s3api list-object-versions \
  --bucket tkws-uploads-prod \
  --prefix uploads/2025/05/<arquivo>

# Restaura versão específica
aws s3api copy-object \
  --bucket tkws-uploads-prod \
  --copy-source "tkws-uploads-prod/uploads/...?versionId=XYZ" \
  --key uploads/2025/05/<arquivo>
```

### Recuperar arquivo "deletado"

```bash
# Delete em bucket versionado vira "delete marker"
# Remove o delete marker pra restaurar:
aws s3api delete-object \
  --bucket tkws-uploads-prod \
  --key uploads/path/to/file \
  --version-id <delete-marker-version-id>
```

## Teste mensal obrigatório

**Primeiro domingo de cada mês**, agendar:

1. Restaurar snapshot mais recente em instância de teste
2. Conectar e validar contagens básicas
3. Subir API local apontando pra ela
4. Smoke test (login, listar tenants)
5. Excluir instância de teste
6. Anotar tempo gasto e problemas encontrados em `docs/runbook-logs/`

Esse exercício revela problemas **antes** de você precisar deles em emergência.

## Catastrophic recovery: perdi TUDO

Cenário pior caso: conta AWS comprometida, todos recursos deletados.

**Pré-requisitos** (mantenha em local externo SEGURO):
- Credenciais root AWS (2FA hardware key)
- Git repo (já está em GitHub, fora da AWS)
- `ZITADEL_MASTERKEY` (em 1Password ou cofre)
- Conteúdo dos `.env.prod` e `.env.staging` (em 1Password)
- Backup mais recente do `tkws-backups` se ele também foi deletado (Glacier tem 5-12h de recovery)

**Recovery completo:**

1. Recupera conta AWS (via suporte se comprometida)
2. Recria recursos seguindo `docs/03-DEPLOY.md` seção "Setup inicial"
3. Restaura backup do banco (do Glacier se necessário)
4. Aponta DNS pra novos IPs
5. Atualiza variáveis de ambiente com novos endpoints
6. Smoke test

**Tempo estimado:** 8-24h. Por isso o **mensal** importa: você descobre fricções antes.

## Métricas de saúde dos backups

Acompanhe (idealmente via alerta):

- Último snapshot RDS bem-sucedido: deve ser < 25h atrás
- Último dump S3: deve ser < 25h atrás
- Tamanho do dump: razoavelmente estável (queda súbita = problema)
- Erros de cron: zero

## Anti-padrões a evitar

❌ Backup só com snapshot RDS (perda de região = perde tudo)
❌ Dump local na EC2 (perda da EC2 = perde tudo)
❌ Versionamento S3 desabilitado
❌ Sem teste de restore
❌ Senha do banco e masterkey só na memória
❌ Backup encriptado com chave que ninguém sabe onde está
