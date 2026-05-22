package com.groupws.tkws.features.invites.domain.exception;

/** Já existe invite PENDING para a mesma (tenant, email). */
public class DuplicateInviteException extends RuntimeException {
    public DuplicateInviteException(String email) {
        super("Já existe um convite pendente para " + email);
    }
}
