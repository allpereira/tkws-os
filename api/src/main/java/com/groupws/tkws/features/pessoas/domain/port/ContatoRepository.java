package com.groupws.tkws.features.pessoas.domain.port;

import com.groupws.tkws.features.pessoas.domain.model.Contato;
import com.groupws.tkws.features.pessoas.domain.model.ContatoId;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;

import java.util.List;
import java.util.Optional;

/**
 * Port de persistência dos {@link Contato} de uma Pessoa. Implementação concreta
 * em `infrastructure/persistence/ContatoJpaRepositoryAdapter`. Sempre tenant-scoped.
 *
 * Ver ADR-023.
 */
public interface ContatoRepository {

    Contato save(Contato contato);

    Optional<Contato> findById(long tenantId, ContatoId id);

    /** Contatos de uma Pessoa, ordenados por criação (mais antigos primeiro). */
    List<Contato> listByPessoa(long tenantId, PessoaId pessoaId);

    void deleteById(long tenantId, ContatoId id);
}
