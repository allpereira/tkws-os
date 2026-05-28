package com.groupws.tkws.features.crm.oportunidades.infrastructure.persistence;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.oportunidades.domain.model.Oportunidade;
import com.groupws.tkws.features.crm.oportunidades.domain.model.OportunidadeId;
import com.groupws.tkws.features.crm.oportunidades.domain.port.OportunidadeRepository;
import com.groupws.tkws.features.pessoas.domain.model.PessoaId;
import com.groupws.tkws.shared.page.Pagination;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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
        e.parceiroId = o.parceiroId().orElse(null);
        e.descricao = o.descricao();
        e.valor = o.valor();
        e.metragemM2 = o.metragemM2().orElse(null);
        e.previsaoFechamento = o.previsaoFechamento().orElse(null);
        e.origemId = o.origemId();
        e.origemOutros = o.origemOutros().orElse(null);
        e.notas = o.notas().orElse(null);
        e.createdAt = o.createdAt();
        e.updatedAt = o.updatedAt();
        return toDomain(jpa.save(e));
    }

    @Override
    public Optional<Oportunidade> findById(long tenantId, OportunidadeId id) {
        return jpa.findByIdAndTenantId(id.value(), tenantId).map(this::toDomain);
    }

    private static final Sort BY_UPDATED_DESC = Sort.by(Sort.Direction.DESC, "updatedAt");

    @Override
    public List<Oportunidade> list(long tenantId, PipelineId pipelineId, int limit, int offset) {
        var pageable = Pagination.pageRequest(limit, offset, BY_UPDATED_DESC);
        var page = pipelineId != null
            ? jpa.findByTenantIdAndPipelineId(tenantId, pipelineId.value(), pageable)
            : jpa.findByTenantId(tenantId, pageable);
        return page.getContent().stream().map(this::toDomain).toList();
    }

    @Override
    public long count(long tenantId, PipelineId pipelineId) {
        return pipelineId != null
            ? jpa.countByTenantIdAndPipelineId(tenantId, pipelineId.value())
            : jpa.countByTenantId(tenantId);
    }

    @Override
    public void delete(long tenantId, OportunidadeId id) {
        jpa.findByIdAndTenantId(id.value(), tenantId).ifPresent(jpa::delete);
    }

    private Oportunidade toDomain(OportunidadeJpaEntity e) {
        return Oportunidade.reconstitute(
            OportunidadeId.of(e.id), e.tenantId,
            PipelineId.of(e.pipelineId), EtapaId.of(e.etapaId),
            e.pessoaId != null ? PessoaId.of(e.pessoaId) : null,
            e.ofertaId, e.tipoPagamentoId, e.empreendimentoId,
            e.tipoProjetoId, e.responsavelId, e.parceiroId,
            e.descricao, e.valor, e.metragemM2,
            e.previsaoFechamento, e.origemId, e.origemOutros, e.notas,
            e.createdAt, e.updatedAt
        );
    }
}
