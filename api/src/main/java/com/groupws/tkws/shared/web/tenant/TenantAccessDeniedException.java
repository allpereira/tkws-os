package com.groupws.tkws.shared.web.tenant;

import com.groupws.tkws.shared.domain.DomainException;

/**
 * Usuário tentou atuar em um tenant diferente do seu, sem ter role
 * SYSTEM_ADMIN. Acontece quando o header `X-Tenant-Id` não bate com o
 * `zitadel_org_id` do JWT.
 *
 * Mapeado para HTTP 403 Forbidden via {@link
 * com.groupws.tkws.shared.infrastructure.GlobalExceptionHandler}.
 */
public class TenantAccessDeniedException extends DomainException {
    public TenantAccessDeniedException(String detalhe) {
        super("tenant.access_denied",
            "Acesso ao tenant negado: " + detalhe);
    }
}
