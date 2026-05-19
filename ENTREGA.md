# TKWS OS — Pacote de documentação completa (v3)

> Entregue em 19/05/2026. Inclui revisões pre-launch:
> mobile (Capacitor), cofre de segredos, seed dev, feature flags, e onboarding com aprovação.

## Novidades desta versão

### Mobile (Capacitor) configurado desde o dia 1

- **CORS** ajustado em `docker-compose.prod.yml` e `staging.yml` pra aceitar
  `capacitor://localhost` (iOS) e `https://localhost` (Android)
- **Zitadel redirect URIs** documentados pra app Native com deep link `br.com.tkws.app://callback`
- **`docs/04-AUTH.md`** ganhou seção Mobile com instruções de plugin OIDC e deep linking
- **`docs/01-DEVELOPMENT.md`** ganhou seção Capacitor com setup completo (init, plataformas,
  plugins, workflow, build de produção)

### Cofre de Segredos Críticos

- **`docs/11-SECRETS-VAULT.md`** — política completa (Tier 1/2/3, redundância 1Password +
  AWS Secrets Manager + offline físico)
- **`scripts/verify-secrets-vault.sh`** — verificação mensal automatizada (1Password CLI +
  AWS Secrets Manager)
- Inclui cenários de recuperação (perdi 1Password / perdi AWS / catastrófico)

### Seed de desenvolvimento

- **`api/src/main/resources/db/migration/R__seed_dev.sql`** — migration repeatable que
  cria 2 tenants e 2 usuários **só em ambiente dev**
- **`application.yml`** com placeholder `environment` que bloqueia execução em
  staging/prod/test
- Idempotente (INSERT ... ON CONFLICT DO NOTHING)

### Feature flags

- **Tabela `feature_flags`** (`V2__feature_flags.sql`) com seed das 7 flags previstas
  (crm-leads-v1, orcamento-v1, etc)
- **`FeatureFlag` record + `FeatureFlagService`** com cache Caffeine (60s TTL)
- **`docs/12-FEATURE-FLAGS.md`** — guia completo de uso
- **`ADR-013`** — justificativa da escolha (interno vs Unleash/LaunchDarkly)
- Spring `@EnableCaching` ativado, deps Caffeine adicionadas ao `pom.xml`

### Onboarding com aprovação manual

- **Migration `V3__tenant_approval_workflow.sql`** — coluna `status` (PENDING/ACTIVE/
  REJECTED/SUSPENDED) + colunas de solicitante + timestamps
- **`TenantStatus` enum** no domínio
- **`TenantJpaEntity`** atualizada com novos campos
- **`docs/13-ONBOARDING.md`** — fluxo completo (endpoints, estados, SLA, implementação pendente)
- **`ADR-014`** — justificativa do híbrido vs self-service puro/manual

## Resumo do pacote atual

### Documentação para humanos (`docs/`)

**14 documentos** (adicionados 11, 12, 13):

| # | Arquivo | Propósito |
|---|---|---|
| 00 | ARCHITECTURE.md | Visão arquitetural |
| 01 | DEVELOPMENT.md | Setup, workflow, Capacitor (NEW) |
| 02 | TESTING.md | TDD, Testing Trophy |
| 03 | DEPLOY.md | AWS + Cloudflare Pages |
| 04 | AUTH.md | Zitadel + Mobile (NEW) |
| 05 | DESIGN-SYSTEM.md | ⚠️ Placeholder (aguarda HTML) |
| 06 | BACKUP-RECOVERY.md | Backup + DR |
| 07 | OBSERVABILITY.md | Logs + métricas |
| 08 | SECURITY.md | LGPD + secrets |
| 09 | RUNBOOKS.md | Playbooks operacionais |
| 10 | FEATURE-CHECKLIST.md | Criar feature passo a passo |
| **11** | **SECRETS-VAULT.md** | **Cofre de segredos críticos (NEW)** |
| **12** | **FEATURE-FLAGS.md** | **Sistema de feature flags (NEW)** |
| **13** | **ONBOARDING.md** | **Fluxo de onboarding com aprovação (NEW)** |

### ADRs (`docs/adr/`)

**14 ADRs** (adicionados 11, 12, 13, 14):

