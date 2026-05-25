# 08 — Segurança & LGPD

> Segurança não é feature, é não-negociável desde o dia 1. LGPD é obrigação legal no Brasil.

## Modelo de ameaça (resumido)

| Ameaça | Mitigação |
|---|---|
| Vazamento de credenciais | Nenhum segredo no repo, secrets em GitHub Secrets/Vault |
| SQL injection | JPA parametrizado (nunca String concatenation), Bean Validation |
| XSS | React escapa por padrão, CSP no Caddy, sanitização em rich text |
| CSRF | Stateless JWT em header (não cookie), `csrf().disable()` |
| Force brute em login | Rate limiting no Zitadel, lockout após 5 tentativas |
| Sequestro de sessão | HTTPS obrigatório, JWT curto (12h), refresh com rotação |
| Privilege escalation | RBAC via `@PreAuthorize`, ArchUnit valida fronteiras |
| Cross-tenant data leak | RLS no Postgres + filtro `tenant_id` na app |
| Ransomware | Backups versionados em S3, snapshots RDS, IAM restritivo |

## Checklist de segurança — obrigatório em toda feature

### Backend

- [ ] Endpoint exige autenticação (default — só health/swagger são públicos)
- [ ] Endpoint exige autorização adequada via `@PreAuthorize`
- [ ] Input validado com Bean Validation (`@Valid` + `@NotBlank`/`@Size`/`@Pattern`)
- [ ] Query usa parameter binding (sem `String.format`/concat em SQL)
- [ ] Erros não vazam stack trace para usuário final
- [ ] Logs não contêm PII completo (mascarar CPF/CNPJ, email parcial)
- [ ] Multi-tenant: queries filtram por `tenant_id` (ou RLS cuida)
- [ ] Endpoints de mutação são idempotentes ou validam duplicatas

### Frontend

- [ ] Input validado com Zod (mesmo que backend revalida)
- [ ] Output que vem do banco passa por React (escape automático)
- [ ] Rich text/HTML user-generated sanitizado com DOMPurify
- [ ] Tokens em `localStorage` aceitos (XSS no app significa fim) mas considere `httpOnly cookie`
- [ ] CSP configurado no Caddy (impede script externo)
- [ ] Não loga token ou dados sensíveis no console em produção

### Infra

