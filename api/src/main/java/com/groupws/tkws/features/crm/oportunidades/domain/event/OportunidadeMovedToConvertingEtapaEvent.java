package com.groupws.tkws.features.crm.oportunidades.domain.event;

import com.groupws.tkws.features.crm.oportunidades.domain.model.OportunidadeId;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.shared.domain.DomainEvent;

import java.time.Instant;
import java.util.UUID;

/**
 * Emitido quando uma Oportunidade entra numa Etapa marcada com
 * `converte_lead_em_cliente = true`. Um listener no módulo de Pessoas
 * consome esse evento e promove a Pessoa de LEAD para CLIENTE.
 *
 * Garante o desacoplamento entre módulos: Oportunidades não conhece
 * `PessoaRepository`. Comunicação só por evento (ver CLAUDE.md regra 4:
 * "Features não se acessam diretamente — comunicam via eventos ou DTOs").
 */
public record OportunidadeMovedToConvertingEtapaEvent(
    UUID eventId,
    OportunidadeId oportunidadeId,
    PessoaId pessoaId,
    long tenantId,
    Instant occurredOn
) implements DomainEvent {
    public OportunidadeMovedToConvertingEtapaEvent(OportunidadeId oportunidadeId,
                                                   PessoaId pessoaId, long tenantId,
                                                   Instant occurredOn) {
        this(UUID.randomUUID(), oportunidadeId, pessoaId, tenantId, occurredOn);
    }
}
