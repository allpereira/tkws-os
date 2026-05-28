package com.groupws.tkws.features.crm.configuracoes.origensnegocio.infrastructure.persistence;

import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model.OrigemNegocio;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.model.OrigemNegocioId;
import com.groupws.tkws.features.crm.configuracoes.origensnegocio.domain.port.OrigemNegocioRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
class OrigemNegocioJpaRepositoryAdapter implements OrigemNegocioRepository {

    private final OrigemNegocioJpaRepository jpa;

    OrigemNegocioJpaRepositoryAdapter(OrigemNegocioJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public OrigemNegocio save(OrigemNegocio origem) {
        OrigemNegocioJpaEntity entity = jpa.findById(origem.id().value()).orElseGet(OrigemNegocioJpaEntity::new);
        entity.id = origem.id().value();
        entity.tenantId = origem.tenantId();
        entity.codigo = origem.codigo();
        entity.nome = origem.nome();
        entity.exigeParceiro = origem.exigeParceiro();
        entity.exigeDetalhe = origem.exigeDetalhe();
        entity.ativo = origem.ativo();
        entity.createdAt = origem.createdAt();
        entity.updatedAt = origem.updatedAt();
        return toDomain(jpa.save(entity));
    }

    @Override
    public Optional<OrigemNegocio> findById(long tenantId, OrigemNegocioId id) {
        return jpa.findByIdAndTenantId(id.value(), tenantId).map(this::toDomain);
    }

    @Override
    public List<OrigemNegocio> listAll(long tenantId) {
        return jpa.findByTenantIdOrderByNomeAsc(tenantId).stream().map(this::toDomain).toList();
    }

    @Override
    public boolean existsByCodigo(long tenantId, String codigo) {
        return jpa.existsByTenantIdAndCodigo(tenantId, codigo);
    }

    @Override
    public void delete(long tenantId, OrigemNegocioId id) {
        jpa.findByIdAndTenantId(id.value(), tenantId).ifPresent(jpa::delete);
    }

    private OrigemNegocio toDomain(OrigemNegocioJpaEntity e) {
        return OrigemNegocio.reconstitute(
            OrigemNegocioId.of(e.id), e.tenantId, e.codigo, e.nome,
            e.exigeParceiro, e.exigeDetalhe, e.ativo, e.createdAt, e.updatedAt
        );
    }
}
