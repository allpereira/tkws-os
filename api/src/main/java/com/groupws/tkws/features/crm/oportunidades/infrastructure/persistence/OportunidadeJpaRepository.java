package com.groupws.tkws.features.crm.oportunidades.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface OportunidadeJpaRepository extends JpaRepository<OportunidadeJpaEntity, UUID> {
    Optional<OportunidadeJpaEntity> findByIdAndTenantId(UUID id, UUID tenantId);
    List<OportunidadeJpaEntity> findByTenantIdAndPipelineIdOrderByUpdatedAtDesc(UUID tenantId, UUID pipelineId);
    List<OportunidadeJpaEntity> findByTenantIdOrderByUpdatedAtDesc(UUID tenantId);
}
