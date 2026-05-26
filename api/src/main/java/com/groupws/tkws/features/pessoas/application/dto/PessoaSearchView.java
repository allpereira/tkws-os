package com.groupws.tkws.features.pessoas.application.dto;

import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;

import java.util.UUID;

/**
 * View "leve" de Pessoa para combobox de autocomplete.
 *
 * Contém apenas os campos necessários para o usuário escolher uma pessoa
 * numa lista de resultados de busca · evita serializar o agregado todo
 * (notas, endereço completo, timestamps).
 *
 * `documento` é retornado normalizado (só dígitos) · a UI formata para exibir.
 */
public record PessoaSearchView(
    UUID id,
    String nomeContato,
    String nomeEmpresa,
    TipoPessoa tipoPessoa,
    String documento,
    String cidade,
    String uf,
    StatusPessoa status
) {
    public static PessoaSearchView from(Pessoa p) {
        return new PessoaSearchView(
            p.id().value(),
            p.nomeContato(),
            p.nomeEmpresa().orElse(null),
            p.tipoPessoa(),
            p.documento().map(d -> d.value()).orElse(null),
            p.cidade().orElse(null),
            p.uf().orElse(null),
            p.status()
        );
    }
}
