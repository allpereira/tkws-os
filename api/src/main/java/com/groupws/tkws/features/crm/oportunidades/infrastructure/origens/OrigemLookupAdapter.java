package com.groupws.tkws.features.crm.oportunidades.infrastructure.origens;

import com.groupws.tkws.features.crm.configuracoes.origensnegocio.application.OrigemNegocioService;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.application.OrigemNegocioView;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.exception.OrigemNegocioNotFoundException;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model.OrigemNegocioId;
import com.groupws.tkws.features.crm.oportunidades.domain.port.OrigemLookup;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * Implementação do port {@link OrigemLookup} · usa o
 * {@link OrigemNegocioService} (Application do módulo Origens de Negócio) para
 * descobrir as flags da origem selecionada.
 *
 * Note que NÃO importa JpaEntity de Origens · só o service público.
 */
@Component
class OrigemLookupAdapter implements OrigemLookup {

    private final OrigemNegocioService origemService;

    OrigemLookupAdapter(OrigemNegocioService origemService) {
        this.origemService = origemService;
    }

    @Override
    public Optional<OrigemInfo> findOrigem(long tenantId, UUID origemId) {
        if (origemId == null) {
            return Optional.empty();
        }
        try {
            OrigemNegocioView view = origemService.findById(tenantId, OrigemNegocioId.of(origemId));
            return Optional.of(new OrigemInfo(view.id(), view.exigeParceiro(), view.exigeDetalhe()));
        } catch (OrigemNegocioNotFoundException e) {
            return Optional.empty();
        }
    }
}
