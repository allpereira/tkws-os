package com.groupws.tkws.features.users.infrastructure.persistence;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
class UserJpaEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    UUID id;

    @Column(name = "zitadel_id", nullable = false, unique = true)
    String zitadelId;

    @Column(name = "email", nullable = false)
    String email;

    @Column(name = "full_name")
    String fullName;

    @Column(name = "avatar_url")
    String avatarUrl;

    @Column(name = "tenant_id")
    Long tenantId;

    @Column(name = "active", nullable = false)
    boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    Instant updatedAt;

    @Column(name = "last_login_at")
    Instant lastLoginAt;

    protected UserJpaEntity() {}

    UserJpaEntity(UUID id, String zitadelId, String email, String fullName, String avatarUrl,
                  Long tenantId, boolean active, Instant createdAt, Instant updatedAt, Instant lastLoginAt) {
        this.id = id;
        this.zitadelId = zitadelId;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.tenantId = tenantId;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastLoginAt = lastLoginAt;
    }
}
