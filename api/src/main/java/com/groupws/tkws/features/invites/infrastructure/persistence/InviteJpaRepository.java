package com.groupws.tkws.features.invites.infrastructure.persistence;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface InviteJpaRepository extends JpaRepository<InviteJpaEntity, UUID> {

    Optional<InviteJpaEntity> findByTokenHash(String tokenHash);

    Optional<InviteJpaEntity> findByIdAndTenantId(UUID id, Long tenantId);

    @Query("""
        SELECT COUNT(i) > 0 FROM InviteJpaEntity i
        WHERE i.tenantId = :tenantId
          AND LOWER(i.email) = LOWER(:email)
          AND i.status = 'PENDING'
        """)
    boolean existsPending(@Param("tenantId") Long tenantId, @Param("email") String email);

    /**
     * Filtro de status opcional · {@code CAST(:status AS string)} fixa o tipo do
     * bind quando o param chega {@code null} (ver docs/15-API-BEST-PRACTICES.md).
     */
    @Query("""
        SELECT i FROM InviteJpaEntity i
        WHERE i.tenantId = :tenantId
          AND (CAST(:status AS string) IS NULL OR i.status = CAST(:status AS string))
        ORDER BY i.createdAt DESC
        """)
    List<InviteJpaEntity> findByTenant(@Param("tenantId") Long tenantId,
                                       @Param("status") String status,
                                       Pageable pageable);

    @Query("""
        SELECT COUNT(i) FROM InviteJpaEntity i
        WHERE i.tenantId = :tenantId
          AND (CAST(:status AS string) IS NULL OR i.status = CAST(:status AS string))
        """)
    long countByTenant(@Param("tenantId") Long tenantId, @Param("status") String status);
}
