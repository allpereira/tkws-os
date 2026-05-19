package com.groupws.tkws.features.tenants.application.dto;

import com.groupws.tkws.features.tenants.domain.model.Tenant;

import java.time.Instant;
import java.util.UUID;

public record TenantView(
    UUID id,
    String zitadelOrgId,
    String name,
    String slug,
    boolean active,
    Instant createdAt,
    Instant updatedAt
) {
    public static TenantView from(Tenant tenant) {
        return new TenantView(
            tenant.id().value(),
            tenant.zitadelOrgId(),
            tenant.name(),
            tenant.slug(),
            tenant.active(),
            tenant.createdAt(),
            tenant.updatedAt()
        );
    }
}
