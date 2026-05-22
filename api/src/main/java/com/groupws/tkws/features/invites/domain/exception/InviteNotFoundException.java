package com.groupws.tkws.features.invites.domain.exception;

public class InviteNotFoundException extends RuntimeException {
    public InviteNotFoundException(String identifier) {
        super("Convite não encontrado: " + identifier);
    }
}
