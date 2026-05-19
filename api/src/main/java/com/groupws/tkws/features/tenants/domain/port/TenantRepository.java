package com.groupws.tkws.features.tenants.domain.port;

import com.groupws.tkws.features.tenants.domain.model.Tenant;
import com.groupws.tkws.features.tenants.domain.model.TenantId;

import java.util.Optional;

/**
 * Port (interface) que o domínio expõe para persistência de Tenants.
 * Implementação concreta vive em infrastructure/persistence.
 */
public interface TenantRepository {

    Tenant save(Tenant tenant);

    Optional<Tenant> findById(TenantId id);

    Optional<Tenant> findBySlug(String slug);

    Optional<Tenant> findByZitadelOrgId(String zitadelOrgId);

    boolean existsBySlug(String slug);

    boolean existsByZitadelOrgId(String zitadelOrgId);
}
