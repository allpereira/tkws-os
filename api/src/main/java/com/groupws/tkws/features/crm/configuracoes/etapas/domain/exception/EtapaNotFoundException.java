package com.groupws.tkws.features.crm.configuracoes.etapas.domain.exception;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.shared.domain.DomainException;

public class EtapaNotFoundException extends DomainException {
    public EtapaNotFoundException(EtapaId id) {
        super("etapas.not_found", "Etapa não encontrada: " + id.value());
    }
}
