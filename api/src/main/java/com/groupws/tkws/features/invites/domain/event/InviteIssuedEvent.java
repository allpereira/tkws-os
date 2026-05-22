package com.groupws.tkws.features.invites.domain.event;

import com.groupws.tkws.features.invites.domain.model.InviteId;
import com.groupws.tkws.features.invites.domain.model.InviteRole;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.shared.domain.DomainEvent;

import java.time.Instant;
import java.util.UUID;

/** Disparado quando um admin cria um convite (antes do email ser enviado). */
public record InviteIssuedEvent(
    UUID eventId,
    InviteId inviteId,
    TenantId tenantId,
    String email,
    String fullName,
    InviteRole role,
    Instant expiresAt,
    Instant occurredOn
) implements DomainEvent {

    public InviteIssuedEvent(InviteId inviteId, TenantId tenantId, String email,
                             String fullName, InviteRole role,
                             Instant expiresAt, Instant occurredOn) {
        this(UUID.randomUUID(), inviteId, tenantId, email, fullName, role, expiresAt, occurredOn);
    }
}
