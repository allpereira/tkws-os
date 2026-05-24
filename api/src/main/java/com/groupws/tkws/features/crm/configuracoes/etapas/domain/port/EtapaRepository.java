package com.groupws.tkws.features.crm.configuracoes.etapas.domain.port;

import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.Etapa;
import com.groupws.tkws.features.crm.configuracoes.etapas.domain.model.EtapaId;
import com.groupws.tkws.features.crm.configuracoes.pipelines.domain.model.PipelineId;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EtapaRepository {
    Etapa save(Etapa etapa);
    Optional<Etapa> findById(UUID tenantId, EtapaId id);
    List<Etapa> listByPipeline(UUID tenantId, PipelineId pipelineId);
    List<Etapa> listAll(UUID tenantId);
    boolean existsByCodigo(UUID tenantId, String codigo);
    void delete(UUID tenantId, EtapaId id);
}
