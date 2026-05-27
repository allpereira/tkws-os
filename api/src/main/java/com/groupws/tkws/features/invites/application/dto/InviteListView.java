package com.groupws.tkws.features.invites.application.dto;

import com.groupws.tkws.features.invites.domain.model.Invite;

import java.time.Instant;
import java.util.UUID;

/**
 * Vista de listagem/administração de um convite.
 *
 * <p>Nunca expõe o token (nem claro nem hash) nem o {@code zitadel_user_id} —
 * é o que a tela de Usuários (admin) consome para listar e gerenciar convites.
 */
public record InviteListView(
    UUID id,
    String email,
    String fullName,
    String role,
    String status,
    Instant expiresAt,
    Instant createdAt,
    Instant acceptedAt,
    Instant revokedAt
) {
    public static InviteListView from(Invite invite) {
        return new InviteListView(
            invite.id().value(),
            invite.email(),
            invite.fullName(),
            invite.role().key(),
            invite.status().name(),
            invite.expiresAt(),
            invite.createdAt(),
            invite.acceptedAt(),
            invite.revokedAt()
        );
    }
}
