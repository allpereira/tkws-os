package com.groupws.tkws.features.invites.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

/** Já existe invite PENDING para a mesma (tenant, email). */
public class DuplicateInviteException extends DomainException {
    public DuplicateInviteException(String email) {
        super("invites.duplicate", "Já existe um convite pendente para " + email, 409);
    }
}
