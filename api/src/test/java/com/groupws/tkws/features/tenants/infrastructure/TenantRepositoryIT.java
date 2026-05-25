package com.groupws.tkws.features.tenants.infrastructure;

import com.groupws.tkws.features.tenants.domain.model.Tenant;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import com.groupws.tkws.shared.AbstractIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration test do adapter de persistência.
 * Roda contra Postgres real (Testcontainers) com migrations aplicadas via Flyway.
 *
 * Convenção: sufixo *IT.java → roda em mvn verify (maven-failsafe-plugin).
 */
@DisplayName("TenantRepository — Persistence Integration")
class TenantRepositoryIT extends AbstractIntegrationTest {

    @Autowired TenantRepository tenantRepository;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach
    void cleanDatabase() {
        jdbc.execute("TRUNCATE tenants RESTART IDENTITY CASCADE");
    }

    @Test
    @DisplayName("save deve persistir e retornar tenant com mesmo ID")
    void saveDevePersistir() {
        Tenant novo = Tenant.create("zitadel-org-1", "Studio X", "studio-x");

        Tenant salvo = tenantRepository.save(novo);

        assertThat(salvo.id()).isEqualTo(novo.id());
        assertThat(salvo.name()).isEqualTo("Studio X");
        assertThat(salvo.slug()).isEqualTo("studio-x");
        assertThat(salvo.active()).isTrue();
    }

    @Test
    @DisplayName("findById deve retornar tenant persistido")
    void findByIdDeveRetornar() {
        Tenant tenant = tenantRepository.save(
            Tenant.create("zitadel-org-2", "Outro Studio", "outro-studio")
        );

        Optional<Tenant> achado = tenantRepository.findById(tenant.id());

        assertThat(achado).isPresent();
        assertThat(achado.get().slug()).isEqualTo("outro-studio");
    }

    @Test
    @DisplayName("findById deve retornar empty quando não existir")
    void findByIdDeveRetornarEmpty() {
        Optional<Tenant> achado = tenantRepository.findById(TenantId.of(999_999L));
        assertThat(achado).isEmpty();
    }

    @Test
    @DisplayName("findBySlug deve encontrar por slug")
    void findBySlugDeveEncontrar() {
        tenantRepository.save(Tenant.create("zitadel-org-3", "Arch ABC", "arch-abc"));

        Optional<Tenant> achado = tenantRepository.findBySlug("arch-abc");

        assertThat(achado).isPresent();
        assertThat(achado.get().zitadelOrgId()).isEqualTo("zitadel-org-3");
    }

    @Test
    @DisplayName("findByZitadelOrgId deve encontrar")
    void findByZitadelOrgIdDeveEncontrar() {
        tenantRepository.save(Tenant.create("zitadel-org-4", "Nome", "slug-4"));

        Optional<Tenant> achado = tenantRepository.findByZitadelOrgId("zitadel-org-4");

        assertThat(achado).isPresent();
    }

    @Test
    @DisplayName("existsBySlug deve retornar true quando existir")
    void existsBySlugTrue() {
        tenantRepository.save(Tenant.create("zitadel-org-5", "Nome", "slug-existe"));

        assertThat(tenantRepository.existsBySlug("slug-existe")).isTrue();
        assertThat(tenantRepository.existsBySlug("nao-existe")).isFalse();
    }

    @Test
    @DisplayName("save deve atualizar tenant existente")
    void saveDeveAtualizar() {
        Tenant inicial = tenantRepository.save(
            Tenant.create("zitadel-org-6", "Antigo", "slug-update")
        );

        inicial.rename("Novo Nome");
        Tenant atualizado = tenantRepository.save(inicial);

        Tenant relido = tenantRepository.findById(atualizado.id()).orElseThrow();
        assertThat(relido.name()).isEqualTo("Novo Nome");
    }

    @Test
    @DisplayName("save deve violar unique constraint em slug duplicado")
    void saveDeveViolarUniqueSlug() {
        tenantRepository.save(Tenant.create("zitadel-org-A", "A", "mesmo-slug"));

        Tenant duplicado = Tenant.create("zitadel-org-B", "B", "mesmo-slug");

        // O save vai falhar no flush por causa do unique constraint do banco.
        // Em produção, o use case checa antes via existsBySlug() e lança exceção de domínio.
        org.junit.jupiter.api.Assertions.assertThrows(
            org.springframework.dao.DataIntegrityViolationException.class,
            () -> tenantRepository.save(duplicado)
        );
    }
}
