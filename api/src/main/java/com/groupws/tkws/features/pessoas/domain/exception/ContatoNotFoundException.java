package com.groupws.tkws.features.pessoas.domain.exception;

import com.groupws.tkws.features.pessoas.domain.model.ContatoId;
import com.groupws.tkws.shared.domain.DomainException;

/**
 * Contato não encontrado para o ID informado (dentro do tenant / pessoa atual).
 * Mapeia para HTTP 422 via {@code GlobalExceptionHandler}.
 */
public class ContatoNotFoundException extends DomainException {
    public ContatoNotFoundException(ContatoId id) {
        super("pessoas.contato_not_found", "Contato não encontrado: " + id);
    }
}
