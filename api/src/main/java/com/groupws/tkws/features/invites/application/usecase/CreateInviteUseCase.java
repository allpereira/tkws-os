package com.groupws.tkws.features.invites.application.usecase;

import com.groupws.tkws.features.invites.application.dto.CreateInviteCommand;
import com.groupws.tkws.features.invites.application.dto.InviteView;
import com.groupws.tkws.features.invites.domain.exception.DuplicateInviteException;
import com.groupws.tkws.features.invites.domain.model.Invite;
import com.groupws.tkws.features.invites.domain.model.InviteRole;
import com.groupws.tkws.features.invites.domain.model.InviteToken;
import com.groupws.tkws.features.invites.domain.port.IdentityProvider;
import com.groupws.tkws.features.invites.domain.port.InviteNotifier;
import com.groupws.tkws.features.invites.domain.port.InviteRepository;
import com.groupws.tkws.features.tenants.domain.exception.TenantNotFoundException;
import com.groupws.tkws.features.tenants.domain.model.Tenant;
import com.groupws.tkws.features.tenants.domain.model.TenantId;
import com.groupws.tkws.features.tenants.domain.port.TenantRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

/**
 * Cria um invite, cria o user shell no IdP, persiste e dispara notificações.
 *
 * <p>Ordem de operações (best-effort):
 * <ol>
 *   <li>Valida tenant existe</li>
 *   <li>Checa duplicate PENDING</li>
 *   <li>Cria user shell no Zitadel (sem senha)</li>
 *   <li>Gera token + grava invite</li>
 *   <li>Envia email para o convidado</li>
 *   <li>Notifica admin (Telegram / log)</li>
 * </ol>
 *
 * Se o passo 5 ou 6 falhar, o invite fica persistido — o admin pode reenviar.
 */
@Service
public class CreateInviteUseCase {

    private final InviteRepository invites;
    private final TenantRepository tenants;
    private final IdentityProvider idp;
    private final InviteNotifier notifier;
    private final Duration ttl;
    private final String acceptBaseUrl;

    public CreateInviteUseCase(
        InviteRepository invites,
        TenantRepository tenants,
        IdentityProvider idp,
        InviteNotifier notifier,
        @Value("${tkws.invites.ttl:P7D}") Duration ttl,
        @Value("${tkws.invites.accept-base-url:http://localhost:5174/accept-invite}") String acceptBaseUrl
    ) {
        this.invites = invites;
        this.tenants = tenants;
        this.idp = idp;
        this.notifier = notifier;
        this.ttl = ttl;
        this.acceptBaseUrl = acceptBaseUrl;
    }

    @Transactional
    public InviteView execute(CreateInviteCommand cmd, UUID issuedByUserId, String issuedByEmail) {
        TenantId tenantId = TenantId.of(cmd.tenantId());
        Tenant tenant = tenants.findById(tenantId)
            .orElseThrow(() -> new TenantNotFoundException(tenantId.toString()));

        String email = cmd.email().trim().toLowerCase();
        if (invites.existsPending(tenantId, email)) {
            throw new DuplicateInviteException(email);
        }

        InviteRole role = InviteRole.fromKey(cmd.role());

        // Cria o user shell no Zitadel (sem senha, email pré-verificado).
        String zitadelUserId = idp.createShellUser(tenant.zitadelOrgId(), email, cmd.fullName());

        // Gera token claro + persiste só o hash.
        InviteToken token = InviteToken.generate();
        Invite invite = Invite.issue(tenantId, email, cmd.fullName(), role,
            token.hashHex(), ttl, issuedByUserId);
        invite.attachZitadelUser(zitadelUserId);
        Invite saved = invites.save(invite);

        // Notifica em best-effort — falhas aqui não derrubam a transação principal.
        String acceptUrl = acceptBaseUrl + "?token=" + token.value();
        try {
            notifier.sendInviteEmail(saved, token.value(), tenant.name(), acceptUrl);
        } catch (RuntimeException ex) {
            // log mas não rollback — admin pode reenviar
            org.slf4j.LoggerFactory.getLogger(CreateInviteUseCase.class)
                .warn("Falha ao enviar email do invite {}: {}", saved.id(), ex.getMessage());
        }
        try {
            notifier.notifyAdminOfNewInvite(saved, tenant.name(), issuedByEmail);
        } catch (RuntimeException ex) {
            org.slf4j.LoggerFactory.getLogger(CreateInviteUseCase.class)
                .warn("Falha ao notificar admin sobre invite {}: {}", saved.id(), ex.getMessage());
        }

        return new InviteView(
            saved.id().value(), tenantId.value(), saved.email(), saved.fullName(),
            saved.role().key(), saved.status().name(), saved.expiresAt(), saved.createdAt(),
            token.value()  // único momento em que o token claro vai pra resposta
        );
    }
}
