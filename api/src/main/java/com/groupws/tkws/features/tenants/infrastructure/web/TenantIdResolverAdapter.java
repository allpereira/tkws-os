package com.groupws.tkws.features.tenants.infrastructure.web;

import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import com.groupws.tkws.shared.web.tenant.TenantIdResolver;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Implementação do port {@link TenantIdResolver} usando o repositório de
 * Tenants.
 *
 * Cache simples em memória (ConcurrentHashMap) · o mapping
 * `zitadel_org_id → tenant_id` (BIGINT) é estável durante o ciclo de vida
 * do tenant. Invalidação acontece naturalmente quando o processo reinicia.
 * Não há suporte a `tenant deletion` no momento; quando vier, esse cache
 * precisa de TTL ou bus de invalidação.
 */
@Component
class TenantIdResolverAdapter implements TenantIdResolver {

    private final TenantRepository tenantRepository;
    private final ConcurrentHashMap<String, Long> cache = new ConcurrentHashMap<>();

    TenantIdResolverAdapter(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    @Override
    public Optional<Long> resolveByZitadelOrgId(String zitadelOrgId) {
        if (zitadelOrgId == null || zitadelOrgId.isBlank()) {
            return Optional.empty();
        }
        Long cached = cache.get(zitadelOrgId);
        if (cached != null) {
            return Optional.of(cached);
        }
        return tenantRepository.findByZitadelOrgId(zitadelOrgId)
            .map(tenant -> {
                long id = tenant.id().value();
                cache.put(zitadelOrgId, id);
                return id;
            });
    }
}
