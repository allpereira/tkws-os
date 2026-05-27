package com.groupws.tkws.features.pessoas.application.dto;

import com.groupws.tkws.features.pessoas.domain.model.Contato;
import com.groupws.tkws.features.pessoas.domain.model.TipoRelacionamento;

import java.time.Instant;
import java.util.UUID;

/**
 * View pública de um {@link Contato} para a UI/API REST. Ver ADR-023.
 */
public record ContatoView(
    UUID id,
    UUID pessoaId,
    String nome,
    String email,
    String telefone,
    TipoRelacionamento tipoRelacionamento,
    Instant createdAt,
    Instant updatedAt
) {
    public static ContatoView from(Contato c) {
        return new ContatoView(
            c.id().value(),
            c.pessoaId().value(),
            c.nome(),
            c.email().orElse(null),
            c.telefone().orElse(null),
            c.tipoRelacionamento(),
            c.createdAt(),
            c.updatedAt()
        );
    }
}
