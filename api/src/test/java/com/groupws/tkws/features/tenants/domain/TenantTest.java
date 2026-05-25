package com.groupws.tkws.features.tenants.domain;

import com.groupws.tkws.features.tenants.domain.event.TenantCreatedEvent;
import com.groupws.tkws.features.tenants.domain.exception.InvalidTenantSlugException;
import com.groupws.tkws.features.tenants.domain.model.Tenant;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.shared.domain.DomainEvent;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit tests do agregado Tenant.
 *
 * Princípios:
 * - Testam invariantes do domínio sem subir Spring/banco/etc
 * - Rápidos (centenas por segundo)
 * - Cada teste tem um comportamento isolado
 *
 * Estado transiente: `Tenant.create()` retorna agregado sem id; o id é
 * atribuído pelo adapter de persistência após o INSERT via
 * {@link Tenant#assignIdIfTransient}. Eventos só são registrados nesse momento.
 * Os testes que precisam validar id/evento de criação simulam o adapter
 * chamando `assignIdIfTransient(TenantId.of(1L))` explicitamente.
 */
@DisplayName("Tenant — Aggregate Root")
class TenantTest {

    private static final TenantId PERSIST_ID = TenantId.of(1L);

    @Nested
    @DisplayName("ao criar")
    class WhenCreating {

        @Test
        @DisplayName("deve criar tenant transiente com defaults corretos")
        void deveCriarTenantValido() {
            Tenant tenant = Tenant.create("zitadel-org-123", "Studio Arquitetura X", "studio-x");

            assertThat(tenant.isTransient()).isTrue();
            assertThat(tenant.idOpt()).isEmpty();
            assertThat(tenant.zitadelOrgId()).isEqualTo("zitadel-org-123");
            assertThat(tenant.name()).isEqualTo("Studio Arquitetura X");
            assertThat(tenant.slug()).isEqualTo("studio-x");
            assertThat(tenant.active()).isTrue();
            assertThat(tenant.createdAt()).isNotNull();
            assertThat(tenant.updatedAt()).isEqualTo(tenant.createdAt());
        }

        @Test
        @DisplayName("deve registrar TenantCreatedEvent após assignIdIfTransient")
        void deveRegistrarEventoDeCriacao() {
            Tenant tenant = Tenant.create("org-1", "Nome", "slug-valido");
            // antes da atribuição de id (adapter ainda não rodou) · sem evento
            assertThat(tenant.peekDomainEvents()).isEmpty();

            tenant.assignIdIfTransient(PERSIST_ID);

            List<DomainEvent> events = tenant.peekDomainEvents();
            assertThat(events).hasSize(1);
            assertThat(events.get(0)).isInstanceOf(TenantCreatedEvent.class);
            TenantCreatedEvent event = (TenantCreatedEvent) events.get(0);
            assertThat(event.tenantId()).isEqualTo(PERSIST_ID);
            assertThat(event.name()).isEqualTo("Nome");
            assertThat(event.slug()).isEqualTo("slug-valido");
        }

        @Test
        @DisplayName("assignIdIfTransient deve ser idempotente · segunda chamada é no-op")
        void assignIdIdempotente() {
            Tenant tenant = Tenant.create("org-1", "Nome", "slug");
            tenant.assignIdIfTransient(PERSIST_ID);
            assertThat(tenant.peekDomainEvents()).hasSize(1);

            tenant.assignIdIfTransient(TenantId.of(2L));

            assertThat(tenant.id()).isEqualTo(PERSIST_ID);
            assertThat(tenant.peekDomainEvents()).hasSize(1);
        }

        @Test
        @DisplayName("id() em tenant transiente deve lançar IllegalStateException")
        void idTransienteLanca() {
            Tenant tenant = Tenant.create("org-1", "Nome", "slug");
            assertThatThrownBy(tenant::id)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("transiente");
        }

        @ParameterizedTest
        @ValueSource(strings = {
            "Slug Com Espaço",
            "SlugComMaiusculas",
            "slug_com_underscore",
            "-comecando-com-hifen",
            "terminando-com-hifen-",
            "acentuação",
            ""
        })
        @DisplayName("deve rejeitar slugs inválidos")
        void deveRejeitarSlugsInvalidos(String slugInvalido) {
            assertThatThrownBy(() -> Tenant.create("org-1", "Nome", slugInvalido))
                .isInstanceOf(InvalidTenantSlugException.class)
                .hasMessageContaining(slugInvalido);
        }

        @ParameterizedTest
        @ValueSource(strings = { "studio-x", "abc", "tenant-2024", "nome-com-tres-hifens-aqui" })
        @DisplayName("deve aceitar slugs válidos")
        void deveAceitarSlugsValidos(String slugValido) {
            Tenant tenant = Tenant.create("org-1", "Nome", slugValido);
            assertThat(tenant.slug()).isEqualTo(slugValido);
        }

        @Test
        @DisplayName("deve rejeitar nome vazio")
        void deveRejeitarNomeVazio() {
            assertThatThrownBy(() -> Tenant.create("org-1", "  ", "slug"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("vazio");
        }

        @Test
        @DisplayName("deve rejeitar nome maior que 255 chars")
        void deveRejeitarNomeMuitoLongo() {
            String nomeLongo = "a".repeat(256);
            assertThatThrownBy(() -> Tenant.create("org-1", nomeLongo, "slug"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("muito longo");
        }
    }

    @Nested
    @DisplayName("operações no ciclo de vida")
    class LifecycleOperations {

        @Test
        @DisplayName("rename deve atualizar nome e updatedAt")
        void renameDeveAtualizarNomeETimestamp() throws InterruptedException {
            Tenant tenant = Tenant.create("org-1", "Antigo", "slug");
            var antesUpdate = tenant.updatedAt();
            Thread.sleep(5);

            tenant.rename("Novo Nome");

            assertThat(tenant.name()).isEqualTo("Novo Nome");
            assertThat(tenant.updatedAt()).isAfter(antesUpdate);
        }

        @Test
        @DisplayName("deactivate deve marcar como inativo")
        void deactivateDeveMarcarInativo() {
            Tenant tenant = Tenant.create("org-1", "Nome", "slug");
            assertThat(tenant.active()).isTrue();

            tenant.deactivate();

            assertThat(tenant.active()).isFalse();
        }

        @Test
        @DisplayName("deactivate em tenant já inativo deve ser idempotente")
        void deactivateIdempotente() {
            Tenant tenant = Tenant.create("org-1", "Nome", "slug");
            tenant.deactivate();
            var updatedAt1 = tenant.updatedAt();

            tenant.deactivate();

            assertThat(tenant.updatedAt()).isEqualTo(updatedAt1);
        }

        @Test
        @DisplayName("pullDomainEvents deve retornar e limpar eventos após assignIdIfTransient")
        void pullDeveLimparEventos() {
            Tenant tenant = Tenant.create("org-1", "Nome", "slug");
            tenant.assignIdIfTransient(PERSIST_ID);
            assertThat(tenant.peekDomainEvents()).hasSize(1);

            List<DomainEvent> pulled = tenant.pullDomainEvents();

            assertThat(pulled).hasSize(1);
            assertThat(tenant.peekDomainEvents()).isEmpty();
        }
    }
}
