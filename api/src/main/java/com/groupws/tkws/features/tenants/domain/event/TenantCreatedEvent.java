package com.groupws.tkws.features.tenants.domain.event;

import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.shared.domain.DomainEvent;

import java.time.Instant;
import java.util.UUID;

public record TenantCreatedEvent(
    UUID eventId,
    TenantId tenantId,
    String name,
    String slug,
    Instant occurredOn
) implements DomainEvent {

    public TenantCreatedEvent(TenantId tenantId, String name, String slug, Instant occurredOn) {
        this(UUID.randomUUID(), tenantId, name, slug, occurredOn);
    }

    /** Helper · `tenantId` como long puro (matching o tipo de coluna no banco). */
    public long tenantIdLong() {
        return tenantId.value();
    }
}
