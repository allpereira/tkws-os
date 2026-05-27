package com.groupws.tkws.features.crm.oportunidades.domain.port;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.oportunidades.domain.model.Oportunidade;
import com.groupws.tkws.features.crm.oportunidades.domain.model.OportunidadeId;

import java.util.List;
import java.util.Optional;

public interface OportunidadeRepository {
    Oportunidade save(Oportunidade oportunidade);
    Optional<Oportunidade> findById(long tenantId, OportunidadeId id);

    /** Página de oportunidades do tenant · {@code pipelineId} null lista todas. */
    List<Oportunidade> list(long tenantId, PipelineId pipelineId, int limit, int offset);

    /** Total que casa com o mesmo filtro de {@link #list}. */
    long count(long tenantId, PipelineId pipelineId);

    void delete(long tenantId, OportunidadeId id);
}
