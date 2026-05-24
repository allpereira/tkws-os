package com.groupws.tkws.features.pessoas.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

/**
 * Documento (CPF/CNPJ) com tamanho/formato inválido para o tipo de pessoa.
 */
public class DocumentoInvalidoException extends DomainException {
    public DocumentoInvalidoException(String message) {
        super("pessoas.documento_invalido", message);
    }
}
