package com.groupws.tkws.features.users.domain.model;

import java.util.Objects;
import java.util.UUID;

public record UserId(UUID value) {
    public UserId { Objects.requireNonNull(value); }
    public static UserId generate() { return new UserId(UUID.randomUUID()); }
    public static UserId of(UUID uuid) { return new UserId(uuid); }
    public static UserId of(String s) { return new UserId(UUID.fromString(s)); }
    @Override public String toString() { return value.toString(); }
}
