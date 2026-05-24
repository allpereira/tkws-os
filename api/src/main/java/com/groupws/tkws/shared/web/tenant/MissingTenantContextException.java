package com.groupws.tkws.shared.web.tenant;

import com.groupws.tkws.shared.domain.DomainException;

/**
 * JWT da request não traz `org_id` e nenhum header `X-Tenant-Id` foi informado
 * (ou o usuário não tem role para usar o header).
 *
 * Resposta HTTP: 422 Unprocessable Entity (default DomainException).
 */
public class MissingTenantContextException extends DomainException {
    public MissingTenantContextException(String detalhe) {
        super("tenant.context_missing",
            "Tenant não pôde ser resolvido para esta request: " + detalhe);
    }
}
