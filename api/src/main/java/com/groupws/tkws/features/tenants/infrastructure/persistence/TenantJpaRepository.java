package com.groupws.tkws.features.tenants.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

interface TenantJpaRepository extends JpaRepository<TenantJpaEntity, Long> {

    Optional<TenantJpaEntity> findBySlug(String slug);

    Optional<TenantJpaEntity> findByZitadelOrgId(String zitadelOrgId);

    boolean existsBySlug(String slug);

    boolean existsByZitadelOrgId(String zitadelOrgId);
}
