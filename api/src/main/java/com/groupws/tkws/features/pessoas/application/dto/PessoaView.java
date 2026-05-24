package com.groupws.tkws.features.pessoas.application.dto;

import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;

import java.time.Instant;
import java.util.UUID;

/**
 * View pública de uma Pessoa para a UI/API REST.
 *
 * O `documento` é exposto normalizado (só dígitos). UI formata para exibição.
 */
public record PessoaView(
    UUID id,
    UUID tenantId,
    TipoPessoa tipoPessoa,
    String documento,
    String nomeContato,
    String emailContato,
    String celularContato,
    String nomeEmpresa,
    StatusPessoa status,
    Instant convertidoEm,
    String endereco,
    String cidade,
    String uf,
    String cep,
    String notas,
    Instant createdAt,
    Instant updatedAt
) {
    public static PessoaView from(Pessoa p) {
        return new PessoaView(
            p.id().value(),
            p.tenantId(),
            p.tipoPessoa(),
            p.documento().map(d -> d.value()).orElse(null),
            p.nomeContato(),
            p.emailContato().orElse(null),
            p.celularContato().orElse(null),
            p.nomeEmpresa().orElse(null),
            p.status(),
            p.convertidoEm().orElse(null),
            p.endereco().orElse(null),
            p.cidade().orElse(null),
            p.uf().orElse(null),
            p.cep().orElse(null),
            p.notas().orElse(null),
            p.createdAt(),
            p.updatedAt()
        );
    }
}
