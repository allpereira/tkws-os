package com.groupws.tkws.features.pessoas.domain.model;

import com.groupws.tkws.features.pessoas.domain.exception.DocumentoInvalidoException;

import java.util.Objects;

/**
 * Value Object · CPF ou CNPJ normalizado (apenas dígitos).
 *
 * Validação de dígitos verificadores fica para um futuro · hoje validamos
 * apenas tamanho e que sejam só dígitos. Backend confia em verificação
 * mais profunda quando necessário (integração com Receita, e.g.).
 *
 * Imutável, comparável por valor.
 */
public final class Documento {

    private final String valor;
    private final TipoPessoa tipo;

    private Documento(String valor, TipoPessoa tipo) {
        this.valor = valor;
        this.tipo = tipo;
    }

    /**
     * Cria um Documento a partir do tipo esperado e do valor informado.
     * Aceita valor formatado ("123.456.789-00") · armazena só dígitos.
     *
     * @throws DocumentoInvalidoException se o número de dígitos não bater com o tipo.
     */
    public static Documento of(TipoPessoa tipo, String rawValor) {
        Objects.requireNonNull(tipo, "tipo");
        Objects.requireNonNull(rawValor, "valor");

        String digits = rawValor.replaceAll("\\D", "");
        if (digits.isEmpty()) {
            throw new DocumentoInvalidoException("Documento vazio");
        }
        int expected = tipo == TipoPessoa.PF ? 11 : 14;
        if (digits.length() != expected) {
            throw new DocumentoInvalidoException(
                "Documento %s esperava %d dígitos · recebeu %d (%s)"
                    .formatted(tipo.name(), expected, digits.length(), digits)
            );
        }
        return new Documento(digits, tipo);
    }

    public String value() { return valor; }
    public TipoPessoa tipo() { return tipo; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Documento other)) return false;
        return valor.equals(other.valor) && tipo == other.tipo;
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor, tipo);
    }

    @Override
    public String toString() {
        return tipo + ":" + valor;
    }
}