1. Clean Architecture + DDD tático
2. Backend em Java/Spring Boot
3. Frontend em React 19
4. Auth via Zitadel self-hosted
5. Cloud em AWS
6. Docker Compose puro (backend)
7. Multi-tenancy via discriminator + RLS
8. Testing Trophy
9. ArchUnit
10. TanStack Router
11. Monorepo único
12. Cloudflare Pages para frontend
13. **Feature flags via tabela + Caffeine (NEW)**
14. **Auto-cadastro com aprovação manual (NEW)**

## Status do design system

**⚠️ AINDA PENDENTE.** Anexa o HTML pela interface do chat (botão de clipe), e na próxima
conversa eu extraio tokens reais.

## Próximos passos práticos

### 1. Versionar tudo no Git

```bash
cd tkws-os
git init -b main
git add .
git commit -m "chore: initial scaffold with full documentation and pre-launch reviews"
gh repo create groupws/tkws-os --private --source=. --remote=origin --push
```

### 2. Configurar Zitadel masterkey IMEDIATAMENTE

Antes de qualquer outra coisa, gere e guarde a masterkey conforme `docs/11-SECRETS-VAULT.md`:

```bash
# Gera
openssl rand -hex 16
# Cola em 1Password (vault "TKWS OS Critical")
# Cola em AWS Secrets Manager
# Imprime e guarda em cofre físico
```

### 3. Configurar mobile no Zitadel (mesmo que mobile entre depois)

Já cria a aplicação Native no Zitadel agora. Mesmo que você só compile o app daqui a 3
meses, a config tá pronta:

1. Zitadel → Projetos → TKWS OS → Applications → New
2. Type: Native
3. Redirect URI: `br.com.tkws.app://callback`
4. Anota Client ID para usar quando começar o build mobile

### 4. Provisionar AWS + Cloudflare seguindo `docs/03-DEPLOY.md`

### 5. Primeiro deploy

`git push origin main` → Cloudflare builda frontend, GitHub Actions builda API.

### 6. Aprovação manual do primeiro tenant

Após Zitadel rodando, cria seu próprio tenant manualmente via Swagger
(`POST /api/v1/tenants` com role `system_admin`).

Ou aguarda a feature `onboarding-v1` (implementa endpoint público).

### 7. Primeira feature de negócio (CRM/Leads)

Usa `.ai/FEATURE-TEMPLATE.md` como prompt. Lembre de usar feature flag:

```java
if (!featureFlags.isEnabled("crm-leads-v1", tenantId)) {
    throw new FeatureNotAvailableException("crm-leads-v1");
}
```

E habilita pro seu próprio tenant via:
```sql
UPDATE feature_flags
SET enabled_for_tenants = ARRAY['<seu-tenant-uuid>'::uuid]
WHERE name = 'crm-leads-v1';
```

## Pendências conscientes (não bloqueiam início)

Estas são coisas que **decidimos deixar pra depois**:

1. **Termos de uso e política de privacidade** — bloqueante pra launch público, não pra começar
2. **Dashboard de aprovação de onboarding** — interface admin pode ser via SQL até ter tela
3. **CHANGELOG.md** — começa quando tiver primeira versão deployada
4. **CONTRIBUTING.md** — quando entrar outro dev
5. **Modelo de pricing/billing** — decisão de produto, não bloqueia código
6. **Tela de "Reportar problema"** — sugestão pro MVP, mas não bloqueante
7. **Ambiente de demo separado** — staging serve por enquanto

## Recomendações finais

### Antes de codar feature de negócio

1. ✅ Cofre de segredos configurado e validado
2. ✅ Domínio + Cloudflare + AWS provisionados
3. ✅ Pipelines CI/CD verdes
4. ✅ Você consegue logar no app em staging
5. ✅ Backup do banco testado pelo menos uma vez (não esperando emergência)

### Ritmo recomendado

**Mês 1:** Infraestrutura + auth + sua própria conta funcionando
**Mês 2:** CRM (Leads) — primeira feature de negócio
**Mês 3:** Onboarding endpoint + primeiro cliente real (você aprova manualmente)
**Mês 4:** Orçamento (depende de CRM)
**Mês 5:** Mobile (Capacitor) — código já está pronto pra empacotar
**Mês 6:** Catálogo de Produtos + Suprimentos

Esse é o seu roadmap implícito. Não está escrito em pedra. Está em pdf.
