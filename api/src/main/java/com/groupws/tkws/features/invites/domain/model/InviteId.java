package com.groupws.tkws.features.invites.domain.model;

import java.util.Objects;
import java.util.UUID;

/** Value Object: identificador único do invite. */
public record InviteId(UUID value) {

    public InviteId {
        Objects.requireNonNull(value, "InviteId value");
    }

    public static InviteId generate() {
        return new InviteId(UUID.randomUUID());
    }

    public static InviteId of(UUID uuid) {
        return new InviteId(uuid);
    }

    public static InviteId of(String uuid) {
        return new InviteId(UUID.fromString(uuid));
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
