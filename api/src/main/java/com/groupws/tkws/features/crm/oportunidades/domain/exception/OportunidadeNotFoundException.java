package com.groupws.tkws.features.crm.oportunidades.domain.exception;

import com.groupws.tkws.features.crm.oportunidades.domain.model.OportunidadeId;
import com.groupws.tkws.shared.domain.DomainException;

public class OportunidadeNotFoundException extends DomainException {
    public OportunidadeNotFoundException(OportunidadeId id) {
        super("oportunidades.not_found", "Oportunidade não encontrada: " + id.value());
    }
}
