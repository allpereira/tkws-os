# 11 — Cofre de Segredos Críticos

> **Perder qualquer segredo desta lista significa não conseguir recuperar dados em desastre.**
> Trate este documento como crítico. Imprima e guarde fora do sistema.

## Princípios

1. **3 cópias, 2 mídias, 1 offsite** — igual backup de dados
2. **Cofre é diferente de senha gerenciador** — segredos críticos vão em **AMBOS**, não só num
3. **Acesso fora de banda** — não confie só em coisas que dependem do produto que você está protegendo
4. **Rotação periódica** — alguns segredos precisam ser trocados anualmente

## Inventário de segredos críticos

### Tier 1 — Perda significa não recuperar dados

| Segredo | O que protege | Tamanho | Rotação |
|---|---|---|---|
| `ZITADEL_MASTERKEY` | Criptografia de toda base de auth (usuários, MFA, sessões) | 32 chars exatos | **Nunca rotacionar sem migração planejada** |
| AWS root credentials | Controle total da conta AWS | N/A | Após qualquer suspeita |
| Domínio (Registro.br/registrar login) | Controle do `tkws.com.br` | N/A | A cada 12 meses |

### Tier 2 — Perda causa downtime mas recupera

| Segredo | O que protege | Rotação |
|---|---|---|
| Senha do banco (RDS) | Acesso à aplicação | 12 meses ou após incidente |
| Zitadel admin password | Acesso ao painel Zitadel | 6 meses |
| SSH keys da EC2 | Acesso ao servidor | Após qualquer suspeita |
| GitHub PATs | CI/CD e deploys | 90 dias |
| Cloudflare API token | Gerenciamento DNS/Pages | 90 dias |
| `IAM` access keys (se usar) | API AWS | 90 dias |

### Tier 3 — Operacional, fácil rotacionar

| Segredo | O que protege |
|---|---|
| Sentry DSN | Tracking de erros |
| Outras API keys de SaaS | Variável |

## Onde guardar cada Tier

### Tier 1 — REDUNDÂNCIA OBRIGATÓRIA

Mínimo **3 locais independentes**:

1. **1Password** (vault "TKWS OS Critical") — cópia principal de trabalho
2. **AWS Secrets Manager** (region sa-east-1, KMS key dedicada) — cópia operacional
3. **Offline físico** — papel impresso, envelope lacrado, num cofre físico **fora do escritório**

⚠️ **Se você só tem em 1Password e perde acesso ao 1Password = perdeu tudo.** O offline físico
existe pra isso.

### Tier 2 — Redundância suficiente

Mínimo **2 locais**:

1. **1Password** (vault "TKWS OS Ops")
2. **GitHub Secrets** (pro CI/CD usar)

### Tier 3 — 1Password basta

## A ZITADEL_MASTERKEY — instruções específicas

### O que é

Chave de 32 caracteres usada para criptografar **todos** os dados sensíveis no banco do Zitadel:
- Hashes de senhas
- Tokens de refresh
- Backup codes de MFA
- Chaves privadas de signing
- Dados de SSO providers configurados

**Sem a masterkey, o backup do banco do Zitadel não vale nada.** Os dados estão lá mas estão
cifrados.

### Geração

Gera **uma vez por ambiente** (staging e prod separadas):

```bash
# 32 caracteres hex (recomendado pela documentação Zitadel)
openssl rand -hex 16

# Ou alfanumérico
openssl rand -base64 24 | head -c 32
```

### Armazenamento (siga TODOS os passos)

#### Passo 1 — Imediato (mesmo dia da geração)

1. Cola no 1Password vault `TKWS OS Critical` com nome `ZITADEL_MASTERKEY_PROD` (ou `_STAGING`)
2. Cola no AWS Secrets Manager:
   ```bash
   aws secretsmanager create-secret \
     --name tkws/prod/zitadel-masterkey \
     --secret-string "$MASTERKEY" \
     --region sa-east-1 \
     --kms-key-id <kms-key-arn>
   ```
3. Adiciona ao `.env.prod` do servidor (`/opt/tkws-os/.env.prod`, permissões 600)
4. Adiciona ao GitHub Secret `ZITADEL_MASTERKEY_PROD` (caso deploy precise referenciar)

