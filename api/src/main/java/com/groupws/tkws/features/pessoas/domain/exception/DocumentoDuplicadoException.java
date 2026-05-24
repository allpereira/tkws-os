package com.groupws.tkws.features.pessoas.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

/**
 * Documento já cadastrado no mesmo tenant.
 *
 * Dispara HTTP 409 (Conflict) via GlobalExceptionHandler.
 * O frontend usa essa resposta para sugerir o cadastro existente em vez de
 * permitir duplicação (ver ADR-018 · seção "Detecção de duplicidade").
 */
public class DocumentoDuplicadoException extends DomainException {
    public DocumentoDuplicadoException(String documento) {
        super("pessoas.documento_duplicado",
            "Já existe uma pessoa cadastrada com este documento neste tenant: " + documento);
    }
}
