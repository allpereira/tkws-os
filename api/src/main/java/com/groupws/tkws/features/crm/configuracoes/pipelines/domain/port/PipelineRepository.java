package com.groupws.tkws.features.crm.configuracoes.pipelines.domain.port;

import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.ModuloPipeline;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.Pipeline;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PipelineRepository {
    Pipeline save(Pipeline pipeline);
    Optional<Pipeline> findById(UUID tenantId, PipelineId id);
    List<Pipeline> list(UUID tenantId, ModuloPipeline filtro);
    boolean existsByCodigo(UUID tenantId, String codigo);
    void delete(UUID tenantId, PipelineId id);
}
