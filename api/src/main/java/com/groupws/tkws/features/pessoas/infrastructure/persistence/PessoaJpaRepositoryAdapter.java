package com.groupws.tkws.features.pessoas.infrastructure.persistence;

import com.groupws.tkws.features.pessoas.domain.model.Documento;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.port.PessoaListCriteria;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import com.groupws.tkws.features.pessoas.domain.port.PessoaSort;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Adapter de persistência · implementa o port `PessoaRepository` usando
 * Spring Data JPA. Aqui acontece a conversão Domain ↔ JPA Entity.
 */
@Repository
class PessoaJpaRepositoryAdapter implements PessoaRepository {

    private final PessoaJpaRepository jpa;

    PessoaJpaRepositoryAdapter(PessoaJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Pessoa save(Pessoa pessoa) {
        PessoaJpaEntity entity = jpa.findById(pessoa.id().value())
            .orElseGet(PessoaJpaEntity::new);
        applyDomainToEntity(pessoa, entity);
        PessoaJpaEntity saved = jpa.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Pessoa> findById(long tenantId, PessoaId id) {
        return jpa.findByIdAndTenantId(id.value(), tenantId).map(this::toDomain);
    }

    @Override
    public Optional<Pessoa> findByDocumento(long tenantId, String documentoNormalizado) {
        return jpa.findByTenantIdAndDocumento(tenantId, documentoNormalizado).map(this::toDomain);
    }

    @Override
    public List<Pessoa> findByEmailOuCelular(long tenantId, String email, String celular) {
        String e = (email != null && !email.isBlank()) ? email : null;
        String c = (celular != null && !celular.isBlank()) ? celular : null;
        if (e == null && c == null) return List.of();
        return jpa.findByEmailOrCelular(tenantId, e, c).stream()
            .map(this::toDomain)
            .toList();
    }

    /** Teto duro de itens por página · ver ADR-022. */
    private static final int MAX_LIMIT = 100;

    @Override
    public List<Pessoa> list(long tenantId, PessoaListCriteria criteria, int limit, int offset) {
        int safeLimit = Math.max(1, Math.min(limit, MAX_LIMIT));
        int safeOffset = Math.max(0, offset);
        int page = safeOffset / safeLimit;
        return jpa.listFiltered(
                tenantId,
                criteria.status() != null ? criteria.status().name() : null,
                criteria.tipoPessoa() != null ? criteria.tipoPessoa().name() : null,
                blankToNull(criteria.uf()),
                blankToNull(criteria.cidade()),
                blankToNull(criteria.q()),
                onlyDigits(criteria.q()),
                PageRequest.of(page, safeLimit, sortFor(criteria.sort()))
            ).stream()
            .map(this::toDomain)
            .toList();
    }

    @Override
    public long count(long tenantId, PessoaListCriteria criteria) {
        return jpa.countFiltered(
            tenantId,
            criteria.status() != null ? criteria.status().name() : null,
            criteria.tipoPessoa() != null ? criteria.tipoPessoa().name() : null,
            blankToNull(criteria.uf()),
            blankToNull(criteria.cidade()),
            blankToNull(criteria.q()),
            onlyDigits(criteria.q())
        );
    }

    private static Sort sortFor(PessoaSort sort) {
        return switch (sort) {
            case NOME -> Sort.by(Sort.Direction.ASC, "nomeContato");
            case CONVERSAO -> Sort.by(Sort.Direction.DESC, "convertidoEm");
            case RECENTE -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }

    /** Extrai só os dígitos · vazio quando não há nenhum (desabilita o ramo de documento no SQL). */
    private static String onlyDigits(String s) {
        return s == null ? "" : s.replaceAll("\\D", "");
    }

    @Override
    public List<Pessoa> search(long tenantId, String query, int limit) {
        String trimmed = query == null ? "" : query.trim();
        if (trimmed.isEmpty()) return List.of();
        int safeLimit = Math.max(1, Math.min(limit, 20));
        String termDigits = trimmed.replaceAll("\\D", "");
        return jpa.search(
                tenantId,
                trimmed,
                termDigits,
                PageRequest.of(0, safeLimit)
            ).stream()
            .map(this::toDomain)
            .toList();
    }

    @Override
    public boolean existsByDocumento(long tenantId, String documentoNormalizado) {
        return jpa.existsByTenantIdAndDocumento(tenantId, documentoNormalizado);
    }

    // ============ Conversões ============

    private void applyDomainToEntity(Pessoa p, PessoaJpaEntity e) {
        e.id = p.id().value();
        e.tenantId = p.tenantId();
        e.tipoPessoa = p.tipoPessoa().name();
        e.documento = p.documento().map(Documento::value).orElse(null);
        e.nomeContato = p.nomeContato();
        e.emailContato = p.emailContato().orElse(null);
        e.celularContato = p.celularContato().orElse(null);
        e.nomeEmpresa = p.nomeEmpresa().orElse(null);
        e.status = p.status().name();
        e.convertidoEm = p.convertidoEm().orElse(null);
        e.endereco = p.endereco().orElse(null);
        e.cidade = p.cidade().orElse(null);
        e.uf = p.uf().orElse(null);
        e.cep = p.cep().orElse(null);
        e.notas = p.notas().orElse(null);
        e.createdAt = p.createdAt();
        e.updatedAt = p.updatedAt();
    }

    private Pessoa toDomain(PessoaJpaEntity e) {
        TipoPessoa tipo = TipoPessoa.valueOf(e.tipoPessoa);
        Documento documento = e.documento != null && !e.documento.isBlank()
            ? Documento.of(tipo, e.documento)
            : null;
        return Pessoa.reconstitute(
            PessoaId.of(e.id),
            e.tenantId,
            tipo,
            documento,
            e.nomeContato,
            e.emailContato,
            e.celularContato,
            e.nomeEmpresa,
            StatusPessoa.valueOf(e.status),
            e.convertidoEm,
            e.endereco,
            e.cidade,
            e.uf,
            e.cep,
            e.notas,
            e.createdAt,
            e.updatedAt
        );
    }
}
