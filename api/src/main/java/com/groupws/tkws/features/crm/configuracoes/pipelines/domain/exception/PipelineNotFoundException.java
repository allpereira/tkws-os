package com.groupws.tkws.features.crm.configuracoes.pipelines.domain.exception;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.shared.domain.DomainException;

public class PipelineNotFoundException extends DomainException {
    public PipelineNotFoundException(PipelineId id) {
        super("pipelines.not_found", "Pipeline não encontrado: " + id.value());
    }
}
