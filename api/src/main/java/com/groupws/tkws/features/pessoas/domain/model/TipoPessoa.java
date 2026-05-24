package com.groupws.tkws.features.pessoas.domain.model;

/**
 * Classificação fiscal da Pessoa.
 *   PF · pessoa física (CPF)
 *   PJ · pessoa jurídica (CNPJ)
 */
public enum TipoPessoa {
    PF,
    PJ;

    public boolean isFisica() { return this == PF; }
    public boolean isJuridica() { return this == PJ; }
}
