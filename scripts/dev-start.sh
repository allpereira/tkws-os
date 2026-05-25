#!/usr/bin/env bash
# Sobe todo o ambiente de desenvolvimento do TKWS OS.
# Uso: bash scripts/dev-start.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# ── Cores ──────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn()  { echo -e "${YELLOW}[!]${NC} $*"; }
error() { echo -e "${RED}[✗]${NC} $*"; }

# ── 1. Docker services ─────────────────────────────────────────────────────────
info "Subindo serviços Docker (postgres, redis, zitadel, zitadel-gateway)..."
docker compose up -d postgres redis zitadel zitadel-gateway

echo ""
info "Aguardando Postgres ficar healthy..."
for i in $(seq 1 30); do
  if docker compose exec -T postgres pg_isready -U tkws -q 2>/dev/null; then
    info "Postgres healthy ✓"; break
  fi
  [ "$i" -eq 30 ] && { error "Postgres não ficou healthy em 30s"; exit 1; }
  sleep 2
done

info "Aguardando Zitadel ficar healthy (pode levar até 2 min na 1ª vez)..."
for i in $(seq 1 60); do
  STATUS=$(docker inspect --format='{{.State.Health.Status}}' tkws-zitadel 2>/dev/null || echo "none")
  if [ "$STATUS" = "healthy" ]; then
    info "Zitadel healthy ✓"; break
  fi
  [ "$i" -eq 60 ] && { warn "Zitadel ainda não healthy após 2 min — continuando mesmo assim"; break; }
  printf '.'
  sleep 2
done
echo ""

# ── 2. Ativa Login V2 customizado ─────────────────────────────────────────────
info "Ativando Login V2 (custom login app em localhost:5174)..."
bash "$ROOT_DIR/scripts/zitadel-dev-enable-login-v2-custom.sh" 2>&1 | grep -v "^$" || true

# ── 2b. Extrai o PAT do login-client (Vite proxy injeta nas chamadas Session API) ─
info "Extraindo PAT do login-client (login/ é SPA — proxy injeta Bearer)..."
if [ -s "$ROOT_DIR/docker/zitadel/login-client.pat" ]; then
  info "PAT já presente em docker/zitadel/login-client.pat — pulando extração"
else
  bash "$ROOT_DIR/scripts/extract-login-pat.sh" || \
    warn "Falha ao extrair PAT — sem ele a Session API responde 401. Rode manualmente quando o Zitadel ficar healthy."
fi

# ── 2c. Seed Zitadel (project TKWS OS + app Web + roles + sync .env.local) ────
# Idempotente: roda toda subida pra garantir que .env.local tem o client_id correto
# e que o estado de aplicação está consistente. Falhas em writes (precisam de
# ORG_OWNER) são apenas avisos. Ver docs/04-AUTH.md § "Reset Zitadel do zero".
info "Aplicando seed do Zitadel (idempotente)..."
bash "$ROOT_DIR/scripts/zitadel-seed.sh" 2>&1 | sed 's/^/  /' || \
  warn "Seed do Zitadel teve falhas (ver acima). Pode ser primeira execução · siga docs/04-AUTH.md § Reset Zitadel."

# ── 3. Login app (porta 5174) ──────────────────────────────────────────────────
info "Iniciando login app em localhost:5174..."
if lsof -ti:5174 >/dev/null 2>&1; then
  warn "Porta 5174 já em uso — assumindo que login app já está rodando"
else
  cd "$ROOT_DIR/login"
  npm run dev > /tmp/tkws-login.log 2>&1 &
  LOGIN_PID=$!
  echo "$LOGIN_PID" > /tmp/tkws-login.pid
  info "Login app iniciado (PID $LOGIN_PID, log: /tmp/tkws-login.log)"
  sleep 3
fi

# ── 4. Frontend principal (porta 5173) ────────────────────────────────────────
info "Iniciando frontend em localhost:5173..."
if lsof -ti:5173 >/dev/null 2>&1; then
  warn "Porta 5173 já em uso — assumindo que frontend já está rodando"
else
  cd "$ROOT_DIR/frontend"
  npm run dev > /tmp/tkws-frontend.log 2>&1 &
  FRONTEND_PID=$!
  echo "$FRONTEND_PID" > /tmp/tkws-frontend.pid
  info "Frontend iniciado (PID $FRONTEND_PID, log: /tmp/tkws-frontend.log)"
  sleep 3
fi

# ── 5. API Spring Boot (porta 8080) ───────────────────────────────────────────
info "Iniciando API Spring Boot em localhost:8080..."
if lsof -ti:8080 >/dev/null 2>&1; then
  warn "Porta 8080 já em uso — assumindo que API já está rodando"
else
  cd "$ROOT_DIR/api"
  ZITADEL_ISSUER=http://localhost:8088 \
  DB_URL=jdbc:postgresql://localhost:5433/tkws \
  DB_USER=tkws \
  DB_PASSWORD=tkws \
  REDIS_HOST=localhost \
  REDIS_PORT=6380 \
  CORS_ORIGINS=http://localhost:5173 \
  ENVIRONMENT=dev \
  LOG_LEVEL=DEBUG \
    mvn spring-boot:run -q > /tmp/tkws-api.log 2>&1 &
  API_PID=$!
  echo "$API_PID" > /tmp/tkws-api.pid
  info "API iniciada (PID $API_PID, log: /tmp/tkws-api.log)"
  echo ""
  warn "API demora ~30-60s para subir. Acompanhe: tail -f /tmp/tkws-api.log"
fi

# ── Resumo ─────────────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════"
info "Ambiente TKWS OS iniciado!"
echo ""
echo "  Frontend:    http://localhost:5173"
echo "  Login App:   http://localhost:5174"
echo "  API:         http://localhost:8080/actuator/health"
echo "  Zitadel:     http://localhost:8088/ui/console"
echo ""
echo "  Logs:"
echo "    tail -f /tmp/tkws-login.log"
echo "    tail -f /tmp/tkws-frontend.log"
echo "    tail -f /tmp/tkws-api.log"
echo "════════════════════════════════════════════════════════"
