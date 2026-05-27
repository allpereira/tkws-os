package com.groupws.tkws.features.pessoas.domain.exception;

import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoRelacionamento;
import com.groupws.tkws.shared.domain.DomainException;

/**
 * Tipo de relacionamento incompatível com o tipo da Pessoa dona do contato.
 *
 * Ex.: tentar marcar um contato como SOCIO (relacionamento de PJ) numa Pessoa PF,
 * ou CONJUGE (relacionamento de PF) numa Pessoa PJ. Ver ADR-023.
 *
 * Mapeia para HTTP 422 via {@code GlobalExceptionHandler}.
 */
public class RelacionamentoIncompativelException extends DomainException {
    public RelacionamentoIncompativelException(TipoRelacionamento relacionamento, TipoPessoa tipoPessoa) {
        super("pessoas.relacionamento_incompativel",
            "Relacionamento %s não se aplica a uma pessoa do tipo %s"
                .formatted(relacionamento.name(), tipoPessoa.name()));
    }
}
