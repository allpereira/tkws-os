package com.groupws.tkws.shared.featureflag;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

/**
 * Serviço para checar feature flags.
 *
 * Cache em memória (Caffeine via Spring Cache) com TTL de 60s — flags raramente mudam,
 * e 60s de propagação após mudança no banco é aceitável.
 *
 * Uso típico em controllers/use cases:
 *
 *   if (featureFlags.isEnabled("crm-leads-v1", tenantId)) {
 *       // libera funcionalidade
 *   }
 *
 * Para invalidar cache após mudar flag no banco:
 *   featureFlags.invalidate("crm-leads-v1");
 */
@Service
public class FeatureFlagService {

    private final JdbcTemplate jdbc;

    public FeatureFlagService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Cacheable(value = "feature-flags", key = "#name")
    public Optional<FeatureFlag> findByName(String name) {
        var results = jdbc.query(
            "SELECT id, name, description, default_enabled, enabled_for_tenants, disabled_for_tenants "
                + "FROM feature_flags WHERE name = ?",
            (rs, rowNum) -> new FeatureFlag(
                (UUID) rs.getObject("id"),
                rs.getString("name"),
                rs.getString("description"),
                rs.getBoolean("default_enabled"),
                Arrays.asList((UUID[]) rs.getArray("enabled_for_tenants").getArray()),
                Arrays.asList((UUID[]) rs.getArray("disabled_for_tenants").getArray())
            ),
            name
        );
        return results.stream().findFirst();
    }

    /**
     * Checa se a feature está habilitada para o tenant.
     * Flag não encontrada = retorna false (fail-closed).
     */
    public boolean isEnabled(String flagName, UUID tenantId) {
        return findByName(flagName)
            .map(flag -> flag.isEnabledFor(tenantId))
            .orElse(false);
    }

    /**
     * Versão global (não tenant-specific). Usa default_enabled.
     */
    public boolean isEnabledGlobally(String flagName) {
        return findByName(flagName).map(FeatureFlag::defaultEnabled).orElse(false);
    }

    @CacheEvict(value = "feature-flags", key = "#name")
    public void invalidate(String name) {
        // Apenas invalida cache. Mudança real é via migration ou endpoint admin.
    }

    @CacheEvict(value = "feature-flags", allEntries = true)
    public void invalidateAll() {
    }
}
