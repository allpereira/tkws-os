package com.groupws.tkws.features.crm.oportunidades.infrastructure.persistence;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.oportunidades.domain.model.Oportunidade;
import com.groupws.tkws.features.crm.oportunidades.domain.model.OportunidadeId;
import com.groupws.tkws.features.crm.oportunidades.domain.port.OportunidadeRepository;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
class OportunidadeJpaRepositoryAdapter implements OportunidadeRepository {

    private final OportunidadeJpaRepository jpa;

    OportunidadeJpaRepositoryAdapter(OportunidadeJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Oportunidade save(Oportunidade o) {
        OportunidadeJpaEntity e = jpa.findById(o.id().value()).orElseGet(OportunidadeJpaEntity::new);
        e.id = o.id().value();
        e.tenantId = o.tenantId();
        e.pipelineId = o.pipelineId().value();
        e.etapaId = o.etapaId().value();
        e.pessoaId = o.pessoaId().map(PessoaId::value).orElse(null);
        e.ofertaId = o.ofertaId().orElse(null);
        e.tipoPagamentoId = o.tipoPagamentoId().orElse(null);
        e.empreendimentoId = o.empreendimentoId().orElse(null);
        e.tipoProjetoId = o.tipoProjetoId().orElse(null);
        e.responsavelId = o.responsavelId().orElse(null);
        e.titulo = o.titulo();
        e.descricao = o.descricao().orElse(null);
        e.valor = o.valor();
        e.metragemM2 = o.metragemM2().orElse(null);
        e.prazoFechamento = o.prazoFechamento().orElse(null);
        e.notas = o.notas().orElse(null);
        e.createdAt = o.createdAt();
        e.updatedAt = o.updatedAt();
        return toDomain(jpa.save(e));
    }

    @Override
    public Optional<Oportunidade> findById(UUID tenantId, OportunidadeId id) {
        return jpa.findByIdAndTenantId(id.value(), tenantId).map(this::toDomain);
    }

    @Override
    public List<Oportunidade> listByPipeline(UUID tenantId, PipelineId pipelineId) {
        return jpa.findByTenantIdAndPipelineIdOrderByUpdatedAtDesc(tenantId, pipelineId.value())
            .stream().map(this::toDomain).toList();
    }

    @Override
    public List<Oportunidade> listAll(UUID tenantId) {
        return jpa.findByTenantIdOrderByUpdatedAtDesc(tenantId)
            .stream().map(this::toDomain).toList();
    }

    @Override
    public void delete(UUID tenantId, OportunidadeId id) {
        jpa.findByIdAndTenantId(id.value(), tenantId).ifPresent(jpa::delete);
    }

    private Oportunidade toDomain(OportunidadeJpaEntity e) {
        return Oportunidade.reconstitute(
            OportunidadeId.of(e.id), e.tenantId,
            PipelineId.of(e.pipelineId), EtapaId.of(e.etapaId),
            e.pessoaId != null ? PessoaId.of(e.pessoaId) : null,
            e.ofertaId, e.tipoPagamentoId, e.empreendimentoId,
            e.tipoProjetoId, e.responsavelId,
            e.titulo, e.descricao, e.valor, e.metragemM2,
            e.prazoFechamento, e.notas, e.createdAt, e.updatedAt
        );
    }
}
