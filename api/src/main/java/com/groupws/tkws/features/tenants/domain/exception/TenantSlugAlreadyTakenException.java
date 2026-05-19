package com.groupws.tkws.features.tenants.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

public class TenantSlugAlreadyTakenException extends DomainException {
    public TenantSlugAlreadyTakenException(String slug) {
        super("TENANT_SLUG_ALREADY_TAKEN",
            "Já existe um tenant com o slug '" + slug + "'");
    }
}
