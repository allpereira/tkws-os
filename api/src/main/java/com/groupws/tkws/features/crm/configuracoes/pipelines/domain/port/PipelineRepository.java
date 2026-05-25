package com.groupws.tkws.features.crm.configuracoes.pipelines.domain.port;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.ModuloPipeline;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.Pipeline;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;

import java.util.List;
import java.util.Optional;

public interface PipelineRepository {
    Pipeline save(Pipeline pipeline);
    Optional<Pipeline> findById(long tenantId, PipelineId id);
    List<Pipeline> list(long tenantId, ModuloPipeline filtro);
    boolean existsByCodigo(long tenantId, String codigo);
    void delete(long tenantId, PipelineId id);
}
