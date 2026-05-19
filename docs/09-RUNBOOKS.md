# 09 — Runbooks Operacionais

> Playbooks pra quando algo der errado. **Imprima ou tenha offline.** Em incidente, você
> não quer ficar navegando no GitHub.

## Como usar este documento

Cada runbook tem:
- **Sintomas:** como você reconhece o problema
- **Diagnóstico:** comandos pra confirmar
- **Resolução:** passo a passo
- **Pós-incidente:** o que documentar/aprender

Durante incidente:
1. Mantenha calma
2. Comunica em canal (Telegram pessoal por enquanto)
3. Aplica runbook
4. Documenta o que fez em `docs/incident-logs/INC-YYYYMMDD-descricao.md`

## Runbook 1: API está fora do ar

**Sintomas:**
- UptimeRobot avisou
- Usuários reportam erro
- `curl https://api.tkws.com.br/actuator/health` falha

**Diagnóstico:**
```bash
ssh ubuntu@<prod-host>
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=100 api
```

**Resolução:**

### Cenário A: Container parou
```bash
docker compose -f docker-compose.prod.yml up -d api
# Aguarda 30-60s
curl https://api.tkws.com.br/actuator/health
```

### Cenário B: Container está OOM
```bash
# Confirma no log:
docker compose logs api | grep -i "outofmemory\|killed"

# Aumenta limite no compose
nano docker-compose.prod.yml
# Em api.deploy.resources.limits.memory: 4G  # era 2G
docker compose -f docker-compose.prod.yml up -d api
```

### Cenário C: API não conecta no banco
```bash
docker compose exec api sh -c "nc -zv $DB_HOST 5432"

# Se falhar, problema é com RDS ou Security Group
# Verifica RDS status na AWS Console
```

**Pós-incidente:**
- Por que parou? (OOM? Deploy ruim? Cosmic ray?)
- Como evitar? (Aumentar memória? Health check melhor? Auto-restart?)
- Atualizar este runbook se aprendeu algo novo

## Runbook 2: Deploy falhou no GitHub Actions

**Sintomas:**
- Notificação do GitHub
- Build vermelho no PR ou branch protegida

**Diagnóstico:**
1. Abre GitHub Actions tab do repo
2. Clica no run que falhou
3. Identifica step específico

**Resolução:**

### Build de imagem falhou
- Provavelmente erro de compilação
- Local: roda `./mvnw verify` ou `npm run build`
- Conserta, commita, push

### Test falhou no CI mas passa local
- Diferença de ambiente? Verifica versão Java/Node no workflow
- Race condition? Adiciona `await waitFor(...)` (frontend) ou aumenta timeout
- Flaky test? Roda 3x local pra confirmar consistência

### Deploy SSH falhou
- Verifica se host respondia: `ping <host>`
- SSH key correta nos secrets? Tenta SSH manual com a key
- Permissão `/opt/tkws-os` no servidor: `sudo chown -R ubuntu:ubuntu /opt/tkws-os`

### Reverter um deploy ruim
```bash
ssh ubuntu@<host>
cd /opt/tkws-os

# Lista tags disponíveis
docker images | grep tkws-os

# Volta pra commit anterior (use SHA curto)
IMAGE_TAG=abc1234 \
  docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## Runbook 3: Banco está lento

**Sintomas:**
- Latência API alta (p95 > 500ms)
- `hikaricp_connections_pending` > 0
- Reclamações de timeout

**Diagnóstico:**
```bash
# 1. RDS Performance Insights (AWS Console) — qual query está lenta?

# 2. Conexões ativas
docker compose exec api curl localhost:8080/actuator/metrics/hikaricp.connections.active

# 3. Query slow log (se habilitou no RDS)
```

**Resolução:**

### Query lenta identificada
1. `EXPLAIN ANALYZE <query>` direto no banco
2. Falta de índice? Cria migration:
   ```sql
   -- V{N}__index_for_slow_query.sql
   CREATE INDEX CONCURRENTLY idx_xxx ON tabela(coluna);
   ```
   **Importante:** `CONCURRENTLY` pra não travar tabela em produção.

### Connection pool esgotado
- Aumenta `DB_POOL_SIZE` no `.env.prod` (cuidado: cada conexão consome RAM no RDS)
- Identifica vazamento (transações abertas demais) via Performance Insights

### Locks
```sql
-- Queries esperando lock
SELECT * FROM pg_stat_activity WHERE wait_event_type = 'Lock';

-- Mata query travada (CUIDADO)
SELECT pg_terminate_backend(<pid>);
```

## Runbook 4: SSL/Certificado problema

**Sintomas:**
- Browser mostra "Not Secure"
- Cert expirou (`openssl s_client -connect api.tkws.com.br:443`)

**Diagnóstico:**
```bash
docker compose logs caddy | tail -50
```

**Resolução:**

Caddy renova automaticamente. Se falhou:

### DNS apontando errado
```bash
dig api.tkws.com.br  # confirma que aponta pro IP correto
```

### Let's Encrypt rate limit
- Você fez muitos requests? Espera 1 semana
- Em dev/staging: use `caddy_ca = https://acme-staging-v02.api.letsencrypt.org/directory`

### Volume do Caddy perdeu dados
```bash
# Volume `caddy-data` tem os certs. Se perdeu, Caddy renova mas pode bater limite.
docker volume inspect tkws-os_caddy-data
```

## Runbook 5: Zitadel não autentica

**Sintomas:**
- Usuário não consegue logar
- API retorna 401 mesmo com token

**Diagnóstico:**
```bash
# 1. Zitadel está rodando?
docker compose ps zitadel
curl https://auth.tkws.com.br/.well-known/openid-configuration

# 2. Issuer correto na API?
docker compose exec api env | grep ZITADEL
```

