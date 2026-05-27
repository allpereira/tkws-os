package com.groupws.tkws.features.invites.application.usecase;

import com.groupws.tkws.features.invites.application.dto.InviteListView;
import com.groupws.tkws.features.invites.domain.exception.InviteNotFoundException;
import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteId;
import com.groupws.tkws.features.invites.domain.model.InviteToken;
import com.groupws.tkws.features.invites.domain.port.InviteNotifier;
import com.groupws.tkws.features.invites.domain.port.InviteRepository;
import com.groupws.tkws.features.tenants.domain.exception.TenantNotFoundException;
import com.groupws.tkws.features.tenants.domain.model.Tenant;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

/**
 * Reenvia um convite PENDING: gera um novo token (invalida o link antigo),
 * estende a validade e dispara o email novamente. Tenant-scoped.
 *
 * <p>Só faz sentido em estado PENDING — convites aceitos/expirados/revogados
 * lançam {@link com.groupws.tkws.features.invites.domain.exception.InviteNotAcceptableException}
 * via {@code Invite.rotateToken}.
 */
@Service
public class ResendInviteUseCase {

    private static final Logger log = LoggerFactory.getLogger(ResendInviteUseCase.class);

    private final InviteRepository invites;
    private final TenantRepository tenants;
    private final InviteNotifier notifier;
    private final Duration ttl;
    private final String acceptBaseUrl;

    public ResendInviteUseCase(
        InviteRepository invites,
        TenantRepository tenants,
        InviteNotifier notifier,
        @Value("${tkws.invites.ttl:P7D}") Duration ttl,
        @Value("${tkws.invites.accept-base-url:http://localhost:5174/accept-invite}") String acceptBaseUrl
    ) {
        this.invites = invites;
        this.tenants = tenants;
        this.notifier = notifier;
        this.ttl = ttl;
        this.acceptBaseUrl = acceptBaseUrl;
    }

    @Transactional
    public InviteListView execute(long tenantId, UUID inviteId) {
        Invite invite = invites.findByIdAndTenant(InviteId.of(inviteId), TenantId.of(tenantId))
            .orElseThrow(() -> new InviteNotFoundException(inviteId.toString()));

        Tenant tenant = tenants.findById(invite.tenantId())
            .orElseThrow(() -> new TenantNotFoundException(invite.tenantId().toString()));

        // Rotaciona o token (invalida o link antigo) e estende a validade.
        InviteToken token = InviteToken.generate();
        invite.rotateToken(token.hashHex(), ttl);
        Invite saved = invites.save(invite);

        String acceptUrl = acceptBaseUrl + "?token=" + token.value();
        notifier.sendInviteEmail(saved, token.value(), tenant.name(), acceptUrl);
        log.info("Invite reenviado: inviteId={} to={} tenant={}", saved.id(), saved.email(), tenant.name());

        return InviteListView.from(saved);
    }
}
