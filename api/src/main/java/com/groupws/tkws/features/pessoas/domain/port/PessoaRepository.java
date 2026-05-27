package com.groupws.tkws.features.pessoas.domain.port;

import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;

import java.util.List;
import java.util.Optional;

/**
 * Port de persistência de Pessoas. Implementação concreta vive em
 * `infrastructure/persistence/PessoaJpaRepositoryAdapter`.
 *
 * Métodos de dedup explicitam o caso de uso: encontrar pessoa existente
 * antes de criar Lead novo (ver ADR-018, "Detecção de duplicidade").
 *
 * `tenantId` é o BIGINT local (PK em tenants.id).
 */
public interface PessoaRepository {

    Pessoa save(Pessoa pessoa);

    Optional<Pessoa> findById(long tenantId, PessoaId id);

    /**
     * Busca exata por documento normalizado (só dígitos). Retorna a única
     * pessoa daquele tenant com aquele CPF/CNPJ, se existir.
     */
    Optional<Pessoa> findByDocumento(long tenantId, String documentoNormalizado);

    /**
     * Busca soft por email ou celular (qualquer um) · pode retornar várias.
     * Usado para sugerir cadastros existentes antes da criação de Lead novo.
     * A normalização do celular (só dígitos) é responsabilidade do caller.
     */
    List<Pessoa> findByEmailOuCelular(long tenantId, String email, String celular);

    /**
     * Lista paginada (offset/limit) com filtros e ordenação · ver
     * {@link PessoaListCriteria}. Usada pelas telas Leads e Clientes, que são
     * views sobre esta mesma tabela. Sempre tenant-scoped.
     *
     * O saneamento de {@code limit} (teto 100) e {@code offset} é feito pelo
     * adapter. Use {@link #count(long, PessoaListCriteria)} com os mesmos
     * critérios para obter o total e montar o envelope de paginação.
     */
    List<Pessoa> list(long tenantId, PessoaListCriteria criteria, int limit, int offset);

    /** Total de pessoas que casam com os critérios (ignora paginação). */
    long count(long tenantId, PessoaListCriteria criteria);

    /**
     * Busca livre por autocomplete · usada pelo Combobox async no frontend.
     *
     * Casa parcialmente (case-insensitive) em `nome_contato`, `nome_empresa`
     * e também em `documento` quando o termo contém dígitos (procura pela
     * sequência normalizada). Sempre tenant-scoped · ordena matches no
     * início do nome primeiro, depois pelo `createdAt` desc.
     *
     * O caller passa a query crua (com ou sem máscara). A normalização para
     * dígitos é feita pelo adapter.
     */
    List<Pessoa> search(long tenantId, String query, int limit);

    boolean existsByDocumento(long tenantId, String documentoNormalizado);
}
