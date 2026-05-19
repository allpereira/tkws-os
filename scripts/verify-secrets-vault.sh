#!/usr/bin/env bash
# Verifica que segredos críticos do TKWS OS estão acessíveis.
# Rodar todo primeiro domingo do mês (ver docs/11-SECRETS-VAULT.md).
#
# Uso: ./scripts/verify-secrets-vault.sh
#
# Não imprime os valores, apenas confirma que eles podem ser recuperados.

set -u

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAILED=0
WARNINGS=0

check() {
    local name="$1"
    local cmd="$2"

    echo -n "  → $name ... "
    if eval "$cmd" >/dev/null 2>&1; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${RED}FALHOU${NC}"
        FAILED=$((FAILED+1))
    fi
}

warn() {
    echo -e "${YELLOW}AVISO:${NC} $1"
    WARNINGS=$((WARNINGS+1))
}

echo "=== Verificação de Cofre de Segredos (TKWS OS) ==="
echo "Data: $(date '+%Y-%m-%d %H:%M:%S')"
echo

# 1Password CLI
echo "1Password (cofre TKWS OS Critical):"
if ! command -v op >/dev/null 2>&1; then
    warn "1Password CLI ('op') não instalado. Instale: brew install --cask 1password-cli"
else
    check "ZITADEL_MASTERKEY_PROD" "op item get 'ZITADEL_MASTERKEY_PROD' --vault 'TKWS OS Critical'"
    check "ZITADEL_MASTERKEY_STAGING" "op item get 'ZITADEL_MASTERKEY_STAGING' --vault 'TKWS OS Critical'"
    check "AWS Root Credentials" "op item get 'AWS Root' --vault 'TKWS OS Critical'"
    check "Registro.br Login" "op item get 'Registro.br' --vault 'TKWS OS Critical'"
fi
echo

# AWS Secrets Manager
echo "AWS Secrets Manager (sa-east-1):"
if ! command -v aws >/dev/null 2>&1; then
    warn "AWS CLI não instalado."
else
    check "tkws/prod/zitadel-masterkey" "aws secretsmanager describe-secret --secret-id tkws/prod/zitadel-masterkey --region sa-east-1"
    check "tkws/staging/zitadel-masterkey" "aws secretsmanager describe-secret --secret-id tkws/staging/zitadel-masterkey --region sa-east-1"
fi
echo

# Verificação manual
echo "Verificação manual (você deve fazer agora):"
echo "  [ ] Envelope físico do cofre verificado (intacto, data correta)?"
echo "  [ ] Cofre em local secundário (não-residência) verificado?"
echo "  [ ] Domínio tkws.com.br com auto-renovação ativada?"
echo "  [ ] MFA hardware key (YubiKey) funciona pra AWS root?"
echo

echo "=== Resumo ==="
if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ Todos os segredos críticos estão acessíveis.${NC}"
    exit 0
elif [ $FAILED -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS aviso(s). Verifica e resolve.${NC}"
    exit 0
else
    echo -e "${RED}✗ $FAILED falha(s) crítica(s). Resolve HOJE.${NC}"
    echo
    echo "Próximos passos:"
    echo "  1. Identifica qual segredo não está acessível"
    echo "  2. Restaura usando outro local que ainda funciona"
    echo "  3. Investiga causa (senha esquecida, MFA perdido, etc)"
    echo "  4. Cria incident log em docs/incident-logs/"
    exit 1
fi
