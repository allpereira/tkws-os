# ADR-019 — Tenant context resolvido do JWT, nunca de query/body

**Status:** Aceito
**Data:** 2026-05-23
**Decisores:** Allysson Pereira

## Contexto

> **Atualização 2026-05-24**: após [ADR-021](ADR-021-tenant-id-bigint.md), o
> tipo do `tenantId` mudou de `UUID` para `long` (BIGINT). O resto desta ADR
> permanece válido — só os tipos foram atualizados: `TenantContext(long, String)`,
> port renomeado `TenantUuidResolver` → `TenantIdResolver`.

A versão inicial da feature `pessoas` recebia `tenantId` como `@RequestParam UUID tenantId` em todos os endpoints. Isso é um anti-pattern de segurança:

1. **Adulteração trivial**: o cliente controla o valor, pode passar id de outro tenant e tentar acesso cruzado. Sem validação extra, vira escalonamento.
2. **Cache poisoning**: query params aparecem em logs/access logs/cache HTTP. Tenant identification não deveria vazar lá.
3. **Duplicação**: 100% dos endpoints precisam repetir o mesmo parâmetro.
4. **Confusão semântica**: tenantId é *contexto* da request (quem está chamando), não *input* da operação (o que está sendo feito).

Em multi-tenancy bem feita, o tenant é deduzido do **identity provider**, não da request HTTP arbitrária. No nosso caso, o Zitadel já carrega o `org_id` do usuário no JWT — basta ler de lá.

## Decisão

**Tenant é resolvido por `@CurrentTenant TenantContext` em parâmetro de controller.** Nunca via query param ou body.

A resolução segue esta ordem:

1. **JWT-first**: lê o claim `urn:zitadel:iam:user:resourceowner:id` (padrão do Zitadel para "organização do usuário"). Faz lookup `zitadel_org_id → tenant_id (BIGINT local)` via `TenantIdResolver` (cacheado em memória).

   Como o claim pode não vir no JWT (depende do app Zitadel ter "User Info inside Access Token" habilitado), há fallback: se o JWT não trouxer, o backend consulta `/oidc/v1/userinfo` no Zitadel com o próprio access token do usuário (ver `ZitadelOrgIdFromUserInfoClient`).

2. **Header `X-Tenant-Id` override**: se a request traz esse header E o usuário tem role `SYSTEM_ADMIN`, usa o header como fonte. Permite system admin atuar em qualquer tenant sem precisar trocar de organização no Zitadel.

3. **Erro 422** (`MissingTenantContextException`): JWT sem claim e sem header.

4. **Erro 403** (`TenantAccessDeniedException`): header foi passado mas o usuário não é SYSTEM_ADMIN.

```java
@PostMapping
@PreAuthorize("hasAnyRole('ORG_ADMIN', 'PROJECT_MANAGER')")
public ResponseEntity<PessoaView> create(
    @CurrentTenant TenantContext tenant,
    @Valid @RequestBody CreatePessoaRequest request
) {
    return ResponseEntity.ok(createPessoa.execute(request.toCommand(tenant.tenantId())));
}
```

O `CreatePessoaRequest` (body) **não tem campo `tenantId`** — ele é injetado pelo `.toCommand(tenantId)` usando o tenant resolvido.

## Componentes

| Tipo | Local | Responsabilidade |
|---|---|---|
| `TenantContext` (record) | `shared/web/tenant/` | `(tenantId long, zitadelOrgId String)` |
| `@CurrentTenant` (annotation) | `shared/web/tenant/` | Marca parâmetro de controller |
| `CurrentTenantArgumentResolver` | `shared/web/tenant/` | Resolve a partir do JWT/header (e fallback UserInfo) |
| `TenantIdResolver` (port) | `shared/web/tenant/` | `zitadel_org_id → tenant_id (BIGINT)` |
| `TenantIdResolverAdapter` | `features/tenants/infrastructure/web/` | Implementa o port via `TenantRepository` + cache |
| `ZitadelOrgIdFromUserInfoClient` | `features/users/web/` | Fallback `/oidc/v1/userinfo` quando claim não vem no JWT |
| `MissingTenantContextException` | `shared/web/tenant/` | 422 Unprocessable Entity |
| `TenantAccessDeniedException` | `shared/web/tenant/` | 403 Forbidden |
| `TenantWebMvcConfig` | `shared/web/tenant/` | Registra o resolver no Spring MVC |

## Alternativas consideradas

### A) `@RequestParam UUID tenantId` (REJEITADO) ❌
Anti-pattern já descrito. Era o estado inicial. Hoje, com BIGINT (ADR-021), o tipo seria `long` mas o vetor de ataque é idêntico — não é o tipo do id, é o canal (query/body) que é o problema.

### B) `@RequestHeader X-Tenant-Id` sempre obrigatório (REJEITADO)
- Cliente esquece, requests falham.
- Não tira vantagem do JWT que já carrega org_id.

### C) `ThreadLocal<TenantContext>` populado por filtro (REJEITADO)
- Funciona mas é mágico. Esconde a dependência. Difícil de testar (precisa de filter chain).
- `ArgumentResolver` é explícito e idiomático em Spring.

### D) JWT-first + header override por SYSTEM_ADMIN (ACEITO) ✓
- Padrão seguro (JWT, assinado pelo Zitadel).
- Permite admins multi-tenant.
- Explícito nos controllers.

## Consequências

### Positivas
- **Segurança**: cliente não pode adulterar tenant arbitrariamente.
- **Logs limpos**: tenant não vaza em query params.
- **Auditável**: header override de SYSTEM_ADMIN sempre fica no body do request (audit log futuro pode anotar quando há `zitadelOrgId.startsWith("system-admin-override")`).
- **Conciso**: controllers ficam livres do parâmetro repetido.

### Negativas
- Testes precisam mockar JWT/SecurityContext. Use `@WithMockUser` ou helper de teste futuro.
- Quando rodar via `curl` sem JWT, precisa passar header `X-Tenant-Id` E ter role SYSTEM_ADMIN no SecurityContext (em testes/dev).

### Trade-offs
- Cache em memória do `TenantIdResolverAdapter` não tem TTL ou invalidação. Aceitável porque tenants não mudam de `zitadel_org_id`. Se for deletar tenant um dia, precisamos de bus de invalidação.
- O fallback `/userinfo` adiciona uma chamada HTTP extra ao Zitadel quando o claim não vem no JWT. Mitigação: cacheado por subject; resolução normal (JWT-first) não paga esse custo.

## Aplicação retroativa

`PessoaController` foi o primeiro a usar `@CurrentTenant`. Demais controllers existentes (`TenantController`, `InviteController`, `UserController`) **não** foram migrados nesta PR porque ainda não usam multi-tenancy explícita (manipulam dados de admin). Migração futura quando começarem a operar sobre dados scoped por tenant.

**Regra a partir desta PR:** todo controller novo que opere em dados scoped por tenant DEVE usar `@CurrentTenant`. ArchUnit pode reforçar isso futuramente.

## Relacionado

- [ADR-021](ADR-021-tenant-id-bigint.md) · `tenants.id` como BIGINT (tipo do `tenantId`)
- [ADR-018](ADR-018-pessoas-unificadas.md) · Pessoas unificadas
- [ADR-004](ADR-004-zitadel-auth.md) · Zitadel como IdP
- [docs/04-AUTH.md](../04-AUTH.md) · Fluxo de autenticação (§ 4.1 traz o scope OIDC necessário para o claim)
- [docs/08-SECURITY.md](../08-SECURITY.md) · Modelo de segurança
