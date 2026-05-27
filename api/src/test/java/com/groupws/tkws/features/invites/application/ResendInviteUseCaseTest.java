package com.groupws.tkws.features.invites.application;

import com.groupws.tkws.features.invites.application.dto.InviteListView;
import com.groupws.tkws.features.invites.application.usecase.ResendInviteUseCase;
import com.groupws.tkws.features.invites.domain.exception.InviteNotAcceptableException;
import com.groupws.tkws.features.invites.domain.exception.InviteNotFoundException;
import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteRole;
import com.groupws.tkws.features.invites.domain.port.InviteNotifier;
import com.groupws.tkws.features.invites.domain.port.InviteRepository;
import com.groupws.tkws.features.tenants.domain.model.Tenant;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("ResendInviteUseCase")
class ResendInviteUseCaseTest {

    @Mock InviteRepository invites;
    @Mock TenantRepository tenants;
    @Mock InviteNotifier notifier;

    private ResendInviteUseCase useCase;

    private static final long TENANT_ID = 9L;
    private final Tenant tenant = Tenant.create("zitadel-org-9", "Studio Nove", "studio-nove");

    @BeforeEach
    void setUp() {
        useCase = new ResendInviteUseCase(invites, tenants, notifier,
            Duration.ofDays(7), "http://localhost:5174/accept-invite");
        tenant.assignIdIfTransient(TenantId.of(TENANT_ID));
    }

    @Test
    @DisplayName("rotaciona token, persiste e reenvia email")
    void deveReenviar() {
        Invite invite = Invite.issue(TenantId.of(TENANT_ID), "x@y.com", "X Y",
            InviteRole.DEFAULT, "hash-antigo", Duration.ofDays(7), null);
        UUID id = invite.id().value();
        when(invites.findByIdAndTenant(any(), eq(TenantId.of(TENANT_ID)))).thenReturn(Optional.of(invite));
        when(tenants.findById(TenantId.of(TENANT_ID))).thenReturn(Optional.of(tenant));
        when(invites.save(any(Invite.class))).thenAnswer(inv -> inv.getArgument(0));

        InviteListView view = useCase.execute(TENANT_ID, id);

        assertThat(view.status()).isEqualTo("PENDING");
        assertThat(invite.tokenHash()).isNotEqualTo("hash-antigo");
        verify(notifier).sendInviteEmail(any(Invite.class), anyString(), eq("Studio Nove"), anyString());
    }

    @Test
    @DisplayName("404 quando convite não pertence ao tenant")
    void deveLancarNotFound() {
        when(invites.findByIdAndTenant(any(), any())).thenReturn(Optional.empty());
        assertThatThrownBy(() -> useCase.execute(TENANT_ID, UUID.randomUUID()))
            .isInstanceOf(InviteNotFoundException.class);
        verify(notifier, never()).sendInviteEmail(any(), any(), any(), any());
    }

    @Test
    @DisplayName("410 ao reenviar convite já revogado")
    void naoReenviaTerminal() {
        Invite invite = Invite.issue(TenantId.of(TENANT_ID), "x@y.com", null,
            InviteRole.DEFAULT, "h", Duration.ofDays(7), null);
        invite.revoke();
        when(invites.findByIdAndTenant(any(), any())).thenReturn(Optional.of(invite));
        when(tenants.findById(any())).thenReturn(Optional.of(tenant));

        assertThatThrownBy(() -> useCase.execute(TENANT_ID, invite.id().value()))
            .isInstanceOf(InviteNotAcceptableException.class);
        verify(notifier, never()).sendInviteEmail(any(), any(), any(), any());
    }
}
