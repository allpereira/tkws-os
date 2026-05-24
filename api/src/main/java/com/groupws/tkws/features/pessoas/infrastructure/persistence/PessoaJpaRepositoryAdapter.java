package com.groupws.tkws.features.pessoas.infrastructure.persistence;

import com.groupws.tkws.features.pessoas.domain.model.Documento;
import com.groupws.tkws.features.pessoas.domain.model.Pessoa;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.StatusPessoa;
import com.groupws.tkws.features.pessoas.domain.model.TipoPessoa;
import com.groupws.tkws.features.pessoas.domain.port.PessoaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    public Optional<Pessoa> findById(UUID tenantId, PessoaId id) {
        return jpa.findByIdAndTenantId(id.value(), tenantId).map(this::toDomain);
    }

    @Override
    public Optional<Pessoa> findByDocumento(UUID tenantId, String documentoNormalizado) {
        return jpa.findByTenantIdAndDocumento(tenantId, documentoNormalizado).map(this::toDomain);
    }

    @Override
    public List<Pessoa> findByEmailOuCelular(UUID tenantId, String email, String celular) {
        String e = (email != null && !email.isBlank()) ? email : null;
        String c = (celular != null && !celular.isBlank()) ? celular : null;
        if (e == null && c == null) return List.of();
        return jpa.findByEmailOrCelular(tenantId, e, c).stream()
            .map(this::toDomain)
            .toList();
    }

    @Override
    public List<Pessoa> list(UUID tenantId, StatusPessoa statusOuNull, int limit, int offset) {
        int safeLimit = Math.max(1, Math.min(limit, 200));
        int safeOffset = Math.max(0, offset);
        int page = safeOffset / safeLimit;
        return jpa.list(
                tenantId,
                statusOuNull != null ? statusOuNull.name() : null,
                PageRequest.of(page, safeLimit)
            ).stream()
            .map(this::toDomain)
            .toList();
    }

    @Override
    public boolean existsByDocumento(UUID tenantId, String documentoNormalizado) {
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
