package com.groupws.tkws.features.invites.web;

import com.groupws.tkws.features.invites.application.dto.AcceptInviteCommand;
import com.groupws.tkws.features.invites.application.dto.CreateInviteCommand;
import com.groupws.tkws.features.invites.application.dto.InviteListView;
import com.groupws.tkws.features.invites.application.dto.InviteTokenInfoView;
import com.groupws.tkws.features.invites.application.dto.InviteView;
import com.groupws.tkws.features.invites.application.usecase.AcceptInviteUseCase;
import com.groupws.tkws.features.invites.application.usecase.CreateInviteUseCase;
import com.groupws.tkws.features.invites.application.usecase.GetInviteByTokenUseCase;
import com.groupws.tkws.features.invites.application.usecase.ListInvitesUseCase;
import com.groupws.tkws.features.invites.application.usecase.ResendInviteUseCase;
import com.groupws.tkws.features.invites.application.usecase.RevokeInviteUseCase;
import com.groupws.tkws.features.invites.domain.model.InviteStatus;
import com.groupws.tkws.shared.page.PageResponse;
import com.groupws.tkws.shared.web.tenant.CurrentTenant;
import com.groupws.tkws.shared.web.tenant.TenantContext;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Endpoints de convite de membros para tenants existentes.
 *
 * <p>Fluxo: o admin cria o convite → o sistema cria um user shell (sem senha/role)
 * no Zitadel e envia um magic link por email → o convidado só ganha acesso de fato
 * ao clicar no link e definir a senha (a aceitação é a confirmação do email).
 *
 * <ul>
 *   <li>{@code POST   /api/v1/invites}              — admin do tenant (auth)</li>
 *   <li>{@code GET    /api/v1/invites}              — admin do tenant · listagem paginada</li>
 *   <li>{@code POST   /api/v1/invites/{id}/revoke}  — admin cancela convite PENDING</li>
 *   <li>{@code POST   /api/v1/invites/{id}/resend}  — admin reenvia (rotaciona token)</li>
 *   <li>{@code GET    /api/v1/invites/by-token}     — público (lookup pela tela)</li>
 *   <li>{@code POST   /api/v1/invites/accept}       — público (consome o token)</li>
 * </ul>
 *
 * Multi-tenancy: o tenant é resolvido via {@code @CurrentTenant} (JWT ou header
 * {@code X-Tenant-Id} para SYSTEM_ADMIN) — nunca via body/param. Ver ADR-019.
 * As duas rotas públicas precisam estar liberadas no {@code SecurityConfig}.
 */
@RestController
@RequestMapping("/api/v1/invites")
class InviteController {

    private final CreateInviteUseCase create;
    private final ListInvitesUseCase list;
    private final RevokeInviteUseCase revoke;
    private final ResendInviteUseCase resend;
    private final GetInviteByTokenUseCase byToken;
    private final AcceptInviteUseCase accept;

    InviteController(CreateInviteUseCase create, ListInvitesUseCase list,
                     RevokeInviteUseCase revoke, ResendInviteUseCase resend,
                     GetInviteByTokenUseCase byToken, AcceptInviteUseCase accept) {
        this.create = create;
        this.list = list;
        this.revoke = revoke;
        this.resend = resend;
        this.byToken = byToken;
        this.accept = accept;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN','SYSTEM_ADMIN')")
    public ResponseEntity<InviteView> createInvite(
        @CurrentTenant TenantContext tenant,
        @Valid @RequestBody CreateInviteCommand cmd,
        @AuthenticationPrincipal Jwt jwt
    ) {
        UUID issuedBy = parseUserId(jwt.getSubject());
        String issuedByEmail = jwt.getClaimAsString("email");
        InviteView view = create.execute(cmd, tenant.tenantId(), issuedBy, issuedByEmail);
        return ResponseEntity.status(201).body(view);
    }

    /** Listagem paginada (tela de Usuários). Filtro opcional por status. */
    @GetMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN','SYSTEM_ADMIN')")
    public ResponseEntity<PageResponse<InviteListView>> listInvites(
        @CurrentTenant TenantContext tenant,
        @RequestParam(required = false) InviteStatus status,
        @RequestParam(defaultValue = "50") int limit,
        @RequestParam(defaultValue = "0") int offset
    ) {
        return ResponseEntity.ok(list.execute(tenant.tenantId(), status, limit, offset));
    }

    /** Cancela um convite PENDING. Idempotência não garantida (segundo revoke → 410). */
    @PostMapping("/{id}/revoke")
    @PreAuthorize("hasAnyRole('ORG_ADMIN','SYSTEM_ADMIN')")
    public ResponseEntity<InviteListView> revokeInvite(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(revoke.execute(tenant.tenantId(), id));
    }

    /** Reenvia o convite gerando um novo token e estendendo a validade. */
    @PostMapping("/{id}/resend")
    @PreAuthorize("hasAnyRole('ORG_ADMIN','SYSTEM_ADMIN')")
    public ResponseEntity<InviteListView> resendInvite(
        @CurrentTenant TenantContext tenant,
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(resend.execute(tenant.tenantId(), id));
    }

    @GetMapping("/by-token")
    public InviteTokenInfoView byToken(@RequestParam("token") String token) {
        return byToken.execute(token);
    }

    @PostMapping("/accept")
    public InviteTokenInfoView acceptInvite(@Valid @RequestBody AcceptInviteCommand cmd) {
        return accept.execute(cmd);
    }

    /**
     * O subject do JWT do Zitadel pode ser numeric (snowflake) — não é UUID.
     * Retornamos null nesse caso; o use case só usa o ID pra auditoria.
     */
    private static UUID parseUserId(String subject) {
        try {
            return UUID.fromString(subject);
        } catch (Exception e) {
            return null;
        }
    }
}
