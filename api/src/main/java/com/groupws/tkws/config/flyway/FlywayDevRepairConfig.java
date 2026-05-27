package com.groupws.tkws.config.flyway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Em desenvolvimento local, realinha checksums do {@code flyway_schema_history} antes de migrar.
 * Evita falha de startup quando uma migration versionada (ex.: V7) foi editada após já ter sido aplicada.
 * <p>
 * Não roda em {@code test} (ITs usam estratégia própria) nem quando {@code ENVIRONMENT != dev}.
 * Desligar: {@code TKWS_FLYWAY_REPAIR_ON_MIGRATE=false}.
 */
@Configuration
@Profile("!test")
@ConditionalOnExpression(
    "'${spring.flyway.placeholders.environment:dev}' == 'dev' "
        + "&& '${tkws.flyway.repair-on-migrate:true}' == 'true'"
)
public class FlywayDevRepairConfig {

    private static final Logger log = LoggerFactory.getLogger(FlywayDevRepairConfig.class);

    @Bean
    public FlywayMigrationStrategy devFlywayRepairBeforeMigrate() {
        return flyway -> {
            log.info("Flyway dev repair-on-migrate: aligning flyway_schema_history checksums");
            flyway.repair();
            flyway.migrate();
        };
    }
}
