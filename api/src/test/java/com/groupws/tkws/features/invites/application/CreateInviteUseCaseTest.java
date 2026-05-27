package com.groupws.tkws.features.invites.application;

import com.groupws.tkws.features.invites.application.dto.CreateInviteCommand;
import com.groupws.tkws.features.invites.application.dto.InviteView;
import com.groupws.tkws.features.invites.application.usecase.CreateInviteUseCase;
import com.groupws.tkws.features.invites.domain.exception.DuplicateInviteException;
import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.port.IdentityProvider;
import com.groupws.tkws.features.invites.domain.port.InviteNotifier;
import com.groupws.tkws.features.invites.domain.port.InviteRepository;
import com.groupws.tkws.features.tenants.domain.exception.TenantNotFoundException;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CreateInviteUseCase")
class CreateInviteUseCaseTest {

    @Mock InviteRepository invites;
    @Mock TenantRepository tenants;
    @Mock IdentityProvider idp;
    @Mock InviteNotifier notifier;

    private CreateInviteUseCase useCase;

    private static final long TENANT_ID = 7L;
    private final Tenant tenant = Tenant.create("zitadel-org-7", "Studio Sete", "studio-sete");
    private final CreateInviteCommand cmd =
        new CreateInviteCommand("nova@pessoa.com", "Nova Pessoa", "comercial_atendimento");

    @BeforeEach
    void setUp() {
        useCase = new CreateInviteUseCase(invites, tenants, idp, notifier,
            Duration.ofDays(7), "http://localhost:5174/accept-invite");
        tenant.assignIdIfTransient(TenantId.of(TENANT_ID));
    }

    @Test
    @DisplayName("cria shell user no IdP, persiste invite e envia email")
    void deveCriarConvite() {
        when(tenants.findById(TenantId.of(TENANT_ID))).thenReturn(Optional.of(tenant));
        when(invites.existsPending(any(), eq("nova@pessoa.com"))).thenReturn(false);
        when(idp.createShellUser(eq("zitadel-org-7"), eq("nova@pessoa.com"), anyString()))
            .thenReturn("zitadel-user-1");
        when(invites.save(any(Invite.class))).thenAnswer(inv -> inv.getArgument(0));

        InviteView view = useCase.execute(cmd, TENANT_ID, UUID.randomUUID(), "admin@studio.com");

        assertThat(view.email()).isEqualTo("nova@pessoa.com");
        assertThat(view.status()).isEqualTo("PENDING");
        assertThat(view.rawToken()).isNotBlank();
        verify(idp).createShellUser("zitadel-org-7", "nova@pessoa.com", "Nova Pessoa");
        verify(invites).save(any(Invite.class));
        verify(notifier).sendInviteEmail(any(Invite.class), anyString(), eq("Studio Sete"), anyString());
    }

    @Test
    @DisplayName("rejeita quando tenant não existe")
    void deveRejeitarTenantInexistente() {
        when(tenants.findById(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.execute(cmd, TENANT_ID, null, "a@b.com"))
            .isInstanceOf(TenantNotFoundException.class);
        verify(idp, never()).createShellUser(any(), any(), any());
        verify(invites, never()).save(any());
    }

    @Test
    @DisplayName("rejeita quando já existe invite PENDING para o email")
    void deveRejeitarDuplicado() {
        when(tenants.findById(any())).thenReturn(Optional.of(tenant));
        when(invites.existsPending(any(), eq("nova@pessoa.com"))).thenReturn(true);

        assertThatThrownBy(() -> useCase.execute(cmd, TENANT_ID, null, "a@b.com"))
            .isInstanceOf(DuplicateInviteException.class);
        verify(idp, never()).createShellUser(any(), any(), any());
    }

    @Test
    @DisplayName("falha de email não derruba a transação (best-effort)")
    void emailBestEffort() {
        when(tenants.findById(any())).thenReturn(Optional.of(tenant));
        when(invites.existsPending(any(), any())).thenReturn(false);
        when(idp.createShellUser(any(), any(), any())).thenReturn("zid");
        when(invites.save(any(Invite.class))).thenAnswer(inv -> inv.getArgument(0));
        doThrow(new RuntimeException("smtp down")).when(notifier)
            .sendInviteEmail(any(), anyString(), anyString(), anyString());

        InviteView view = useCase.execute(cmd, TENANT_ID, null, "a@b.com");

        assertThat(view).isNotNull();
        verify(invites).save(any(Invite.class));
    }
}