**Resolução:**

### Zitadel travou
```bash
docker compose logs zitadel --tail=100
docker compose restart zitadel
# Aguarda 1-2 min
```

### Issuer URL não bate
```bash
# Compara o que API espera vs o que Zitadel diz
curl -s https://auth.tkws.com.br/.well-known/openid-configuration | jq .issuer
# Deve bater com ZITADEL_ISSUER no .env
```

### Masterkey perdida
**Recovery impossível sem ela.** Restaura backup pré-incidente. Por isso ela está no 1Password.

## Runbook 6: Disco cheio na EC2

**Sintomas:**
- Alerta de disco
- API começa a falhar com I/O errors

**Diagnóstico:**
```bash
ssh ubuntu@<host>
df -h
du -sh /var/lib/docker/* | sort -h | tail
```

**Resolução:**
```bash
# Limpa imagens antigas
docker system prune -af --volumes  # CUIDADO: lê o que faz

# Identifica volumes grandes
docker system df

# Limpa logs antigos do Docker
sudo find /var/lib/docker/containers -name "*.log" -exec truncate -s 0 {} \;

# Se persistir: aumenta EBS volume
# AWS Console → EC2 → Volumes → Modify Volume
```

## Runbook 7: Vazamento de dados (LGPD)

**Sintomas:**
- Acesso não autorizado detectado em logs
- Dados expostos publicamente

**Resolução IMEDIATA:**
1. **Para a fonte do vazamento**
   - Endpoint vulnerável? Desabilita temporariamente
   - Credencial comprometida? Rotaciona AGORA
   - Banco exposto? Tira IP público

2. **Avalia escopo**
   - Quantos titulares afetados?
   - Que dados expostos?
   - Por quanto tempo?

3. **Documenta**
   - Cria `docs/incident-logs/INC-YYYYMMDD-vazamento.md`
   - Logs, screenshots, timeline

4. **Notifica (até 72h)**
   - ANPD: https://www.gov.br/anpd/pt-br
   - Titulares afetados via email

5. **Auditoria pós-incidente**
   - O que falhou?
   - Como evitar?
   - Atualizar `docs/08-SECURITY.md`

## Runbook 8: Performance está degradando

**Sintomas:**
- Latência crescente ao longo de dias/semanas
- Sem erro específico

**Diagnóstico:**
```bash
# 1. Compara métricas históricas (Grafana)
# 2. Verifica crescimento de tabelas grandes
docker compose exec api psql -h $DB_HOST -U tkws_app -d tkws -c "
  SELECT schemaname, tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
  FROM pg_tables
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
  LIMIT 10;
"

# 3. Verifica VACUUM/ANALYZE
docker compose exec api psql -h $DB_HOST -U tkws_app -d tkws -c "
  SELECT relname, last_autovacuum, last_autoanalyze
  FROM pg_stat_user_tables
  ORDER BY last_autovacuum NULLS FIRST
  LIMIT 10;
"
```

**Resolução:**

### Tabela cresceu sem índice adequado
- Identifica query lenta
- Cria índice (com `CONCURRENTLY`)

### VACUUM defasado
```sql
VACUUM ANALYZE nome_tabela;
```

### Cache hit ratio baixo
- Aumenta `shared_buffers` no parameter group do RDS
- Ou aumenta tamanho da instância

## Runbook 9: Como fazer uma janela de manutenção

**Quando:**
- Migration grande de banco
- Upgrade major de versão
- Mudança breaking de schema

**Procedimento:**

```bash
# 1. Comunica usuários 24-48h antes
# 2. Coloca página de manutenção (Caddy serve estático temporário)

# Caddyfile temporário:
# app.tkws.com.br {
#   respond "Em manutenção até HH:MM. Retornamos em breve." 503
# }

# 3. Para containers
docker compose -f docker-compose.prod.yml stop api frontend

# 4. Snapshot manual do banco (sempre antes)
aws rds create-db-snapshot --db-instance-identifier tkws-prod \
  --db-snapshot-identifier tkws-prod-pre-maintenance-$(date +%Y%m%d)

# 5. Executa mudança
# ... (migration, etc)

# 6. Sobe de volta
docker compose -f docker-compose.prod.yml up -d

# 7. Smoke test
curl https://api.tkws.com.br/actuator/health
curl https://app.tkws.com.br

# 8. Remove página de manutenção
```

## Template de Incident Log

Quando algo der errado, documenta em `docs/incident-logs/INC-YYYYMMDD-descricao.md`:

```markdown
# INC-20250517-api-out

**Início:** 2025-05-17 14:32 BRT
**Fim:** 2025-05-17 14:51 BRT
**Severidade:** P1
**Impacto:** API indisponível, 100% dos usuários

## Timeline

- 14:32 — Alerta UptimeRobot
- 14:34 — Login no servidor, identifica container parado
- 14:38 — `docker compose up -d api` falha por OOM
- 14:45 — Aumenta limite de memória, restart
- 14:51 — API saudável

## Root cause

OOM no container API. Crescimento de heap acima do limite configurado (1.5GB) devido
a processamento síncrono de upload grande.

## Resolução

- Aumentado memory limit de 1.5G para 3G no docker-compose.prod.yml
- Upload movido para fila assíncrona (issue #42)

## Lições aprendidas

- Adicionar alerta de memória > 80% (P2) para detectar antes do OOM
- Processamento síncrono de uploads é anti-padrão — deve ir pra fila

## Action items

- [ ] Issue #42 — mover upload pra fila assíncrona
- [ ] Issue #43 — alerta de memória > 80% por 5min
- [ ] Atualizar Runbook 1 com cenário "OOM"
```
