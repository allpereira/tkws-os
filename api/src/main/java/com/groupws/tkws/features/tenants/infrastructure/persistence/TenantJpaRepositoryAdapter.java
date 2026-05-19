package com.groupws.tkws.features.tenants.infrastructure.persistence;

import com.groupws.tkws.features.tenants.domain.model.Tenant;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Adapter de persistência: implementa o port TenantRepository do domínio
 * usando Spring Data JPA por baixo.
 *
 * É aqui que acontece a conversão Domain Model ↔ JPA Entity.
 */
@Repository
class TenantJpaRepositoryAdapter implements TenantRepository {

    private final TenantJpaRepository jpaRepository;

    TenantJpaRepositoryAdapter(TenantJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Tenant save(Tenant tenant) {
        TenantJpaEntity entity = toEntity(tenant);
        TenantJpaEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Tenant> findById(TenantId id) {
        return jpaRepository.findById(id.value()).map(this::toDomain);
    }

    @Override
    public Optional<Tenant> findBySlug(String slug) {
        return jpaRepository.findBySlug(slug).map(this::toDomain);
    }

    @Override
    public Optional<Tenant> findByZitadelOrgId(String zitadelOrgId) {
        return jpaRepository.findByZitadelOrgId(zitadelOrgId).map(this::toDomain);
    }

    @Override
    public boolean existsBySlug(String slug) {
        return jpaRepository.existsBySlug(slug);
    }

    @Override
    public boolean existsByZitadelOrgId(String zitadelOrgId) {
        return jpaRepository.existsByZitadelOrgId(zitadelOrgId);
    }

    // ============ Conversões ============

    private TenantJpaEntity toEntity(Tenant tenant) {
        return new TenantJpaEntity(
            tenant.id().value(),
            tenant.zitadelOrgId(),
            tenant.name(),
            tenant.slug(),
            tenant.active(),
            tenant.createdAt(),
            tenant.updatedAt()
        );
    }

    private Tenant toDomain(TenantJpaEntity entity) {
        return Tenant.reconstitute(
            TenantId.of(entity.id),
            entity.zitadelOrgId,
            entity.name,
            entity.slug,
            entity.active,
            entity.createdAt,
            entity.updatedAt
        );
    }
}
