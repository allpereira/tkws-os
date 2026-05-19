package com.groupws.tkws.features.tenants.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

public class InvalidTenantSlugException extends DomainException {
    public InvalidTenantSlugException(String slug) {
        super("INVALID_TENANT_SLUG",
            "Slug inválido: '" + slug + "'. Use apenas letras minúsculas, números e hífens.");
    }
}
