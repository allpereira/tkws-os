package com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.exception;

import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model.OrigemNegocioId;
import com.groupws.tkws.shared.domain.DomainException;

public class OrigemNegocioNotFoundException extends DomainException {
    public OrigemNegocioNotFoundException(OrigemNegocioId id) {
        super("origens_negocio.not_found", "Origem de negócio não encontrada: " + id.value());
    }
}
