package com.groupws.tkws.features.crm.configuracoes.pipelines.domain.exception;

import com.groupws.tkws.shared.domain.DomainException;

public class PipelineCodigoDuplicadoException extends DomainException {
    public PipelineCodigoDuplicadoException(String codigo) {
        super("pipelines.codigo_duplicado", "Já existe pipeline com código '" + codigo + "'");
    }
}
