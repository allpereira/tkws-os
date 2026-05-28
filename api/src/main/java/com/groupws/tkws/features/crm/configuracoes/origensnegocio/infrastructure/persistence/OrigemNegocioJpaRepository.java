package com.groupws.tkws.features.crm.configuracoes.origensnegocio.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface OrigemNegocioJpaRepository extends JpaRepository<OrigemNegocioJpaEntity, UUID> {
    Optional<OrigemNegocioJpaEntity> findByIdAndTenantId(UUID id, Long tenantId);
    List<OrigemNegocioJpaEntity> findByTenantIdOrderByNomeAsc(Long tenantId);
    boolean existsByTenantIdAndCodigo(Long tenantId, String codigo);
}