- [ ] HTTPS obrigatório (Caddy + Let's Encrypt)
- [ ] Headers de segurança configurados (HSTS, X-Frame-Options, X-Content-Type-Options)
- [ ] Banco em subnet privada (sem IP público)
- [ ] Security Group restritivo (só portas necessárias)
- [ ] Backups criptografados (RDS encryption + S3 SSE)
- [ ] Secrets via env vars, nunca em código
- [ ] Imagens base atualizadas (Trivy scan no CI)

## Secrets management

### Tipos de segredo no projeto

| Segredo | Onde fica em prod | Onde NÃO fica |
|---|---|---|
| Senha do banco | `.env.prod` no servidor (perm 600) | Git, Slack, Email |
| Zitadel masterkey | `.env.prod` + 1Password | Git, logs |
| JWT signing key | Gerenciado pelo Zitadel (em banco) | Git, logs |
| AWS credentials | IAM Role da EC2 (sem chaves estáticas) | Git, .env |
| SSH private key | GitHub Secrets (cifrada) | Git |
| Sentry DSN | `.env.prod` (não é tão sensível, mas evite vazar) | Git público |

### Rotação de segredos

| Segredo | Cadência |
|---|---|
| Senha do banco | A cada 12 meses ou após incidente |
| SSH keys da EC2 | Após qualquer suspeita de comprometimento |
| Zitadel admin password | A cada 6 meses |
| AWS access keys (se usadas) | A cada 90 dias |
| GitHub PATs | A cada 90 dias |

### O que fazer se um segredo vazou

1. **Rotaciona IMEDIATAMENTE** o segredo
2. Audita logs (CloudTrail, GitHub audit, etc) por uso suspeito
3. Se foi commitado no Git: rotaciona **+** considere reescrever histórico (git filter-repo)
4. Documenta incidente em `docs/incident-logs/`
5. Comunica usuários se houver risco de exposição de dados deles (LGPD: 72h)

## LGPD — Conformidade

### Princípios

O TKWS OS trata dados pessoais de:
- Usuários do sistema (nome, email, foto)
- Eventualmente: dados de leads no CRM (nome, contato)
- Dados profissionais dos arquitetos e seus clientes

Aplicar:
- **Finalidade:** só coletar dados necessários para função do sistema
- **Minimização:** menos campos = menos risco
- **Transparência:** termos de uso + política de privacidade visíveis
- **Acesso:** usuário pode solicitar exportação dos próprios dados
- **Correção:** usuário pode atualizar dados
- **Exclusão:** usuário pode solicitar deleção (com prazo legal de retenção)
- **Portabilidade:** exportação em formato estruturado (JSON)

### Mecanismos no código

#### Marcação de PII

Toda entidade JPA com dados pessoais documenta:

```java
@Entity
@Table(name = "users")
class UserJpaEntity {
    // @PII("identifier")
    String email;

    // @PII("name")
    String fullName;

    // @PII("biometric")  // se aplicável
    String avatarUrl;
}
```

(annotation `@PII` futura — por enquanto, documentar em comentário)

#### Auditoria

Tabela `audit_log` (a criar):
```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id BIGINT REFERENCES tenants(id),  -- ver ADR-021
    user_id UUID,
    action VARCHAR(100) NOT NULL,  -- CREATE_TENANT, UPDATE_USER, etc
    resource_type VARCHAR(100),
    resource_id UUID,
    changes JSONB,  -- antes/depois
    ip_address INET,
    user_agent TEXT,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_occurred ON audit_log(occurred_at);
```

Cada operação mutadora registra evento no `audit_log` (via Domain Events + listener).

#### Exportação de dados (Direito de acesso)

Use case futuro `ExportUserDataUseCase`:
1. Recebe `userId` (próprio usuário ou admin)
2. Coleta dados de todas tabelas que referenciam `user_id`
3. Gera JSON estruturado
4. Disponibiliza download seguro temporário

#### Anonimização (Direito ao esquecimento)

Em vez de DELETE (que quebra integridade), faz **anonimização**:

```sql
UPDATE users SET
    email = 'anonymized_' || id || '@deleted.local',
    full_name = 'Usuário Removido',
    avatar_url = NULL,
    active = false
WHERE id = ?;
```

Mantém audit trail mas remove identificação.

### DPO e contato

Definir antes de lançar:
- Email DPO: `dpo@tkws.com.br`
- Página de política de privacidade: `https://app.tkws.com.br/privacy`
- Página de termos de uso: `https://app.tkws.com.br/terms`

### Notificação de incidente

LGPD exige notificar ANPD e titulares em **prazo razoável** (72h boa prática) após incidente
com risco aos titulares. Procedimento em `docs/09-RUNBOOKS.md` seção "Vazamento de dados".

## Headers de segurança no Caddy

Já configurado em `Caddyfile.prod`:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

A adicionar quando frontend estabilizar:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.tkws.com.br https://auth.tkws.com.br
```

## Scan de vulnerabilidades

### CI: Trivy nos containers

Adicionar ao `.github/workflows/ci.yml`:

```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'ghcr.io/${{ github.repository }}/api:latest'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

### Dependabot

Já habilitado via GitHub. Atualiza dependências automaticamente.

### OWASP Dependency Check

Roda em `mvn verify` (via plugin no `pom.xml`). Adicionar quando crescer:

```xml
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>10.0.4</version>
    <executions>
        <execution><goals><goal>check</goal></goals></execution>
    </executions>
</plugin>
```

### Snyk (alternativa paga, free tier disponível)

Considere se tiver budget. Bom pra licenças.

## Rate limiting

A configurar no Caddy ou via Bucket4j no Spring:

```
- 100 req/min por IP em endpoints públicos
- 1000 req/min por usuário autenticado
- 10 tentativas de login/min por IP (Zitadel já faz)
```

## Princípios "boring security"

- **Less is more:** menos features, menos código, menos superfície de ataque
- **Default secure:** novas features começam restritas, abrem conforme necessidade
- **Defense in depth:** múltiplas camadas (CSP + escape + sanitize)
- **Audit early, audit often:** logs centralizados, alertas em padrões suspeitos
