package com.groupws.tkws.features.pessoas.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

/**
 * Documento (CPF/CNPJ) já cadastrado no mesmo tenant.
 *
 * Dispara HTTP 422 via GlobalExceptionHandler. A mensagem (`detail`) é escrita
 * para o usuário final — sem jargão interno ("tenant") — pois o frontend a
 * exibe diretamente. Ver ADR-018 · seção "Detecção de duplicidade".
 */
public class DocumentoDuplicadoException extends DomainException {
    public DocumentoDuplicadoException(String documento) {
        super("pessoas.documento_duplicado",
            "Já existe um cadastro com o documento " + documento
                + ". Verifique se a pessoa não está cadastrada.");
    }
}
