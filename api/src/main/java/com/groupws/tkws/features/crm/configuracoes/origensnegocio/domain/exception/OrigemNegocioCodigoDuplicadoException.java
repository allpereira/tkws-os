package com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

public class OrigemNegocioCodigoDuplicadoException extends DomainException {
    public OrigemNegocioCodigoDuplicadoException(String codigo) {
        super("origens_negocio.codigo_duplicado", "Já existe origem de negócio com código '" + codigo + "'");
    }
}
