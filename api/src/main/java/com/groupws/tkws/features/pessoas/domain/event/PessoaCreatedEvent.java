package com.groupws.tkws.features.pessoas.domain.event;

import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.shared.domain.DomainEvent;

import java.time.Instant;
import java.util.UUID;

public record PessoaCreatedEvent(
    UUID eventId,
    PessoaId pessoaId,
    long tenantId,
    TipoPessoa tipoPessoa,
    StatusPessoa status,
    Instant occurredOn
) implements DomainEvent {

    public PessoaCreatedEvent(PessoaId pessoaId, long tenantId, TipoPessoa tipoPessoa,
                              StatusPessoa status, Instant occurredOn) {
        this(UUID.randomUUID(), pessoaId, tenantId, tipoPessoa, status, occurredOn);
    }
}
