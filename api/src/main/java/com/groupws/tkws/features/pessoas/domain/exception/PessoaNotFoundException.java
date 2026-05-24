package com.groupws.tkws.features.pessoas.domain.exception;

import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.shared.domain.DomainException;

/**
 * Pessoa não encontrada para o ID informado dentro do tenant atual.
 */
public class PessoaNotFoundException extends DomainException {
    public PessoaNotFoundException(PessoaId id) {
        super("pessoas.not_found", "Pessoa não encontrada: " + id);
    }
}
