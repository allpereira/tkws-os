package com.groupws.tkws.features.invites.infrastructure.persistence;

import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteId;
import com.groupws.tkws.features.invites.domain.model.InviteRole;
import com.groupws.tkws.features.invites.domain.model.InviteStatus;
import com.groupws.tkws.features.invites.domain.port.InviteRepository;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
class InviteJpaRepositoryAdapter implements InviteRepository {

    private final InviteJpaRepository jpa;

    InviteJpaRepositoryAdapter(InviteJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Invite save(Invite invite) {
        InviteJpaEntity entity = jpa.findById(invite.id().value()).orElseGet(InviteJpaEntity::new);
        entity.id              = invite.id().value();
        entity.tenantId        = invite.tenantId().value();
        entity.email           = invite.email();
        entity.fullName        = invite.fullName();
        entity.role            = invite.role().key();
        entity.tokenHash       = invite.tokenHash();
        entity.status          = invite.status().name();
        entity.expiresAt       = invite.expiresAt();
        entity.createdByUserId = invite.createdByUserId();
        entity.createdAt       = invite.createdAt();
        entity.acceptedAt      = invite.acceptedAt();
        entity.revokedAt       = invite.revokedAt();
        entity.zitadelUserId   = invite.zitadelUserId();
        return toDomain(jpa.save(entity));
    }

    @Override
    public Optional<Invite> findById(InviteId id) {
        return jpa.findById(id.value()).map(this::toDomain);
    }

    @Override
    public Optional<Invite> findByTokenHash(String tokenHash) {
        return jpa.findByTokenHash(tokenHash).map(this::toDomain);
    }

    @Override
    public boolean existsPending(TenantId tenantId, String email) {
        return jpa.existsPending(tenantId.value(), email);
    }

    private Invite toDomain(InviteJpaEntity e) {
        return Invite.reconstitute(
            InviteId.of(e.id),
            TenantId.of(e.tenantId),
            e.email,
            e.fullName,
            InviteRole.fromKey(e.role),
            e.tokenHash,
            InviteStatus.valueOf(e.status),
            e.expiresAt,
            e.createdByUserId,
            e.createdAt,
            e.acceptedAt,
            e.revokedAt,
            e.zitadelUserId
        );
    }
}
