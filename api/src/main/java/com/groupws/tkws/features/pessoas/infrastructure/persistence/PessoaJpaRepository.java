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

    /**
     * Autocomplete · ILIKE em nome_contato, nome_empresa e documento
     * (este último só quando o termo tem dígitos · `:termDigits` vazio
     * desabilita esse ramo via short-circuit no SQL).
     *
     * Ordem de relevância:
     *   1. nomeContato começa com o termo  (prefixo)
     *   2. nomeEmpresa começa com o termo
     *   3. resto (substring no meio do nome)
     *   tiebreaker: createdAt DESC (mais recentes primeiro)
     */
    @Query("""
        SELECT p FROM PessoaJpaEntity p
        WHERE p.tenantId = :tenantId
          AND (
                LOWER(p.nomeContato) LIKE LOWER(CONCAT('%', :term, '%'))
             OR (p.nomeEmpresa IS NOT NULL AND LOWER(p.nomeEmpresa) LIKE LOWER(CONCAT('%', :term, '%')))
             OR (:termDigits <> '' AND p.documento IS NOT NULL AND p.documento LIKE CONCAT('%', :termDigits, '%'))
          )
        ORDER BY
          CASE WHEN LOWER(p.nomeContato) LIKE LOWER(CONCAT(:term, '%')) THEN 0
               WHEN p.nomeEmpresa IS NOT NULL AND LOWER(p.nomeEmpresa) LIKE LOWER(CONCAT(:term, '%')) THEN 1
               ELSE 2 END,
          p.createdAt DESC
    """)
    List<PessoaJpaEntity> search(
        @Param("tenantId") Long tenantId,
        @Param("term") String term,
        @Param("termDigits") String termDigits,
        Pageable pageable
    );
}
