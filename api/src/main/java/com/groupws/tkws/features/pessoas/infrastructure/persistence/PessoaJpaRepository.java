package com.groupws.tkws.features.pessoas.infrastructure.persistence;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface PessoaJpaRepository extends JpaRepository<PessoaJpaEntity, UUID> {

    Optional<PessoaJpaEntity> findByIdAndTenantId(UUID id, Long tenantId);

    Optional<PessoaJpaEntity> findByTenantIdAndDocumento(Long tenantId, String documento);

    boolean existsByTenantIdAndDocumento(Long tenantId, String documento);

    /**
     * Soft match · email OU celular (qualquer um). NULL não conta como match.
     */
    @Query("""
        SELECT p FROM PessoaJpaEntity p
        WHERE p.tenantId = :tenantId
          AND (
                (:email IS NOT NULL AND p.emailContato = :email)
             OR (:celular IS NOT NULL AND p.celularContato = :celular)
          )
        ORDER BY p.createdAt DESC
    """)
    List<PessoaJpaEntity> findByEmailOrCelular(
        @Param("tenantId") Long tenantId,
        @Param("email") String email,
        @Param("celular") String celular
    );

    @Query("""
        SELECT p FROM PessoaJpaEntity p
        WHERE p.tenantId = :tenantId
          AND (:status IS NULL OR p.status = :status)
        ORDER BY p.createdAt DESC
    """)
    List<PessoaJpaEntity> list(
        @Param("tenantId") Long tenantId,
        @Param("status") String status,
        Pageable pageable
    );
}
