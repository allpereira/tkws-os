package com.groupws.tkws.features.invites.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

public class InviteNotFoundException extends DomainException {
    public InviteNotFoundException(String identifier) {
        super("invites.not_found", "Convite não encontrado: " + identifier, 404);
    }
}
