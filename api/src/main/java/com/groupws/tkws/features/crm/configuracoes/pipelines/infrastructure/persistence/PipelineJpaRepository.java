package com.groupws.tkws.features.crm.configuracoes.pipelines.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface PipelineJpaRepository extends JpaRepository<PipelineJpaEntity, UUID> {
    Optional<PipelineJpaEntity> findByIdAndTenantId(UUID id, UUID tenantId);
    List<PipelineJpaEntity> findByTenantIdOrderByOrdemAscNomeAsc(UUID tenantId);
    List<PipelineJpaEntity> findByTenantIdAndModuloOrderByOrdemAscNomeAsc(UUID tenantId, String modulo);
    boolean existsByTenantIdAndCodigo(UUID tenantId, String codigo);
}
