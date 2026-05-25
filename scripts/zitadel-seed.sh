#!/usr/bin/env bash
# zitadel-seed.sh — Configuração declarativa do Zitadel local (idempotente).
#
# ┌─ O que é responsabilidade do COMPOSE (ZITADEL_FIRSTINSTANCE_*) ─────────────┐
# │  · org default criada no bootstrap (nome inicial varia)                     │
# │  · domínio inicial (ex.: tkws.localhost ou similar)                         │
# │  · admin@tkws.local (humano, ORG_OWNER, senha = ZITADEL_FIRSTINSTANCE_…)    │
# │  · login-client (machine user) + PAT em /zitadel/bootstrap/login-client.pat │
# │  · feature LoginV2 (ZITADEL_DEFAULTINSTANCE_FEATURES_LOGINV2_REQUIRED=true) │
# │  · OIDC default URLs (DefaultLoginUrlV2 → http://localhost:5174/login?…)    │
# └──────────────────────────────────────────────────────────────────────────────┘
#
# ┌─ O que é responsabilidade DESTE SCRIPT (estado de aplicação) ───────────────┐
# │  · Nome da org    → "GROUP WS"                                              │
# │  · Domínio primário → "group-ws.localhost"                                   │
# │  · Projeto "TKWS OS"                                                        │
# │  · App OIDC "Web" (PKCE público, JWT, role assertion ON, redirect 5173)     │
# │  · 5 roles do projeto: system_admin, org_admin, comercial_atendimento,      │
# │    comercial_proposta, default                                              │
# │  · Sync VITE_ZITADEL_CLIENT_ID em frontend/.env.local + login/.env.local    │
# └──────────────────────────────────────────────────────────────────────────────┘
#
# ┌─ O que é DELIBERADAMENTE não-gerenciado pelo seed ──────────────────────────┐
# │  · UserGrant de roles a usuários humanos (atribuído manual ou via invite)   │
# │  · IDPs externos (Google, GitHub, etc) — adicionar quando for usar          │
# │  · SMTP custom (hoje aponta para Mailpit do compose · localhost:1025)       │
# │  · Policies (login, password complexity, lockout, label) — usam defaults    │
# │    da instância. Se for customizar branding/MFA, adicionar funções aqui.    │
# │  · Private key do login-client (JWT profile) — hoje usa só PAT              │
# │  · Promover login-client a ORG_OWNER — passo manual UMA vez (ver           │
# │    docs/04-AUTH.md § "Reset Zitadel do zero")                               │
# └──────────────────────────────────────────────────────────────────────────────┘
#
# Uso:
#   scripts/zitadel-seed.sh                 # aplica configuração
#   scripts/zitadel-seed.sh --dry-run       # mostra o que faria
#   scripts/zitadel-seed.sh --print-state   # imprime estado atual + diff
#
# Idempotente: roda múltiplas vezes sem duplicar.
#
# Pré-requisito: containers UP (`docker compose up -d`), Zitadel saudável,
# arquivo `docker/zitadel/login-client.pat` populado (rode `scripts/extract-login-pat.sh`
# após `docker compose up -d` se não existir).
#
# Ver docs/04-AUTH.md § "Reset Zitadel do zero" e ADR-015.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAT_FILE="$ROOT_DIR/docker/zitadel/login-client.pat"
ZITADEL_BASE="${ZITADEL_BASE:-http://localhost:8088}"

# ── Estado declarativo · alterar aqui se mudar o nome/domínio do tenant TKWS ─
ORG_NAME="GROUP WS"
ORG_PRIMARY_DOMAIN="group-ws.localhost"
PROJECT_NAME="TKWS OS"
APP_NAME="Web"
REDIRECT_URI_FRONTEND="http://localhost:5173/callback"
POST_LOGOUT_URIS=("http://localhost:5173" "http://localhost:5173/")
ALLOWED_ORIGINS=("http://localhost:5173")
TKWS_ROLES=(
  "system_admin:Administrador da plataforma TKWS"
  "org_admin:Administrador do escritório"
  "comercial_atendimento:Atendimento Comercial"
  "comercial_proposta:Proposta Comercial"
  "default:Usuário básico · vê apenas os próprios dados"
)

DRY_RUN=false
PRINT_STATE=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --print-state) PRINT_STATE=true ;;
    *) echo "Flag desconhecida: $arg" >&2; exit 2 ;;
  esac
done

# ──────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────

