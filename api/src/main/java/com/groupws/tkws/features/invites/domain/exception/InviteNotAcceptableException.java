package com.groupws.tkws.features.invites.domain.exception;

import com.groupws.tkws.features.invites.domain.model.InviteStatus;
import com.groupws.tkws.shared.domain.DomainException;

/**
 * Lançada quando se tenta aceitar/revogar um invite que já saiu do estado PENDING
 * (já aceito, expirado ou revogado). 410 GONE — a SPA /accept-invite trata esse
 * status como "expirou/já usado".
 */
public class InviteNotAcceptableException extends DomainException {

    private final InviteStatus status;

    public InviteNotAcceptableException(InviteStatus status) {
        super("invites.not_acceptable", "Convite não está pendente (status atual: " + status + ")", 410);
        this.status = status;
    }

    public InviteStatus status() {
        return status;
    }
}
