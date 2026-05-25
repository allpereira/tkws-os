package com.groupws.tkws.features.crm.configuracoes.pipelines.infrastructure.persistence;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.ModuloPipeline;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.Pipeline;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.port.PipelineRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
class PipelineJpaRepositoryAdapter implements PipelineRepository {

    private final PipelineJpaRepository jpa;

    PipelineJpaRepositoryAdapter(PipelineJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Pipeline save(Pipeline pipeline) {
        PipelineJpaEntity entity = jpa.findById(pipeline.id().value()).orElseGet(PipelineJpaEntity::new);
        entity.id = pipeline.id().value();
        entity.tenantId = pipeline.tenantId();
        entity.codigo = pipeline.codigo();
        entity.nome = pipeline.nome();
        entity.descricao = pipeline.descricao();
        entity.modulo = pipeline.modulo().dbValue();
        entity.ordem = pipeline.ordem();
        entity.ativo = pipeline.ativo();
        entity.createdAt = pipeline.createdAt();
        entity.updatedAt = pipeline.updatedAt();
        return toDomain(jpa.save(entity));
    }

    @Override
    public Optional<Pipeline> findById(long tenantId, PipelineId id) {
        return jpa.findByIdAndTenantId(id.value(), tenantId).map(this::toDomain);
    }

    @Override
    public List<Pipeline> list(long tenantId, ModuloPipeline filtro) {
        List<PipelineJpaEntity> entities = filtro == null
            ? jpa.findByTenantIdOrderByOrdemAscNomeAsc(tenantId)
            : jpa.findByTenantIdAndModuloOrderByOrdemAscNomeAsc(tenantId, filtro.dbValue());
        return entities.stream().map(this::toDomain).toList();
    }

    @Override
    public boolean existsByCodigo(long tenantId, String codigo) {
        return jpa.existsByTenantIdAndCodigo(tenantId, codigo);
    }

    @Override
    public void delete(long tenantId, PipelineId id) {
        jpa.findByIdAndTenantId(id.value(), tenantId).ifPresent(jpa::delete);
    }

    private Pipeline toDomain(PipelineJpaEntity e) {
        return Pipeline.reconstitute(
            PipelineId.of(e.id), e.tenantId, e.codigo, e.nome, e.descricao,
            ModuloPipeline.fromDb(e.modulo), e.ordem, e.ativo, e.createdAt, e.updatedAt
        );
    }
}
