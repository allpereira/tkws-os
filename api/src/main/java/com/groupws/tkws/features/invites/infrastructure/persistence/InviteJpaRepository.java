package com.groupws.tkws.features.invites.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

interface InviteJpaRepository extends JpaRepository<InviteJpaEntity, UUID> {

    Optional<InviteJpaEntity> findByTokenHash(String tokenHash);

    @Query("""
        SELECT COUNT(i) > 0 FROM InviteJpaEntity i
        WHERE i.tenantId = :tenantId
          AND LOWER(i.email) = LOWER(:email)
          AND i.status = 'PENDING'
        """)
    boolean existsPending(@Param("tenantId") Long tenantId, @Param("email") String email);
}
