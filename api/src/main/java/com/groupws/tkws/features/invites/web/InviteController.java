package com.groupws.tkws.features.invites.web;

import com.groupws.tkws.features.invites.application.dto.AcceptInviteCommand;
import com.groupws.tkws.features.invites.application.dto.CreateInviteCommand;
import com.groupws.tkws.features.invites.application.dto.InviteTokenInfoView;
import com.groupws.tkws.features.invites.application.dto.InviteView;
import com.groupws.tkws.features.invites.application.usecase.AcceptInviteUseCase;
import com.groupws.tkws.features.invites.application.usecase.CreateInviteUseCase;
import com.groupws.tkws.features.invites.application.usecase.GetInviteByTokenUseCase;
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
 * <ul>
 *   <li>{@code POST   /api/v1/invites}            — admin do tenant (auth)</li>
 *   <li>{@code GET    /api/v1/invites/by-token}   — público (lookup pela tela)</li>
 *   <li>{@code POST   /api/v1/invites/accept}     — público (consome o token)</li>
 * </ul>
 *
 * As duas rotas públicas precisam estar liberadas no {@code SecurityConfig}.
 */
@RestController
@RequestMapping("/api/v1/invites")
class InviteController {

    private final CreateInviteUseCase create;
    private final GetInviteByTokenUseCase byToken;
    private final AcceptInviteUseCase accept;

    InviteController(CreateInviteUseCase create, GetInviteByTokenUseCase byToken, AcceptInviteUseCase accept) {
        this.create = create;
        this.byToken = byToken;
        this.accept = accept;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN','SYSTEM_ADMIN')")
    public ResponseEntity<InviteView> createInvite(
        @Valid @RequestBody CreateInviteCommand cmd,
        @AuthenticationPrincipal Jwt jwt
    ) {
        UUID issuedBy = parseUserId(jwt.getSubject());
        String issuedByEmail = jwt.getClaimAsString("email");
        InviteView view = create.execute(cmd, issuedBy, issuedByEmail);
        return ResponseEntity.status(201).body(view);
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
