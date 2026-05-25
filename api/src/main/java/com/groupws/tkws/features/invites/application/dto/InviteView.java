package com.groupws.tkws.features.invites.application.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Vista do invite — usada na resposta de criação (admin) e em listagens.
 *
 * O campo {@code rawToken} só vem preenchido na RESPOSTA da criação;
 * em todas as outras situações é null. Isso evita que o token escape em logs
 * ou listagens.
 */
public record InviteView(
    UUID id,
    long tenantId,
    String email,
    String fullName,
    String role,
    String status,
    Instant expiresAt,
    Instant createdAt,
    String rawToken
) {}
