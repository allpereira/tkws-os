package com.groupws.tkws.shared.featureflag;

import java.util.List;
import java.util.UUID;

/**
 * Feature flag pra ligar/desligar funcionalidade por tenant ou globalmente.
 *
 * `enabledForTenants` e `disabledForTenants` guardam BIGINTs (PK local em
 * tenants.id) · espelham as colunas `BIGINT[]` da tabela feature_flags.
 *
 * Default OFF: disabled_for_tenants é ignorado, enabled_for_tenants é a allowlist.
 * Default ON:  enabled_for_tenants é ignorado, disabled_for_tenants é a blocklist.
 *
 * Ver docs/12-FEATURE-FLAGS.md
 */
public record FeatureFlag(
    UUID id,
    String name,
    String description,
    boolean defaultEnabled,
    List<Long> enabledForTenants,
    List<Long> disabledForTenants
) {
    public boolean isEnabledFor(Long tenantId) {
        if (tenantId == null) {
            return defaultEnabled;
        }
        if (defaultEnabled) {
            return !disabledForTenants.contains(tenantId);
        } else {
            return enabledForTenants.contains(tenantId);
        }
    }
}
