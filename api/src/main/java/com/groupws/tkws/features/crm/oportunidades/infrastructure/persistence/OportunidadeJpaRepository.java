package com.groupws.tkws.features.crm.oportunidades.infrastructure.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

interface OportunidadeJpaRepository extends JpaRepository<OportunidadeJpaEntity, UUID> {
    Optional<OportunidadeJpaEntity> findByIdAndTenantId(UUID id, Long tenantId);
    Page<OportunidadeJpaEntity> findByTenantIdAndPipelineId(Long tenantId, UUID pipelineId, Pageable pageable);
    Page<OportunidadeJpaEntity> findByTenantId(Long tenantId, Pageable pageable);
    long countByTenantIdAndPipelineId(Long tenantId, UUID pipelineId);
    long countByTenantId(Long tenantId);
}
