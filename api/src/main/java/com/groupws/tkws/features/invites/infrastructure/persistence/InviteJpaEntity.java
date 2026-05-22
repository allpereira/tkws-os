package com.groupws.tkws.features.invites.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * JPA Entity (camada de infrastructure). NÃO é o Aggregate Root.
 * Conversão acontece em {@code InviteJpaRepositoryAdapter}.
 */
@Entity
@Table(name = "invites")
class InviteJpaEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    UUID id;

    @Column(name = "tenant_id", nullable = false)
    UUID tenantId;

    @Column(name = "email", nullable = false, length = 255)
    String email;

    @Column(name = "full_name", length = 255)
    String fullName;

    @Column(name = "role", nullable = false, length = 50)
    String role;

    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    String tokenHash;

    @Column(name = "status", nullable = false, length = 20)
    String status;

    @Column(name = "expires_at", nullable = false)
    Instant expiresAt;

    @Column(name = "created_by_user_id")
    UUID createdByUserId;

    @Column(name = "created_at", nullable = false, updatable = false)
    Instant createdAt;

    @Column(name = "accepted_at")
    Instant acceptedAt;

    @Column(name = "revoked_at")
    Instant revokedAt;

    @Column(name = "zitadel_user_id", length = 255)
    String zitadelUserId;

    protected InviteJpaEntity() {}
}