red()    { printf '\033[31m%s\033[0m\n' "$*" >&2; }
green()  { printf '\033[32m%s\033[0m\n' "$*" >&2; }
yellow() { printf '\033[33m%s\033[0m\n' "$*" >&2; }
gray()   { printf '\033[90m%s\033[0m\n' "$*" >&2; }

need() { command -v "$1" >/dev/null 2>&1 || { red "Falta dependência: $1"; exit 1; }; }
need curl
need jq

if [[ ! -f "$PAT_FILE" ]]; then
  red "PAT não encontrado em $PAT_FILE"
  echo "Rode: scripts/extract-login-pat.sh   (puxa o PAT do volume do Zitadel)"
  exit 1
fi
PAT="$(tr -d '[:space:]' < "$PAT_FILE")"

# Resolve a org do PAT (1ª chamada confirma que o token é válido)
ME_JSON=$(curl -fsS "$ZITADEL_BASE/auth/v1/users/me" \
  -H "Authorization: Bearer $PAT" 2>/dev/null) || {
    red "Token inválido ou Zitadel inacessível em $ZITADEL_BASE"
    echo "  Confira: docker compose ps zitadel"
    exit 1
}
ORG_ID="$(echo "$ME_JSON" | jq -r '.user.details.resourceOwner')"
green "✓ Conectado · org=$ORG_ID  user=$(echo "$ME_JSON" | jq -r '.user.userName')"

zhdrs=(-H "Authorization: Bearer $PAT" -H "Content-Type: application/json" -H "x-zitadel-orgid: $ORG_ID")

# mgmt: chama Management API. Logs vão pra stderr; stdout é o body JSON (ou vazio).
# Em caso de erro: retorna código != 0 (curl -fsS já trata) — caller decide o que fazer.
mgmt() {
  local method="$1" path="$2" body="${3:-}"
  if $DRY_RUN && [[ "$method" != "GET" && "$path" != *"/_search" && "$path" != "/auth/v1/users/me" ]]; then
    yellow "[dry-run] $method $path  body=$body"
    echo '{"dryRun":true}'
    return 0
  fi
  if [[ -n "$body" ]]; then
    curl -fsS -X "$method" "$ZITADEL_BASE$path" "${zhdrs[@]}" -d "$body"
  else
    curl -fsS -X "$method" "$ZITADEL_BASE$path" "${zhdrs[@]}"
  fi
}

# mgmt_or_warn: como mgmt mas captura 403/400 e emite aviso amigável.
# Retorna 0 mesmo em erro (caller continua); stdout vazio se falhou.
mgmt_or_warn() {
  local method="$1" path="$2" body="${3:-}" action="$4"
  local out err
  out="$(mgmt "$method" "$path" "$body" 2>/tmp/zseed-err)" && {
    echo "$out"
    return 0
  }
  err="$(cat /tmp/zseed-err)"; rm -f /tmp/zseed-err
  if grep -q "403\|PERMISSION_DENIED\|PermissionDenied" <<< "$err"; then
    yellow "⚠ $action · 403 negado pelo Zitadel"
    yellow "  Causa típica: o PAT atual ($PAT_FILE) é do login-client e tem permissão limitada."
    yellow "  Para automatizar criação/edição precisamos de um machine user com role ORG_OWNER."
    yellow "  Veja docs/04-AUTH.md § 'Reset Zitadel' para criar um seed-bot com ORG_OWNER."
  else
    yellow "⚠ $action falhou: $(echo "$err" | tail -1)"
  fi
  return 0
}

# ──────────────────────────────────────────────────────────────────────────
# 1. Organização · nome + domínio primário
# ──────────────────────────────────────────────────────────────────────────

ensure_org_name() {
  local current
  current="$(mgmt GET /management/v1/orgs/me 2>/dev/null | jq -r '.org.name // empty')"
  if [[ "$current" == "$ORG_NAME" ]]; then
    green "✓ Org já se chama '$ORG_NAME'"
    return 0
  fi
  yellow "+ Renomeando org de '${current:-?}' para '$ORG_NAME'"
  mgmt_or_warn PUT /management/v1/orgs/me \
    "{\"name\":\"$ORG_NAME\"}" \
    "renomear org para '$ORG_NAME'" > /dev/null
}

