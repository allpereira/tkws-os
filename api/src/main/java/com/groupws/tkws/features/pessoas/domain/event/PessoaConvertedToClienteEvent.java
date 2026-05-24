package com.groupws.tkws.features.pessoas.domain.event;

import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.shared.domain.DomainEvent;

import java.time.Instant;
import java.util.UUID;

/**
 * Emitido quando uma Pessoa muda de LEAD para CLIENTE.
 *
 * Consumidor esperado: módulo de Atendimento (quando uma Oportunidade entra
 * em etapa com `converte_lead_em_cliente=true`, dispara o use case que carrega
 * a Pessoa e chama `convertToCliente()` — esse evento é o reflexo dessa promoção).
 *
 * Pode ser consumido para: notificar vendedor, registrar timeline, etc.
 */
public record PessoaConvertedToClienteEvent(
    UUID eventId,
    PessoaId pessoaId,
    UUID tenantId,
    Instant occurredOn
) implements DomainEvent {

    public PessoaConvertedToClienteEvent(PessoaId pessoaId, UUID tenantId, Instant occurredOn) {
        this(UUID.randomUUID(), pessoaId, tenantId, occurredOn);
    }
}
