package com.groupws.tkws.features.invites.domain.model;

/**
 * Ciclo de vida de um convite.
 *
 * PENDING  → enviado, esperando aceite
 * ACCEPTED → consumido (one-shot, não reutilizável)
 * EXPIRED  → passou da janela {@code expires_at} sem aceite
 * REVOKED  → admin cancelou antes do aceite
 *
 * Ver ADR-016.
 */
public enum InviteStatus {
    PENDING,
    ACCEPTED,
    EXPIRED,
    REVOKED;

    public boolean isAcceptable() {
        return this == PENDING;
    }

    public boolean isTerminal() {
        return this == ACCEPTED || this == EXPIRED || this == REVOKED;
    }
}