ensure_primary_domain() {
  local domains_json
  domains_json="$(mgmt POST /management/v1/orgs/me/domains/_search '{"queries":[]}' 2>/dev/null)"
  local primary current_primary
  primary="$(echo "$domains_json" | jq -r '.result[] | select(.isPrimary == true) | .domainName' 2>/dev/null)"
  current_primary="${primary:-}"

  if [[ "$current_primary" == "$ORG_PRIMARY_DOMAIN" ]]; then
    green "✓ Domínio primário já é '$ORG_PRIMARY_DOMAIN'"
    return 0
  fi

  # Existe mas não é primary?
  local exists
  exists="$(echo "$domains_json" | jq -r ".result[] | select(.domainName == \"$ORG_PRIMARY_DOMAIN\") | .domainName" 2>/dev/null)"
  if [[ -z "$exists" ]]; then
    yellow "+ Adicionando domínio '$ORG_PRIMARY_DOMAIN'"
    mgmt_or_warn POST /management/v1/orgs/me/domains \
      "{\"domain\":\"$ORG_PRIMARY_DOMAIN\"}" \
      "adicionar domínio '$ORG_PRIMARY_DOMAIN'" > /dev/null
  fi

  yellow "+ Definindo '$ORG_PRIMARY_DOMAIN' como primário (atual: '${current_primary:-nenhum}')"
  mgmt_or_warn POST "/management/v1/orgs/me/domains/_setprimary" \
    "{\"domain\":\"$ORG_PRIMARY_DOMAIN\"}" \
    "definir '$ORG_PRIMARY_DOMAIN' como primário" > /dev/null
}

# ──────────────────────────────────────────────────────────────────────────
# 2. Projeto "TKWS OS"
# ──────────────────────────────────────────────────────────────────────────

find_project_id() {
  mgmt POST /management/v1/projects/_search "{\"queries\":[{\"nameQuery\":{\"name\":\"$PROJECT_NAME\",\"method\":\"TEXT_QUERY_METHOD_EQUALS\"}}]}" \
    | jq -r '.result[0].id // empty'
}

ensure_project() {
  local id; id="$(find_project_id || true)"
  if [[ -n "$id" ]]; then
    green "✓ Projeto '$PROJECT_NAME' já existe · id=$id"
    ensure_project_role_assertion "$id"
    echo "$id"; return 0
  fi
  yellow "+ Criando projeto '$PROJECT_NAME'"
  local out
  out="$(mgmt_or_warn POST /management/v1/projects \
    "{\"name\":\"$PROJECT_NAME\",\"projectRoleAssertion\":true,\"projectRoleCheck\":false,\"hasProjectCheck\":false}" \
    "criar projeto '$PROJECT_NAME'")"
  id="$(echo "$out" | jq -r '.id // empty' 2>/dev/null || true)"
  if [[ -n "$id" ]]; then
    green "  ✓ Criado · id=$id"
  fi
  echo "$id"
}

# Garante projectRoleAssertion = true (necessário para o claim
# `urn:zitadel:iam:org:project:roles` ser emitido no JWT). Sem isso, mesmo
# com role grants e accessTokenRoleAssertion no app, o token vem sem roles
# e todo `@PreAuthorize` no backend retorna 403.
ensure_project_role_assertion() {
  local proj_id="$1"
  local detail
  detail="$(mgmt GET "/management/v1/projects/$proj_id" 2>/dev/null)"
  local current
  current="$(echo "$detail" | jq -r '.project.projectRoleAssertion // false' 2>/dev/null)"
  if [[ "$current" == "true" ]]; then
    green "  ✓ projectRoleAssertion já está ON"
    return 0
  fi
  yellow "  + Ligando projectRoleAssertion (necessário para JWT trazer claim de roles)"
  mgmt_or_warn PUT "/management/v1/projects/$proj_id" \
    "{\"name\":\"$PROJECT_NAME\",\"projectRoleAssertion\":true,\"projectRoleCheck\":false,\"hasProjectCheck\":false,\"privateLabelingSetting\":\"PRIVATE_LABELING_SETTING_UNSPECIFIED\"}" \
    "ligar projectRoleAssertion em '$PROJECT_NAME'" > /dev/null
}

# ──────────────────────────────────────────────────────────────────────────
# 3. App "Web" (OIDC public PKCE)
# ──────────────────────────────────────────────────────────────────────────

find_app_id() {
  local proj_id="$1"
  mgmt POST "/management/v1/projects/$proj_id/apps/_search" "{\"queries\":[{\"nameQuery\":{\"name\":\"$APP_NAME\",\"method\":\"TEXT_QUERY_METHOD_EQUALS\"}}]}" \
    | jq -r '.result[0].id // empty'
}

