package com.groupws.tkws.shared.crud;

import com.groupws.tkws.shared.domain.DomainException;

import java.util.UUID;

/** Lookup entry não encontrada para o id/tenant atual. */
public class LookupNotFoundException extends DomainException {
    public LookupNotFoundException(String tabela, UUID id) {
        super(tabela + ".not_found", tabela + " não encontrado: " + id);
    }
}
