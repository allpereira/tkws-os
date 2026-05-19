package com.groupws.tkws.features.tenants.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

public class TenantNotFoundException extends DomainException {
    public TenantNotFoundException(String identifier) {
        super("TENANT_NOT_FOUND",
            "Tenant não encontrado: " + identifier);
    }
}
