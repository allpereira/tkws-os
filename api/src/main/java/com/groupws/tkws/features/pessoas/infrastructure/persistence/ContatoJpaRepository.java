package com.groupws.tkws.features.pessoas.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface ContatoJpaRepository extends JpaRepository<ContatoJpaEntity, UUID> {

    Optional<ContatoJpaEntity> findByIdAndTenantId(UUID id, Long tenantId);

    List<ContatoJpaEntity> findByTenantIdAndPessoaIdOrderByCreatedAtAsc(Long tenantId, UUID pessoaId);
}
