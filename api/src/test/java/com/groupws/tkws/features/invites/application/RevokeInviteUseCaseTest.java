package com.groupws.tkws.features.invites.application;

import com.groupws.tkws.features.invites.application.dto.InviteListView;
import com.groupws.tkws.features.invites.application.usecase.RevokeInviteUseCase;
import com.groupws.tkws.features.invites.domain.exception.InviteNotFoundException;
import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteId;
import com.groupws.tkws.features.invites.domain.model.InviteRole;
import com.groupws.tkws.features.invites.domain.model.InviteStatus;
import com.groupws.tkws.features.invites.domain.port.InviteRepository;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("RevokeInviteUseCase")
class RevokeInviteUseCaseTest {

    @Mock InviteRepository invites;

    private static final long TENANT_ID = 5L;

    @Test
    @DisplayName("revoga convite do próprio tenant")
    void deveRevogar() {
        RevokeInviteUseCase useCase = new RevokeInviteUseCase(invites);
        Invite invite = Invite.issue(TenantId.of(TENANT_ID), "a@b.com", null,
            InviteRole.DEFAULT, "h", Duration.ofDays(7), null);
        UUID id = invite.id().value();
        when(invites.findByIdAndTenant(InviteId.of(id), TenantId.of(TENANT_ID))).thenReturn(Optional.of(invite));
        when(invites.save(any(Invite.class))).thenAnswer(inv -> inv.getArgument(0));

        InviteListView view = useCase.execute(TENANT_ID, id);

        assertThat(view.status()).isEqualTo(InviteStatus.REVOKED.name());
        verify(invites).save(invite);
    }

    @Test
    @DisplayName("404 quando convite não pertence ao tenant (ou inexistente)")
    void deveLancarNotFound() {
        RevokeInviteUseCase useCase = new RevokeInviteUseCase(invites);
        UUID id = UUID.randomUUID();
        when(invites.findByIdAndTenant(any(), any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.execute(TENANT_ID, id))
            .isInstanceOf(InviteNotFoundException.class);
        verify(invites, never()).save(any());
    }
}