ensure_app() {
  local proj_id="$1"
  if [[ -z "$proj_id" ]]; then echo "|"; return 0; fi

  local app_id; app_id="$(find_app_id "$proj_id" || true)"
  local post_logout_json origins_json
  post_logout_json=$(printf '"%s",' "${POST_LOGOUT_URIS[@]}" | sed 's/,$//')
  origins_json=$(printf '"%s",' "${ALLOWED_ORIGINS[@]}" | sed 's/,$//')

  local body
  body=$(cat <<EOF
{
  "name": "$APP_NAME",
  "redirectUris": ["$REDIRECT_URI_FRONTEND"],
  "responseTypes": ["OIDC_RESPONSE_TYPE_CODE"],
  "grantTypes": ["OIDC_GRANT_TYPE_AUTHORIZATION_CODE"],
  "appType": "OIDC_APP_TYPE_WEB",
  "authMethodType": "OIDC_AUTH_METHOD_TYPE_NONE",
  "postLogoutRedirectUris": [$post_logout_json],
  "version": "OIDC_VERSION_1_0",
  "devMode": true,
  "accessTokenType": "OIDC_TOKEN_TYPE_JWT",
  "accessTokenRoleAssertion": true,
  "idTokenRoleAssertion": true,
  "idTokenUserinfoAssertion": true,
  "additionalOrigins": [$origins_json],
  "skipNativeAppSuccessPage": false
}
EOF
  )

  if [[ -n "$app_id" ]]; then
    green "✓ App '$APP_NAME' já existe · id=$app_id"
    gray "  (config OIDC não é re-aplicada · edite manualmente no Console se mudar)"
  else
    yellow "+ Criando app '$APP_NAME'"
    local out
    out="$(mgmt_or_warn POST "/management/v1/projects/$proj_id/apps/oidc" "$body" "criar app OIDC '$APP_NAME'")"
    app_id="$(echo "$out" | jq -r '.appId // empty' 2>/dev/null || true)"
    if [[ -n "$app_id" ]]; then
      green "  ✓ Criado · id=$app_id"
    fi
  fi

  # Lê client_id atual (não retornado no create de forma confiável)
  local client_id=""
  if [[ -n "$app_id" ]]; then
    client_id="$(mgmt POST "/management/v1/projects/$proj_id/apps/_search" \
      "{\"queries\":[{\"nameQuery\":{\"name\":\"$APP_NAME\",\"method\":\"TEXT_QUERY_METHOD_EQUALS\"}}]}" 2>/dev/null \
      | jq -r '.result[0].oidcConfig.clientId // empty' 2>/dev/null || true)"
  fi
  echo "${app_id}|${client_id}"
}

# ──────────────────────────────────────────────────────────────────────────
# 4. Roles do projeto
# ──────────────────────────────────────────────────────────────────────────

ensure_roles() {
  local proj_id="$1"
  if [[ -z "$proj_id" ]]; then return 0; fi

  local existing
  existing="$(mgmt POST "/management/v1/projects/$proj_id/roles/_search" '{"queries":[]}' 2>/dev/null \
    | jq -r '.result[]?.key' 2>/dev/null | sort -u)"

  for entry in "${TKWS_ROLES[@]}"; do
    local key="${entry%%:*}"
    local label="${entry#*:}"
    if echo "$existing" | grep -qx "$key"; then
      green "✓ Role '$key' já existe"
    else
      yellow "+ Criando role '$key' ($label)"
      mgmt_or_warn POST "/management/v1/projects/$proj_id/roles" \
        "{\"roleKey\":\"$key\",\"displayName\":\"$label\",\"group\":\"tkws\"}" \
        "criar role '$key'" > /dev/null
    fi
  done
}

# ──────────────────────────────────────────────────────────────────────────
# 5. Sincroniza VITE_ZITADEL_CLIENT_ID nos .env.local
# ──────────────────────────────────────────────────────────────────────────

sync_env_files() {
  local client_id="$1"
  local project_id="$2"
  local f
  for f in "$ROOT_DIR/frontend/.env.local" "$ROOT_DIR/login/.env.local"; do
    [[ -f "$f" ]] || continue
    _sync_env_var "$f" VITE_ZITADEL_CLIENT_ID  "$client_id"
    _sync_env_var "$f" VITE_ZITADEL_PROJECT_ID "$project_id"
  done
}

# Atualiza ou adiciona `KEY=VALUE` em um arquivo .env. Idempotente.
_sync_env_var() {
  local file="$1" key="$2" value="$3"
  if grep -q "^${key}=" "$file"; then
    if grep -q "^${key}=${value}\$" "$file"; then
      gray "  = $file já está com ${key}=${value}"
    else
      yellow "+ Atualizando ${key} em $file"
      # macOS BSD sed exige sufixo no -i
      sed -i.bak "s|^${key}=.*|${key}=${value}|" "$file"
      rm -f "${file}.bak"
    fi
  else
    echo "${key}=${value}" >> "$file"
    green "  + Adicionado ${key}=${value} em $file"
  fi
}

