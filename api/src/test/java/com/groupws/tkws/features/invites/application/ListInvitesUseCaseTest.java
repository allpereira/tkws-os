package com.groupws.tkws.features.invites.application;

import com.groupws.tkws.features.invites.application.dto.InviteListView;
import com.groupws.tkws.features.invites.application.usecase.ListInvitesUseCase;
import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteRole;
import com.groupws.tkws.features.invites.domain.model.InviteStatus;
import com.groupws.tkws.features.invites.domain.port.InviteRepository;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.shared.page.PageResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("ListInvitesUseCase")
class ListInvitesUseCaseTest {

    @Mock InviteRepository invites;

    private static final long TENANT_ID = 3L;

    private Invite invite() {
        return Invite.issue(TenantId.of(TENANT_ID), "a@b.com", "A B",
            InviteRole.DEFAULT, "h", Duration.ofDays(7), null);
    }

    @Test
    @DisplayName("retorna envelope paginado com hasNext correto")
    void deveListar() {
        ListInvitesUseCase useCase = new ListInvitesUseCase(invites);
        when(invites.findByTenant(any(), eq(null), eq(50), eq(0))).thenReturn(List.of(invite(), invite()));
        when(invites.countByTenant(any(), eq(null))).thenReturn(2L);

        PageResponse<InviteListView> page = useCase.execute(TENANT_ID, null, 50, 0);

        assertThat(page.content()).hasSize(2);
        assertThat(page.total()).isEqualTo(2);
        assertThat(page.hasNext()).isFalse();
        assertThat(page.content().get(0).email()).isEqualTo("a@b.com");
    }

    @Test
    @DisplayName("limita o tamanho de página a 100")
    void deveLimitarPagina() {
        ListInvitesUseCase useCase = new ListInvitesUseCase(invites);
        when(invites.findByTenant(any(), any(), eq(100), eq(0))).thenReturn(List.of());
        when(invites.countByTenant(any(), any())).thenReturn(0L);

        useCase.execute(TENANT_ID, InviteStatus.PENDING, 9999, -5);

        verify(invites).findByTenant(TenantId.of(TENANT_ID), InviteStatus.PENDING, 100, 0);
    }
}
