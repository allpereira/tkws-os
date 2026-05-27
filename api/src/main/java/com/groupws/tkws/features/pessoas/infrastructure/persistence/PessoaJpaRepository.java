package com.groupws.tkws.features.pessoas.infrastructure.persistence;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface PessoaJpaRepository extends JpaRepository<PessoaJpaEntity, UUID> {

    Optional<PessoaJpaEntity> findByIdAndTenantId(UUID id, Long tenantId);

    Optional<PessoaJpaEntity> findByTenantIdAndDocumento(Long tenantId, String documento);

    boolean existsByTenantIdAndDocumento(Long tenantId, String documento);

    /**
     * Soft match · email OU celular (qualquer um). NULL não conta como match.
     */
    @Query("""
        SELECT p FROM PessoaJpaEntity p
        WHERE p.tenantId = :tenantId
          AND (
                (:email IS NOT NULL AND p.emailContato = :email)
             OR (:celular IS NOT NULL AND p.celularContato = :celular)
          )
        ORDER BY p.createdAt DESC
    """)
    List<PessoaJpaEntity> findByEmailOrCelular(
        @Param("tenantId") Long tenantId,
        @Param("email") String email,
        @Param("celular") String celular
    );

    /**
     * Listagem filtrada das telas Leads/Clientes. Todos os filtros são
     * opcionais (param null = ignora). A ordenação vem do {@code Pageable}
     * (o adapter monta o {@code Sort} a partir do enum PessoaSort).
     *
     * `q` casa em nome do contato, nome da empresa, email e — quando
     * `qDigits` não é vazio — no documento normalizado.
     *
     * Os parâmetros opcionais (string) usam {@code CAST(... AS string)} para
     * fixar o tipo do bind: sem isso o driver PostgreSQL infere {@code bytea}
     * para parâmetros nulos e a query quebra com
     * {@code function lower(bytea) does not exist}.
     */
    @Query("""
        SELECT p FROM PessoaJpaEntity p
        WHERE p.tenantId = :tenantId
          AND (CAST(:status AS string) IS NULL OR p.status = CAST(:status AS string))
          AND (CAST(:tipo AS string) IS NULL OR p.tipoPessoa = CAST(:tipo AS string))
          AND (CAST(:uf AS string) IS NULL OR p.uf = CAST(:uf AS string))
          AND (CAST(:cidade AS string) IS NULL OR LOWER(p.cidade) LIKE LOWER(CONCAT('%', CAST(:cidade AS string), '%')))
          AND (CAST(:q AS string) IS NULL
                OR LOWER(p.nomeContato) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%'))
                OR (p.nomeEmpresa IS NOT NULL AND LOWER(p.nomeEmpresa) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')))
                OR (p.emailContato IS NOT NULL AND LOWER(p.emailContato) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')))
                OR (:qDigits <> '' AND p.documento IS NOT NULL AND p.documento LIKE CONCAT('%', :qDigits, '%'))
          )
    """)
    List<PessoaJpaEntity> listFiltered(
        @Param("tenantId") Long tenantId,
        @Param("status") String status,
        @Param("tipo") String tipo,
        @Param("uf") String uf,
        @Param("cidade") String cidade,
        @Param("q") String q,
        @Param("qDigits") String qDigits,
        Pageable pageable
    );

    /** Total de registros que casam com os mesmos filtros de {@link #listFiltered}. */
    @Query("""
        SELECT COUNT(p) FROM PessoaJpaEntity p
        WHERE p.tenantId = :tenantId
          AND (CAST(:status AS string) IS NULL OR p.status = CAST(:status AS string))
          AND (CAST(:tipo AS string) IS NULL OR p.tipoPessoa = CAST(:tipo AS string))
          AND (CAST(:uf AS string) IS NULL OR p.uf = CAST(:uf AS string))
          AND (CAST(:cidade AS string) IS NULL OR LOWER(p.cidade) LIKE LOWER(CONCAT('%', CAST(:cidade AS string), '%')))
          AND (CAST(:q AS string) IS NULL
                OR LOWER(p.nomeContato) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%'))
                OR (p.nomeEmpresa IS NOT NULL AND LOWER(p.nomeEmpresa) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')))
                OR (p.emailContato IS NOT NULL AND LOWER(p.emailContato) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')))
                OR (:qDigits <> '' AND p.documento IS NOT NULL AND p.documento LIKE CONCAT('%', :qDigits, '%'))
          )
    """)
    long countFiltered(
        @Param("tenantId") Long tenantId,
        @Param("status") String status,
        @Param("tipo") String tipo,
        @Param("uf") String uf,
        @Param("cidade") String cidade,
        @Param("q") String q,
        @Param("qDigits") String qDigits
    );

    /**
     * Autocomplete · ILIKE em nome_contato, nome_empresa e documento
     * (este último só quando o termo tem dígitos · `:termDigits` vazio
     * desabilita esse ramo via short-circuit no SQL).
     *
     * Ordem de relevância:
     *   1. nomeContato começa com o termo  (prefixo)
     *   2. nomeEmpresa começa com o termo
     *   3. resto (substring no meio do nome)
     *   tiebreaker: createdAt DESC (mais recentes primeiro)
     */
    @Query("""
        SELECT p FROM PessoaJpaEntity p
        WHERE p.tenantId = :tenantId
          AND (:status IS NULL OR p.status = :status)
          AND (
                LOWER(p.nomeContato) LIKE LOWER(CONCAT('%', :term, '%'))
             OR (p.nomeEmpresa IS NOT NULL AND LOWER(p.nomeEmpresa) LIKE LOWER(CONCAT('%', :term, '%')))
             OR (:termDigits <> '' AND p.documento IS NOT NULL AND p.documento LIKE CONCAT('%', :termDigits, '%'))
          )
        ORDER BY
          CASE WHEN LOWER(p.nomeContato) LIKE LOWER(CONCAT(:term, '%')) THEN 0
               WHEN p.nomeEmpresa IS NOT NULL AND LOWER(p.nomeEmpresa) LIKE LOWER(CONCAT(:term, '%')) THEN 1
               ELSE 2 END,
          p.createdAt DESC
    """)
    List<PessoaJpaEntity> search(
        @Param("tenantId") Long tenantId,
        @Param("status") com.groupws.tkws.features.pessoas.domain.model.StatusPessoa status,
        @Param("term") String term,
        @Param("termDigits") String termDigits,
        Pageable pageable
    );
}
