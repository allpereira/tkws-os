package com.groupws.tkws.features.pessoas.domain.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Value Object · identificador único de um {@link Contato}.
 * Tipado fortemente para não confundir com {@link PessoaId}.
 */
public record ContatoId(UUID value) {

    public ContatoId {
        Objects.requireNonNull(value, "ContatoId value");
    }

    public static ContatoId generate() {
        return new ContatoId(UUID.randomUUID());
    }

    public static ContatoId of(UUID uuid) {
        return new ContatoId(uuid);
    }

    public static ContatoId of(String uuid) {
        return new ContatoId(UUID.fromString(uuid));
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
