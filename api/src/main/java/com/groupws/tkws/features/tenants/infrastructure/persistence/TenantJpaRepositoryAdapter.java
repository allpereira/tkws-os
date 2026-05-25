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
 *
 * O id é BIGINT IDENTITY · em INSERT entregamos null e lemos o id gerado
 * pelo Postgres após `save()`. O método {@link Tenant#assignIdIfTransient}
 * é então chamado para popular o id no agregado e disparar o evento de criação.
 */
@Repository
class TenantJpaRepositoryAdapter implements TenantRepository {

    private final TenantJpaRepository jpaRepository;

    TenantJpaRepositoryAdapter(TenantJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    /**
     * Salva o tenant preservando campos de V3 (status, requester data, etc.)
     * que ainda não existem no Aggregate Root.
     *
     * - Se o aggregate é transiente (id null), INSERT · o banco gera o id BIGINT
     *   e chamamos {@link Tenant#assignIdIfTransient} pra anexar o id e disparar
     *   `TenantCreatedEvent`.
     * - Se já tem id, carregamos o registro existente e atualizamos APENAS os
     *   campos que o domínio atual conhece (evita sobrescrever colunas do
     *   workflow de aprovação).
     */
    @Override
    public Tenant save(Tenant tenant) {
        if (tenant.isTransient()) {
            TenantJpaEntity entity = new TenantJpaEntity(
                tenant.zitadelOrgId(),
                tenant.name(),
                tenant.slug(),
                tenant.active(),
                tenant.createdAt(),
                tenant.updatedAt()
            );
            TenantJpaEntity saved = jpaRepository.save(entity);
            tenant.assignIdIfTransient(TenantId.of(saved.id));
            return tenant;
        }

        long id = tenant.id().value();
        TenantJpaEntity entity = jpaRepository.findById(id)
            .map(existing -> {
                existing.name      = tenant.name();
                existing.slug      = tenant.slug();
                existing.active    = tenant.active();
                existing.updatedAt = tenant.updatedAt();
                return existing;
            })
            .orElseThrow(() -> new IllegalStateException(
                "Tenant com id=" + id + " marcado como persistido mas não encontrado no banco"));

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
