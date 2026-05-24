package com.groupws.tkws.features.crm.configuracoes.etapas.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

public class EtapaCodigoDuplicadoException extends DomainException {
    public EtapaCodigoDuplicadoException(String codigo) {
        super("etapas.codigo_duplicado", "Já existe etapa com código '" + codigo + "'");
    }
}
