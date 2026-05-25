package com.groupws.tkws.features.tenants.domain.model;

/**
 * Value Object · identificador único de um Tenant.
 *
 * BIGINT local em vez de UUID porque tenantId aparece em todas as FKs e
 * responses · economia de espaço + index reads mais rápidos. Ver
 * `V1__initial_schema.sql` e ADR-019.
 *
 * O id externo (Zitadel `org_id`) fica em `Tenant.zitadelOrgId`, opaco.
 */
public record TenantId(long value) {

    public TenantId {
        if (value <= 0) {
            throw new IllegalArgumentException("TenantId deve ser positivo · recebeu: " + value);
        }
    }

    public static TenantId of(long v) {
        return new TenantId(v);
    }

    @Override
    public String toString() {
        return Long.toString(value);
    }
}