#### Passo 2 — Mesma semana

5. Imprime em papel sulfite (sem watermark de impressora se possível, mas não é crítico)
6. Coloca em envelope lacrado com:
   - Data
   - Nome do segredo (`ZITADEL_MASTERKEY_PROD`)
   - Instrução de uso ("Veja docs/11-SECRETS-VAULT.md no repo tkws-os")
7. Guarda em cofre físico (residência E não-residência: cópias em locais diferentes)
8. **Não compartilhe com mais ninguém ainda** — você é solo

#### Passo 3 — Quando time crescer

9. Cria envelope adicional pra co-fundador/sócio com acesso emergencial
10. Documenta procedimento de "quem pode abrir o envelope" (ex.: dois sócios juntos, ou advogado em caso de incapacitação)

### Verificação mensal

**Primeiro domingo de cada mês**, valide que ainda tem acesso:

```bash
# Teste 1: 1Password vault acessível
op item get "ZITADEL_MASTERKEY_PROD" --vault "TKWS OS Critical"

# Teste 2: AWS Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id tkws/prod/zitadel-masterkey \
  --region sa-east-1 \
  --query SecretString --output text

# Teste 3: Confere que valores batem
# (não execute se for em terminal compartilhado)
```

Se um dos três falhar, **resolva no mesmo dia** — não é "depois". Falha em um ainda te deixa
com dois, mas se você ignora vai cair pra zero.

### Cenário: você perdeu acesso ao 1Password

1. Confere AWS Secrets Manager — recupera de lá
2. Atualiza 1Password com nova senha do gerenciador
3. Cria ADR/incident log documentando

### Cenário: você perdeu AWS

1. Confere 1Password — recupera de lá
2. Recria conta AWS, restaura backups
3. Re-popula Secrets Manager

### Cenário: catastrófico — perdeu 1Password E AWS

1. Vai até cofre físico, abre envelope
2. Recupera valor da masterkey
3. Re-popula 1Password (nova conta) e AWS

### Cenário: perdeu tudo (incluindo cofre físico)

Aceita perda total dos dados Zitadel. Os usuários precisarão **se cadastrar de novo**.
Dados de negócio no banco TKWS estão OK (criptografia diferente, masterkey diferente, se você
seguiu separação).

## Outros segredos Tier 1

### AWS root credentials

- **MFA hardware key** (YubiKey ou similar) — não confie em SMS/TOTP só
- Guarda credenciais root em 1Password vault separado (`AWS Root`)
- **Crie IAM user** (`allysson-admin`) e use ele no dia a dia, nunca o root
- Root só pra emergência (mudar billing, encerrar conta)

### Registro de domínio

- Login Registro.br no 1Password
- 2FA ativado
- Email de recuperação **fora do tkws.com.br** (gmail pessoal)
- **Auto-renovação ligada** com cartão de crédito pessoal (não corporativo que pode bloquear)

## Checklist mensal (primeiro domingo do mês)

- [ ] ZITADEL_MASTERKEY_PROD recuperável de 1Password
- [ ] ZITADEL_MASTERKEY_PROD recuperável de AWS Secrets Manager
- [ ] ZITADEL_MASTERKEY_STAGING recuperável de ambos
- [ ] AWS root credentials acessíveis com MFA
- [ ] Domínio com auto-renovação OK (verifica expiry)
- [ ] Cofre físico verificado (envelope intacto)
- [ ] Sem novos segredos críticos pendentes de cadastrar

## Anti-padrões

❌ Guardar masterkey **só** no `.env` do servidor
❌ Commitar `.env*` no Git
❌ Compartilhar masterkey via Slack/Email/WhatsApp
❌ Gerar masterkey nova "pra teste" e esquecer (cria masterkeys órfãs que cifram dados de teste irrecuperavelmente)
❌ Usar mesma masterkey em staging e prod (não é só prática ruim, gera confusão em incidente)
❌ Confiar só em uma cópia (1Password só) — falha técnica acontece
❌ Confiar só em digital — incêndio/ransomware atinge tudo digital
❌ Imprimir e deixar na gaveta do escritório (incêndio destrói)
