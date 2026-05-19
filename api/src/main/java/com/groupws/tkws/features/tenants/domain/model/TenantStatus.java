package com.groupws.tkws.features.tenants.domain.model;

/**
 * Estados do ciclo de vida de um Tenant.
 *
 * PENDING:   Tenant solicitou cadastro mas ainda não foi aprovado (auto-cadastro).
 * ACTIVE:    Tenant aprovado e operando normalmente.
 * REJECTED:  Solicitação de cadastro foi negada (mantém pra auditoria).
 * SUSPENDED: Tenant temporariamente suspenso (inadimplência, abuso).
 *
 * Ver ADR-014.
 */
public enum TenantStatus {
    PENDING,
    ACTIVE,
    REJECTED,
    SUSPENDED;

    public boolean canLogin() {
        return this == ACTIVE;
    }

    public boolean isTerminal() {
        return this == REJECTED;
    }
}
