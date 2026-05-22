package com.groupws.tkws.features.invites.application.dto;

/**
 * Resposta pública do GET /api/v1/invites/by-token — só metadata visível para
 * a tela /accept-invite saber se renderiza ou mostra erro.
 *
 * NÃO inclui o token (o caller já o tem) nem zitadel_user_id.
 */
public record InviteTokenInfoView(
    boolean valid,
    String reason,        // null se valid=true; "expired" | "revoked" | "accepted" | "not_found"
    String email,
    String fullName,
    String role,
    String tenantName
) {
    public static InviteTokenInfoView invalid(String reason) {
        return new InviteTokenInfoView(false, reason, null, null, null, null);
    }

    public static InviteTokenInfoView valid(String email, String fullName, String role, String tenantName) {
        return new InviteTokenInfoView(true, null, email, fullName, role, tenantName);
    }
}
