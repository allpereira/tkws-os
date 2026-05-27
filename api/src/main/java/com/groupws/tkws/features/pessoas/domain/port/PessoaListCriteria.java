package com.groupws.tkws.features.pessoas.domain.port;

import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;

/**
 * Critérios de filtragem da listagem de Pessoas (telas Leads/Clientes).
 *
 * Todos os campos são opcionais (null = sem filtro), exceto {@code sort} que
 * nunca é null (default {@link PessoaSort#RECENTE}). A busca textual {@code q}
 * casa em nome do contato, nome da empresa, email e — quando contém dígitos —
 * no documento normalizado.
 */
public record PessoaListCriteria(
    StatusPessoa status,
    String q,
    TipoPessoa tipoPessoa,
    String cidade,
    String uf,
    PessoaSort sort
) {
    public PessoaListCriteria {
        if (sort == null) sort = PessoaSort.RECENTE;
    }

    /** Atalho · só status (mantém compat com chamadas simples Lead/Cliente). */
    public static PessoaListCriteria ofStatus(StatusPessoa status) {
        return new PessoaListCriteria(status, null, null, null, null, PessoaSort.RECENTE);
    }
}
