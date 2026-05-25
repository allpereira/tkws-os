package com.groupws.tkws.features.crm.oportunidades.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface OportunidadeJpaRepository extends JpaRepository<OportunidadeJpaEntity, UUID> {
    Optional<OportunidadeJpaEntity> findByIdAndTenantId(UUID id, Long tenantId);
    List<OportunidadeJpaEntity> findByTenantIdAndPipelineIdOrderByUpdatedAtDesc(Long tenantId, UUID pipelineId);
    List<OportunidadeJpaEntity> findByTenantIdOrderByUpdatedAtDesc(Long tenantId);
}
