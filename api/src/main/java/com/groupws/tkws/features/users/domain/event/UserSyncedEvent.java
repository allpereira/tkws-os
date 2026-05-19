package com.groupws.tkws.features.users.domain.event;

import com.groupws.tkws.features.users.domain.model.UserId;
import com.groupws.tkws.shared.domain.DomainEvent;

import java.time.Instant;
import java.util.UUID;

public record UserSyncedEvent(
    UUID eventId,
    UserId userId,
    String zitadelId,
    String email,
    Instant occurredOn,
    boolean firstTime
) implements DomainEvent {

    public UserSyncedEvent(UserId userId, String zitadelId, String email, Instant occurredOn, boolean firstTime) {
        this(UUID.randomUUID(), userId, zitadelId, email, occurredOn, firstTime);
    }
}
