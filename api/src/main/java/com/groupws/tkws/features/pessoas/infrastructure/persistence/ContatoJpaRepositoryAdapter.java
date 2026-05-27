package com.groupws.tkws.features.pessoas.infrastructure.persistence;

import com.groupws.tkws.features.pessoas.domain.model.Contato;
import com.groupws.tkws.features.pessoas.domain.model.ContatoId;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.features.pessoas.domain.model.TipoRelacionamento;
import com.groupws.tkws.features.pessoas.domain.port.ContatoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Adapter de persistência · implementa o port {@link ContatoRepository} com
 * Spring Data JPA. Conversão Domain ↔ JPA Entity acontece aqui. Ver ADR-023.
 */
@Repository
class ContatoJpaRepositoryAdapter implements ContatoRepository {

    private final ContatoJpaRepository jpa;

    ContatoJpaRepositoryAdapter(ContatoJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Contato save(Contato contato) {
        ContatoJpaEntity entity = jpa.findById(contato.id().value())
            .orElseGet(ContatoJpaEntity::new);
        applyDomainToEntity(contato, entity);
        return toDomain(jpa.save(entity));
    }

    @Override
    public Optional<Contato> findById(long tenantId, ContatoId id) {
        return jpa.findByIdAndTenantId(id.value(), tenantId).map(this::toDomain);
    }

    @Override
    public List<Contato> listByPessoa(long tenantId, PessoaId pessoaId) {
        return jpa.findByTenantIdAndPessoaIdOrderByCreatedAtAsc(tenantId, pessoaId.value()).stream()
            .map(this::toDomain)
            .toList();
    }

    @Override
    public void deleteById(long tenantId, ContatoId id) {
        jpa.findByIdAndTenantId(id.value(), tenantId).ifPresent(jpa::delete);
    }

    // ============ Conversões ============

    private void applyDomainToEntity(Contato c, ContatoJpaEntity e) {
        e.id = c.id().value();
        e.pessoaId = c.pessoaId().value();
        e.tenantId = c.tenantId();
        e.nome = c.nome();
        e.email = c.email().orElse(null);
        e.telefone = c.telefone().orElse(null);
        e.tipoRelacionamento = c.tipoRelacionamento().name();
        e.createdAt = c.createdAt();
        e.updatedAt = c.updatedAt();
    }

    private Contato toDomain(ContatoJpaEntity e) {
        return Contato.reconstitute(
            ContatoId.of(e.id),
            PessoaId.of(e.pessoaId),
            e.tenantId,
            e.nome,
            e.email,
            e.telefone,
            TipoRelacionamento.valueOf(e.tipoRelacionamento),
            e.createdAt,
            e.updatedAt
        );
    }
}
