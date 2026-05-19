package com.groupws.tkws.features.users.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

public class UserNotFoundException extends DomainException {
    public UserNotFoundException(String identifier) {
        super("USER_NOT_FOUND", "Usuário não encontrado: " + identifier);
    }
}
