package com.groupws.tkws.features.invites.application.usecase;

import com.groupws.tkws.features.invites.application.dto.InviteTokenInfoView;
import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteStatus;
import com.groupws.tkws.features.invites.domain.model.InviteToken;
import com.groupws.tkws.features.invites.domain.port.InviteRepository;
import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Lookup público (sem auth) de um invite pelo token claro recebido no link.
 *
 * <p>Retorna sempre 200 com {@link InviteTokenInfoView} contendo {@code valid=false}
 * em vez de 404, pra não vazar a existência de tokens via timing/status code.
 */
@Service
public class GetInviteByTokenUseCase {

    private final InviteRepository invites;
    private final TenantRepository tenants;

    public GetInviteByTokenUseCase(InviteRepository invites, TenantRepository tenants) {
        this.invites = invites;
        this.tenants = tenants;
    }

    @Transactional(readOnly = true)
    public InviteTokenInfoView execute(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return InviteTokenInfoView.invalid("not_found");
        }
        String hash = InviteToken.hashOf(rawToken.trim());

        Invite invite = invites.findByTokenHash(hash).orElse(null);
        if (invite == null) {
            return InviteTokenInfoView.invalid("not_found");
        }

        if (invite.status() == InviteStatus.ACCEPTED) return InviteTokenInfoView.invalid("accepted");
        if (invite.status() == InviteStatus.REVOKED)  return InviteTokenInfoView.invalid("revoked");
        if (invite.status() == InviteStatus.EXPIRED || invite.isExpired(Instant.now())) {
            return InviteTokenInfoView.invalid("expired");
        }

        String tenantName = tenants.findById(invite.tenantId())
            .map(t -> t.name())
            .orElse("");

        return InviteTokenInfoView.valid(
            invite.email(), invite.fullName(), invite.role().key(), tenantName
        );
    }
}
