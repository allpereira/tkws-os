package com.groupws.tkws.features.crm.configuracoes.etapas.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface EtapaJpaRepository extends JpaRepository<EtapaJpaEntity, UUID> {
    Optional<EtapaJpaEntity> findByIdAndTenantId(UUID id, Long tenantId);
    List<EtapaJpaEntity> findByTenantIdAndPipelineIdOrderByOrdemAscNomeAsc(Long tenantId, UUID pipelineId);
    List<EtapaJpaEntity> findByTenantIdOrderByOrdemAscNomeAsc(Long tenantId);
    boolean existsByTenantIdAndCodigo(Long tenantId, String codigo);
}
