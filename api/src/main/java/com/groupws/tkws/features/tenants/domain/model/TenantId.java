package com.groupws.tkws.features.tenants.domain.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Value Object representando o identificador único de um Tenant.
 * Tipado fortemente para evitar confusão entre IDs de diferentes agregados.
 */
public record TenantId(UUID value) {

    public TenantId {
        Objects.requireNonNull(value, "TenantId value");
    }

    public static TenantId generate() {
        return new TenantId(UUID.randomUUID());
    }

    public static TenantId of(UUID uuid) {
        return new TenantId(uuid);
    }

    public static TenantId of(String uuid) {
        return new TenantId(UUID.fromString(uuid));
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
