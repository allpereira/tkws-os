package com.groupws.tkws.features.pessoas.domain.port;

import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Port de persistência de Pessoas. Implementação concreta vive em
 * `infrastructure/persistence/PessoaJpaRepositoryAdapter`.
 *
 * Métodos de dedup explicitam o caso de uso: encontrar pessoa existente
 * antes de criar Lead novo (ver ADR-018, "Detecção de duplicidade").
 */
public interface PessoaRepository {

    Pessoa save(Pessoa pessoa);

    Optional<Pessoa> findById(UUID tenantId, PessoaId id);

    /**
     * Busca exata por documento normalizado (só dígitos). Retorna a única
     * pessoa daquele tenant com aquele CPF/CNPJ, se existir.
     */
    Optional<Pessoa> findByDocumento(UUID tenantId, String documentoNormalizado);

    /**
     * Busca soft por email ou celular (qualquer um) · pode retornar várias.
     * Usado para sugerir cadastros existentes antes da criação de Lead novo.
     * A normalização do celular (só dígitos) é responsabilidade do caller.
     */
    List<Pessoa> findByEmailOuCelular(UUID tenantId, String email, String celular);

    /**
     * Lista paginada simples (sem cursor) · filtrada por status quando
     * informado. Usado pelas telas Leads e Clientes do frontend, que são
     * apenas views sobre essa mesma tabela.
     */
    List<Pessoa> list(UUID tenantId, StatusPessoa statusOuNull, int limit, int offset);

    boolean existsByDocumento(UUID tenantId, String documentoNormalizado);
}
