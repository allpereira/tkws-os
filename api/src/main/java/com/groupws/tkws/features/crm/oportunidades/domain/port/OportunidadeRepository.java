package com.groupws.tkws.features.crm.oportunidades.domain.port;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;
import com.groupws.tkws.features.crm.oportunidades.domain.model.Oportunidade;
import com.groupws.tkws.features.crm.oportunidades.domain.model.OportunidadeId;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OportunidadeRepository {
    Oportunidade save(Oportunidade oportunidade);
    Optional<Oportunidade> findById(UUID tenantId, OportunidadeId id);
    List<Oportunidade> listByPipeline(UUID tenantId, PipelineId pipelineId);
    List<Oportunidade> listAll(UUID tenantId);
    void delete(UUID tenantId, OportunidadeId id);
}
