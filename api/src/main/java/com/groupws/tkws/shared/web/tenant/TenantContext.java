package com.groupws.tkws.shared.web.tenant;

import java.util.Objects;
import java.util.UUID;

/**
 * Contexto multi-tenant da request atual.
 *
 * Resolvido pelo {@link CurrentTenantArgumentResolver} a partir do JWT
 * (claim `urn:zitadel:iam:user:resourceowner:id`) ou do header
 * `X-Tenant-Id` quando a role atual permite (SYSTEM_ADMIN).
 *
 * Use sempre via parâmetro de controller anotado com {@link CurrentTenant} —
 * **nunca aceite tenantId em query param ou body**. Isso evita escalonamento
 * cross-tenant via parâmetro adulterado pelo cliente.
 */
public record TenantContext(UUID tenantId, String zitadelOrgId) {

    public TenantContext {
        Objects.requireNonNull(tenantId, "tenantId");
        Objects.requireNonNull(zitadelOrgId, "zitadelOrgId");
    }
}