# ──────────────────────────────────────────────────────────────────────────
# Run
# ──────────────────────────────────────────────────────────────────────────

print_state() {
  echo ""
  echo "═════════════════════════════════════════════════════════════════"
  echo "  Estado atual do Zitadel · org=$ORG_ID"
  echo "═════════════════════════════════════════════════════════════════"

  echo ""
  echo "▸ Organização"
  mgmt GET /management/v1/orgs/me 2>/dev/null \
    | jq -r '.org | "  name:           \(.name)\n  primary_domain: \(.primaryDomain)\n  state:          \(.state)"'

  echo ""
  echo "▸ Domínios"
  mgmt POST /management/v1/orgs/me/domains/_search '{"queries":[]}' 2>/dev/null \
    | jq -r '.result[]? | "  - \(.domainName) (primary=\(.isPrimary), verified=\(.isVerified))"'

  echo ""
  echo "▸ Membros da org"
  mgmt POST /management/v1/orgs/me/members/_search '{}' 2>/dev/null \
    | jq -r '.result[]? | "  - \(.preferredLoginName) (\(.displayName)) · roles=\(.roles | join(","))"'

  echo ""
  echo "▸ Users (humanos + machines)"
  mgmt POST /management/v1/users/_search '{"queries":[]}' 2>/dev/null \
    | jq -r '.result[]? | "  - \(.userName) · type=\(if .machine then "machine" else "human" end)"'

  echo ""
  echo "▸ Projetos"
  mgmt POST /management/v1/projects/_search '{"queries":[]}' 2>/dev/null \
    | jq -r '.result[]? | "  - \(.name) (id=\(.id), state=\(.state))"'

  local proj_id
  proj_id="$(find_project_id || true)"
  if [[ -n "$proj_id" ]]; then
    echo ""
    echo "▸ Apps do projeto '$PROJECT_NAME'"
    mgmt POST "/management/v1/projects/$proj_id/apps/_search" '{}' 2>/dev/null \
      | jq -r '.result[]? | "  - \(.name) · client_id=\(.oidcConfig.clientId // "?") · redirect=\(.oidcConfig.redirectUris // [] | join(","))"'

    echo ""
    echo "▸ Roles do projeto '$PROJECT_NAME'"
    local roles
    roles="$(mgmt POST "/management/v1/projects/$proj_id/roles/_search" '{"queries":[]}' 2>/dev/null \
      | jq -r '.result[]? | "  - \(.key) · \"\(.displayName)\""')"
    if [[ -z "$roles" ]]; then
      yellow "  (nenhuma role criada · esperado: ${#TKWS_ROLES[@]} · gap de ORG_OWNER do PAT)"
    else
      echo "$roles"
    fi
  fi

  echo ""
  echo "▸ IDPs externos"
  local idps
  idps="$(mgmt POST /management/v1/idps/_search '{}' 2>/dev/null | jq -r '.result[]?.name')"
  if [[ -z "$idps" ]]; then echo "  (nenhum)"; else echo "$idps" | sed 's/^/  - /'; fi

  echo "═════════════════════════════════════════════════════════════════"
}

if $PRINT_STATE; then
  print_state
  exit 0
fi

# 1. Org (nome + domínio primário)
ensure_org_name
ensure_primary_domain

# 2-4. Projeto + App + Roles
PROJ_ID="$(ensure_project)"
APP_OUT="$(ensure_app "$PROJ_ID")"
APP_ID="${APP_OUT%%|*}"
CLIENT_ID="${APP_OUT##*|}"
ensure_roles "$PROJ_ID"

# 5. Sync .env
if [[ -n "$CLIENT_ID" && "$CLIENT_ID" != "null" ]]; then
  echo ""
  green "═══════════════════════════════════════════════════"
  green "  $PROJECT_NAME no Zitadel"
  green "    org_id     : $ORG_ID  ($ORG_NAME)"
  green "    project_id : $PROJ_ID"
  green "    app_id     : $APP_ID"
  green "    client_id  : $CLIENT_ID"
  green "═══════════════════════════════════════════════════"
  if ! $DRY_RUN; then
    sync_env_files "$CLIENT_ID" "$PROJ_ID"
  fi
fi

green "✓ Seed concluído"
gray "  Para inspecionar o estado completo: $0 --print-state"
