package com.groupws.tkws.shared.web.tenant;

import java.util.Objects;

/**
 * Contexto multi-tenant da request atual.
 *
 * Resolvido pelo {@link CurrentTenantArgumentResolver} a partir do JWT
 * (claim `urn:zitadel:iam:user:resourceowner:id`) ou do header
 * `X-Tenant-Id` quando a role atual permite (SYSTEM_ADMIN).
 *
 * `tenantId` é o BIGINT local (PK em tenants.id). `zitadelOrgId` é o
 * identificador opaco da org no Zitadel (snowflake string) usado para
 * resolver o tenant — guardamos separado pra evitar acoplar a PK local
 * ao formato do Zitadel.
 *
 * Use sempre via parâmetro de controller anotado com {@link CurrentTenant} —
 * **nunca aceite tenantId em query param ou body**. Isso evita escalonamento
 * cross-tenant via parâmetro adulterado pelo cliente.
 */
public record TenantContext(long tenantId, String zitadelOrgId) {

    public TenantContext {
        if (tenantId <= 0) {
            throw new IllegalArgumentException("tenantId deve ser positivo · recebeu: " + tenantId);
        }
        Objects.requireNonNull(zitadelOrgId, "zitadelOrgId");
    }
}
