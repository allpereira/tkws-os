package com.groupws.tkws.features.invites.domain.exception;

import com.groupws.tkws.features.invites.domain.model.InviteStatus;

/**
 * Lançada quando se tenta aceitar/revogar um invite que já saiu do estado PENDING
 * (já aceito, expirado ou revogado).
 */
public class InviteNotAcceptableException extends RuntimeException {

    private final InviteStatus status;

    public InviteNotAcceptableException(InviteStatus status) {
        super("Convite não está pendente (status atual: " + status + ")");
        this.status = status;
    }

    public InviteStatus status() {
        return status;
    }
}
