package com.groupws.tkws.features.crm.configuracoes.etapas.infrastructure.persistence;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.Etapa;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.TipoEtapa;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.port.EtapaRepository;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
class EtapaJpaRepositoryAdapter implements EtapaRepository {

    private final EtapaJpaRepository jpa;

    EtapaJpaRepositoryAdapter(EtapaJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Etapa save(Etapa etapa) {
        EtapaJpaEntity entity = jpa.findById(etapa.id().value()).orElseGet(EtapaJpaEntity::new);
        entity.id = etapa.id().value();
        entity.tenantId = etapa.tenantId();
        entity.pipelineId = etapa.pipelineId().value();
        entity.codigo = etapa.codigo();
        entity.nome = etapa.nome();
        entity.descricao = etapa.descricao();
        entity.cor = etapa.cor();
        entity.probabilidade = (short) etapa.probabilidade();
        entity.tipo = etapa.tipo().dbValue();
        entity.ordem = etapa.ordem();
        entity.converteLeadEmCliente = etapa.converteLeadEmCliente();
        entity.ativo = etapa.ativo();
        entity.createdAt = etapa.createdAt();
        entity.updatedAt = etapa.updatedAt();
        return toDomain(jpa.save(entity));
    }

    @Override
    public Optional<Etapa> findById(UUID tenantId, EtapaId id) {
        return jpa.findByIdAndTenantId(id.value(), tenantId).map(this::toDomain);
    }

    @Override
    public List<Etapa> listByPipeline(UUID tenantId, PipelineId pipelineId) {
        return jpa.findByTenantIdAndPipelineIdOrderByOrdemAscNomeAsc(tenantId, pipelineId.value())
            .stream().map(this::toDomain).toList();
    }

    @Override
    public List<Etapa> listAll(UUID tenantId) {
        return jpa.findByTenantIdOrderByOrdemAscNomeAsc(tenantId)
            .stream().map(this::toDomain).toList();
    }

    @Override
    public boolean existsByCodigo(UUID tenantId, String codigo) {
        return jpa.existsByTenantIdAndCodigo(tenantId, codigo);
    }

    @Override
    public void delete(UUID tenantId, EtapaId id) {
        jpa.findByIdAndTenantId(id.value(), tenantId).ifPresent(jpa::delete);
    }

    private Etapa toDomain(EtapaJpaEntity e) {
        return Etapa.reconstitute(
            EtapaId.of(e.id), e.tenantId, PipelineId.of(e.pipelineId),
            e.codigo, e.nome, e.descricao, e.cor, e.probabilidade,
            TipoEtapa.fromDb(e.tipo), e.ordem, e.converteLeadEmCliente, e.ativo,
            e.createdAt, e.updatedAt
        );
    }
}
