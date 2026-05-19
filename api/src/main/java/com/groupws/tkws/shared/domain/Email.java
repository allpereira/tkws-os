package com.groupws.tkws.shared.domain;

import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Value Object representando um endereço de e-mail válido.
 * Imutável e auto-validado.
 */
public record Email(String value) {

    private static final Pattern PATTERN = Pattern.compile(
        "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    public Email {
        Objects.requireNonNull(value, "Email não pode ser nulo");
        if (value.isBlank()) {
            throw new IllegalArgumentException("Email não pode ser vazio");
        }
        if (!PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Email inválido: " + value);
        }
        value = value.toLowerCase();
    }

    @Override
    public String toString() {
        return value;
    }
}
