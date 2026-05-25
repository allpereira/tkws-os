package com.groupws.tkws.features.crm.configuracoes.pipelines.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface PipelineJpaRepository extends JpaRepository<PipelineJpaEntity, UUID> {
    Optional<PipelineJpaEntity> findByIdAndTenantId(UUID id, Long tenantId);
    List<PipelineJpaEntity> findByTenantIdOrderByOrdemAscNomeAsc(Long tenantId);
    List<PipelineJpaEntity> findByTenantIdAndModuloOrderByOrdemAscNomeAsc(Long tenantId, String modulo);
    boolean existsByTenantIdAndCodigo(Long tenantId, String codigo);
}
