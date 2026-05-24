package com.groupws.tkws.features.pessoas.domain.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Value Object · identificador único de uma Pessoa.
 * Tipado fortemente para evitar confusão entre IDs de diferentes agregados.
 */
public record PessoaId(UUID value) {

    public PessoaId {
        Objects.requireNonNull(value, "PessoaId value");
    }

    public static PessoaId generate() {
        return new PessoaId(UUID.randomUUID());
    }

    public static PessoaId of(UUID uuid) {
        return new PessoaId(uuid);
    }

    public static PessoaId of(String uuid) {
        return new PessoaId(UUID.fromString(uuid));
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
