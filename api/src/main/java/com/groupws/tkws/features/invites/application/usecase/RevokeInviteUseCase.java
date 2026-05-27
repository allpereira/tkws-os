package com.groupws.tkws.features.invites.application.usecase;

import com.groupws.tkws.features.invites.application.dto.InviteListView;
import com.groupws.tkws.features.invites.domain.exception.InviteNotFoundException;
import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteId;
import com.groupws.tkws.features.invites.domain.port.InviteRepository;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Cancela um convite PENDING antes do aceite. Tenant-scoped: o convite precisa
 * pertencer ao tenant atual, senão respondemos 404 (não vazamos a existência de
 * convites de outros tenants).
 *
 * <p>Não removemos o user shell do Zitadel aqui — ele fica sem senha nem role,
 * portanto inerte. Uma rotina de limpeza pode removê-lo depois (fora de escopo).
 */
@Service
public class RevokeInviteUseCase {

    private final InviteRepository invites;

    public RevokeInviteUseCase(InviteRepository invites) {
        this.invites = invites;
    }

    @Transactional
    public InviteListView execute(long tenantId, UUID inviteId) {
        Invite invite = invites.findByIdAndTenant(InviteId.of(inviteId), TenantId.of(tenantId))
            .orElseThrow(() -> new InviteNotFoundException(inviteId.toString()));

        invite.revoke();
        Invite saved = invites.save(invite);
        return InviteListView.from(saved);
    }
}
