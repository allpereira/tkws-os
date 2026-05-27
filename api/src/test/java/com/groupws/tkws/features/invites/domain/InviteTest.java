package com.groupws.tkws.features.invites.domain;

import com.groupws.tkws.features.invites.domain.event.InviteIssuedEvent;
import com.groupws.tkws.features.invites.domain.exception.InviteNotAcceptableException;
import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteRole;
import com.groupws.tkws.features.invites.domain.model.InviteStatus;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit tests do agregado Invite — invariantes de ciclo de vida sem Spring/banco.
 */
@DisplayName("Invite — Aggregate Root")
class InviteTest {

    private static final TenantId TENANT = TenantId.of(1L);
    private static final Duration TTL = Duration.ofDays(7);

    private Invite newInvite() {
        return Invite.issue(TENANT, "Maria@Exemplo.com", "Maria Souza",
            InviteRole.COMERCIAL_ATENDIMENTO, "hash-1", TTL, UUID.randomUUID());
    }

    @Nested
    @DisplayName("ao emitir")
    class WhenIssuing {

        @Test
        @DisplayName("deve criar PENDING, normalizar email e expirar no futuro")
        void deveCriarPendente() {
            Invite invite = newInvite();

            assertThat(invite.status()).isEqualTo(InviteStatus.PENDING);
            assertThat(invite.email()).isEqualTo("maria@exemplo.com");
            assertThat(invite.fullName()).isEqualTo("Maria Souza");
            assertThat(invite.expiresAt()).isAfter(Instant.now());
            assertThat(invite.acceptedAt()).isNull();
            assertThat(invite.revokedAt()).isNull();
        }

        @Test
        @DisplayName("deve registrar InviteIssuedEvent")
        void deveRegistrarEvento() {
            Invite invite = newInvite();
            assertThat(invite.peekDomainEvents()).hasSize(1)
                .first().isInstanceOf(InviteIssuedEvent.class);
        }

        @Test
        @DisplayName("deve rejeitar ttl não-positivo")
        void deveRejeitarTtlInvalido() {
            assertThatThrownBy(() -> Invite.issue(TENANT, "a@b.com", null,
                InviteRole.DEFAULT, "h", Duration.ZERO, null))
                .isInstanceOf(IllegalArgumentException.class);
        }

        @Test
        @DisplayName("deve rejeitar email sem @")
        void deveRejeitarEmailInvalido() {
            assertThatThrownBy(() -> Invite.issue(TENANT, "sem-arroba", null,
                InviteRole.DEFAULT, "h", TTL, null))
                .isInstanceOf(IllegalArgumentException.class);
        }
    }

    @Nested
    @DisplayName("ao aceitar")
    class WhenAccepting {

        @Test
        @DisplayName("deve marcar ACCEPTED e gravar zitadelUserId")
        void deveAceitar() {
            Invite invite = newInvite();
            invite.accept("zitadel-99");

            assertThat(invite.status()).isEqualTo(InviteStatus.ACCEPTED);
            assertThat(invite.acceptedAt()).isNotNull();
            assertThat(invite.zitadelUserId()).isEqualTo("zitadel-99");
        }

        @Test
        @DisplayName("não deve aceitar duas vezes (estado terminal)")
        void naoDeveAceitarDuasVezes() {
            Invite invite = newInvite();
            invite.accept("z1");
            assertThatThrownBy(() -> invite.accept("z2"))
                .isInstanceOf(InviteNotAcceptableException.class);
        }
    }

    @Nested
    @DisplayName("ao revogar")
    class WhenRevoking {

        @Test
        @DisplayName("deve marcar REVOKED a partir de PENDING")
        void deveRevogar() {
            Invite invite = newInvite();
            invite.revoke();
            assertThat(invite.status()).isEqualTo(InviteStatus.REVOKED);
            assertThat(invite.revokedAt()).isNotNull();
        }

        @Test
        @DisplayName("não deve revogar convite já aceito")
        void naoDeveRevogarAceito() {
            Invite invite = newInvite();
            invite.accept("z1");
            assertThatThrownBy(invite::revoke).isInstanceOf(InviteNotAcceptableException.class);
        }
    }

    @Nested
    @DisplayName("ao rotacionar token (reenvio)")
    class WhenRotating {

        @Test
        @DisplayName("deve trocar o hash e estender a validade")
        void deveRotacionar() {
            Invite invite = newInvite();
            Instant before = invite.expiresAt();

            invite.rotateToken("hash-2", Duration.ofDays(14));

            assertThat(invite.tokenHash()).isEqualTo("hash-2");
            assertThat(invite.expiresAt()).isAfterOrEqualTo(before);
            assertThat(invite.status()).isEqualTo(InviteStatus.PENDING);
        }

        @Test
        @DisplayName("não deve rotacionar convite fora de PENDING")
        void naoDeveRotacionarTerminal() {
            Invite invite = newInvite();
            invite.revoke();
            assertThatThrownBy(() -> invite.rotateToken("h", TTL))
                .isInstanceOf(InviteNotAcceptableException.class);
        }

        @Test
        @DisplayName("deve rejeitar ttl inválido na rotação")
        void deveRejeitarTtlInvalido() {
            Invite invite = newInvite();
            assertThatThrownBy(() -> invite.rotateToken("h", Duration.ofSeconds(-1)))
                .isInstanceOf(IllegalArgumentException.class);
        }
    }

    @Nested
    @DisplayName("expiração")
    class Expiry {

        @Test
        @DisplayName("isExpired deve refletir a janela")
        void isExpired() {
            Invite invite = newInvite();
            assertThat(invite.isExpired(Instant.now())).isFalse();
            assertThat(invite.isExpired(Instant.now().plus(Duration.ofDays(8)))).isTrue();
        }

        @Test
        @DisplayName("expire só muda quando ainda PENDING")
        void expireApenasPendente() {
            Invite invite = newInvite();
            invite.expire();
            assertThat(invite.status()).isEqualTo(InviteStatus.EXPIRED);

            Invite aceito = newInvite();
            aceito.accept("z");
            aceito.expire();
            assertThat(aceito.status()).isEqualTo(InviteStatus.ACCEPTED);
        }
    }
}
