package com.groupws.tkws.features.invites.application.usecase;

import com.groupws.tkws.features.invites.application.dto.AcceptInviteCommand;
import com.groupws.tkws.features.invites.application.dto.InviteTokenInfoView;
import com.groupws.tkws.features.invites.domain.exception.InviteNotAcceptableException;
import com.groupws.tkws.features.invites.domain.exception.InviteNotFoundException;
import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteStatus;
import com.groupws.tkws.features.invites.domain.model.InviteToken;
import com.groupws.tkws.features.invites.domain.port.IdentityProvider;
import com.groupws.tkws.features.invites.domain.port.InviteRepository;
import com.groupws.tkws.features.tenants.domain.model.Tenant;
import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Conclui o convite: define a senha do user shell no IdP, atribui o role e marca
 * o invite como ACCEPTED.
 *
 * <p>Retorna {@link InviteTokenInfoView} com {@code valid=true} pra que o frontend
 * possa exibir uma mensagem de sucesso e prosseguir pro login OIDC normal.
 */
@Service
public class AcceptInviteUseCase {

    private final InviteRepository invites;
    private final TenantRepository tenants;
    private final IdentityProvider idp;

    public AcceptInviteUseCase(InviteRepository invites, TenantRepository tenants, IdentityProvider idp) {
        this.invites = invites;
        this.tenants = tenants;
        this.idp = idp;
    }

    @Transactional
    public InviteTokenInfoView execute(AcceptInviteCommand cmd) {
        String hash = InviteToken.hashOf(cmd.token().trim());
        Invite invite = invites.findByTokenHash(hash)
            .orElseThrow(() -> new InviteNotFoundException("token"));

        if (invite.isExpired(Instant.now())) {
            invite.expire();
            invites.save(invite);
            throw new InviteNotAcceptableException(InviteStatus.EXPIRED);
        }

        Tenant tenant = tenants.findById(invite.tenantId())
            .orElseThrow(() -> new InviteNotFoundException("tenant"));

        // 1. Define a senha no Zitadel — pode falhar com policy/complexity errors.
        idp.setPassword(invite.zitadelUserId(), cmd.password());

        // 2. Atribui o role do projeto na org do tenant.
        idp.grantProjectRole(invite.zitadelUserId(), tenant.zitadelOrgId(), invite.role());

        // 3. Marca como aceito.
        invite.accept(invite.zitadelUserId());
        invites.save(invite);

        return InviteTokenInfoView.valid(
            invite.email(), cmd.fullName(), invite.role().key(), tenant.name()
        );
    }
}
