package com.groupws.tkws.shared.crud;

import com.groupws.tkws.shared.domain.DomainException;

/** Tentativa de cadastrar lookup entry com `codigo` já usado no mesmo tenant. */
public class LookupCodigoDuplicadoException extends DomainException {
    public LookupCodigoDuplicadoException(String tabela, String codigo) {
        super(tabela + ".codigo_duplicado",
            "Já existe " + tabela + " com código '" + codigo + "' neste tenant");
    }
}
