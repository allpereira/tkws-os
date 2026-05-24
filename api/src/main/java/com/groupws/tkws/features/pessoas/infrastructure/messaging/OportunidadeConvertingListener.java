package com.groupws.tkws.features.pessoas.infrastructure.messaging;

import com.groupws.tkws.features.crm.oportunidades.domain.event.OportunidadeMovedToConvertingEtapaEvent;
import com.groupws.tkws.features.pessoas.application.usecase.ConvertPessoaToClienteUseCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Listener no módulo de Pessoas que reage ao evento
 * {@link OportunidadeMovedToConvertingEtapaEvent} emitido pelo módulo de
 * Oportunidades quando uma Oportunidade entra numa etapa marcada como
 * conversão.
 *
 * Comportamento: promove a Pessoa associada para CLIENTE (idempotente —
 * se já é cliente, é no-op).
 *
 * Atende a regra de não acoplar módulos: Oportunidades não conhece
 * `PessoaRepository`; só dispara o evento. Pessoas consome.
 */
@Component
class OportunidadeConvertingListener {

    private static final Logger log = LoggerFactory.getLogger(OportunidadeConvertingListener.class);

    private final ConvertPessoaToClienteUseCase convertUseCase;

    OportunidadeConvertingListener(ConvertPessoaToClienteUseCase convertUseCase) {
        this.convertUseCase = convertUseCase;
    }

    @EventListener
    public void on(OportunidadeMovedToConvertingEtapaEvent event) {
        log.info("Oportunidade {} entrou em etapa de conversão · promovendo pessoa {} para CLIENTE",
            event.oportunidadeId().value(), event.pessoaId().value());
        convertUseCase.execute(event.tenantId(), event.pessoaId());
    }
}
