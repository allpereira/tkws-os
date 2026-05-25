package com.groupws.tkws.features.crm.oportunidades.infrastructure.etapas;

import com.groupws.tkws.features.crm.configuracoes.etapas.application.EtapaService;
import com.groupws.tkws.features.crm.configuracoes.etapas.application.EtapaView;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.exception.EtapaNotFoundException;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.oportunidades.domain.port.EtapaLookup;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Implementação do port {@link EtapaLookup} · usa o {@link EtapaService}
 * (que é da Application do módulo Etapas) para descobrir se a etapa
 * converte lead em cliente.
 *
 * Note que NÃO importa JpaEntity de Etapas · só o service público.
 */
@Component
class EtapaLookupAdapter implements EtapaLookup {

    private final EtapaService etapaService;

    EtapaLookupAdapter(EtapaService etapaService) {
        this.etapaService = etapaService;
    }

    @Override
    public Optional<EtapaInfo> findEtapa(long tenantId, EtapaId etapaId) {
        try {
            EtapaView view = etapaService.findById(tenantId, etapaId);
            return Optional.of(new EtapaInfo(EtapaId.of(view.id()), view.converteLeadEmCliente()));
        } catch (EtapaNotFoundException e) {
            return Optional.empty();
        }
    }
}
