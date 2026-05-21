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

    /**
     * Salva o tenant preservando campos de V3 (status, requester data, etc.)
     * que ainda não existem no Aggregate Root.
     *
     * Estratégia: se a entidade já existir no banco (update), carregamos o registro
     * existente e atualizamos APENAS os campos que o domínio atual conhece, evitando
     * sobrescrever colunas do workflow de aprovação (status, requested_at, etc.).
     *
     * Quando a feature `onboarding-v1` mapear esses campos no Aggregate Root,
     * este merge pode ser simplificado para um `toEntity()` direto.
     */
    @Override
    public Tenant save(Tenant tenant) {
        TenantJpaEntity entity = jpaRepository.findById(tenant.id().value())
            .map(existing -> {
                // Update: atualiza apenas campos conhecidos pelo domínio atual
                existing.name      = tenant.name();
                existing.slug      = tenant.slug();
                existing.active    = tenant.active();
                existing.updatedAt = tenant.updatedAt();
                return existing;
            })
            .orElseGet(() -> toEntity(tenant)); // Insert: cria entidade nova

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
