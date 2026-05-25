package com.groupws.tkws.features.users.domain.model;

import com.groupws.tkws.features.users.domain.event.UserSyncedEvent;
import com.groupws.tkws.shared.domain.AggregateRoot;
import com.groupws.tkws.shared.domain.Email;

import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.OptionalLong;

/**
 * Aggregate Root · usuário espelhado a partir do Zitadel.
 *
 * `tenantId` é o BIGINT local (PK em tenants.id) · pode ser null quando o
 * user ainda não foi vinculado a nenhum tenant.
 */
public final class User extends AggregateRoot<UserId> {

    private final UserId id;
    private final String zitadelId;
    private Email email;
    private String fullName;
    private String avatarUrl;
    /** null quando o user ainda não foi associado a um tenant. */
    private Long tenantId;
    private boolean active;
    private final Instant createdAt;
    private Instant updatedAt;
    private Instant lastLoginAt;

    private User(UserId id, String zitadelId, Email email, String fullName, String avatarUrl,
                 Long tenantId, boolean active, Instant createdAt, Instant updatedAt, Instant lastLoginAt) {
        this.id = Objects.requireNonNull(id, "id");
        this.zitadelId = Objects.requireNonNull(zitadelId, "zitadelId");
        this.email = Objects.requireNonNull(email, "email");
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.tenantId = tenantId;
        this.active = active;
        this.createdAt = Objects.requireNonNull(createdAt, "createdAt");
        this.updatedAt = Objects.requireNonNull(updatedAt, "updatedAt");
        this.lastLoginAt = lastLoginAt;
    }

    public static User createFromZitadel(String zitadelId, Email email, String fullName, String avatarUrl) {
        Instant now = Instant.now();
        UserId id = UserId.generate();
        User user = new User(id, zitadelId, email, fullName, avatarUrl, null, true, now, now, now);
        user.registerEvent(new UserSyncedEvent(id, zitadelId, email.value(), now, true));
        return user;
    }

    public static User reconstitute(UserId id, String zitadelId, Email email, String fullName,
                                    String avatarUrl, Long tenantId, boolean active,
                                    Instant createdAt, Instant updatedAt, Instant lastLoginAt) {
        return new User(id, zitadelId, email, fullName, avatarUrl, tenantId, active, createdAt, updatedAt, lastLoginAt);
    }

    public void syncFromZitadel(Email email, String fullName, String avatarUrl) {
        this.email = Objects.requireNonNull(email);
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.lastLoginAt = Instant.now();
        this.updatedAt = Instant.now();
        registerEvent(new UserSyncedEvent(id, zitadelId, email.value(), Instant.now(), false));
    }

    public void assignToTenant(long tenantId) {
        if (tenantId <= 0) {
            throw new IllegalArgumentException("tenantId deve ser positivo · recebeu: " + tenantId);
        }
        this.tenantId = tenantId;
        this.updatedAt = Instant.now();
    }

    public void deactivate() {
        if (!active) return;
        this.active = false;
        this.updatedAt = Instant.now();
    }

    @Override public UserId id() { return id; }
    public String zitadelId() { return zitadelId; }
    public Email email() { return email; }
    public String fullName() { return fullName; }
    public String avatarUrl() { return avatarUrl; }
    public OptionalLong tenantId() {
        return tenantId == null ? OptionalLong.empty() : OptionalLong.of(tenantId);
    }
    /** Retorna o tenantId como `Long` (boxed · null se sem tenant). Útil para JPA / DTOs. */
    public Long tenantIdOrNull() { return tenantId; }
    public boolean active() { return active; }
    public Instant createdAt() { return createdAt; }
    public Instant updatedAt() { return updatedAt; }
    public Optional<Instant> lastLoginAt() { return Optional.ofNullable(lastLoginAt); }
}
