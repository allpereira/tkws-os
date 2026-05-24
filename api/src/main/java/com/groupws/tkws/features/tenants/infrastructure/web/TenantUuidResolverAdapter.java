package com.groupws.tkws.features.tenants.infrastructure.web;

import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import com.groupws.tkws.shared.web.tenant.TenantUuidResolver;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Implementação do port {@link TenantUuidResolver} usando o repositório de
 * Tenants.
 *
 * Cache simples em memória (ConcurrentHashMap) · o mapping
 * `zitadel_org_id → tenant_id` é estável durante o ciclo de vida do tenant.
 * Invalidação acontece naturalmente quando o processo reinicia. Não há
 * suporte a `tenant deletion` no momento; quando vier, esse cache precisa
 * de TTL ou bus de invalidação.
 */
@Component
class TenantUuidResolverAdapter implements TenantUuidResolver {

    private final TenantRepository tenantRepository;
    private final ConcurrentHashMap<String, UUID> cache = new ConcurrentHashMap<>();

    TenantUuidResolverAdapter(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    @Override
    public Optional<UUID> resolveByZitadelOrgId(String zitadelOrgId) {
        if (zitadelOrgId == null || zitadelOrgId.isBlank()) {
            return Optional.empty();
        }
        UUID cached = cache.get(zitadelOrgId);
        if (cached != null) {
            return Optional.of(cached);
        }
        return tenantRepository.findByZitadelOrgId(zitadelOrgId)
            .map(tenant -> {
                UUID uuid = tenant.id().value();
                cache.put(zitadelOrgId, uuid);
                return uuid;
            });
    }
}
