package com.groupws.tkws.shared.web.tenant;

import java.util.Optional;
import java.util.UUID;

/**
 * Port (shared) para resolver `zitadel_org_id` → `tenant_id` (UUID local).
 *
 * Implementação concreta vive em `features/tenants/infrastructure/web/` e
 * consome o `TenantRepository` do domínio de tenants. Modelado como port
 * pra evitar que `shared/web/` acople em `features/tenants/`.
 *
 * Pode (e deve) ser cacheado · o mapping é estável durante o ciclo de vida
 * do tenant.
 */
public interface TenantUuidResolver {
    Optional<UUID> resolveByZitadelOrgId(String zitadelOrgId);
}
