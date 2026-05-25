package com.groupws.tkws.features.crm.oportunidades.domain.port;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.oportunidades.domain.model.Oportunidade;
import com.groupws.tkws.features.crm.oportunidades.domain.model.OportunidadeId;

import java.util.List;
import java.util.Optional;

public interface OportunidadeRepository {
    Oportunidade save(Oportunidade oportunidade);
    Optional<Oportunidade> findById(long tenantId, OportunidadeId id);
    List<Oportunidade> listByPipeline(long tenantId, PipelineId pipelineId);
    List<Oportunidade> listAll(long tenantId);
    void delete(long tenantId, OportunidadeId id);
}
